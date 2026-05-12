import {
  Controller,
  Get,
  Delete,
  Put,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

// Typed body interface — replaces the unsafe `any`
interface UpdateUserDto {
  username?: string;
  role?: string;
}

// BOTH guards must pass:
// 1. AccessTokenGuard: user must be logged in
// 2. RolesGuard: user must have the ADMIN role
@UseGuards(AccessTokenGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('overview')
  getOverview() {
    return this.adminService.getSystemOverview();
  }

  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('expenses')
  getAllExpenses() {
    return this.adminService.getAllExpenses();
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: number) {
    return this.adminService.deleteUser(id);
  }

  @Put('users/:id')
  updateUser(@Param('id') id: number, @Body() updateData: UpdateUserDto) {
    return this.adminService.updateUser(id, updateData);
  }

  @Delete('expenses/:id')
  deleteExpense(@Param('id') id: number) {
    return this.adminService.deleteExpense(id);
  }
}
