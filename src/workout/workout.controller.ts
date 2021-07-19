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
import { WorkoutService } from './workout.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { ApiTags } from '@nestjs/swagger';
import { SortDto } from 'src/common/dto/sort.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@ApiTags('Workouts')
@Controller('workout')
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  @Post()
  create(@Body() createWorkoutDto: CreateWorkoutDto) {
    return this.workoutService.create(createWorkoutDto);
  }

  @Get()
  async findAll(
    @Req() req,
    @Query() sortParams?: SortDto,
    @Query() pagination?: PaginationDto,
  ) {
    req.res.set('content-range', (await this.workoutService.count()).toString);
    return await this.workoutService.findAll(sortParams, pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workoutService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkoutDto: UpdateWorkoutDto) {
    return this.workoutService.update(+id, updateWorkoutDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workoutService.remove(+id);
  }
}
