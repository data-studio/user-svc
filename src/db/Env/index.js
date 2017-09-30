

module.exports = function Env (db) {

  const bookshelf = db._bookshelf;

  let Env = bookshelf.Model.extend({
    tableName: 'envs',
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

  db.Env = Env;

  // function fetchEnvById (id) {
  //   return new Promise((resolve, reject) => {
  //     Env.where({"Id": id})
  //       .fetch({withRelated: ["App"]})
  //       .then(resolve)
  //       .catch(reject);
  //   });
  // };
  //
  // db.fetchEnvById = fetchEnvById;

  function fetchEnvsByAppId (appId) {
    return new Promise((resolve, reject) => {
      Env.where({"AppId": appId, "Deleted": null})
        .fetchAll()
        .then(resolve)
        .catch(reject);
    });
  }

  db.fetchEnvsByAppId = fetchEnvsByAppId;

  function fetchEnvById (id) {
    return new Promise((resolve, reject) => {
      Env.where({"Id": id, "Deleted": null})
        .fetch()
        .then(resolve)
        .catch(reject);
    });
  }

  db.fetchEnvById = fetchEnvById;

};
