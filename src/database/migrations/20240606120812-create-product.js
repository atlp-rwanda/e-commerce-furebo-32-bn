/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      productName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      expireDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      collection_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Collections',
          key: 'id',
        }
      },
      availability: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      seller_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        }
      },
      images: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      expired: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      reviews: {
        type: Sequelize.JSONB,
        defaultValue: [],
        allowNull: true
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};
