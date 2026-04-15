import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { LoanApplicationModule } from './loan_application/loan_application.module';
import { EmailModule } from './email/email.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING;

const sequelizeOptions = databaseUrl
  ? {
      dialect: 'postgres' as const,
      uri: databaseUrl,
      autoLoadModels: true,
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false },
      },
      pool: { max: 2, min: 0, idle: 10000 },
      retry: { max: 0 },
      logging: false,
    }
  : {
      dialect: 'postgres' as const,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadModels: true,
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      pool: { max: 2, min: 0, idle: 10000 },
      retry: { max: 0 },
      logging: false,
    };

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot(sequelizeOptions),
    LoanApplicationModule,
    EmailModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
