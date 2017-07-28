

module.exports = function Schema (db) {

  const bookshelf = db._bookshelf;

  let Schema = bookshelf.Model.extend({
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
    Properties: function() {
      return this.hasMany(db.Property, "Id", "SchemaId")
        .query(function(qb) {
          qb.whereNull('Deleted');
        });
    },
  });

  db.Schema = Schema;

  function fetchSchemaById (id) {
    return new Promise((resolve, reject) => {
      Schema.where({"Id": id})
        .fetch({withRelated: ["App", "Properties"]})
        .then(resolve)
        .catch(reject);
    });
  };

  db.fetchSchemaById = fetchSchemaById;

  function fetchSchemasByAppId (appId) {
    return new Promise((resolve, reject) => {
      Schema.where({"AppId": appId, "Deleted": null})
        .fetchAll()
        .then(resolve)
        .catch(reject);
    });
  }

  db.fetchSchemasByAppId = fetchSchemasByAppId;

  function fetchSchemaById (id) {
    return new Promise((resolve, reject) => {
      Schema.where({"Id": id, "Deleted": null})
        .fetch()
        .then(resolve)
        .catch(reject);
    });
  }

  db.fetchSchemaById = fetchSchemaById;

};
