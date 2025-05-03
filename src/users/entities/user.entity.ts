import { Entity, Column, OneToMany, PrimaryColumn, ManyToOne } from 'typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { Company } from './company.entity';

@Entity()
export class User {
  @PrimaryColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  middleName: string;

  @Column()
  lastName: string;

  @Column()
  isActive: boolean;

  @Column()
  description: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  role: {
    id: number;
    name: string;
    permissions: string[];
  } | null;

  @ManyToOne(() => Company, (company) => company.users)
  company: Company;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
