'use strict';

require('dotenv').config();
const Promise = require('bluebird');
const credential = require('credential');
const pw = credential();

const models = require('../models');
const AdminUser = models['AdminUser'];

const adminPwd = process.env.ADMIN_SEED_PASSWORD || 'adminpwd';
const testPwd = process.env.TEST_SEED_PASSWORD || 'testpwd';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    let adminUser, testUser, adminRole, memberRole;
    return pw.hash(adminPwd).then((hash) => {
      return AdminUser.create({
        username: 'admin',
        password: hash,
      }).then((admin) => {
        adminUser = admin;
        return pw.hash(testPwd).then((hash) => {
          return AdminUser.create({
            username: 'test',
            password: hash,
          });
        });
      });
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('admin_user', null, {})
  }
};
