import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { FullUserDto } from 'src/users/dto/full-user.dto';
import { Order } from './entities/order.entity';
import { JwtAccessGuard } from 'src/jwt/jwt.guard/jwt.guard';
import { NotFoundException } from '@nestjs/common';

interface RequestWithUser extends Request {
  user: FullUserDto;
}

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Post()
  @UseGuards(JwtAccessGuard)
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Request() req: RequestWithUser,
  ): Promise<Order> {
    const { id: createdById, company } = req.user;
    const orderData: CreateOrderDto & {
      createdById: number;
      companyId: number;
    } = {
      ...createOrderDto,
      createdById,
      companyId: company.id,
    };
    return await this.orderService.create(orderData);
  }

  @Get()
  @UseGuards(JwtAccessGuard)
  async findAll(
    @Query() paginationQuery: PaginationQueryDto,
    @Request() req: RequestWithUser,
  ): Promise<Order[]> {
    return await this.orderService.findAll(paginationQuery, req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAccessGuard)
  async findOne(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ): Promise<Order> {
    const orderId = parseInt(id, 10);
    if (isNaN(orderId)) {
      throw new NotFoundException('Некорректный идентификатор заказа');
    }
    return await this.orderService.findOne(orderId, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAccessGuard)
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Request() req: RequestWithUser,
  ): Promise<Order> {
    return await this.orderService.update(id, updateOrderDto, req.user);
  }
}
