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

const Routes = require("../../src/routes");

describe("API ROUTE", function () {

  const _GET_ = "[ GET    ]";
  const _POST_ = "[ POST   ]";
  const _PUT_ = "[ PUT    ]";
  const _DELETE_ = "[ DELETE ]";

  const _USER_ = "/user/:userId";
  const _LOGIN_AVAILABILITY_ = "/login/:login/availability";
  const _SIGNUP_ = "/signup/:signupId";
  const _SIGNUPS_ = "/signups";

  const _APP_ = "/app/:appId";
  const _APP_SCHEMAS_ = "/schemas";
  const _APP_SCHEMA_ = "/app/:appId/schema/:schemaId";
  const _APP_APIS_ = "/apis";
  const _APP_CLIENTS_ = "/clients";
  const _APPS_ = "/apps";
  const _ALL_APPS_ = "/apps/all";

  const _API_ = "/api/:apiId";
  const _API_OPERATIONS_ = "/api/:apiId/operations";
  const _APIS_ = "/apis";

  const _OPERATION_ = "/operation/:operationId";
  const _OPERATIONS_ = "/operations";

  const _AUTH_ATTEMPT_ = "/auth/attempt/:authAttemptId";
  const _AUTH_ATTEMPTS_ = "/auth/attempts";

  const _FN_ = jasmine.any(Function);

  let spyGet;
  let spyPost;
  let spyPut;
  let spyDelete;
  let dataStudioMock;
  let routes;

  beforeEach(function () {

    spyGet = jasmine.createSpy("get");
    spyPost = jasmine.createSpy("post");
    spyPut = jasmine.createSpy("put");
    spyDelete = jasmine.createSpy("delete");

    dataStudioMock = {
      expressApp: {
        get: spyGet,
        post: spyPost,
        put: spyPut,
        delete: spyDelete,
      },
      db: {

      },
    };

    routes = Routes(dataStudioMock);

  });

  describe("DEFINITIONS", function () {

    describe("FOR USERS", function () {

      it(`${_GET_} ${_USER_}`, function () {
        expect(spyGet).toHaveBeenCalledWith(_USER_, _FN_, _FN_);
      });

      it(`${_PUT_} ${_USER_}`, function () {
        expect(spyPut).toHaveBeenCalledWith(_USER_, _FN_, _FN_);
      });

      it(`${_GET_} ${_LOGIN_AVAILABILITY_}`, function () {
        expect(spyGet).toHaveBeenCalledWith(_LOGIN_AVAILABILITY_, _FN_);
      });

    });

    describe("FOR SIGNUPS", function () {

      it(`${_GET_} ${_SIGNUP_}`, function () {
        expect(spyGet).toHaveBeenCalledWith(_SIGNUP_, _FN_);
      });

      it(`${_POST_} ${_SIGNUPS_}`, function () {
        expect(spyPost).toHaveBeenCalledWith(_SIGNUPS_, _FN_, _FN_);
      });

    });

    describe("FOR AUTH", function () {

      it(`${_POST_} ${_AUTH_ATTEMPTS_}`, function () {
        expect(spyPost).toHaveBeenCalledWith(_AUTH_ATTEMPTS_, _FN_);
      });

      it(`${_GET_} ${_AUTH_ATTEMPT_}`, function () {
        expect(spyGet).toHaveBeenCalledWith(_AUTH_ATTEMPT_, _FN_);
      });

    });

    describe("FOR APPS", function () {

      it(`${_POST_} ${_APPS_}`, function () {
        expect(spyPost).toHaveBeenCalledWith(_APPS_, _FN_, _FN_);
      });

      it(`${_GET_} ${_ALL_APPS_}`, function () {
        expect(spyGet).toHaveBeenCalledWith(_ALL_APPS_, _FN_, _FN_);
      });

      it(`${_GET_} ${_APP_}`, function () {
        expect(spyGet).toHaveBeenCalledWith(_APP_, _FN_, _FN_);
      });

      it(`${_GET_} ${_APP_SCHEMAS_}`, function () {
        expect(spyGet).toHaveBeenCalledWith(_APP_SCHEMAS_, _FN_, _FN_);
      });

      it(`${_POST_} ${_APP_SCHEMAS_}`, function () {
        expect(spyPost).toHaveBeenCalledWith(_APP_SCHEMAS_, _FN_, _FN_);
      });

      it(`${_GET_} ${_APP_APIS_}`, function () {
        expect(spyGet).toHaveBeenCalledWith(_APP_APIS_, _FN_, _FN_);
      });

      it(`${_POST_} ${_APP_APIS_}`, function () {
        expect(spyPost).toHaveBeenCalledWith(_APP_APIS_, _FN_, _FN_);
      });

      it(`${_GET_} ${_APP_CLIENTS_}`, function () {
        expect(spyGet).toHaveBeenCalledWith(_APP_CLIENTS_, _FN_, _FN_);
      });

      it(`${_POST_} ${_APP_CLIENTS_}`, function () {
        expect(spyPost).toHaveBeenCalledWith(_APP_CLIENTS_, _FN_, _FN_);
      });

      it(`${_PUT_} ${_APP_}`, function () {
        expect(spyPut).toHaveBeenCalledWith(_APP_, _FN_, _FN_);
      });

      it(`${_DELETE_} ${_APP_}`, function () {
        expect(spyDelete).toHaveBeenCalledWith(_APP_, _FN_, _FN_);
      });

      it(`${_DELETE_} ${_APP_SCHEMA_}`, function () {
        expect(spyDelete).toHaveBeenCalledWith(_APP_SCHEMA_, _FN_, _FN_);
      });

    });

    describe("FOR APIS", function () {

      it(`${_POST_} ${_APIS_}`, function () {
        expect(spyPost).toHaveBeenCalledWith(_APIS_, _FN_, _FN_);
      });

      it(`${_GET_} ${_API_}`, function () {
        expect(spyGet).toHaveBeenCalledWith(_API_, _FN_, _FN_);
      });

      it(`${_PUT_} ${_API_}`, function () {
        expect(spyPut).toHaveBeenCalledWith(_API_, _FN_, _FN_);
      });

      it(`${_DELETE_} ${_API_}`, function () {
        expect(spyDelete).toHaveBeenCalledWith(_API_, _FN_, _FN_);
      });

    });

    describe("FOR OPERATIONS", function () {

      it(`${_POST_} ${_API_OPERATIONS_}`, function () {
        expect(spyPost).toHaveBeenCalledWith(_APIS_, _FN_, _FN_);
      });

      it(`${_POST_} ${_OPERATIONS_}`, function () {
        expect(spyPost).toHaveBeenCalledWith(_APIS_, _FN_, _FN_);
      });

      it(`${_GET_} ${_OPERATION_}`, function () {
        expect(spyGet).toHaveBeenCalledWith(_API_, _FN_, _FN_);
      });

      it(`${_PUT_} ${_OPERATION_}`, function () {
        expect(spyPut).toHaveBeenCalledWith(_API_, _FN_, _FN_);
      });

      it(`${_DELETE_} ${_OPERATION_}`, function () {
        expect(spyDelete).toHaveBeenCalledWith(_API_, _FN_, _FN_);
      });

    });

  });

});
