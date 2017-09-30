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
