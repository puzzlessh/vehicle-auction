import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  private orders: Order[] = [
    {
      id: 1,
      creator: 'Иванов Иван',
      customer: "ООО 'АвтоСервис'",
      model: 'Toyota Camry 2022',
      order: 'Ремонт после ДТП',
      imageList: [
        'https://example.com/photo1.jpg',
        'https://example.com/photo2.jpg',
      ],
      vin: 'XTA210997654321',
      odometer: 15000,
      vehiclePassport: '45КН123456',
      plateNumber: 'А123БВ777',
      bodyColor: 'Чёрный',
      description: 'Необходимо заменить переднее крыло и покрасить дверь.',
      deadLine: new Date('2024-12-31'),
      isEvacuationRequired: true,
      isPrepaymentAllowed: false,
      isAuctionStarted: false,
      type: 'Ремонт',
      status: 'В работе',
      createAt: new Date('2024-05-15'),
    },
  ];

  findAll() {
    return this.orders;
  }

  findOne(id: string) {
    const order = this.orders.find((item) => item.id === +id);
    if (!order) {
      throw new HttpException(`Order #${id} not found`, HttpStatus.NOT_FOUND);
    }
    return order;
  }

  create(createOrderDto: any) {
    return this.orders.push(createOrderDto);
  }

  update(id: string, updateOrderDto: any) {
    const existingOrder = this.findOne(id);
    if (existingOrder) {
      // existing entity
    }
  }

  remove(id: string) {
    const orderIndex = this.orders.findIndex((item) => item.id === +id);
    if (orderIndex >= 0) {
      this.orders.splice(orderIndex, 1);
    }
  }
}
