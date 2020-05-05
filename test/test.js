const moment = require("moment")
require('dotenv').config()

const chai = require("chai");
const should = require('chai').should();
const expect = chai.expect;
const url = process.env.API_URL;
const request = require("supertest")(url);

let id;
let token;
let firstEvent;

describe("Connection", () => {
    it("Connection to the server", (done) => {
      request
        .post("test")
        .expect(200)
        .end((err, res) => {
          // res will contain array with one user
          if (err) return done(err);
          done();
        });
    });
  });

describe("GraphQL", () => {
  it("Returns events", (done) => {
    request
      .post("Graphql")
      .send({ query: '{events{_id id name{fi}}}' })
      .expect(200)
      .end((err, res) => {
        // res will contain array with one user
        if (err) return done(err);
        
        res.body.data.events.should.have.lengthOf(10);
        firstEvent = res.body.data.events[0].id
        for(let event of res.body.data.events) {
            event.should.have.property('id');
            event.should.have.property('name');
            let name = event.name;
            name.should.have.property('fi');
        }
        done();
      });
  });
});

describe("GraphQL", () => {
    it("Register user", (done) => {
      request
        .post("Graphql")
        .send({ query: `
        mutation {
            UserRegister (
              username: "testUser"
              password: "testUser"
              email: "testUser@testUser.fi"
              address: "kilonportti 1"
            ) {id token}
          }`
         })
        .expect(200)
        .end((err, res) => {
          // res will contain array with one user
          if (err) return done(err);
          done();
        });
    });
  });

describe("GraphQL", () => {
    it("Login user", (done) => {
      request
        .post("Graphql")
        .send({ query: `
        {
            userLogin (username:"testUser" password: "testUser") {
              id
              token
            }
          }`
         })
        .expect(200)
        .end((err, res) => {
            res.body.data.userLogin.should.have.property('id')
            res.body.data.userLogin.should.have.property('token')
            id = res.body.data.userLogin.id;
            token = res.body.data.userLogin.token;
            // res will contain array with one user
          if (err) return done(err);
          done();
        });
    });
  });

  describe("GraphQL", () => {
    it("Reserve a event", (done) => {
      request
        .post("Graphql")
        .set("Authorization", "Bearer " + token)
        .send({ query: `
        mutation {
          UserAddReservation(id: "${id}" , reservation: "${firstEvent}", date:"1588610113") {
              id
          }
      }
        `
         })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.data.UserAddReservation.should.have.property('id')

          done();
        });
    });
  });

  describe("GraphQL", () => {
    it("Delete a event", (done) => {
      request
        .post("Graphql")
        .set("Authorization", "Bearer " + token)
        .send({ query: `
        mutation {
            UserRemoveReservation(id: "${id}" , reservation: "${firstEvent}") {
              id
            }
          }
        `
         })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.data.UserRemoveReservation.should.have.property('id')
          done();
        });
    });
  });

  describe("GraphQL", () => {
    it("Get Your events", (done) => {
      request
        .post("Graphql")
        .send({ query: `
        {
        user(id: "${id}") {
        id
        reservations {
          id
          name {fi}
          description {
            intro
          }
          location {
            lat
            lon
                }
              }
            }
          }
    `
         })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
  });


  describe("GraphQL", () => {
    it("Delete user", (done) => {
      request
        .post("Graphql")
        .set("Authorization", "Bearer " + token)
        .send({ query: `
        mutation {
            UserDelete (id: "${id}") {
              id
            }
          }`
         })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          console.log()
          res.body.data.UserDelete.should.have.property('id')
          done();
        });
    });
  });
/*
describe('GraphQL', () => {
    it('Returns user with id = 10', (done) => {
        request.post('/graphql')
        .send({ query: '{ user(id: 10) { id name username email } }'})
        .expect(200)
        .end((err,res) => {
            // res will contain array with one user
            if (err) return done(err);
            res.body.user.should.have.property('id')
            res.body.user.should.have.property('name')
            res.body.user.should.have.property('username')
            res.body.user.should.have.property('email')
            done();
          })
     })*/
