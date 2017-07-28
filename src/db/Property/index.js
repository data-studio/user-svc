

module.exports = function Property (db) {

  const bookshelf = db._bookshelf;

  let Property = bookshelf.Model.extend({
    tableName: 'schema_properties',
    constructor: function() {
      bookshelf.Model.apply(this, arguments);
      this.on('saving', function(model, attrs, options) {
        options.query.where('Id', '=', model.get("Id"));
      });
    },
    Schema: function() {
      return this.belongsTo(db.Schema, "SchemaId", "Id");
    },
  });

  db.Property = Property;

  function fetchPropertyById (id) {
    return new Promise((resolve, reject) => {
      Property.where({"Id": id})
        .fetch({withRelated: ["Schema"]})
        .then(resolve)
        .catch(reject);
    });
  };

  db.fetchPropertyById = fetchPropertyById;

  function fetchPropertiesBySchemaId (schemaId) {
    return new Promise((resolve, reject) => {
      Property.where({"SchemaId": schemaId, "Deleted": null})
        .fetchAll()
        .then(resolve)
        .catch(reject);
    });
  }

  db.fetchPropertiesBySchemaId = fetchPropertiesBySchemaId;

  function fetchPropertyById (id) {
    return new Promise((resolve, reject) => {
      Property.where({"Id": id, "Deleted": null})
        .fetch()
        .then(resolve)
        .catch(reject);
    });
  }

  db.fetchPropertyById = fetchPropertyById;

};
