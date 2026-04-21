import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './expense.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
  ) {}

  // GET all expenses for a user
  async findAll(userId: number): Promise<Expense[]> {
    return this.expenseRepository.find({
      where: { user: { id: userId } },
      order: { created_at: 'DESC' },
    });
  }

  // POST create a new expense
  async create(
    userId: number,
    createExpenseDto: CreateExpenseDto,
  ): Promise<Expense> {
    const expense = this.expenseRepository.create({
      ...createExpenseDto,
      user: { id: userId },
    });
    return this.expenseRepository.save(expense);
  }

  // PUT update an expense
  async update(
    id: number,
    userId: number,
    updateData: Partial<CreateExpenseDto>,
  ): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    Object.assign(expense, updateData);
    return this.expenseRepository.save(expense);
  }

  // DELETE an expense
  async remove(id: number, userId: number): Promise<void> {
    const expense = await this.expenseRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    await this.expenseRepository.remove(expense);
  }
}
