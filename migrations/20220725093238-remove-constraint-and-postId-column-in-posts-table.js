'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.removeConstraint('comments', 'comments_postId_posts_fk')

    await queryInterface.removeColumn('comments', 'postId')

    await queryInterface.addColumn('comments', 'postId', {
      type: Sequelize.INTEGER,
      references: {
          model: 'posts',
          key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.addColumn('comments', 'postId', {
      type: Sequelize.INTEGER,
      references: {
          model: 'posts',
          key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    })
  }
};
