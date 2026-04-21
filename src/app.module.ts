// ============================================================
// FILE: src/app.module.ts
// PURPOSE: Root module — connects to PostgreSQL via TypeORM
// ============================================================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ExpenseModule } from './expense/expense.module';
import { IncomeModule } from './income/income.module';

@Module({
  imports: [
    // TypeORM configuration — connects to PostgreSQL
    TypeOrmModule.forRoot({
      type: 'postgres', // Database type
      host: 'localhost', // Database server (your PC)
      port: 5432, // PostgreSQL default port
      username: 'postgres', // Default superuser
      password: 'postgres123', // ← YOUR password from Step 1.1
      database: 'expense_tracker', // Database name from Step 3.1
      autoLoadEntities: true, // Auto-find all entity files
      synchronize: true, // ← AUTO-CREATES TABLES!
      // synchronize: true means TypeORM reads your entity files
      // and automatically creates/updates database tables.
      // WARNING: Only use this in development, NOT in production!
    }),

    // Feature modules
    UserModule,
    AuthModule,
    ExpenseModule,
    IncomeModule,
  ],
})
export class AppModule {}
