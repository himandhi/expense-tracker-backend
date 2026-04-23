import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Controller('expenses')
export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}

  @Get()
  findAll(@Query('userId') userId: number) {
    return this.expenseService.findAll(userId);
  }

  @Post()
  create(
    @Query('userId') userId: number,
    @Body() createExpenseDto: CreateExpenseDto,
  ) {
    return this.expenseService.create(userId, createExpenseDto);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Query('userId') userId: number,
    @Body() updateData: Partial<CreateExpenseDto>,
  ) {
    return this.expenseService.update(id, userId, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @Query('userId') userId: number) {
    return this.expenseService.remove(id, userId);
  }
}
