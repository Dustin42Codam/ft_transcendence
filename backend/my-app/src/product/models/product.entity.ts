import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class Product {
	
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	title: string;
	
	@Column()
	image: string;
	
	@Column()
	description: string;
	
	@Column()
	price: number;
}
