import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Auction, AuctionType } from './entities/auction.entity';
import { CompanyAuction } from './entities/company-auction.entity';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { FullUserDto } from '../users/dto/full-user.dto';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';

@Injectable()
export class AuctionsService {
  private readonly logger = new Logger(AuctionsService.name);

  constructor(
    @InjectRepository(Auction)
    private readonly auctionRepository: Repository<Auction>,
    @InjectRepository(CompanyAuction)
    private readonly companyAuctionRepository: Repository<CompanyAuction>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(
    createAuctionDto: CreateAuctionDto,
    user: FullUserDto,
  ): Promise<Auction> {
    return await this.auctionRepository.manager.transaction(
      async (manager: EntityManager) => {
        try {
          if (!user.role.permissions.includes('CREATE-AUCTION')) {
            throw new ForbiddenException('Нет прав для создания аукциона');
          }

          if (!user.company?.id) {
            throw new NotFoundException('Компания пользователя не найдена');
          }

          const order = await manager.findOne(Order, {
            where: { id: createAuctionDto.orderId, createdById: user.id },
          });
          if (!order) {
            throw new NotFoundException(
              `Заявка с id ${createAuctionDto.orderId} не найдена или не принадлежит вам`,
            );
          }

          const existingAuction = await manager.findOne(Auction, {
            where: { orderId: createAuctionDto.orderId },
          });
          if (existingAuction) {
            throw new ConflictException(
              `Аукцион для заявки с id ${createAuctionDto.orderId} уже существует`,
            );
          }

          order.status = OrderStatus.PROCESS;
          order.isAuctionStarted = true;
          await manager.save(Order, order);

          const auction = manager.create(Auction, {
            orderId: createAuctionDto.orderId,
            type: AuctionType.NOT_ACTIVE,
            public: false,
            isVisible: true,
          });
          const savedAuction = await manager.save(Auction, auction);

          if (createAuctionDto.allowedCompanyIds.length > 0) {
            const companyAuctions = createAuctionDto.allowedCompanyIds.map(
              (companyId) =>
                manager.create(CompanyAuction, {
                  auctionId: savedAuction.id,
                  companyId,
                }),
            );
            await manager.save(CompanyAuction, companyAuctions);
          }

          return savedAuction;
        } catch (error: unknown) {
          this.logger.error(
            `Ошибка при создании аукциона для заявки ${createAuctionDto.orderId}`,
            error instanceof Error ? error.stack : undefined,
          );
          if (
            error instanceof NotFoundException ||
            error instanceof ForbiddenException ||
            error instanceof ConflictException
          ) {
            throw error;
          }
          throw new InternalServerErrorException('Не удалось создать аукцион');
        }
      },
    );
  }

  async getAvailableCompanies(
    companyId: number,
    user: FullUserDto,
  ): Promise<{ auction_id: number; company_id: number }[]> {
    try {
      if (!user.role.permissions.includes('VIEW-AUCTION-COMPANIES')) {
        throw new ForbiddenException(
          'Нет прав для просмотра компаний аукциона',
        );
      }

      const companyAuctions = await this.companyAuctionRepository
        .createQueryBuilder('ca')
        .leftJoinAndSelect('ca.auction', 'auction')
        .where('ca.companyId = :companyId', { companyId })
        .getMany();

      return companyAuctions.map((ca) => ({
        auction_id: ca.auction.id,
        company_id: ca.companyId,
      }));
    } catch (error: unknown) {
      this.logger.error(
        `Ошибка при получении доступных компаний для companyId ${companyId}`,
        error instanceof Error ? error.stack : undefined,
      );
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Не удалось получить список компаний',
      );
    }
  }

  async update(
    id: number,
    updateAuctionDto: UpdateAuctionDto,
    user: FullUserDto,
  ): Promise<Auction> {
    return await this.auctionRepository.manager.transaction(
      async (manager: EntityManager) => {
        try {
          if (!user.role.permissions.includes('UPDATE-AUCTION')) {
            throw new ForbiddenException('Нет прав для обновления аукциона');
          }

          const auction = await manager.findOne(Auction, {
            where: { id },
            relations: ['order'],
          });
          if (!auction) {
            throw new NotFoundException(`Аукцион с id ${id} не найден`);
          }

          if (auction.order.createdById !== user.id) {
            throw new ForbiddenException(
              'Аукцион принадлежит другому пользователю',
            );
          }

          if (
            updateAuctionDto.startTime &&
            updateAuctionDto.endTime &&
            new Date(updateAuctionDto.startTime) >=
              new Date(updateAuctionDto.endTime)
          ) {
            throw new BadRequestException(
              'Время окончания аукциона должно быть позже времени начала',
            );
          }

          const updatedAuction = manager.create(Auction, {
            ...auction,
            ...updateAuctionDto,
          });
          const savedAuction = await manager.save(Auction, updatedAuction);

          if (updateAuctionDto.allowedCompanyIds) {
            await manager.delete(CompanyAuction, { auctionId: id });
            const companyAuctions = updateAuctionDto.allowedCompanyIds.map(
              (companyId) =>
                manager.create(CompanyAuction, {
                  auctionId: savedAuction.id,
                  companyId,
                }),
            );
            await manager.save(CompanyAuction, companyAuctions);
          }

          return savedAuction;
        } catch (error: unknown) {
          this.logger.error(
            `Ошибка при обновлении аукциона с id ${id}`,
            error instanceof Error ? error.stack : undefined,
          );
          if (
            error instanceof NotFoundException ||
            error instanceof ForbiddenException ||
            error instanceof BadRequestException
          ) {
            throw error;
          }
          throw new InternalServerErrorException('Не удалось обновить аукцион');
        }
      },
    );
  }
}
