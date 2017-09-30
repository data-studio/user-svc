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

const Db = require("../../src/db");

describe("DATABASE", function () {

  const _Api_ = "Api";
  const _AppClient_ = "Client";
  const _App_ = "App";
  const _AppSchema_ = "Schema";
  const _AuthAttempt_ = "AuthAttempt";
  const _Operation_ = "Operation";
  const _OperationParameter_ = "OperationParameter";
  const _Route_ = "Route";
  const _Hash_ = "Hash";
  const _Token_ = "Token";
  const _User_ = "User";

  const _fetchApiById_ = "fetchApiById";
  const _fetchApisByAppId_ = "fetchApisByAppId";
  const _fetchAppById_ = "fetchAppById";
  const _fetchAppClientById_ = "fetchClientById";
  const _fetchAppSchemaById_ = "fetchSchemaById";
  const _fetchUserById_ = "fetchUserById";
  const _fetchUserByLogin_ = "fetchUserByLogin";
  const _fetchAuthAttemptById_ = "fetchAuthAttemptById";
  const _fetchHashByOwnerId_ = "fetchHashByOwnerId";
  const _fetchTokenById_ = "fetchTokenById";
  const _fetchTokenByKey_ = "fetchTokenByKey";
  const _fetchOperationById_ = "fetchOperationById";
  const _fetchOperationsByApiId_ = "fetchOperationsByApiId";
  const _fetchRouteById_ = "fetchRouteById";
  const _fetchRoutesByApiId_ = "fetchRoutesByApiId";

  let db;

  beforeEach(function () {
    db = Db();
  });

  describe("MODELS", function () {

    it(_Api_, function () {
      expect(_Api_ in db).toBe(true);
    });

    it(_AppClient_, function () {
      expect(_AppClient_ in db).toBe(true);
    });

    it(_App_, function () {
      expect(_App_ in db).toBe(true);
    });

    it(_AppSchema_, function () {
      expect(_AppSchema_ in db).toBe(true);
    });

    it(_AuthAttempt_, function () {
      expect(_AuthAttempt_ in db).toBe(true);
    });

    it(_Operation_, function () {
      expect(_Operation_ in db).toBe(true);
    });

    it(_Route_, function () {
      expect(_Route_ in db).toBe(true);
    });

    it(_Hash_, function () {
      expect(_Hash_ in db).toBe(true);
    });

    it(_Token_, function () {
      expect(_Token_ in db).toBe(true);
    });

    it(_User_, function () {
      expect(_User_ in db).toBe(true);
    });

  });

  describe("SUGAR METHODS", function () {

    describe("FOR APIS", function () {

      it(_fetchApiById_, function () {
        expect(_fetchApiById_ in db).toBe(true);
      });

      it(_fetchApisByAppId_, function () {
        expect(_fetchApisByAppId_ in db).toBe(true);
      });

    });

    describe("FOR APPS", function () {

      it(_fetchAppById_, function () {
        expect(_fetchAppById_ in db).toBe(true);
      });

      it(_fetchAppClientById_, function () {
        expect(_fetchAppClientById_ in db).toBe(true);
      });

      it(_fetchAppSchemaById_, function () {
        expect(_fetchAppSchemaById_ in db).toBe(true);
      });

    });

    describe("FOR USERS", function () {

      it(_fetchUserById_, function () {
        expect(_fetchUserById_ in db).toBe(true);
      });

      it(_fetchUserByLogin_, function () {
        expect(_fetchUserByLogin_ in db).toBe(true);
      });

      it(_fetchAuthAttemptById_, function () {
        expect(_fetchAuthAttemptById_ in db).toBe(true);
      });

      it(_fetchHashByOwnerId_, function () {
        expect(_fetchHashByOwnerId_ in db).toBe(true);
      });

    });

    describe("FOR TOKENS", function () {

      it(_fetchTokenById_, function () {
        expect(_fetchTokenById_ in db).toBe(true);
      });

      it(_fetchTokenByKey_, function () {
        expect(_fetchTokenByKey_ in db).toBe(true);
      });

    });

    describe("FOR OPERATIONS", function () {

      it(_fetchOperationById_, function () {
        expect(_fetchOperationById_ in db).toBe(true);
      });

      it(_fetchOperationsByApiId_, function () {
        expect(_fetchOperationsByApiId_ in db).toBe(true);
      });

    });

    describe("FOR ROUTES", function () {

      it(_fetchRouteById_, function () {
        expect(_fetchRouteById_ in db).toBe(true);
      });

      it(_fetchRoutesByApiId_, function () {
        expect(_fetchRoutesByApiId_ in db).toBe(true);
      });

    });

  });

});
