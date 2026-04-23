import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseController } from './expense.controller';
import { ExpenseService } from './expense.service';
import { Expense } from './expense.entity';
import { Income } from '../income/income.entity';

@Module({
  // CHANGED: Added Income to forFeature so ExpenseService can access it
  imports: [TypeOrmModule.forFeature([Expense, Income])],
  controllers: [ExpenseController],
  providers: [ExpenseService],
})
export class ExpenseModule {}
