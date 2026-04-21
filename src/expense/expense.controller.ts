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

  // GET /expenses?userId=1
  @Get()
  findAll(@Query('userId') userId: number) {
    return this.expenseService.findAll(userId);
  }

  // POST /expenses?userId=1
  @Post()
  create(
    @Query('userId') userId: number,
    @Body() createExpenseDto: CreateExpenseDto,
  ) {
    return this.expenseService.create(userId, createExpenseDto);
  }

  // PUT /expenses/1?userId=1
  @Put(':id')
  update(
    @Param('id') id: number,
    @Query('userId') userId: number,
    @Body() updateData: Partial<CreateExpenseDto>,
  ) {
    return this.expenseService.update(id, userId, updateData);
  }

  // DELETE /expenses/1?userId=1
  @Delete(':id')
  remove(@Param('id') id: number, @Query('userId') userId: number) {
    return this.expenseService.remove(id, userId);
  }
}
