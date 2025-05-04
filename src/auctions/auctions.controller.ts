import {
  Body,
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Post,
  Request,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AuctionsService } from './auctions.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { Auction } from './entities/auction.entity';
import { JwtAccessGuard } from '../jwt/jwt.guard/jwt.guard';
import { FullUserDto } from '../users/dto/full-user.dto';

interface RequestWithUser extends Request {
  user: FullUserDto;
}

@ApiTags('auctions')
@ApiBearerAuth('access-token')
@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Post()
  @UseGuards(JwtAccessGuard)
  @ApiOperation({ summary: 'Создать новый аукцион' })
  @ApiResponse({
    status: 201,
    description: 'Аукцион успешно создан',
    type: Auction,
  })
  @ApiResponse({ status: 403, description: 'Нет прав для создания аукциона' })
  async create(
    @Body() createAuctionDto: CreateAuctionDto,
    @Request() req: RequestWithUser,
  ): Promise<Auction> {
    return await this.auctionsService.create(createAuctionDto, req.user);
  }

  @Get()
  @UseGuards(JwtAccessGuard)
  async getAvailableAuctions(
    @Query('company_id') companyId: number,
    @Request() req: RequestWithUser,
  ): Promise<
    { auction_id: number; company_id: number | null; isVisible: boolean }[]
  > {
    if (companyId === undefined || isNaN(companyId)) {
      throw new NotFoundException('Некорректный идентификатор компании');
    }
    return await this.auctionsService.getAvailableAuctions(companyId, req.user);
  }

  @Patch(':id')
  @UseGuards(JwtAccessGuard)
  @ApiOperation({ summary: 'Обновить аукцион' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID аукциона',
  })
  @ApiResponse({
    status: 200,
    description: 'Аукцион успешно обновлен',
    type: Auction,
  })
  async update(
    @Param('id') id: string,
    @Body() updateAuctionDto: UpdateAuctionDto,
    @Request() req: RequestWithUser,
  ): Promise<Auction> {
    const auctionId = parseInt(id, 10);
    if (isNaN(auctionId)) {
      throw new NotFoundException('Некорректный идентификатор аукциона');
    }
    return await this.auctionsService.update(
      auctionId,
      updateAuctionDto,
      req.user,
    );
  }
}
