import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from 'src/auth/jwt-auth-guard';
import { Role } from 'src/auth/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('Events')
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Roles(Role.ADMIN)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(+id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(+id, updateEventDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.remove(+id);
  }
}
