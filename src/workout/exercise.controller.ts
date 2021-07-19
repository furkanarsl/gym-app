import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { ApiTags } from '@nestjs/swagger';
import { SortDto } from 'src/common/dto/sort.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { Roles } from 'src/auth/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from 'src/auth/jwt-auth-guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role.enum';

@ApiTags('Exercises')
@Controller('exercise')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Roles(Role.ADMIN)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Post()
  async create(@Body() createWorkoutDto: CreateExerciseDto) {
    return await this.exerciseService.create(createWorkoutDto);
  }

  @UseGuards(JWTAuthGuard, RolesGuard)
  @Get()
  async findAll(
    @Req() req,
    @Query() sortParams?: SortDto,
    @Query() pagination?: PaginationDto,
  ) {
    req.res.set(
      'content-range',
      (await this.exerciseService.count()).toString(),
    );
    return await this.exerciseService.findAll(sortParams, pagination);
  }

  @UseGuards(JWTAuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exerciseService.findOne(+id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExerciseDto) {
    return this.exerciseService.update(+id, updateExerciseDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exerciseService.remove(+id);
  }
}
