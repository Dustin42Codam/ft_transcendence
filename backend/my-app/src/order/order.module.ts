import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

@Module({
	imports: [
		CommonModule,
		TypeOrmModule.forFeature([Order, OrderItem])
	],
	controllers: [OrderController],
	providers: [OrderService]
})
export class OrderModule {}
