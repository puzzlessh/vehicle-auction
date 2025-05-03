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
interface RequestWhithUser extends Request {
  user: FullUserDto;
}

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Get()
  @UseGuards(JwtAccessGuard)
  async findAll(
    @Request() req: RequestWhithUser,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    const userPermissions = req.user.role.permissions;
    const userId = req.user.id;
    return this.orderService.findAll(paginationQuery, userPermissions, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.orderService.findOne('' + id);
  }

  @Post()
  @UseGuards(JwtAccessGuard)
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Request() req: RequestWhithUser,
  ): Promise<Order> {
    console.log('Received user data!:', req.user);
    return this.orderService.create(createOrderDto, req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }
}
