import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
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
  async getIncome(@Req() req: Request) {
    try {
      const user = req.user as { userId: number };
      return await this.incomeService.getIncome(user.userId);
    } catch {
      throw new InternalServerErrorException('Failed to retrieve income');
    }
  }

  // POST /income
  @Post()
  async setIncome(@Req() req: Request, @Body() setIncomeDto: SetIncomeDto) {
    try {
      const user = req.user as { userId: number };
      return await this.incomeService.setIncome(user.userId, setIncomeDto);
    } catch {
      throw new InternalServerErrorException('Failed to set income');
    }
  }
}
