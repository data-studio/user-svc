"use strict";

const v4uuid = require("uuid/v4");

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
  const authz = dataStudio.authz;

  api.get("/schema/:schemaId", requireAuthorization, function (req, res) {
    if (null === req.schemaModel) {
      return res.send(404);
    }
    res.send(200, req.schemaModel);
  });

  api.put("/schema/:schemaId", requireAuthorization, function (req, res) {
    res.send(404);
  });

  api.delete("/schema/:schemaId", requireAuthorization, function (req, res) {
    res.send(404);
  });

  api.get("/schemas", requireAuthorization, function (req, res) {

  });

  api.post("/schemas", requireAuthorization, function (req, res) {
    let Schema = db.Schema;
    let newAppSchemaId = v4uuid();
    let newAppSchema = new Schema({
      Id: newAppSchemaId,
      AppId: req.body.AppId,
      Name: req.body.Name || "NewSchema",
      Created: Math.floor(Date.now()/1000),
    });
    newAppSchema.save()
      .then(function (schema) {
        res.localRedirect(`/app/${req.body.AppId}/schema/${schema.get("Id")}`);
      })
      .catch(function (err) {
        res.status(400).send({ ErrorMsg: err.message });
      });
  });

  [
    {id: "properties", fetch: "fetchPropertiesBySchemaId"},
  ].forEach(x => {

    let tId = x.id;
    let tFn = x.fetch;

    api.get(`/schema/:schemaId/${tId}`, requireAuthorization, function (req, res) {
      authz.verifyOwnership(req.path.split(/\//g).slice(0,3).join("/"), req.authUser.get("Id"))
        .then(function () {
          db[tFn](req.schemaModel.get("Id"))
            .then(function (models) {
              res.status(200).send(models);
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

  api.get("/schema/:schemaId/:subTypeName/:subTypeId", requireAuthorization, function (req, res) {
    let t = {
      "properties": "property",
    }
    let subTypeName = req.subTypeName;
    let subTypeId = req.subTypeId;
    let schemaId = req.schemaModel.get("Id");
    switch (subTypeName) {
      case "property":
        db.fetchPropertyById(subTypeId)
          .then(function (prop) {
            authz.verifyOwnership(req.path, req.authUser.get("Id"))
              .then(function () {
                res.status(200).send(prop);
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

  api.post("/schema/:schemaId/:subTypeName", requireAuthorization, function (req, res) {
    let t = {
      "properties": "property",
    }
    let Property = db.Property;
    let subTypeName = req.subTypeName;
    let schemaId = req.schemaModel.get("Id");
    let newSchemaThingId = v4uuid();
    let newSchemaThing;
    switch (subTypeName) {
      case "properties":
        newSchemaThing = new Property({
          Id: newSchemaThingId,
          SchemaId: schemaId,
          Key: req.body.Key || "Name",
          Created: Math.floor(Date.now()/1000),
        });
        break;
    }
    newSchemaThing.save()
      .then(function (schemaThing) {
        let uri = `/schema/${schemaId}/${t[subTypeName]}/${schemaThing.get("Id")}`;
        events.emit("resource:created", uri, req.authUser.get("Id"));
        res.localRedirect(uri);
      })
      .catch(function (err) {
        console.log(err);
        res.sendStatus(400).send({ ErrorMsg: err.message });
      });
  });

};
