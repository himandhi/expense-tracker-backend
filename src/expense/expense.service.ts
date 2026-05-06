import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
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
    try {
      return await this.expenseRepository.find({
        where: { userId },
        order: { created_at: 'DESC' },
      });
    } catch {
      throw new InternalServerErrorException('Failed to fetch expenses');
    }
  }

  async create(
    userId: number,
    createExpenseDto: CreateExpenseDto,
  ): Promise<Expense> {
    try {
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

      return await this.expenseRepository.save(expense);
    } catch (_error) {
      if (
        _error instanceof BadRequestException ||
        _error instanceof NotFoundException
      ) {
        throw _error;
      }
      throw new InternalServerErrorException('Failed to create expense');
    }
  }

  async update(
    id: number,
    userId: number,
    updateData: Partial<CreateExpenseDto>,
  ): Promise<Expense> {
    try {
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
      return await this.expenseRepository.save(expense);
    } catch (_error) {
      if (
        _error instanceof BadRequestException ||
        _error instanceof NotFoundException
      ) {
        throw _error;
      }
      throw new InternalServerErrorException('Failed to update expense');
    }
  }

  async remove(id: number, userId: number): Promise<void> {
    try {
      const expense = await this.expenseRepository.findOne({
        where: { id, userId },
      });

      if (!expense) {
        throw new NotFoundException('Expense not found');
      }

      await this.expenseRepository.remove(expense);
    } catch (_error) {
      if (_error instanceof NotFoundException) {
        throw _error;
      }
      throw new InternalServerErrorException('Failed to delete expense');
    }
  }
}
