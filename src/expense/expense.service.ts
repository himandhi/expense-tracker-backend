import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './expense.entity';
import { Income } from '../income/income.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,

    @InjectRepository(Income)
    private incomeRepository: Repository<Income>,
  ) {}

  async findAll(userId: number): Promise<Expense[]> {
    return this.expenseRepository.find({
      where: { userId },
      order: { created_at: 'DESC' },
    });
  }

  async create(
    userId: number,
    createExpenseDto: CreateExpenseDto,
  ): Promise<Expense> {
    const income = await this.incomeRepository.findOne({
      where: { userId },
    });

    const incomeAmount = income ? Number(income.amount) : 0;

    const existingExpenses = await this.expenseRepository.find({
      where: { userId },
    });

    const totalSpent = existingExpenses.reduce(
      (sum, exp) => sum + Number(exp.cost),
      0,
    );

    const remaining = incomeAmount - totalSpent;

    if (createExpenseDto.cost > remaining) {
      throw new BadRequestException(
        `Insufficient balance. Remaining: Rs. ${remaining.toFixed(2)}, Requested: Rs. ${createExpenseDto.cost.toFixed(2)}`,
      );
    }

    const expense = this.expenseRepository.create({
      name: createExpenseDto.name,
      cost: createExpenseDto.cost,
      userId,
    });
    return this.expenseRepository.save(expense);
  }

  async update(
    id: number,
    userId: number,
    updateData: Partial<CreateExpenseDto>,
  ): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({
      where: { id, userId },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    if (updateData.cost !== undefined) {
      const income = await this.incomeRepository.findOne({
        where: { userId },
      });

      const incomeAmount = income ? Number(income.amount) : 0;

      const existingExpenses = await this.expenseRepository.find({
        where: { userId },
      });

      const totalSpentExcludingCurrent = existingExpenses
        .filter((exp) => exp.id !== id)
        .reduce((sum, exp) => sum + Number(exp.cost), 0);

      const remaining = incomeAmount - totalSpentExcludingCurrent;

      if (updateData.cost > remaining) {
        throw new BadRequestException(
          `Insufficient balance. Remaining: Rs. ${remaining.toFixed(2)}, Requested: Rs. ${updateData.cost.toFixed(2)}`,
        );
      }
    }

    Object.assign(expense, updateData);
    return this.expenseRepository.save(expense);
  }

  async remove(id: number, userId: number): Promise<void> {
    const expense = await this.expenseRepository.findOne({
      where: { id, userId },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    await this.expenseRepository.remove(expense);
  }
}
