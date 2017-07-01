"use strict";

module.exports = function (dataStudio) {

  const knex = require('knex')({
    client: 'mysql',
    connection: {
      host: process.env.DS_DB_HOST,
      user: process.env.DS_DB_USER,
      password: process.env.DS_DB_PASS,
      database: process.env.DS_DB_NAME,
      charset: 'utf8',
    },
  });

  const bookshelf = require('bookshelf')(knex);

  var Hash = bookshelf.Model.extend({
    tableName: 'hashes',
    constructor: function() {
      bookshelf.Model.apply(this, arguments);
      this.on('saving', function(model, attrs, options) {
        options.query.where('Id', '=', model.get("Id"));
      });
    },
  });

  var AppSchema = bookshelf.Model.extend({
    tableName: 'app_schemas',
    constructor: function() {
      bookshelf.Model.apply(this, arguments);
      this.on('saving', function(model, attrs, options) {
        options.query.where('Id', '=', model.get("Id"));
      });
    },
    App: function() {
      return this.belongsTo(bookshelf.Model("User"), "AppId", "Id");
    },
  });

  var App = bookshelf.Model.extend({
    tableName: 'apps',
    constructor: function() {
      bookshelf.Model.apply(this, arguments);
      this.on('saving', function(model, attrs, options) {
        options.query.where('Id', '=', model.get("Id"));
      });
    },
    User: function() {
      return this.belongsTo(bookshelf.Model("User"), "UserId", "Id");
    },
    AppSchemas: function() {
      return this.hasMany(AppSchema, "Id", "UserId");
    },
  });

  var User = bookshelf.Model.extend({
    tableName: 'users',
    constructor: function() {
      bookshelf.Model.apply(this, arguments);
      this.on('saving', function(model, attrs, options) {
        options.query.where('Id', '=', model.get("Id"));
      });
    },
    Apps: function() {
      return this.hasMany(App, "Id", "UserId");
    },
  });

  var Token = bookshelf.Model.extend({
    tableName: 'tokens',
    constructor: function() {
      bookshelf.Model.apply(this, arguments);
      this.on('saving', function(model, attrs, options) {
        options.query.where('Id', '=', model.get("Id"));
      });
    },
    User: function() {
      return this.hasOne(User, "Id", "UserId");
    },
  });

  var AuthAttempt = bookshelf.Model.extend({
    tableName: 'auth_attempts',
    constructor: function() {
      bookshelf.Model.apply(this, arguments);
      this.on('saving', function(model, attrs, options) {
        options.query.where('Id', '=', model.get("Id"));
      });
    },
    Token: function() {
      return this.hasOne(Token, "Id", "TokenId");
    },
  });

  return {
    _knex: knex,
    _bookshelf: bookshelf,
    App: App,
    AppSchema: AppSchema,
    Hash: Hash,
    User: User,
    Token: Token,
    AuthAttempt: AuthAttempt,
    fetchUserById: function (id) {
      return new Promise((resolve, reject) => {
        User.where({"Id": id})
          .fetch()
          .then(resolve)
          .catch(reject);
      });
    },
    fetchUserByLogin: function (login) {
      return new Promise((resolve, reject) => {
        User.where({"Login": login.toLowerCase()})
          .fetch()
          .then(resolve)
          .catch(reject);
      });
    },
    fetchHashByOwnerId: function (id) {
      return new Promise((resolve, reject) => {
        Hash.where({"OwnerId": id})
          .fetch()
          .then(resolve)
          .catch(reject);
      });
    },
    fetchAppSchemaById: function (id) {
      return new Promise((resolve, reject) => {
        AppSchema.where({"Id": id})
          .fetch()
          .then(resolve)
          .catch(reject);
      });
    },
    fetchAppSchemasByAppId: function (appId) {
      return new Promise((resolve, reject) => {
        AppSchema.where({"AppId": appId, "Deleted": null})
          .fetchAll()
          .then(resolve)
          .catch(reject);
      });
    },
    fetchAppById: function (id) {
      return new Promise((resolve, reject) => {
        App.where({"Id": id})
          .fetch()
          .then(resolve)
          .catch(reject);
      });
    },
    fetchAppsByUserId: function (userId) {
      return new Promise((resolve, reject) => {
        App.where({"UserId": userId, "Deleted": null})
          .fetchAll()
          .then(resolve)
          .catch(reject);
      });
    },
    fetchAuthAttemptById: function (id) {
      return new Promise((resolve, reject) => {
        AuthAttempt.where({"Id": id})
          .fetch({withRelated: ["Token"]})
          .then(resolve)
          .catch(reject);
      });
    },
    fetchTokenByKey: function (key) {
      return new Promise((resolve, reject) => {
        Token.where({"Key": key})
          .fetch({withRelated: ["User"]})
          .then(resolve)
          .catch(reject);
      });
    },
    fetchTokenById: function (id) {
      return new Promise((resolve, reject) => {
        Token.where({"Id": id})
          .fetch({withRelated: ["User"]})
          .then(resolve)
          .catch(reject);
      });
    },
  };

};