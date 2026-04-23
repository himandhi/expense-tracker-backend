import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Income } from './income.entity';
import { SetIncomeDto } from './dto/set-income.dto';

@Injectable()
export class IncomeService {
  constructor(
    @InjectRepository(Income)
    private incomeRepository: Repository<Income>,
  ) {}

  async getIncome(userId: number): Promise<Income | null> {
    return this.incomeRepository.findOne({
      where: { userId },
      order: { created_at: 'DESC' },
    });
  }

  async setIncome(userId: number, setIncomeDto: SetIncomeDto): Promise<Income> {
    let income = await this.incomeRepository.findOne({
      where: { userId },
    });

    if (income) {
      income.amount = setIncomeDto.amount;
    } else {
      income = this.incomeRepository.create({
        amount: setIncomeDto.amount,
        userId,
      });
    }

    return this.incomeRepository.save(income);
  }
}
