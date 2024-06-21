const request = require('supertest');
const chai = require('chai');
const app = require('../app');

const expect = chai.expect;
let token;

describe('Account APIs', () => {
  it('should create a new account', (done) => {
    request(app)
      .post('/api/accounts/register')
      .send({
        userName: "testUser",
        emailAddress: "testUser@gmail.com",
        password: "testPass",
        fullName: "testFullName"
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('status', 'success');
        done();
      });
  });

  it('should login with valid credentials', (done) => {
    request(app)
      .post('/api/accounts/login')
      .send({
        userName: 'testUser',
        password: 'testPass'
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        token = res.body.data.token;
        expect(res.body).to.have.property('status', 'success');
        done();
      });
  });

  it('should get profile', (done) => {
    request(app)
      .get('/api/accounts/profile')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('status', 'success');
        done();
      });
  });

  it('should get accounts older than 3 days', (done) => {
    request(app)
      .get('/api/accounts/loginsOlderThanThreeDays')
      .set('Authorization', 'Bearer ' + token)
      .expect(200, done);
  });
});
