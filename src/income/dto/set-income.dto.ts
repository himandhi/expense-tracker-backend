import { IsNumber, Min } from 'class-validator';

export class SetIncomeDto {
  @IsNumber()
  @Min(0)
  amount: number;
}
