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
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from 'src/auth/jwt-auth-guard';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('Workouts')
@Controller('workout')
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  @Roles(Role.ADMIN)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Post()
  create(@Body() createWorkoutDto: CreateWorkoutDto) {
    return this.workoutService.create(createWorkoutDto);
  }

  @UseGuards(JWTAuthGuard, RolesGuard)
  @Get()
  async findAll(
    @Req() req,
    @Query() sortParams?: SortDto,
    @Query() pagination?: PaginationDto,
  ) {
    req.res.set('content-range', (await this.workoutService.count()).toString);
    return await this.workoutService.findAll(sortParams, pagination);
  }

  @UseGuards(JWTAuthGuard)
  @Get('/me')
  findForUser(@Req() req) {
    const user = req.user;
    return this.workoutService.findForUser(user.username);
  }

  @UseGuards(JWTAuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workoutService.findOne(+id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkoutDto: UpdateWorkoutDto) {
    return this.workoutService.update(+id, updateWorkoutDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workoutService.remove(+id);
  }
}
