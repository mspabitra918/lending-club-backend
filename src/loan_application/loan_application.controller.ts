import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { LoanApplicationService } from './loan_application.service';
import { CreateLoanApplicationDto } from './dto/create-loan.dto';

const BACKEND_PUCLIC_URL = '/api/v1/loans';

@Controller(BACKEND_PUCLIC_URL)
export class LoanApplicationController {
  constructor(private readonly loanService: LoanApplicationService) {}

  // Public endpoint — anyone can apply (guest or logged in)
  @Post('apply')
  async apply(@Body() dto: CreateLoanApplicationDto) {
    try {
      const loan = await this.loanService.create(dto);
      return {
        message: 'Loan application submitted successfully',
        loan,
      };
    } catch (error) {
      console.error('Error applying for loan:', error);
      throw new InternalServerErrorException(
        'Error submitting loan application',
      );
    }
  }

  @Get('applications')
  async getAllApplications(
    @Query('date') date?: string,
    @Query('q') q?: string,
    @Query('tzOffset') tzOffset?: string,
  ) {
    try {
      const parsedTz = tzOffset !== undefined ? Number(tzOffset) : undefined;
      const loans = await this.loanService.getAll({
        date,
        q,
        tzOffset: Number.isFinite(parsedTz) ? parsedTz : undefined,
      });
      return { loans };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching loan applications',
      );
    }
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    try {
      const loan = await this.loanService.getById(id);
      return { loan };
    } catch (error) {
      throw new InternalServerErrorException('Error fetching loan application');
    }
  }
}
