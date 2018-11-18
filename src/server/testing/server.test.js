const request = require('supertest');
const app = require('../express-app')


// test the root path (html file)
describe('Test the root path to serve our html file', () => {
  test('GET method should return a 200 response', (done) => {
    request(app)
      .get('/')
      .then((response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });
});

// test the /main.js endpoint
describe('Test the /main.js endpoint to serve our bundle', () => {
  test('GET method should return a 200 response', (done) => {
    request(app)
      .get('/main.js')
      .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

// test the /pod endpoint
describe('GET /pod endpoint', () => {
  test('responds with the proper pod object', (done) => {
    request(app)
      .get('/pod')
      .then((response) => {
        expect(response.body.kind).toBe('PodList')
        done();
      })
  });
  test('returns a JSON object and status of 200', (done) => {
    request(app)
      .get('/pod')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

// test the /service endpoint
describe('GET /service endpoint', () => {
  test('responds with the proper service object', (done) => {
    request(app)
      .get('/service')
      .then((response) => {
        expect(response.body.kind).toBe('ServiceList')
        done();
      })
  });
  test('returns a JSON object and status of 200', (done) => {
    request(app)
      .get('/service')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

// test the /ingress endpoint
describe('GET /ingress endpoint', () => {
  test('responds with the proper ingress object', (done) => {
    request(app)
      .get('/ingress')
      .then((response) => {
        expect(response.body.kind).toBe('IngressList')
        done();
      })
  });
  test('returns a JSON object and status of 200', (done) => {
    request(app)
      .get('/ingress')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw done(err);
        done();
      })
  });
});

// test the /deployment endpoint
describe('GET /deployment endpoint', () => {
  test('responds with the proper deployment object', (done) => {
    request(app)
      .get('/deployment')
      .then((response) => {
        expect(response.body.kind).toBe('DeploymentList')
        done();
      })
  });
  test('returns a JSON object and status of 200', (done) => {
      request(app)
          .get('/deployment')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200, done);
  });
});