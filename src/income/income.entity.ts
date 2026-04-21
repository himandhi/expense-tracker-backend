// ============================================================
// FILE: src/income/income.entity.ts
// PURPOSE: Defines the "incomes" table in PostgreSQL
//
// Auto-creates table:
//   Columns: id, amount, created_at, userId
// ============================================================

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('incomes')
export class Income {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  amount: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.incomes, { onDelete: 'CASCADE' })
  user: User;
}
