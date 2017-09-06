

module.exports = function UserDb (db) {

  const bookshelf = db._bookshelf;

  let User = bookshelf.Model.extend({
    tableName: 'users',
    constructor: function() {
      bookshelf.Model.apply(this, arguments);
      this.on('saving', function(model, attrs, options) {
        options.query.where('Id', '=', model.get("Id"));
      });
    },
    Apps: function() {
      return this.hasMany(db.App, "Id", "UserId")
        .query(function(qb) {
          qb.whereNull('Deleted');
        });
    },
  });

  db.User = User;

  function fetchUserById (id) {
    return new Promise((resolve, reject) => {
      User.where({"Id": id})
        .fetch()
        .then(resolve)
        .catch(reject);
    });
  };

  db.fetchUserById = fetchUserById;

  function fetchUserByLogin (login) {
    return new Promise((resolve, reject) => {
      User.where({"Login": login.toLowerCase()})
        .fetch()
        .then(resolve)
        .catch(reject);
    });
  };

  db.fetchUserByLogin = fetchUserByLogin;

};
