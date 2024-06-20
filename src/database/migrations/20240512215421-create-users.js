/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users',  {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        onDelete: "CASCADE",
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
  
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
  
      birthDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
  
      gender: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "",
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      preferredLanguage: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "",
      },
  
      preferredCurrency: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "",
      },
  
      whereYouLive: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "",
      },
  
      billingAddress: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "",
      },
  
      verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
  
      role: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "",
      },
  
      profileURL: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      
      
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
  
  
    },
    {
      timestamps: true,
      sequelize: Sequelize,
      modelName: "User",
      tableName: "users",
    }
  );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};