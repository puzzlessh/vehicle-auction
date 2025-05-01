import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { FullUserDto } from './dto/full-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async findOrCreateUserWithCompany(userData: FullUserDto): Promise<User> {
    let company = await this.companyRepository.findOne({
      where: { id: userData.company.id },
    });

    if (!company) {
      company = this.companyRepository.create({
        id: userData.company.id,
        name: userData.company.name,
        description: userData.company.description,
        isActive: userData.company.isActive,
        status: userData.company.status,
      });
      await this.companyRepository.save(company);
    }

    let user = await this.userRepository.findOne({
      where: { id: userData.id },
      relations: ['company'],
    });

    if (!user) {
      user = this.userRepository.create({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        middleName: userData.middleName,
        lastName: userData.lastName,
        description: userData.description,
        isActive: userData.isActive,
        role: userData.role
          ? {
              id: userData.role.id,
              name: userData.role.name,
              permissions: userData.role.permissions || [],
            }
          : null,
        company: company,
      });
    } else {
      if (!user.company || user.company.id !== company.id) {
        user.company = company;
      }
      await this.userRepository.save(user);
    }

    return user;
  }
}
