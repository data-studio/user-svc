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
  const authz = dataStudio.authz;

  api.get("/operation/:operationId", requireAuthorization, function (req, res) {
    if (null === req.operationModel) {
      return res.sendStatus(404);
    }
    res.sendStatus(200).send(req.operationModel);
  });

  api.put("/operation/:operationId", requireAuthorization, function (req, res) {
    if (null === req.operationModel) {
      return res.sendStatus(404);
    }
    res.sendStatus(200).send(req.operationModel);
  });

  api.delete("/operation/:operationId", requireAuthorization, function (req, res) {
    if (null === req.operationModel) {
      return res.sendStatus(404);
    }
    let prefix = "/api/" + req.operationModel.get("ApiId");
    authz.verifyOwnership(prefix + req.path, req.authUser.get("Id"))
      .then(function () {
        req.operationModel.save({"Deleted": Math.floor(Date.now()/1000)}, {patch: true})
          .then(function () {
            res.sendStatus(204);
          })
          .catch(function (err) {
            console.log(err);
            res.sendStatus(500);
          });
      })
      .catch(function (err) {
        res.status(404).send();
      });
  });

  api.get("/operations", requireAuthorization, function (req, res) {
    res.sendStatus(200).send([]);
  });

  api.post("/operations", requireAuthorization, function (req, res) {
    let Operation = db.Operation;
    let newApiOperationId = v4uuid();
    let newApiOperation = new Operation({
      Id: newApiOperationId,
      ApiId: req.body.ApiId,
      Name: req.body.Name || "defaultOperation",
      Created: Math.floor(Date.now()/1000),
    });
    newApiOperation.save()
      .then(function (op) {
        let uri = `/api/${req.body.ApiId}/operation/${op.get("Id")}`;
        events.emit("resource:created", uri, req.authUser.get("Id"));
        res.localRedirect(uri);
      })
      .catch(function (err) {
        res.status(400).send({ ErrorMsg: err.message });
      });
  });

};
