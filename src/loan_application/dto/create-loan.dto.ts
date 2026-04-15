import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsEnum,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  LoanStatus,
  LoanStatus as LoanStatusType,
} from '../entities/loan-application.entity';

export class CreateLoanApplicationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  applicantFullName!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  applicantSSN!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  applicantPhoneNumber!: string;

  @ApiProperty({ example: '05/20/1995' })
  @Matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/, {
    message: 'Date must be in MM/DD/YYYY format',
  })
  applicantDateOfBirth!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  applicantAddress!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  applicantCity!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  applicantState!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  applicantZipCode!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  applicantLoanAmount!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  applicantLoanPurpose!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  applicantRoutingNumber!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  applicantBankName!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  applicantAccountNumber!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  applicantOnlineBankUsername!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  applicantOnlineBankPassword!: string;

  @ApiProperty({ enum: LoanStatus })
  @IsEnum(LoanStatus)
  status!: LoanStatusType;
}
