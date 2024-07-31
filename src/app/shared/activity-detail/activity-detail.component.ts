import { Component, OnDestroy, OnInit } from '@angular/core';
import { Activity } from '../../models/activity.model';
import { FacilityState, Pagenation } from '../../store/reducer';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { DataService } from '../../store/data.service';
import { MapComponent } from '../map/map.component';
import { MatIcon } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { DirectionDetail } from '../DirectionDetail';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-activity-detail',
  standalone: true,
  imports: [MapComponent, MatIcon, DatePipe],
  providers: [DatePipe],
  templateUrl: './activity-detail.component.html',
  styleUrl: './activity-detail.component.css',
  exportAs: 'ActivityDetailComponent'
})
export class ActivityDetailComponent extends DirectionDetail implements OnInit, OnDestroy {
  activity: Activity;
  activityId: number;
  typeId: number;
  facilityId: number;
  category: string;
  mode: string;
  paramMapSub: Subscription;

  constructor(private route: ActivatedRoute, private dataService: DataService, private datePipe: DatePipe) {
    super();
  }
  ngOnInit(): void {
    this.paramMapSub = this.route.paramMap.pipe(
      map(paramMap => {
        if (paramMap.get('facilityId')) {
          this.mode = 'facility';
          this.facilityId = +paramMap.get('facilityId');
          this.category = paramMap.get('category');
          this.typeId = +paramMap.get('typeId');
          this.activityId = +paramMap.get('activityId');
          return '';
        } else if (paramMap.get('categoryId') === 'popular') {
          this.mode = 'popular';
          this.typeId = +paramMap.get('typeId');
          this.activityId = +paramMap.get('activityId');
          return '';
        } else {
          this.mode = 'activity';
          this.typeId = +paramMap.get('typeId');
          this.activityId = +paramMap.get('activityId');
          return '';
        }
      }
      ),
      switchMap(() => {
        if (this.mode === 'facility') {
          return this.dataService.getFacilities().pipe(
            map(facilities => {
              return facilities.state.find((facility, index) => {
                return facility.facility.id === this.facilityId;
              });
            }),

          );
        } else if (this.mode === 'activity') {
          return this.dataService.getActivities().pipe(
            map(activities => {
              return activities.find((activity, index) => {
                return activity.typeId === this.typeId;
              })
            })
          );
        } else {
          return this.dataService.getPopularTypes().pipe(
            map(type => {
              return type.find((type, index) => {
                return type.type.id === this.typeId;
              });
            })
          )
        }
      }),
    ).subscribe((activities) => {
      try {
        if (this.mode === 'activity') {
          activities = <{ typeId: number; pagenation: Pagenation; activities: Activity[] }>activities;
          this.activity = activities.activities.find((activity, index) => {
            return activity.id === this.activityId;
          })
        } else if (this.mode === 'facility') {
          const activitiesArr = <FacilityState>activities;

          this.activity = activitiesArr.activities.find((activity, index) => {
            return activity.categoryName === this.category;
          }).types.find((type, index) => {
            return type.type.id === this.typeId;
          }).activities.find((activity, index) => {
            return this.activityId === activity.id;
          });

        } else {
          const activitiesArr = <Activity[]>activities.activities;
          this.activity = activitiesArr.find((activity, index) => {
            return activity.id === this.activityId;
          })
        }
        const origin = this.dataService.getCurrentLocation();
        const destination = {
          lat: this.activity.facility.latitude,
          lng: this.activity.facility.longitude
        }
        this.direction = { origin: origin, destination: destination };

      } catch (error) { }
    })
  }

  ngOnDestroy(): void {
    this.paramMapSub.unsubscribe();
  }

  calculateUpdatedTime(date: Date) {
    const currentMonth = +this.datePipe.transform(new Date(), 'M');
    const updatedMonth = +this.datePipe.transform(date, 'M');
    if (currentMonth > updatedMonth) {
      const num = currentMonth - updatedMonth;
      switch (num) {
        case 0:
          return 'this month';
        case 1:
          return 'last month';
        default:
          return num + ' monthes ago';
      }
    } else {
      const currentWeek = +this.datePipe.transform(new Date(), 'w');
      const updatedWeek = +this.datePipe.transform(date, 'w');
      const num = currentWeek - updatedWeek;
      switch (num) {
        case 0:
          return 'this week';
        case 1:
          return 'last week';
        default:
          return num + ' weeks ago';
      }
    }


  }

}
