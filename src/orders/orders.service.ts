import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { UsersService } from 'src/users/users.service';
import { FullUserDto } from 'src/users/dto/full-user.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly userService: UsersService,
  ) {}

  findAll(
    paginationQueryDto: PaginationQueryDto,
    userPermissions: string[],
    userId: number,
  ) {
    const { limit, offset } = paginationQueryDto;

    if (userPermissions.includes('ADMIN-SERVICE')) {
      return this.orderRepository.find({
        skip: offset,
        take: limit,
      });
    } else {
      return this.orderRepository.find({
        where: { user: { id: userId } },
        skip: offset,
        take: limit,
      });
    }
  }

  async findOne(id: string) {
    const numericId = parseInt(id, 10);
    const order = await this.orderRepository.findOneBy({ id: numericId });

    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    return order;
  }

  async create(
    createOrderDto: CreateOrderDto,
    userData: FullUserDto,
  ): Promise<Order> {
    const user = await this.userService.findOrCreateUserWithCompany(userData);
    const order = this.orderRepository.create({
      ...createOrderDto,
      user: user,
      company: user.company,
      createdById: user.id,
    });
    return this.orderRepository.save(order);
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepository.preload({
      id: +id,
      ...updateOrderDto,
    });

    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    return this.orderRepository.save(order);
  }
}
