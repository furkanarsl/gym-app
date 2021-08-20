import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventService } from 'src/event/event.service';
import { MemberService } from 'src/member/member.service';
import { MembershipService } from 'src/membership/membership.service';
@Injectable()
export class StatsService {
  constructor(
    private membershipService: MembershipService,
    private memberService: MemberService,
    private eventService: EventService,
  ) {}

  async dashboardStats() {
    return [
      {
        id: 1,
        monthlyRevenue: await this.membershipService.monthlyRevenue(),
        monthlyNewMemberShip:
          await this.membershipService.monthlyNewMemberships(),
        totalMembers: await this.memberService.count(),
        recentEvents: await this.eventService.getActiveForWeek(),
      },
      {
        id: 2,
        chartData: await this.membershipService.sixMonthRevenueChartData(),
      },
    ];
  }
}
