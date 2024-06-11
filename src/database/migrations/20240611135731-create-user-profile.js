/* eslint-disable quotes */
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("UserProfiles", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      birthdate: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      preferredLanguage: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      preferredCurrency: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      whereYouLive: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      billingAddress: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("UserProfiles");
  },
};
