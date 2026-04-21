// ============================================================
// FILE: src/user/user.entity.ts
// PURPOSE: Defines the "users" table in PostgreSQL
//
// TypeORM reads this class and AUTOMATICALLY creates:
//   Table: users
//   Columns: id, email, password, created_at
// ============================================================

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Expense } from '../expense/expense.entity';
import { Income } from '../income/income.entity';

// @Entity() tells TypeORM: "This class = a database table"
@Entity('users')
export class User {
  // @PrimaryGeneratedColumn() → auto-incrementing ID (1, 2, 3...)
  @PrimaryGeneratedColumn()
  id: number;

  // @Column({ unique: true }) → no two users can have the same email
  @Column({ unique: true })
  email: string;

  // @Column() → a regular column
  @Column()
  password: string;

  // @CreateDateColumn() → automatically set to current date/time
  @CreateDateColumn()
  created_at: Date;

  // @OneToMany → One user has many expenses
  // This creates a relationship between users and expenses tables
  @OneToMany(() => Expense, (expense) => expense.user)
  expenses: Expense[];

  // @OneToMany → One user has many income records
  @OneToMany(() => Income, (income) => income.user)
  incomes: Income[];
}
