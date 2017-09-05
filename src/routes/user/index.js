"use strict";

const v4uuid = require("uuid/v4");
const crypt = require("bcryptjs");

function requireAuthorization (req, res, next) {
  if (!req.authorized) {
    return res.status(403).send("");
  }
  next();
}

module.exports = function (dataStudio) {

  const api = dataStudio.expressApp;
  const db = dataStudio.db;
  const events = dataStudio.events;

  const RESERVED_LOGINS = require("../../etc/reserved.usernames.json");

  api.get("/user/:userId", requireAuthorization, function (req, res) {
    if (null === req.user) {
      return res.status(404).send("");
    }
    res.status(200).send(req.user);
  });

  api.put("/user/:userId", requireAuthorization, function (req, res) {
    return res.send(404);
  });

  api.get("/login/:login/availability", function (req, res) {

    let Login = req.params.login.toLowerCase();

    checkLoginAvailability(Login)
      .then(function (r) {
        res.status(200).send(r);
      })
      .catch(function () {
        res.status(200).send(r);
      });

  });

  api.get("/signup/:signupId", function (req, res) {
    if (req.signup) {
      res.send(200, req.signup);
      return;
    }
    res.send(404);
  });

  api.post("/signups", checkUsernameAvailability, function (req, res) {

    let User = db.User;
    let Hash = db.Hash;

    let Email = req.body.Email.toLowerCase();
    let NewPassword = pwHash(req.body.NewPassword);

    let Login = Email;

    let tsNow = Math.floor(Date.now()/1000);

    let user;
    let hash;

    let userId = v4uuid();
    let hashId = v4uuid();

    createUserAndHash();

    function createUser () {
      return new Promise((resolve, reject) => {
        user = new User({
          Id: userId,
          Login: Login,
          Created: tsNow,
        });
        user.save()
          .then(function () {
            resolve(user);
          })
          .catch(reject);
      });
    }

    function createUserPassword () {
      return new Promise((resolve, reject) => {
        hash = new Hash({
          Id: hashId,
          Value: NewPassword,
          OwnerId: userId,
        });
        hash.save()
          .then(function () {
            resolve(hash);
          })
          .catch(reject);
      });
    }

    function createUserAndHash () {
      Promise
        .all([
          createUserPassword(),
          createUser(),
        ])
        .then(function (d) {
          events.emit("signup:success", d);
          res.status(202).send("");
        })
        .catch(handleErr);
    }

    function handleErr (err) {
      let msg = err.message;
      res.send(400, { ErrorMsg: msg });
    }

  });

  api.post("/auth/attempts", function (req, res) {

    let AuthAttempt = db.AuthAttempt;
    let Token = db.Token;

    if (!req.body.Login || !req.body.Password) {
      return res.status(400)
        .send({ ErrorMsg: "ERR_INCOMPLETE: Missing Login or Password" })
    }

    let login = req.body.Login;
    let attemptId = v4uuid();
    let tokenId = v4uuid();

    function createToken (user, expiry) {
      let tsNow = Math.floor(Date.now()/1000);
      return Token.forge({
        Id: tokenId,
        UserId: user.get("Id"),
        Key: `${tokenId}/${user.get("Id")}/${tsNow}`,
        Created: tsNow,
        Expiry: expiry || 3600,
      }).save();
    }

    verifyAuthN(req.body.Login, req.body.Password)
      .then(function (user) {

        events.emit("auth/attempt:success", {
          Id: attemptId,
          Login: login,
          TokenId: tokenId,
        });

        createToken(user, 86400)
          .then(function (token) {
            let uri = `/auth/attempt/${attemptId}`;
            res.localRedirect(uri);
          })
          .catch(function (err) {
            console.log(err);
            res.status(400).send({ ErrorMsg: err.message });
          });

      })
      .catch(function (err) {

        events.emit("auth/attempt:error", {
          Id: attemptId,
          Login: login,
          Error: err.message,
        });

        res.status(400).send({ ErrorMsg: err.message });

      });
  });

  api.get("/auth/attempt/:authAttemptId", function (req, res) {
    res.status(200).send(req.authAttempt);
  });

  function verifyAuthN (Login, Password) {
    return new Promise((resolve, reject) => {

      if (!Login || !Password) {
        return reject(new Error());
      }

      db.fetchUserByLogin(Login)
        .then(function (user) {

          db.fetchHashByOwnerId(user.get("Id"))
            .then(function (hash) {
              let passwordCorrect = crypt.compareSync(Password, hash.get("Value"));
              if (passwordCorrect) {
                return resolve(user);
              }
              reject(new Error("ERR_INVALID_PASSWORD: Invalid/incorrect Password"));
            })
            .catch(function (err) {
              reject(new Error("ERR_NO_PASSWORD: Login failed"));
            });

        })
        .catch(function (err) {
          console.log(err);
          reject(new Error("ERR_INVALID_LOGIN: Invalid Login"));
        });

    });
  }

  function reservedLogin (Login) {
    let login = Login.toLowerCase();
    return RESERVED_LOGINS.indexOf(login) > -1;
  }

  function pwHash (password) {
    let salt = crypt.genSaltSync(10);
    return crypt.hashSync(password, salt);
  }

  function checkLoginAvailability (Login) {
    return new Promise((resolve, reject) => {
      if (Login.length < 5 || reservedLogin(Login)) {
        return reject({
          Login: Login,
          Available: false,
          Reason: "RESERVED",
        });
      }

      db.fetchUserByLogin(Login)
        .then(function (user) {

          if (!user) {
            return resolve({
              Login: Login,
              Available: true,
            });
          }

          reject({
            Login: Login,
            Available: false,
          });

        })
        .catch(function (err) {
          reject({
            Login: Login,
            Available: false,
          });
        });
    });
  }

  function checkUsernameAvailability (req, res, next) {
    checkLoginAvailability(req.body.Email.toLowerCase())
      .then(function () {
        next();
      })
      .catch(function () {
        res.status(400).send({ ErrorMsg: 'Login/email unavailable' });
      });
  }

};
