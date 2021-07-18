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

@ApiTags('Exercises')
@Controller('exercise')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Post()
  async create(@Body() createWorkoutDto: CreateExerciseDto) {
    return await this.exerciseService.create(createWorkoutDto);
  }

  @Get()
  async findAll(
    @Req() req,
    @Query() sortParams?: SortDto,
    @Query() pagination?: PaginationDto,
  ) {
    const result = await this.exerciseService.findAll(sortParams, pagination);
    req.res.set('content-range', result.length);
    return result;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exerciseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExerciseDto) {
    return this.exerciseService.update(+id, updateExerciseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exerciseService.remove(+id);
  }
}
