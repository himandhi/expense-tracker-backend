import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
    try {
      return await this.incomeRepository.findOne({
        where: { userId },
        order: { created_at: 'DESC' },
      });
    } catch {
      throw new InternalServerErrorException('Failed to fetch income');
    }
  }

  async setIncome(userId: number, setIncomeDto: SetIncomeDto): Promise<Income> {
    try {
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

      return await this.incomeRepository.save(income);
    } catch {
      throw new InternalServerErrorException('Failed to set income');
    }
  }
}
