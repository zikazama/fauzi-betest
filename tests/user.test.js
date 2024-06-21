const request = require("supertest");
const chai = require("chai");
const app = require("../app");

const expect = chai.expect;

let token;
let accountNumber;
let registrationNumber;

describe("User APIs", () => {
  it("should login with valid credentials", (done) => {
    request(app)
      .post("/api/accounts/login")
      .send({
        userName: "testUser",
        password: "testPass",
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        token = res.body.data.token;
        expect(res.body).to.have.property("status", "success");
        done();
      });
  });

  it("should get profile", (done) => {
    request(app)
      .get("/api/accounts/profile")
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        accountNumber = res.body.data.user.accountNumber;
        registrationNumber = res.body.data.user.registrationNumber;
        expect(res.body).to.have.property("status", "success");
        done();
      });
  });

  it("should update user", (done) => {
    request(app)
      .put("/api/users/")
      .set("Authorization", "Bearer " + token)
      .send({
        emailAddress: "testUser99@gmail.com",
        fullName: "testUserName99",
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property("status", "success");
        done();
      });
  });

  it("should get list user", (done) => {
    request(app)
      .get("/api/users/")
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property("status", "success");
        done();
      });
  });

  it("should get user by account number", (done) => {
    request(app)
      .get("/api/users/accountNumber/" + accountNumber)
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property("status", "success");
        done();
      });
  });

  it("should get user by registration number", (done) => {
    request(app)
      .get("/api/users/registrationNumber/" + registrationNumber)
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property("status", "success");
        done();
      });
  });

  it("should delete account and user", (done) => {
    request(app)
      .delete("/api/users/")
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property("status", "success");
        done();
      });
  });
});
