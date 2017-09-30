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

describe("API_ROUTE REST API", function () {

  let api;

  let userId;
  let authorization;

  let login;
  let password;

  let $testClient;

  beforeEach(function (done) {

    api = jasmine.startTestApi();
    $testClient = jasmine.createTestClient();

    login = $testClient.uniqueLogin();
    password = $testClient.generatePassword();

    $testClient.initUser(login, password, function (err, d) {
      if (err) return done(err);
      userId = d.UserId;
      authorization = d.TokenKey;
      done();
    });

  });

  afterEach(function (done) {
    api.server.close(done);
  });

  describe("/api/:apiId/routes", function () {

    let app;
    let api;
    let appData;
    let apiData;
    let appId;
    let apiId;

    let routeData;

    beforeEach(function (done) {
      appData = {
        Name: "My Test App",
      };
      apiData = {
        Name: "My Test API",
      };
      routeData = {
        Name: "myOperation",
      };
      $testClient.$post(authorization, `/apps`, appData, function (err, res) {
        $testClient.$get(authorization, res.headers.location, function (err, res) {
          app = res.d;
          appId = app.Id;
          $testClient.$post(authorization, `/app/${appId}/apis`, apiData, function (err, res) {
            $testClient.$get(authorization, res.headers.location, function (err, res) {
              api = res.d;
              apiId = api.Id;
              done();
            });
          });
        });
      });
    });

    describe("createApiRoute <POST> with valid parameters", function () {

      it("RETURNS `HTTP/1.1 403 Forbidden` WHEN `Authorization` HEADER IS NOT PROVIDED", function (done) {
        $testClient.$post(null, `/api/${apiId}/routes`, routeData, function (err, res) {
          expect(res.statusCode).toBe(403);
          done();
        });
      });

      it("RETURNS `HTTP/1.1 303 See Other` WHEN `Authorization` HEADER IS PROVIDED", function (done) {
        $testClient.$post(authorization, `/api/${apiId}/routes`, routeData, function (err, res) {
          expect(res.statusCode).toBe(303);
          expect(res.headers.location).toMatch(jasmine.idUrlRegexp("api", "route"));
          done();
        });
      });

      it("CREATES AN API Operation", function (done) {
        $testClient.$post(authorization, `/api/${apiId}/routes`, routeData, function (err, res) {
          $testClient.$get(authorization, res.headers.location, function (err, res) {
            expect(res.statusCode).toBe(200);
            done();
          });
        });
      });

      it("ADDS THE OPERATION TO THE APIS LIST OF OPERATIONS", function (done) {
        $testClient.$post(authorization, `/api/${apiId}/routes`, routeData, function (err, res) {
          let opId = res.headers.location.split(/\//g).pop();
          $testClient.$get(authorization, `/api/${apiId}/routes`, function (err, res) {
            expect(res.statusCode).toBe(200);
            expect(res.d).toEqual(jasmine.arrayContaining([
              jasmine.objectContaining({
                "Id": opId
              }),
            ]));
            done();
          });
        });
      });

    });

  });

});
