import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ExpenseModule } from './expense/expense.module';
import { IncomeModule } from './income/income.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres123',
      database: 'expense_tracker',
      autoLoadEntities: true,
      synchronize: true,
    }),

    // Feature modules
    UserModule,
    AuthModule,
    ExpenseModule,
    IncomeModule,
  ],
})
export class AppModule {}
