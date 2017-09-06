
describe("SCHEMA_PROPERTY REST API", function () {

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

  describe("/schema/:schemaId/properties", function () {

    let app;
    let schema;
    let appData;
    let schemaData;
    let appId;
    let schemaId;

    let propertyData;

    beforeEach(function (done) {
      appData = {
        Name: "My Test App",
      };
      schemaData = {
        Name: "My Test API",
      };
      propertyData = {
        Key: "MyProp",
      };
      $testClient.$post(authorization, `/apps`, appData, function (err, res) {
        $testClient.$get(authorization, res.headers.location, function (err, res) {
          app = res.d;
          appId = app.Id;
          $testClient.$post(authorization, `/app/${appId}/schemas`, schemaData, function (err, res) {
            $testClient.$get(authorization, res.headers.location, function (err, res) {
              schema = res.d;
              schemaId = schema.Id;
              done();
            });
          });
        });
      });
    });

    describe("createSchemaProperty <POST> with valid parameters", function () {

      it("RETURNS `HTTP/1.1 403 Forbidden` WHEN `Authorization` HEADER IS NOT PROVIDED", function (done) {
        $testClient.$post(null, `/schema/${schemaId}/properties`, propertyData, function (err, res) {
          expect(res.statusCode).toBe(403);
          done();
        });
      });

      it("RETURNS `HTTP/1.1 303 See Other` WHEN `Authorization` HEADER IS PROVIDED", function (done) {
        $testClient.$post(authorization, `/schema/${schemaId}/properties`, propertyData, function (err, res) {
          expect(res.statusCode).toBe(303);
          expect(res.headers.location).toMatch(jasmine.idUrlRegexp("schema", "property"));
          done();
        });
      });

      it("CREATES AN API PROPERTY", function (done) {
        $testClient.$post(authorization, `/schema/${schemaId}/properties`, propertyData, function (err, res) {
          $testClient.$get(authorization, res.headers.location, function (err, res) {
            expect(res.statusCode).toBe(200);
            done();
          });
        });
      });

      it("ADDS THE PROPERTY TO THE SCHEMAS LIST OF PROPERTIES", function (done) {
        $testClient.$post(authorization, `/schema/${schemaId}/properties`, propertyData, function (err, res) {
          let propId = res.headers.location.split(/\//g).pop();
          $testClient.$get(authorization, `/schema/${schemaId}/properties`, function (err, res) {
            expect(res.statusCode).toBe(200);
            expect(res.d).toEqual(jasmine.arrayContaining([
              jasmine.objectContaining({
                "Id": propId
              }),
            ]));
            done();
          });
        });
      });

    });

  });

});
