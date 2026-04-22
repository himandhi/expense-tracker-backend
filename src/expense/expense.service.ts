import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './expense.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { User } from '../user/user.entity';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
  ) {}

  async findAll(userId: number): Promise<Expense[]> {
    return this.expenseRepository.find({
      where: { user: { id: userId } as User },
      order: { created_at: 'DESC' },
    });
  }

  async create(
    userId: number,
    createExpenseDto: CreateExpenseDto,
  ): Promise<Expense> {
    const expense = this.expenseRepository.create({
      ...createExpenseDto,
      user: { id: userId } as User,
    });
    return this.expenseRepository.save(expense);
  }

  async update(
    id: number,
    userId: number,
    updateData: Partial<CreateExpenseDto>,
  ): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({
      where: { id, user: { id: userId } as User },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    Object.assign(expense, updateData);
    return this.expenseRepository.save(expense);
  }

  async remove(id: number, userId: number): Promise<void> {
    const expense = await this.expenseRepository.findOne({
      where: { id, user: { id: userId } as User },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    await this.expenseRepository.remove(expense);
  }
}
