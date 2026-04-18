import { Column, DataType, Model, Table } from 'sequelize-typescript';

export const LoanStatus = [
  'NEW_LEAD',
  'IN_REVIEW',
  'APPROVED',
  'REJECTED',
  'FUNDED',
] as const;

export type LoanStatus = (typeof LoanStatus)[number];

@Table({ tableName: 'loan_applications', timestamps: true })
export class LoanApplication extends Model<LoanApplication> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare applicantFullName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare applicantSSN: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare applicantPhoneNumber: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare applicantDateOfBirth: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare applicantAddress: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare applicantCity: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare applicantState: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare applicantZipCode: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare applicantLoanAmount: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare applicantLoanPurpose: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare applicantRoutingNumber: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare applicantBankName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare applicantAccountNumber: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare applicantOnlineBankUsername: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare applicantOnlineBankPassword: string;

  @Column({
    type: DataType.ENUM(...LoanStatus),
    allowNull: false,
  })
  declare status: LoanStatus;

  //   @ForeignKey(() => User)
  //   @Column({ type: DataType.UUID, allowNull: true })
  //   declare userId: string | null;

  //   @BelongsTo(() => User)
  //   declare user: User;
}
