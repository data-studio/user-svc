

module.exports = function AppDb (db) {

  const bookshelf = db._bookshelf;

  let AppSchema = bookshelf.Model.extend({
    tableName: 'app_schemas',
    constructor: function() {
      bookshelf.Model.apply(this, arguments);
      this.on('saving', function(model, attrs, options) {
        options.query.where('Id', '=', model.get("Id"));
      });
    },
    App: function() {
      return this.belongsTo(db.App, "AppId", "Id");
    },
  });

  db.AppSchema = AppSchema;

  let App = bookshelf.Model.extend({
    tableName: 'apps',
    idAttribute: "Id",
    constructor: function() {
      bookshelf.Model.apply(this, arguments);
      this.on('saving', function(model, attrs, options) {
        options.query.where('Id', '=', model.get("Id"));
      });
    },
    User: function() {
      return this.belongsTo(db.User, "UserId", "Id");
    },
    Schemas: function() {
      return this.hasMany(db.AppSchema, "AppId")
        .query(function(qb) {
          qb.whereNull('Deleted');
        });
    },
    Clients: function() {
      return this.hasMany(db.Client, "AppId")
        .query(function(qb) {
          qb.whereNull('Deleted');
        });
    },
    Apis: function() {
      return this.hasMany(db.Api, "AppId")
        .query(function(qb) {
          qb.whereNull('Deleted');
        });
    },
  });

  db.App = App;

  function fetchAppById (id) {
    return new Promise((resolve, reject) => {
      App.where({"Id": id})
        .fetch()
        .then(resolve)
        .catch(reject);
    });
  }

  db.fetchAppById = fetchAppById;

  function fetchAppSchemaById (id) {
    return new Promise((resolve, reject) => {
      AppSchema.where({"Id": id})
        .fetch()
        .then(resolve)
        .catch(reject);
    });
  }

  db.fetchAppSchemaById = fetchAppSchemaById;

  function fetchAppSchemasByAppId (appId) {
    return new Promise((resolve, reject) => {
      AppSchema.where({"AppId": appId, "Deleted": null})
        .fetchAll()
        .then(resolve)
        .catch(reject);
    });
  }

  db.fetchAppSchemasByAppId = fetchAppSchemasByAppId;

  function fetchAppClientsByAppId (appId) {
    return new Promise((resolve, reject) => {
      AppClient.where({"AppId": appId, "Deleted": null})
        .fetchAll()
        .then(resolve)
        .catch(reject);
    });
  }

  db.fetchAppClientsByAppId = fetchAppClientsByAppId;

  function fetchDetailedAppById (id) {
    return new Promise((resolve, reject) => {
      App.where({"Id": id})
        .fetch({withRelated: ["Apis", "Clients", "Schemas"]})
        .then(resolve)
        .catch(reject);
    });
  }

  db.fetchDetailedAppById = fetchDetailedAppById;

  function fetchAppsByUserId (userId) {
    return new Promise((resolve, reject) => {
      App.where({"UserId": userId, "Deleted": null})
        .fetchAll()
        .then(resolve)
        .catch(reject);
    });
  }

  db.fetchAppsByUserId = fetchAppsByUserId;

};
