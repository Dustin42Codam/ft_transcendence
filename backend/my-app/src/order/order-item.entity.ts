import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
	
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	product_title: string;
	
	@Column()
	quantity: number;
	
	@Column()
	price: number;

	@ManyToOne(() => Order, order => order.order_items)
	@JoinColumn({name: 'order_id'})
	order: Order;
}
