'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('loan_applications', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false,
      },
      applicantFullName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      applicantSSN: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      applicantPhoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      applicantDateOfBirth: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      applicantAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      applicantCity: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      applicantState: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      applicantZipCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      applicantLoanAmount: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      applicantLoanPurpose: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      applicantRoutingNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      applicantBankName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      applicantAccountNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      applicantOnlineBankUsername: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      applicantOnlineBankPassword: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(
          'NEW_LEAD',
          'IN_REVIEW',
          'APPROVED',
          'REJECTED',
          'FUNDED',
        ),
        allowNull: false,
        defaultValue: 'NEW_LEAD',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('loan_applications');
  },
};
