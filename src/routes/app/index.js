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

const v4uuid = require("uuid/v4");

function requireAuthorization (req, res, next) {
  if (!req.authorized) {
    return res.sendStatus(403);
  }
  next();
}

module.exports = function (dataStudio) {

  const api = dataStudio.expressApp;
  const db = dataStudio.db;
  const events = dataStudio.events;
  const authz = dataStudio.authz;

  api.get("/app/:appId", requireAuthorization, function (req, res) {
    if (null === req.appModel) {
      return res.sendStatus(404);
    }
    authz.verifyOwnership(req.path, req.authUser.get("Id"))
      .then(function () {
        res.status(200).send(req.appModel);
      })
      .catch(function (err) {
        res.sendStatus(404);
      });
  });

  api.put("/app/:appId", requireAuthorization, function (req, res) {
    return res.sendStatus(404);
  });

  api.get("/apps/all", requireAuthorization, function (req, res) {
    db.fetchAppsByUserId(req.authUser.get("Id"))
      .then(function (apps) {
        res.status(200).send(apps);
      })
      .catch(function (err) {
        res.status(500).send({ ErrorMsg: err.message });
      });
  });

  api.post("/apps", requireAuthorization, function (req, res) {
    let App = db.App;
    let newAppId = v4uuid();
    let newApp = {
      Id: newAppId,
      UserId: req.authUser.get("Id"),
      Name: req.body.Name || "Un-named App",
      Created: Math.floor(Date.now()/1000),
    };
    App.forge(newApp)
      .save(null, {method:"insert"})
      .then(function (app) {
        let uri = `/app/${newAppId}`;
        events.emit("resource:created", uri, req.authUser.get("Id"));
        res.localRedirect(uri);
      })
      .catch(function (err) {
        console.log(err);
        res.status(400).send({ ErrorMsg: err.message });
      });
  });

  api.get("/app/:appId", requireAuthorization, function (req, res) {
    if (req.appModel.get("UserId") !== req.authUser.get("Id")) {
      return res.sendStatus(403);
    }
    db.fetchDetailedAppById(req.appModel.get("Id"))
      .then(function (app) {
        res.status(200).send(app);
      })
      .catch(function (err) {
        res.status(400).send({
          Error: err.message,
        });
      });
  });

  api.delete("/app/:appId", requireAuthorization, function (req, res) {
    if (req.appModel.get("UserId") !== req.authUser.get("Id")) {
      return res.sendStatus(403);
    }
    req.appModel.save({"Deleted": Math.floor(Date.now()/1000)}, {patch: true})
      .then(function () {
        res.sendStatus(204);
      })
      .catch(function (err) {
        console.log(err);
        res.sendStatus(500);
      });

  });


  [
    {id: "schemas", fetch: "fetchAppSchemasByAppId"},
    {id: "apis", fetch: "fetchAppApisByAppId"},
    {id: "clients", fetch: "fetchAppClientsByAppId"},
    {id: "envs", fetch: "fetchEnvsByAppId"},
  ].forEach(x => {

    let tId = x.id;
    let tFn = x.fetch;

    api.get(`/app/:appId/${tId}`, requireAuthorization, function (req, res) {
      if (req.appModel.get("UserId") !== req.authUser.get("Id")) {
        return res.sendStatus(403);
      }
      db[tFn](req.appModel.get("Id"))
        .then(function (schemas) {
          res.status(200).send(schemas);
        })
        .catch(function (err) {
          res.status(500).send({ ErrorMsg: err.message });
        });
    });

  });

  api.get("/app/:appId/:subTypeName/:subTypeId", requireAuthorization, function (req, res) {
    let t = {
      "clients": "client",
      "apis": "api",
      "schemas": "schema",
      "envs": "env",
    }
    let Client = db.Client;
    let Api = db.Api;
    let AppSchema = db.AppSchema;
    let Env = db.Env;
    let subTypeName = req.subTypeName;
    let subTypeId = req.subTypeId;
    let appId = req.appModel.get("Id");
    let newAppThingId = v4uuid();
    let newAppThing;
    switch (subTypeName) {
      case "client":
        db.fetchClientById(subTypeId)
          .then(function (client) {
            authz.verifyOwnership(req.path, req.authUser.get("Id"))
              .then(function () {
                res.status(200).send(client);
              })
              .catch(function (err) {
                res.status(404).send();
              });
          })
          .catch(function (err) {
            console.log(err);
            res.status(400).send({ ErrorMsg: err.message });
          });
        break;
      case "api":
        db.fetchApiById(subTypeId)
          .then(function (api) {
            authz.verifyOwnership(req.path, req.authUser.get("Id"))
              .then(function () {
                res.status(200).send(api);
              })
              .catch(function (err) {
                res.status(404).send();
              });
          })
          .catch(function (err) {
            console.log(err);
            res.status(400).send({ ErrorMsg: err.message });
          });
        break;
      case "schema":
        db.fetchSchemaById(subTypeId)
          .then(function (schema) {
            authz.verifyOwnership(req.path, req.authUser.get("Id"))
              .then(function () {
                res.status(200).send(schema);
              })
              .catch(function (err) {
                res.status(404).send();
              });
          })
          .catch(function (err) {
            console.log(err);
            res.status(400).send({ ErrorMsg: err.message });
          });
        break;
      case "env":
        db.fetchEnvById(subTypeId)
          .then(function (env) {
            authz.verifyOwnership(req.path, req.authUser.get("Id"))
              .then(function () {
                res.status(200).send(env);
              })
              .catch(function (err) {
                res.status(404).send();
              });
          })
          .catch(function (err) {
            console.log(err);
            res.status(400).send({ ErrorMsg: err.message });
          });
        break;
    }
  });

  api.post("/app/:appId/:subTypeName", requireAuthorization, function (req, res) {
    let t = {
      "clients": "client",
      "apis": "api",
      "schemas": "schema",
      "envs": "env",
    }
    let Client = db.Client;
    let Api = db.Api;
    let Env = db.Env;
    let AppSchema = db.AppSchema;
    let subTypeName = req.subTypeName;
    let appId = req.appModel.get("Id");
    let newAppThingId = v4uuid();
    let newAppThing;
    switch (subTypeName) {
      case "clients":
        newAppThing = new Client({
          Id: newAppThingId,
          AppId: appId,
          Name: req.body.Name || "NewClient",
          Created: Math.floor(Date.now()/1000),
        });
        break;
      case "apis":
        newAppThing = new Api({
          Id: newAppThingId,
          AppId: appId,
          Name: req.body.Name || "NewApi",
          Created: Math.floor(Date.now()/1000),
        });
        break;
      case "schemas":
        newAppThing = new AppSchema({
          Id: newAppThingId,
          AppId: appId,
          Name: req.body.Name || "NewSchema",
          Ref: req.body.Ref || "#" + req.body.Name,
          Created: Math.floor(Date.now()/1000),
        });
        break;
      case "envs":
        newAppThing = new Env({
          Id: newAppThingId,
          AppId: appId,
          Name: req.body.Name || "New Env",
          Created: Math.floor(Date.now()/1000),
        });
        break;
    }
    newAppThing.save()
      .then(function (appThing) {
        let uri = `/app/${appId}/${t[subTypeName]}/${appThing.get("Id")}`;
        events.emit("resource:created", uri, req.authUser.get("Id"));
        events.emit("resource:created", `/${t[subTypeName]}/${appThing.get("Id")}`, req.authUser.get("Id"));
        res.localRedirect(uri);
      })
      .catch(function (err) {
        res.status(400).send({ ErrorMsg: err.message });
      });
  });

  api.delete("/app/:appId/schema/:schemaId", requireAuthorization, function (req, res) {
    authz.verifyOwnership(req.path, req.authUser.get("Id"))
      .then(function () {
        req.appSchemaModel.save({"Deleted": Math.floor(Date.now()/1000)}, {patch: true})
          .then(function () {
            res.sendStatus(204);
          })
          .catch(function (err) {
            console.log(err);
            res.sendStatus(500);
          });
      })
      .catch(function (err) {
        res.status(400).send();
      });
  });

  api.get("/app/:appId/api/:apiId", requireAuthorization, function (req, res) {
    if (req.appModel.get("UserId") !== req.authUser.get("Id")) {
      return res.sendStatus(403);
    }
    if (req.apiModel.get("AppId") !== req.appModel.get("Id")) {
      return res.sendStatus(400);
    }
    res.status(200).send(req.apiModel);
  });

  api.get("/app/:appId/client/:clientId", requireAuthorization, function (req, res) {
    if (req.appModel.get("UserId") !== req.authUser.get("Id")) {
      return res.sendStatus(403);
    }
    if (req.clientModel.get("AppId") !== req.appModel.get("Id")) {
      return res.sendStatus(400);
    }
    res.status(200).send(req.clientModel);
  });

  api.get("/app/:appId/schema/:appSchemaId", requireAuthorization, function (req, res) {
    if (req.appModel.get("UserId") !== req.authUser.get("Id")) {
      return res.sendStatus(403);
    }
    if (req.appSchemaModel.get("AppId") !== req.appModel.get("Id")) {
      return res.sendStatus(400);
    }
    res.status(200).send(req.appSchemaModel);
  });

};
