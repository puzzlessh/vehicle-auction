import {
  IsNumber,
  IsPositive,
  IsArray,
  IsBoolean,
  IsOptional,
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAuctionDto {
  @ApiProperty({ description: 'ID заявки', example: 1 })
  @IsNumber()
  @IsPositive()
  orderId: number;

  @ApiProperty({
    description: 'Время начала аукциона',
    example: '2025-05-04T12:13:36.058Z',
  })
  @IsDate()
  startTime: Date;

  @ApiProperty({
    description: 'Время окончания аукциона',
    example: '2025-06-04T14:13:36.058Z',
  })
  @IsDate()
  endTime: Date;

  @ApiPropertyOptional({
    description: 'Публичный ли аукцион',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  public?: boolean;

  @ApiPropertyOptional({
    description: 'Начальная стоимость',
    example: 1000000,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  startCost?: number;

  @ApiProperty({
    description: 'Массив ID компаний, которым разрешен доступ к аукциону',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  allowedCompanyIds: number[];
}
