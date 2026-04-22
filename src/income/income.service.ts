import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Income } from './income.entity';
import { SetIncomeDto } from './dto/set-income.dto';
import { User } from '../user/user.entity';

@Injectable()
export class IncomeService {
  constructor(
    @InjectRepository(Income)
    private incomeRepository: Repository<Income>,
  ) {}

  // GET income for a user
  async getIncome(userId: number): Promise<Income | null> {
    return this.incomeRepository.findOne({
      where: { user: { id: userId } as User },
      order: { created_at: 'DESC' },
    });
  }

  // POST/PUT set or update income
  async setIncome(userId: number, setIncomeDto: SetIncomeDto): Promise<Income> {
    let income = await this.incomeRepository.findOne({
      where: { user: { id: userId } as User },
    });

    if (income) {
      income.amount = setIncomeDto.amount;
    } else {
      income = this.incomeRepository.create({
        amount: setIncomeDto.amount,
        user: { id: userId } as User,
      });
    }

    return this.incomeRepository.save(income);
  }
}
