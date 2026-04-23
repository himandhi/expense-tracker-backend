import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { IncomeService } from './income.service';
import { SetIncomeDto } from './dto/set-income.dto';

@Controller('income')
export class IncomeController {
  constructor(private incomeService: IncomeService) {}

  @Get()
  getIncome(@Query('userId') userId: number) {
    return this.incomeService.getIncome(userId);
  }

  @Post()
  setIncome(
    @Query('userId') userId: number,
    @Body() setIncomeDto: SetIncomeDto,
  ) {
    return this.incomeService.setIncome(userId, setIncomeDto);
  }
}
