import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Expense } from '../expense/expense.entity';
import { Income } from '../income/income.entity';
import { Role } from '../common/enums/role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  // NEW: User's display name
  @Column({ default: '' })
  username: string;

  // NEW: Role column using Enum
  // 'enum' type tells TypeORM this column only allows values from Role enum
  // default: Role.USER means new users are regular users by default
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  // NEW: Store hashed refresh token for token rotation
  @Column({ nullable: true })
  refreshToken: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Expense, (expense) => expense.user)
  expenses: Expense[];

  @OneToMany(() => Income, (income) => income.user)
  incomes: Income[];
}
