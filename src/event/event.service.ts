import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { endOfWeek, startOfWeek } from 'date-fns';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { SortDto } from 'src/common/dto/sort.dto';
import { Between, Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { EventFilterDto } from './dto/event-filter.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}
  async create(createEventDto: CreateEventDto) {
    const event = this.eventRepository.create(createEventDto);
    return this.eventRepository.save(event);
  }

  async findAll(
    sortParams?: SortDto,
    paginationParams?: PaginationDto,
    filterParams?: EventFilterDto,
  ) {
    const qb = this.eventRepository.createQueryBuilder('event');
    if (paginationParams) {
      qb.offset(paginationParams.skip);
      qb.limit(paginationParams.limit);
    }

    if (sortParams) {
      qb.orderBy(sortParams.sort, sortParams.order);
    }

    if ('isCompleted' in filterParams) {
      qb.where('event.isCompleted=:isCompleted', {
        isCompleted: filterParams.isCompleted,
      });
    }
    return qb.getMany();
  }

  async findOne(id: number) {
    return await this.eventRepository.findOne(id);
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    const event = await this.eventRepository.preload({
      id: +id,
      ...updateEventDto,
    });
    if (!event) {
      throw new NotFoundException(`Event ${id} not found.`);
    }
    return await this.eventRepository.save(event);
  }

  async remove(id: number) {
    return await this.eventRepository.delete(id);
  }

  async count() {
    return await this.eventRepository.count();
  }

  async getActiveForWeek() {
    const rightNow = new Date();
    return await this.eventRepository.count({
      where: {
        date: Between(
          startOfWeek(rightNow).toISOString(),
          endOfWeek(rightNow).toISOString(),
        ),
        isCompleted:false
      },
    });
  }
}
