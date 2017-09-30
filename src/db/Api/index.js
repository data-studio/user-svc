/**
 * Eviratec Data Studio
 * Copyright (c) 2017 Callan Peter Milne
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 * OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */

module.exports = function ApiDb (db) {

  const bookshelf = db._bookshelf;

  let Api = bookshelf.Model.extend({
    tableName: 'app_apis',
    constructor: function() {
      bookshelf.Model.apply(this, arguments);
      this.on('saving', function(model, attrs, options) {
        options.query.where('Id', '=', model.get("Id"));
      });
    },
    App: function() {
      return this.belongsTo(db.App, "AppId", "Id");
    },
    Routes: function() {
      return this.hasMany(db.Route, "ApiId", "Id")
        .query(function(qb) {
          qb.whereNull('Deleted');
        });
    },
    Operations: function() {
      return this.hasMany(db.Operation, "ApiId", "Id")
        .query(function(qb) {
          qb.whereNull('Deleted');
        });
    },
  });

  db.Api = Api;

  function fetchDetailedApiById (id) {
    return new Promise((resolve, reject) => {
      Api.where({"Id": id, "Deleted": null})
        .fetch({withRelated: ["Operations", "Routes"]})
        .then(resolve)
        .catch(reject);
    });
  }

  db.fetchDetailedApiById = fetchDetailedApiById;

  function fetchApiById (id, opts) {
    opts = opts || {};
    return new Promise((resolve, reject) => {
      Api.where({"Id": id, "Deleted": null})
        .fetch(opts)
        .then(resolve)
        .catch(reject);
    });
  }

  db.fetchApiById = fetchApiById;

  function fetchApisByAppId (appId) {
    return new Promise((resolve, reject) => {
      Api.where({"AppId": appId, "Deleted": null})
        .fetchAll()
        .then(resolve)
        .catch(reject);
    });
  }

  db.fetchApisByAppId = fetchApisByAppId;

};
