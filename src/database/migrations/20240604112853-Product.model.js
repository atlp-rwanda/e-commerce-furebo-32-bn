const { DataTypes } = require('sequelize');

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
      description:{
        type:Sequelize.STRING,
        allowNull:false,
      },
      price:{
        type:Sequelize.FLOAT,
        allowNull:false,
      },
      quantity:{
        type:Sequelize.INTEGER,
        allowNull:false,
      },
      expireDate:{
        type:Sequelize.DATE,
        allowNull:false,
      },
      collection_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Collections',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      seller_id:{
        type:Sequelize.STRING,
        allowNull:false,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      category:{
        type:DataTypes.STRING,
        allowNull:true
      },
      images: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};
