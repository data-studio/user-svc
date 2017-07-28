
describe("APP_SCHEMA REST Schema", function () {

  let schema;

  let userId;
  let authorization;

  let login;
  let password;

  let $testClient;

  beforeEach(function (done) {

    schema = jasmine.startTestApi();
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
    schema.server.close(done);
  });

  describe("/app/:appId/schemas", function () {

    let appData;
    let app;
    let appId;

    let schemaData;

    beforeEach(function (done) {
      schemaData = {
        Name: "My Test Schema",
      };
      appData = {
        Name: "My Test App",
      };
      $testClient.$post(authorization, `/apps`, appData, function (err, res) {
        $testClient.$get(authorization, res.headers.location, function (err, res) {
          app = res.d;
          appId = app.Id;
          done();
        });
      });
    });

    describe("createAppSchema <POST> with valid parameters", function () {

      it("RETURNS `HTTP/1.1 403 Forbidden` WHEN `Authorization` HEADER IS NOT PROVIDED", function (done) {
        $testClient.$post(null, `/app/${appId}/schemas`, schemaData, function (err, res) {
          expect(res.statusCode).toBe(403);
          done();
        });
      });

      it("RETURNS `HTTP/1.1 303 See Other` WHEN `Authorization` HEADER IS PROVIDED", function (done) {
        $testClient.$post(authorization, `/app/${appId}/schemas`, schemaData, function (err, res) {
          expect(res.statusCode).toBe(303);
          expect(res.headers.location).toMatch(jasmine.idUrlRegexp("app", "schema"));
          done();
        });
      });

      it("CREATES AN APP SCHEMA", function (done) {
        $testClient.$post(authorization, `/app/${appId}/schemas`, schemaData, function (err, res) {
          $testClient.$get(authorization, res.headers.location, function (err, res) {
            expect(res.statusCode).toBe(200);
            done();
          });
        });
      });

      it("ADDS THE SCHEMA TO THE APPS LIST OF SCHEMAS", function (done) {
        $testClient.$post(authorization, `/app/${appId}/schemas`, schemaData, function (err, res) {
          let schemaId = res.headers.location.split(/\//g).pop();
          $testClient.$get(authorization, `/app/${appId}`, function (err, res) {
            expect(res.statusCode).toBe(200);
            expect(res.d).toEqual(jasmine.objectContaining({
              "Schemas": jasmine.arrayContaining([
                jasmine.objectContaining({
                  "Id": schemaId
                }),
              ]),
            }));
            done();
          });
        });
      });

    });

  });

});
