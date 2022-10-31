import { CreateDateColumn, Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	first_name: string;
	
	@Column()
	last_name: string;
	
	@Column()
	email: string;

	@CreateDateColumn()
	created_at: string;

	@OneToMany(() => OrderItem, orderItem => orderItem.order)
	order_items: OrderItem[];

	get name(): string {
		return `${this.first_name} ${this.last_name}`;
	}
}
