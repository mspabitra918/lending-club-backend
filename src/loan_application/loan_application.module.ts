import { Module } from '@nestjs/common';
import { LoanApplicationService } from './loan_application.service';
import { LoanApplicationController } from './loan_application.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { LoanApplication } from './entities/loan-application.entity';

@Module({
  imports: [SequelizeModule.forFeature([LoanApplication])],
  providers: [LoanApplicationService],
  controllers: [LoanApplicationController],
  exports: [LoanApplicationService, SequelizeModule],
})
export class LoanApplicationModule {}
