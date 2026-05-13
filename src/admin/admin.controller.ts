import {
  Controller,
  Get,
  Delete,
  Put,
  Param,
  Body,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

interface UpdateUserDto {
  username?: string;
  role?: string;
}

@UseGuards(AccessTokenGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('overview')
  async getOverview() {
    try {
      return await this.adminService.getSystemOverview();
    } catch {
      throw new InternalServerErrorException('Failed to fetch system overview');
    }
  }

  @Get('users')
  async getAllUsers() {
    try {
      return await this.adminService.getAllUsers();
    } catch {
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  @Get('expenses')
  async getAllExpenses() {
    try {
      return await this.adminService.getAllExpenses();
    } catch {
      throw new InternalServerErrorException('Failed to fetch expenses');
    }
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: number) {
    try {
      return await this.adminService.deleteUser(id);
    } catch {
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  @Put('users/:id')
  async updateUser(@Param('id') id: number, @Body() updateData: UpdateUserDto) {
    try {
      return await this.adminService.updateUser(id, updateData);
    } catch {
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  @Delete('expenses/:id')
  async deleteExpense(@Param('id') id: number) {
    try {
      return await this.adminService.deleteExpense(id);
    } catch {
      throw new InternalServerErrorException('Failed to delete expense');
    }
  }
}
