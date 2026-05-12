import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Expense } from '../expense/expense.entity';
import { Income } from '../income/income.entity';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,

    @InjectRepository(Income)
    private incomeRepository: Repository<Income>,
  ) {}

  // Get all users
  async getAllUsers() {
    try {
      return await this.userRepository.find({
        select: ['id', 'email', 'username', 'role', 'created_at'],
      });
    } catch {
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  // Get all expenses (all users)
  async getAllExpenses() {
    try {
      return await this.expenseRepository.find({
        relations: ['user'],
        order: { created_at: 'DESC' },
      });
    } catch {
      throw new InternalServerErrorException('Failed to fetch expenses');
    }
  }

  // Delete a user (and their data via CASCADE)
  async deleteUser(userId: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.userRepository.remove(user);
      return { message: `User ${user.email} deleted successfully` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  // Update any user's data
  async updateUser(
    userId: number,
    updateData: { username?: string; role?: string },
  ) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (updateData.username) {
        user.username = updateData.username;
      }

      if (updateData.role) {
        user.role = updateData.role as Role;
      }

      await this.userRepository.save(user);
      return { message: 'User updated successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  // Delete any expense
  async deleteExpense(expenseId: number) {
    try {
      const expense = await this.expenseRepository.findOne({
        where: { id: expenseId },
      });

      if (!expense) {
        throw new NotFoundException('Expense not found');
      }

      await this.expenseRepository.remove(expense);
      return { message: 'Expense deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete expense');
    }
  }

  // Get system overview
  async getSystemOverview() {
    try {
      const totalUsers = await this.userRepository.count();
      const totalExpenses = await this.expenseRepository.count();

      return {
        totalUsers,
        totalExpenses,
      };
    } catch {
      throw new InternalServerErrorException('Failed to fetch system overview');
    }
  }
}
