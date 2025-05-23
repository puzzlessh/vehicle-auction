import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Company } from './entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Company])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
