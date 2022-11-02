import { Res, Post, Get, Controller, Query, UseGuards, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { OrderService } from './order.service';
import { Response } from 'express';
// import { Parser } from "json2csv";
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { HasPermission } from 'src/permission/has-permission.decorator';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller()
export class OrderController {
	constructor(private orderService: OrderService) {
	}

	@Get('orders')
	@HasPermission('orders')
	async all(@Query('page') page: number = 1) {
		return this.orderService.paginate(page, ['order_items']);
	}

	// @Post('export')
	// async export(@Res() res: Response) {
	// 	const parser = new Parser({
	// 		fields: ['ID', 'name', 'Email', 'Product Title', 'Price', 'Quantity'],
	// 	});

	// 	const orders = await this.orderService.all(['order_items']);

	// 	const json = [];

	// 	orders.forEach((o: Order) => {
	// 		json.push({
	// 			Id: o.id,
	// 			Name: o.name,
	// 			Email: o.email,
	// 			'Product title': '',
	// 			Quantity: ''
	// 		});
			
	// 		o.order_items.forEach((i: OrderItem) => {
	// 			json.push({
	// 				ID: '',
	// 				Name: '',
	// 				Email: '',
	// 				'Product title': i.product_title,
	// 				Price: i.price,
	// 				Quantity: i.quantity
	// 			});
	// 		})
	// 	});

	// 	const csv = parser.parse(json);

	// 	res.header('Content-Type', 'text/csv');
	// 	res.attachment('orders.csv');

	// 	return res.send(csv);
	// }

	@Get('chart')
	@HasPermission('orders')
	async chart() {
		return this.orderService.chart();
	}
}
