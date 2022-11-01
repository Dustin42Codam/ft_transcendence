import { Get, Controller, Query, UseGuards, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { OrderService } from './order.service';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller()
export class OrderController {
	constructor(private orderService: OrderService) {
	}

	@Get('orders')
	async all(@Query('page') page: number = 1) {
		return this.orderService.paginate(page, ['order_items']);
	}
}
