

module.exports = function OperationDb (db) {

  const bookshelf = db._bookshelf;

  let Operation = bookshelf.Model.extend({
    tableName: 'api_operations',
    constructor: function() {
      bookshelf.Model.apply(this, arguments);
      this.on('saving', function(model, attrs, options) {
        options.query.where('Id', '=', model.get("Id"));
      });
    },
    Api: function() {
      return this.belongsTo(db.Api, "ApiId", "Id");
    },
  });

  db.Operation = Operation;

  function fetchOperationById (id) {
    return new Promise((resolve, reject) => {
      Operation.where({"Id": id})
        .fetch()
        .then(resolve)
        .catch(reject);
    });
  };

  db.fetchOperationById = fetchOperationById;

  function fetchOperationsByApiId (apiId) {
    return new Promise((resolve, reject) => {
      Operation.where({"ApiId": apiId, "Deleted": null})
        .fetchAll()
        .then(resolve)
        .catch(reject);
    });
  };

  db.fetchOperationsByApiId = fetchOperationsByApiId;

};
