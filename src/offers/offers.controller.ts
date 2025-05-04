import {
  Body,
  Controller,
  Post,
  Patch,
  Param,
  Request,
  UseGuards,
  NotFoundException,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entities';
import { JwtAccessGuard } from '../jwt/jwt.guard/jwt.guard';
import { FullUserDto } from '../users/dto/full-user.dto';

interface RequestWithUser extends Request {
  user: FullUserDto;
}

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @UseGuards(JwtAccessGuard)
  async create(
    @Body() createOfferDto: CreateOfferDto,
    @Request() req: RequestWithUser,
  ): Promise<Offer> {
    return await this.offersService.create(createOfferDto, req.user);
  }

  @Patch(':id')
  @UseGuards(JwtAccessGuard)
  async update(
    @Param('id') id: string,
    @Body() updateOfferDto: UpdateOfferDto,
    @Request() req: RequestWithUser,
  ): Promise<Offer> {
    const offerId = parseInt(id, 10);
    if (isNaN(offerId)) {
      throw new NotFoundException('Некорректный идентификатор предложения');
    }
    return await this.offersService.update(offerId, updateOfferDto, req.user);
  }

  @Get()
  @UseGuards(JwtAccessGuard)
  async getOffers(
    @Query('auction_id') auctionId: string,
    @Request() req: RequestWithUser,
  ): Promise<Offer[]> {
    let parsedAuctionId: number | undefined;
    if (auctionId) {
      parsedAuctionId = parseInt(auctionId, 10);
      if (isNaN(parsedAuctionId)) {
        throw new BadRequestException('Некорректный auction_id');
      }
    }
    return await this.offersService.getOffers(parsedAuctionId, req.user);
  }
}
