import { Injectable } from '@nestjs/common';
import { CatRepository } from '../domain/repository/cat.repository';
import { Cat, Cats } from '../domain/entity/cat';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class SqliteCatRepository implements CatRepository {
  constructor(private prisma: PrismaService) {}
  async findAll(): Promise<Cats> {
    return this.prisma.cat.findMany({
      take: 10,
    });
  }

  async createCat(data: Cat): Promise<Cat> {
    return this.prisma.cat.create({
      data,
    });
  }
}
