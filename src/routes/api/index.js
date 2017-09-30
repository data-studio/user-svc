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

function apiToSchema (api) {
  let schema = {};
  let routePaths = {};
  let operations = api.related("Operations");
  let routes = api.related("Routes");
  routes.forEach(route => {
    let path = route.get("Path");
    schema[path] = {};
    routePaths[route.get("Id")] = path;
  });
  operations.forEach(operation => {
    let targetPath = routePaths[operation.get("RouteId")];
    let pathExists = targetPath in schema;
    if (!pathExists) {
      return;
    }
    schema[targetPath][operation.get("Method")] = {
      operationId: operation.get("Name"),
    };
  });
  return schema;
}

module.exports = function (dataStudio) {

  const api = dataStudio.expressApp;
  const db = dataStudio.db;
  const events = dataStudio.events;
  const authz = dataStudio.authz;

  api.get("/api/:apiId", requireAuthorization, function (req, res) {
    if (null === req.apiModel) {
      return res.sendStatus(404);
    }
    db.fetchDetailedApiById(req.apiModel.get("Id"))
      .then(function (api) {
        res.sendStatus(200).send(api);
      })
      .catch(function (err) {
        res.status(500).send({
          ErrorMsg: err.message,
        });
      });
  });

  api.get("/api/:apiId/schema", requireAuthorization, function (req, res) {
    if (null === req.apiModel) {
      return res.sendStatus(404);
    }
    let apiId = req.apiModel.get("Id");
    authz.verifyOwnership(`/api/${apiId}`, req.authUser.get("Id"))
      .then(function () {
        db.fetchDetailedApiById(req.apiModel.get("Id"))
          .then(function (api) {
            res.status(200).send(apiToSchema(api));
          })
          .catch(function (err) {
            res.status(500).send({
              ErrorMsg: err.message,
            });
          });
      })
      .catch(function () {
        res.sendStatus(404);
      });
  });

  api.put("/api/:apiId", requireAuthorization, function (req, res) {
    res.sendStatus(404);
  });

  api.delete("/api/:apiId", requireAuthorization, function (req, res) {
    res.sendStatus(404);
  });

  api.get("/apis", requireAuthorization, function (req, res) {
    res.sendStatus(200).send([]);
  });

  api.post("/apis", requireAuthorization, function (req, res) {
    let Api = db.Api;
    let newAppApiId = v4uuid();
    let newAppApi = new Api({
      Id: newAppApiId,
      AppId: req.body.AppId,
      Name: req.body.Name || "NewApi",
      Created: Math.floor(Date.now()/1000),
    });
    newAppApi.save()
      .then(function (appApi) {
        let uri = `/app/${req.body.AppId}/api/${appApi.get("Id")}`;
        events.emit("resource:created", uri, req.authUser.get("Id"));
        res.localRedirect(uri);
      })
      .catch(function (err) {
        res.sendStatus(400).send({ ErrorMsg: err.message });
      });
  });

  [
    {id: "operations", fetch: "fetchOperationsByApiId"},
    {id: "routes", fetch: "fetchRoutesByApiId"},
  ].forEach(x => {

    let tId = x.id;
    let tFn = x.fetch;

    api.get(`/api/:apiId/${tId}`, requireAuthorization, function (req, res) {
      let ownerUserId = req.apiModel.related("App").get("UserId");
      if (ownerUserId !== req.authUser.get("Id")) {
        return res.sendStatus(403);
      }
      authz.verifyOwnership(req.path.split(/\//g).slice(0,3).join("/"), req.authUser.get("Id"))
        .then(function () {
          db[tFn](req.apiModel.get("Id"))
            .then(function (schemas) {
              res.status(200).send(schemas);
            })
            .catch(function (err) {
              res.status(500).send({ ErrorMsg: err.message });
            });
        })
        .catch(function (err) {
          res.status(404).send();
        });
    });

  });

  api.get("/api/:apiId/:subTypeName/:subTypeId", requireAuthorization, function (req, res) {
    let t = {
      "operations": "operation",
      "routes": "route",
    }
    let subTypeName = req.subTypeName;
    let subTypeId = req.subTypeId;
    let apiId = req.apiModel.get("Id");
    switch (subTypeName) {
      case "operation":
        db.fetchOperationById(subTypeId)
          .then(function (op) {
            authz.verifyOwnership(req.path, req.authUser.get("Id"))
              .then(function () {
                res.status(200).send(op);
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
      case "route":
        db.fetchRouteById(subTypeId)
          .then(function (route) {
            res.status(200).send(route);
          })
          .catch(function (err) {
            console.log(err);
            res.status(400).send({ ErrorMsg: err.message });
          });
        break;
    }
  });

  api.post("/api/:apiId/:subTypeName", requireAuthorization, function (req, res) {
    let t = {
      "operations": "operation",
      "routes": "route",
    }
    let Client = db.Client;
    let Api = db.Api;
    let Route = db.Route;
    let Operation = db.Operation;
    let subTypeName = req.subTypeName;
    let apiId = req.apiModel.get("Id");
    let newApiThingId = v4uuid();
    let newApiThing;
    switch (subTypeName) {
      case "operations":
        newApiThing = new Operation({
          Id: newApiThingId,
          RouteId: req.body.RouteId || null,
          ApiId: apiId,
          Method: req.body.Method || "get",
          Name: req.body.Name || "defaultOperation",
          Summary: "",
          Description: "",
          Created: Math.floor(Date.now()/1000),
        });
        break;
      case "routes":
        newApiThing = new Route({
          Id: newApiThingId,
          ApiId: apiId,
          Path: req.body.Path || "/default/path",
          Created: Math.floor(Date.now()/1000),
        });
        break;
    }
    newApiThing.save()
      .then(function (apiThing) {
        let uri = `/api/${apiId}/${t[subTypeName]}/${apiThing.get("Id")}`;
        events.emit("resource:created", uri, req.authUser.get("Id"));
        res.localRedirect(uri);
      })
      .catch(function (err) {
        console.log(err);
        res.sendStatus(400).send({ ErrorMsg: err.message });
      });
  });

};
