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
} from '@nestjs/common';
import { Request } from 'express';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { AccessTokenGuard } from '../common/guards/access-token.guard';

@UseGuards(AccessTokenGuard)
@Controller('expenses')
export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}

  // GET /expenses — uses userId from JWT token (not query param)
  @Get()
  findAll(@Req() req: Request) {
    const user = req.user as { userId: number };
    return this.expenseService.findAll(user.userId);
  }

  // POST /expenses
  @Post()
  create(@Req() req: Request, @Body() createExpenseDto: CreateExpenseDto) {
    const user = req.user as { userId: number };
    return this.expenseService.create(user.userId, createExpenseDto);
  }

  // PUT /expenses/:id — EDIT an expense
  @Put(':id')
  update(
    @Req() req: Request,
    @Param('id') id: number,
    @Body() updateData: Partial<CreateExpenseDto>,
  ) {
    const user = req.user as { userId: number };
    return this.expenseService.update(id, user.userId, updateData);
  }

  // DELETE /expenses/:id
  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: number) {
    const user = req.user as { userId: number };
    return this.expenseService.remove(id, user.userId);
  }
}
