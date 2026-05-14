import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { AccessTokenGuard } from '../common/guards/access-token.guard';

@UseGuards(AccessTokenGuard)
@Controller('expenses')
export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}

  @Get()
  async findAll(@Req() req: Request) {
    try {
      const user = req.user as { userId: number };
      return await this.expenseService.findAll(user.userId);
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve expenses');
    }
  }

  @Post()
  async create(
    @Req() req: Request,
    @Body() createExpenseDto: CreateExpenseDto,
  ) {
    try {
      const user = req.user as { userId: number };
      return await this.expenseService.create(user.userId, createExpenseDto);
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create expense');
    }
  }

  @Put(':id')
  async update(
    @Req() req: Request,
    @Param('id') id: number,
    @Body() updateData: Partial<CreateExpenseDto>,
  ) {
    try {
      const user = req.user as { userId: number };
      return await this.expenseService.update(id, user.userId, updateData);
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update expense');
    }
  }

  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: number) {
    try {
      const user = req.user as { userId: number };
      return await this.expenseService.remove(id, user.userId);
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete expense');
    }
  }
}
