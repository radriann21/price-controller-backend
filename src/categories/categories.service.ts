import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Logger } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CategoriesWhereInput } from 'src/prisma/generated/models';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.prisma.categories.create({
        data: createCategoryDto,
      });
      return category;
    } catch (err) {
      this.logger.error('Error creating category', err);
      throw new InternalServerErrorException(
        'Ocurrió un error al crear la categoría',
      );
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search, isActive } = paginationDto;

    const skip = (page - 1) * limit;
    const where: CategoriesWhereInput = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [{ name: { contains: search, mode: 'insensitive' } }];
    }

    try {
      const [total, categories] = await this.prisma.$transaction([
        this.prisma.categories.count({ where }),
        this.prisma.categories.findMany({
          skip,
          take: limit,
          where,
          orderBy: { createdAt: 'desc' },
        }),
      ]);

      if (categories.length === 0) {
        this.logger.warn('No hay categorias.');
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
        data: categories,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (err) {
      this.logger.error('Error getting categories', err);
      throw new InternalServerErrorException(
        'Ocurrió un error al obtener las categorías',
      );
    }
  }

  async findOne(id: number) {
    try {
      const category = await this.prisma.categories.findUnique({
        where: { id },
      });

      if (!category) {
        this.logger.warn('Category not found');
        return null;
      }

      return category;
    } catch (err) {
      this.logger.error('Error getting category', err);
      throw new InternalServerErrorException(
        'Ocurrió un error al obtener la categoría',
      );
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const updatedCategory = await this.prisma.categories.update({
        where: { id },
        data: updateCategoryDto,
      });

      if (!updatedCategory) {
        this.logger.error('Category not found');
        throw new NotFoundException('Categoría no encontrada');
      }

      return updatedCategory;
    } catch (err) {
      this.logger.error('Error updating category', err);
      throw new InternalServerErrorException(
        'Ocurrió un error al actualizar la categoría',
      );
    }
  }

  async remove(id: number) {
    try {
      const updatedCategory = await this.prisma.categories.update({
        where: { id },
        data: { isActive: false },
      });

      if (!updatedCategory) {
        this.logger.error('Category not found');
        throw new NotFoundException('Categoría no encontrada');
      }

      return {
        message: 'Categoría desactivada correctamente',
      };
    } catch (err) {
      this.logger.error('Error deleting category', err);
      throw new InternalServerErrorException(
        'Ocurrió un error al eliminar la categoría',
      );
    }
  }
}
