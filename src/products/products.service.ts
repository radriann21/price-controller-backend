import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Logger } from '@nestjs/common';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createNewProduct(createProductDto: CreateProductDto) {
    try {
      const product = await this.prisma.products.create({
        data: createProductDto,
      });

      if (!product) {
        this.logger.error('Product not created');
        throw new InternalServerErrorException('No se pudo crear el producto');
      }

      return product;
    } catch (err) {
      this.logger.error('Error creating new product', err);
      throw new InternalServerErrorException(
        'Ocurrió un error al crear el producto',
      );
    }
  }

  async getAllProducts(query: PaginationDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    try {
      const [products, total] = await this.prisma.$transaction([
        this.prisma.products.findMany({
          skip,
          take: limit,
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.products.count({
          where: { isActive: true },
        }),
      ]);

      if (products.length === 0) {
        this.logger.warn('No products found');
        return {
          data: [],
          meta: {
            total: 0,
            page,
            limit,
            totalPages: 0,
          },
        };
      }

      return {
        data: products,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (err) {
      this.logger.error('Error getting products', err);
      throw new InternalServerErrorException(
        'Ocurrió un error al obtener los productos',
      );
    }
  }

  async getProductById(id: string) {
    try {
      const product = await this.prisma.products.findUnique({
        where: { id },
      });

      if (!product) {
        this.logger.warn('Product not found');
        return null;
      }

      return product;
    } catch (err) {
      this.logger.error('Error obteniendo el producto', err);
      throw new InternalServerErrorException(
        'Ocurrió un error al obtener el producto',
      );
    }
  }

  async getProductByName(name: string) {
    try {
      const product = await this.prisma.products.findFirst({
        where: { name: { equals: name, mode: 'insensitive' } },
      });

      if (!product) {
        this.logger.warn('Product not found');
        return null;
      }

      return product;
    } catch (err) {
      this.logger.error('Error obteniendo el producto', err);
      throw new InternalServerErrorException(
        'Ocurrió un error al obtener el producto',
      );
    }
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    try {
      const updatedProduct = await this.prisma.products.update({
        where: { id },
        data: updateProductDto,
      });

      if (!updatedProduct) {
        this.logger.error('Product not found');
        throw new NotFoundException('Producto no encontrado');
      }

      return updatedProduct;
    } catch (err) {
      this.logger.error('Error updating product', err);
      throw new InternalServerErrorException(
        'Ocurrió un error al actualizar el producto',
      );
    }
  }

  async deleteProduct(id: string) {
    try {
      const updatedProduct = await this.prisma.products.update({
        where: { id },
        data: { isActive: false },
      });

      if (!updatedProduct) {
        this.logger.error('Product not found');
        throw new NotFoundException('Producto no encontrado');
      }

      return {
        message: 'Producto desactivado correctamente',
      };
    } catch (err) {
      this.logger.error('Error deleting product', err);
      throw new InternalServerErrorException(
        'Ocurrió un error al eliminar el producto',
      );
    }
  }

  async updateProductsPrices() {
    const actualRate = await this.prisma.exchangeRates.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!actualRate) {
      this.logger.error('Exchange rate not found');
      throw new NotFoundException('Tipo de cambio no encontrado');
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        await tx.$queryRaw`
          INSERT INTO "historyPrices" ("id", "oldPriceVes", "newPriceVes", "product_id")
          SELECT gen_random_uuid(), "priceVes", ("costUsd" * (1 + "profitMargin" / 100) * ${actualRate.rate}), id
          FROM "Products"
        `;

        await tx.$queryRaw`
          UPDATE "Products"
          SET "priceVes" = "costUsd" * (1 + "profitMargin" / 100) * ${actualRate.rate},
              "updatedAt" = NOW()
        `;
      });
    } catch (err) {
      this.logger.error('Error updating products prices', err);
      throw new InternalServerErrorException(
        'Ocurrió un error al actualizar los precios de los productos',
      );
    }
  }
}
