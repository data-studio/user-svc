/**
 * Eviratec Data Studio
 * Copyright (c) 2017 Callan Peter Milne
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 * OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */
"use strict";

function requireAuthorization (req, res, next) {
  if (!req.authorized) {
    return res.send(403);
  }
  next();
}

module.exports = function (dataStudio) {

  const api = dataStudio.expressApp;
  const db = dataStudio.db;
  const events = dataStudio.events;

  api.get("/client/:clientId", requireAuthorization, function (req, res) {
    if (null === req.clientModel) {
      return res.send(404);
    }
    res.send(200, req.clientModel);
  });

  api.put("/client/:clientId", requireAuthorization, function (req, res) {
    res.send(404);
  });

  api.delete("/client/:clientId", requireAuthorization, function (req, res) {
    res.send(404);
  });

  api.get("/clients", requireAuthorization, function (req, res) {

  });

  api.post("/clients", requireAuthorization, function (req, res) {
    let Client = db.Client;
    let newAppClientId = v4uuid();
    let newAppClient = new Client({
      Id: newAppClientId,
      AppId: req.body.AppId,
      Name: req.body.Name || "NewClient",
      Created: Math.floor(Date.now()/1000),
    });
    newAppClient.save()
      .then(function (client) {
        let uri = `/app/${req.body.AppId}/client/${client.get("Id")}`;
        events.emit("resource:created", uri, req.authUser.get("Id"));
        res.localRedirect(uri);
      })
      .catch(function (err) {
        res.status(400).send({ ErrorMsg: err.message });
      });
  });

};
