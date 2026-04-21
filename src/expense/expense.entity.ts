// ============================================================
// FILE: src/expense/expense.entity.ts
// PURPOSE: Defines the "expenses" table in PostgreSQL
//
// Auto-creates table:
//   Columns: id, name, cost, created_at, userId
// ============================================================

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  // Expense name (Shopping, Holiday, etc.)
  @Column()
  name: string;

  // Cost amount — 'decimal' stores precise money values
  // precision: total digits, scale: digits after decimal
  @Column('decimal', { precision: 10, scale: 2 })
  cost: number;

  @CreateDateColumn()
  created_at: Date;

  // @ManyToOne → Many expenses belong to one user
  // This creates a "userId" foreign key column in the expenses table
  @ManyToOne(() => User, (user) => user.expenses, { onDelete: 'CASCADE' })
  user: User;
}
