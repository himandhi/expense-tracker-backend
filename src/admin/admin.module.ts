import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../user/user.entity';
import { Expense } from '../expense/expense.entity';
import { Income } from '../income/income.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Expense, Income])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
