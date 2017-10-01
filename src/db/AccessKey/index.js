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

const crypto = require('crypto');

module.exports = function Env (db) {

  const bookshelf = db._bookshelf;

  const DEFAULT_KEY_SIZE = 96;
  const PRIVATE_KEY_SIZE = 128;

  const PRIVATE = 'PRIVATE';
  const PUBLIC = 'PUBLIC';

  let AccessKey = bookshelf.Model.extend({
    tableName: 'access_keys',
    constructor: function() {
      let env = this;
      bookshelf.Model.apply(this, arguments);
      this.on('saving', (model, attrs, options) => {
        options.query.where('Id', '=', model.get("Id"));
      });
      this.on('creating', (model, attrs, options) => {

        let keySize;
        let isPrivateKey;

        attrs.KeyType = attrs.KeyType || PRIVATE;
        model.set("KeyType", attrs.KeyType);

        isPrivateKey = PRIVATE === attrs.KeyType;
        keySize = isPrivateKey ? PRIVATE_KEY_SIZE : DEFAULT_KEY_SIZE;

        attrs.Key = generateKey(keySize);
        model.set("Key", attrs.Key);

        console.log(attrs);

      });
    },
  });

  db.AccessKey = AccessKey;

  function fetchAccessKeysBySecureId (secureId) {
    return new Promise((resolve, reject) => {
      AccessKey.where({"SecureId": secureId, "Deleted": null})
        .fetchAll()
        .then(resolve)
        .catch(reject);
    });
  }

  db.fetchAccessKeysBySecureId = fetchAccessKeysBySecureId;

  function fetchAccessKeyById (id) {
    return new Promise((resolve, reject) => {
      AccessKey.where({"Id": id, "Deleted": null})
        .fetch()
        .then(resolve)
        .catch(reject);
    });
  }

  db.fetchAccessKeyById = fetchAccessKeyById;

  function fetchAccessKeyByKey (key) {
    return new Promise((resolve, reject) => {
      AccessKey.where({"Key": key, "Deleted": null})
        .fetch()
        .then(resolve)
        .catch(reject);
    });
  }

  db.fetchAccessKeyByKey = fetchAccessKeyByKey;

};

function generateKey (b) {
  return crypto.randomBytes(b).toString('base64');
}
