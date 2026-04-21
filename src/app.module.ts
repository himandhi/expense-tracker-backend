import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ExpenseModule } from './expense/expense.module';
import { IncomeModule } from './income/income.module';

@Module({
  imports: [UserModule, AuthModule, ExpenseModule, IncomeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
