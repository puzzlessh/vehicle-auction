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
import { AuctionsService } from './auctions.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { Auction } from './entities/auction.entity';
import { JwtAccessGuard } from '../jwt/jwt.guard/jwt.guard';
import { FullUserDto } from '../users/dto/full-user.dto';

interface RequestWithUser extends Request {
  user: FullUserDto;
}

@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Post()
  @UseGuards(JwtAccessGuard)
  async create(
    @Body() createAuctionDto: CreateAuctionDto,
    @Request() req: RequestWithUser,
  ): Promise<Auction> {
    return await this.auctionsService.create(createAuctionDto, req.user);
  }

  @Get()
  @UseGuards(JwtAccessGuard)
  async getAvailableCompanies(
    @Query('company_id') companyId: number,
    @Request() req: RequestWithUser,
  ): Promise<{ auction_id: number; company_id: number }[]> {
    return await this.auctionsService.getAvailableCompanies(
      companyId,
      req.user,
    );
  }

  @Patch(':id')
  @UseGuards(JwtAccessGuard)
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
