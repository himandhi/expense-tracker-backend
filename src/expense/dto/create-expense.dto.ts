import { IsString, IsNumber, IsPositive } from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsPositive()
  cost: number;
}
