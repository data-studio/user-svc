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
