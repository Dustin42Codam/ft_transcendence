import { Injectable } from '@nestjs/common';
import { AbstractService } from 'src/common/abstract.service';
import { Product } from './models/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class ProductService extends AbstractService {
	constructor(
		@InjectRepository(Product) private readonly productRepository: Repository<Product>
	) {
		super(productRepository);
	}
}
