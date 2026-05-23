import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PromoCodesService } from './promocodes.service';
import { CreatePromoCodeDto } from './dto/create-promocode.dto';
import { UpdatePromoCodeDto } from './dto/update-promocode.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../database/schemas/user.schema';

@ApiTags('PromoCodes')
@Controller('promocodes')
export class PromoCodesController {
  constructor(private promoCodesService: PromoCodesService) {}

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all promo codes for superadmin' })
  findAllForAdmin() {
    return this.promoCodesService.findAllForAdmin();
  }

  @Get()
  @ApiOperation({ summary: 'Get all promo codes' })
  findAll() {
    return this.promoCodesService.findAll();
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get promo code by code' })
  findByCode(@Param('code') code: string) {
    return this.promoCodesService.findByCode(code);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create promo code' })
  create(@Body() dto: CreatePromoCodeDto) {
    return this.promoCodesService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update promo code' })
  update(@Param('id') id: string, @Body() dto: UpdatePromoCodeDto) {
    return this.promoCodesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete promo code' })
  remove(@Param('id') id: string) {
    return this.promoCodesService.remove(id);
  }
}
