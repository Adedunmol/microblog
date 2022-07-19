'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Follow', {
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      FollowedId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
      }
    }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Follow')
  }
};
