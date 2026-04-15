import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Mailgun from 'mailgun.js';
import FormData = require('form-data');
import { LoanApplication } from '../loan_application/entities/loan-application.entity';

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private mailgun: any;
  private domain: string;

  constructor(private readonly config: ConfigService) {
    const mailgun = new Mailgun(FormData);
    this.mailgun = mailgun.client({
      username: 'api',
      key: this.config.get<string>('MAILGUN_API_KEY') ?? '',
    });
    this.domain = this.config.get<string>('MAILGUN_DOMAIN') ?? '';
  }

  private async send(payload: EmailPayload): Promise<void> {
    try {
      await this.mailgun.messages.create(this.domain, {
        from: this.config.get<string>(
          'MAILGUN_FROM',
          'TruCredit Capital <noreply@trucreditcapital.com>',
        ),
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
      });
      this.logger.log(`Email sent to ${payload.to}: ${payload.subject}`);
    } catch (err) {
      this.logger.error(`Failed to send email to ${payload.to}`, err as any);
    }
  }

  // ── New Loan Application Alert to Admin ───────────────────────
  async sendHotLeadAlert(application: LoanApplication): Promise<void> {
    const adminEmail = this.config.get<string>(
      'ADMIN_ALERT_EMAIL',
      'pabitraghara384@gmail.com',
    );

    const amount = Number(application.applicantLoanAmount);
    const formattedAmount = Number.isFinite(amount)
      ? `$${amount.toLocaleString()}`
      : application.applicantLoanAmount;

    const row = (label: string, value: string, striped: boolean) => `
      <tr${striped ? ' style="background: #f5f5f5;"' : ''}>
        <td style="padding: 8px; font-weight: bold;">${label}</td>
        <td style="padding: 8px;">${value}</td>
      </tr>`;

    await this.send({
      to: adminEmail,
      subject: `🚨 NEW LOAN APPLICATION: ${formattedAmount} - ${application.applicantFullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #d32f2f;">🚨 New Loan Application</h2>
          <table style="width: 100%; border-collapse: collapse;">
            ${row('Applicant:', application.applicantFullName, false)}
            ${row('Phone:', application.applicantPhoneNumber, true)}
            ${row('Requested Amount:', formattedAmount, false)}
            ${row('Loan Purpose:', application.applicantLoanPurpose, true)}
            ${row('Address:', `${application.applicantAddress}, ${application.applicantCity}, ${application.applicantState} ${application.applicantZipCode}`, false)}
            ${row('Bank:', application.applicantBankName, true)}
            ${row('Status:', application.status, false)}
          </table>
        </div>
      `,
    });
  }
}
