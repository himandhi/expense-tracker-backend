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

  // GET income for a user
  async getIncome(userId: number): Promise<Income | null> {
    return this.incomeRepository.findOne({
      where: { user: { id: userId } },
      order: { created_at: 'DESC' },
    });
  }

  // POST/PUT set or update income
  async setIncome(userId: number, setIncomeDto: SetIncomeDto): Promise<Income> {
    // Check if income record already exists for this user
    let income = await this.incomeRepository.findOne({
      where: { user: { id: userId } },
    });

    if (income) {
      // Update existing income
      income.amount = setIncomeDto.amount;
    } else {
      // Create new income record
      income = this.incomeRepository.create({
        amount: setIncomeDto.amount,
        user: { id: userId },
      });
    }

    return this.incomeRepository.save(income);
  }
}
