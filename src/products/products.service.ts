import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Logger } from '@nestjs/common';
import { PaginationDto } from '../common/dto/pagination.dto';
import {
  ProductsCreateManyInput,
  ProductsWhereInput,
} from 'src/prisma/generated/models';
import * as XLSX from 'xlsx';
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
    const { page = 1, limit = 10, search, isActive } = query;
    const skip = (page - 1) * limit;
    const where: ProductsWhereInput = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { category: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    try {
      const [total, products] = await this.prisma.$transaction([
        this.prisma.products.count({ where }),
        this.prisma.products.findMany({
          skip,
          take: limit,
          where,
          include: {
            category: {
              select: {
                name: true,
              },
            },
          },
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
      orderBy: { createdAt: 'desc' },
    });

    const globalMarginRecord = await this.prisma.globalProfitMargin.findUnique({
      where: { id: 1 },
    });

    if (!actualRate || !globalMarginRecord) {
      this.logger.error('Rate or Global Margin not found');
      throw new NotFoundException(
        'Faltan parámetros de configuración (Tasa o Margen Global)',
      );
    }

    const rate = actualRate.rate;
    const globalMargin = globalMarginRecord.profitMargin;

    try {
      return await this.prisma.$transaction(async (tx) => {
        await tx.$queryRaw`
        INSERT INTO "historyPrices" ("id", "oldPriceVes", "newPriceVes", "product_id", "createdAt")
        SELECT 
          gen_random_uuid(), 
          "priceVes", 
          ROUND(CAST(
            ("costUsd" * ${rate}) / NULLIF(1 - (COALESCE("profitMargin", ${globalMargin}) / 100.0), 0)
          AS numeric), 2), 
          id,
          NOW()
        FROM "Products"
      `;

        await tx.$queryRaw`
        UPDATE "Products"
        SET 
          "priceVes" = ROUND(CAST(
            ("costUsd" * ${rate}) / NULLIF(1 - (COALESCE("profitMargin", ${globalMargin}) / 100.0), 0)
          AS numeric), 2),
          "updatedAt" = NOW()
      `;

        this.logger.log(
          `Precios actualizados masivamente. Tasa: ${rate.toString()}, Margen base: ${globalMargin.toString()}%`,
        );
        return { success: true, rate, globalMargin };
      });
    } catch (err) {
      this.logger.error('Error updating products prices', err);
      throw new InternalServerErrorException(
        'Error al procesar la actualización masiva de precios',
      );
    }
  }

  async importProductsFromExcel(file: Express.Multer.File) {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 }).slice(1);

    if (rawData.length === 0) {
      throw new BadRequestException('Error al leer el archivo excel.');
    }

    const categories = await this.prisma.categories.findMany({
      where: { isActive: true },
    });

    const mappedData = rawData.map(
      (row: unknown[]): ProductsCreateManyInput => {
        const name = row[0] as string;
        const buyPriceVes = row[1] as number;
        const costUsd = row[2] as number;
        const profitMargin = row[3] as number;
        const priceVes = row[4] as number;
        const categoryName = row[5] as string;

        const category = categories.find((cat) => cat.name === categoryName);
        if (!category) {
          throw new BadRequestException(
            `Categoría ${categoryName} no encontrada`,
          );
        }

        return {
          name,
          buyPriceVes,
          costUsd,
          profitMargin,
          priceVes,
          categoryId: category.id,
        };
      },
    );

    try {
      const products = await this.prisma.products.createManyAndReturn({
        data: mappedData,
      });

      if (products.length === 0) {
        throw new BadRequestException('No se pudieron importar los productos');
      }

      return products;
    } catch (err) {
      this.logger.error('Ha ocurrido un error en el servidor', err);
      throw new InternalServerErrorException('Un error en el servidor');
    }
  }
}
