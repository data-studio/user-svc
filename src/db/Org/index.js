

module.exports = function Org (db) {

  const bookshelf = db._bookshelf;

  let Org = bookshelf.Model.extend({
    tableName: 'orgs',
    constructor: function() {
      bookshelf.Model.apply(this, arguments);
      this.on('saving', function(model, attrs, options) {
        options.query.where('Id', '=', model.get("Id"));
      });
    },
    Apps: function() {
      return this.hasMany(db.App, "AppId")
        .query(function(qb) {
          qb.whereNull('Deleted');
        });
    },
  });

  db.Org = Org;

  function fetchOrgById (id) {
    return new Promise((resolve, reject) => {
      Org.where({"Id": id, "Deleted": null})
        .fetch()
        .then(resolve)
        .catch(reject);
    });
  }

  db.fetchOrgById = fetchOrgById;

};
