import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { FullUserDto } from 'src/users/dto/full-user.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(
    orderData: CreateOrderDto & { createdById: number; companyId: number },
  ): Promise<Order> {
    const order = this.orderRepository.create({
      ...orderData,
      createdAt: new Date(),
    });
    return await this.orderRepository.save(order);
  }
}
