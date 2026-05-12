import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { IncomeService } from './income.service';
import { SetIncomeDto } from './dto/set-income.dto';
import { AccessTokenGuard } from '../common/guards/access-token.guard';

@UseGuards(AccessTokenGuard)
@Controller('income')
export class IncomeController {
  constructor(private incomeService: IncomeService) {}

  // GET /income — userId from JWT
  @Get()
  getIncome(@Req() req: Request) {
    const user = req.user as { userId: number };
    return this.incomeService.getIncome(user.userId);
  }

  // POST /income
  @Post()
  setIncome(@Req() req: Request, @Body() setIncomeDto: SetIncomeDto) {
    const user = req.user as { userId: number };
    return this.incomeService.setIncome(user.userId, setIncomeDto);
  }
}
