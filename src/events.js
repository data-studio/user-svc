"use strict";

module.exports = function (dataStudio) {

  const db = dataStudio.db;
  const AuthAttempt = db.AuthAttempt;

  const EventEmitter = require("events");

  class DataStudioEmitter extends EventEmitter {
    constructor () {
      super();
    }
  }

  let events = dataStudio.events = new DataStudioEmitter();

  events.addListener("auth/attempt:success", function (d) {
    async(function () {
      AuthAttempt.forge({
        Id: d.Id,
        Login: d.Login,
        Finished: true,
        Error: null,
        TokenId: d.TokenId,
        Created: Math.floor(Date.now()/1000),
      }).save();
    });
  });

  events.addListener("auth/attempt:error", function (d) {
    async(function () {
      AuthAttempt.forge({
        Id: d.Id,
        Login: d.Login,
        Finished: true,
        Error: d.Error,
        TokenId: null,
        Created: Math.floor(Date.now()/1000),
      }).save();
    });
  });

  events.addListener("resource:created", function (uri, createdByUserId) {
    async(function () {
      dataStudio.authz.registerOwnership(uri, createdByUserId);
      if (uri.split(/\//g).length !== 5) {
        return;
      }
      dataStudio.authz.registerOwnership("/"+uri.split(/\//g).slice(3,2).join("/"), createdByUserId);
    });
  });

  events.addListener("signup:success", function (d) {
    async(function () {

      let user = d[1];
      let userLogin = user.get("Login");

      console.log("signup:success");
      console.log(`New user account created <${userLogin}>`);

    });
  });

  function async (f) {
    process.nextTick(function () {
      try {
        f && f();
      }
      catch (err) {
        console.log(err);
      }
    });
  }

}
