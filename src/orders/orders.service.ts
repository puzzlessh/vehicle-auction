import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { FullUserDto } from 'src/users/dto/full-user.dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(
    orderData: CreateOrderDto & { createdById: number; companyId: number },
  ): Promise<Order> {
    try {
      const order = this.orderRepository.create({
        ...orderData,
        status: orderData.status ?? OrderStatus.DRAFT,
      });
      return await this.orderRepository.save(order);
    } catch (error: unknown) {
      this.logger.error(
        'Ошибка при создании заявки',
        error instanceof Error ? error.stack : undefined,
      );
      throw new InternalServerErrorException('Не удалось создать заявку');
    }
  }

  async findOne(id: number, userId: number): Promise<Order> {
    try {
      const order = await this.orderRepository.findOne({
        where: { id, createdById: userId },
      });

      if (!order) {
        throw new NotFoundException(
          `Заявка с id ${id} не найдена или не принадлежит вам`,
        );
      }

      return order;
    } catch (error: unknown) {
      this.logger.error(
        `Ошибка при получении заявки ${id}`,
        error instanceof Error ? error.stack : undefined,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Не удалось получить заявку');
    }
  }

  async findAll(
    paginationQuery: PaginationQueryDto,
    userId: number,
  ): Promise<Order[]> {
    try {
      const { page = 1, perPage = 10 } = paginationQuery;
      const skip = (page - 1) * perPage;
      const take = perPage;

      return await this.orderRepository.find({
        where: { createdById: userId },
        skip,
        take,
      });
    } catch (error: unknown) {
      this.logger.error(
        'Ошибка при получении списка заявок',
        error instanceof Error ? error.stack : undefined,
      );
      throw new InternalServerErrorException(
        'Не удалось получить список заявок',
      );
    }
  }

  async update(
    id: string,
    updateOrderDto: UpdateOrderDto,
    user: FullUserDto,
  ): Promise<Order> {
    try {
      if (!user.role.permissions.includes('UPDATE-ORDER')) {
        throw new ForbiddenException('Нет прав для обновления заявки');
      }

      const orderId = parseInt(id, 10);
      if (isNaN(orderId)) {
        throw new NotFoundException('Некорректный идентификатор заявки');
      }

      const order = await this.orderRepository.preload({
        id: orderId,
        ...updateOrderDto,
      });

      if (!order) {
        throw new NotFoundException(`Заявка с id ${id} не найдена`);
      }

      if (order.companyId !== user.company.id) {
        throw new ForbiddenException(
          'Вы не можете обновлять заявки другой компании',
        );
      }

      if (order.createdById !== user.id) {
        throw new ForbiddenException('Вы можете обновлять только свои заявки');
      }

      return await this.orderRepository.save(order);
    } catch (error: unknown) {
      this.logger.error(
        `Ошибка при обновлении заявки ${id}`,
        error instanceof Error ? error.stack : undefined,
      );
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Не удалось обновить заявку');
    }
  }
}
