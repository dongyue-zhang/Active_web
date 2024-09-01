import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { Activity } from '../../models/activity.model';
import { ActivatedRoute } from '@angular/router';
import { GridItemComponent } from '../../shared/grid-item/grid-item.component';
import { DataService } from '../../store/data.service';
import { ActivityState, FacilityState, Pagenation } from '../../store/reducer';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { Type } from '../../models/type.model';
import { ActivityListItemComponent } from './activity-list-item/activity-list-item.component';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { isEmpty, isEqual } from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [MatListModule, GridItemComponent, InfiniteScrollDirective, ActivityListItemComponent, MatButtonModule, MatMenuModule, DatePipe, MatIcon, MatDivider],
  providers: [DatePipe],
  templateUrl: './activity-list.component.html',
  styleUrl: './activity-list.component.css',
  exportAs: 'ActivityListComponent'
})
export class ActivityListComponent implements OnInit, OnDestroy {

  _activities: Activity[];
  _activitiesOrigin: Activity[];
  typeId: number;
  categoryId: number;

  facilityId: number;
  category: string;
  activityId: number;
  mode: string;

  _pagenation: Pagenation;
  obs: Observable<Pagenation>;

  sortBy: string;

  _daysForFiltering: string[] = [];
  dayFiltered: string;

  _facilitiesForFiltering: string[];
  facilityFiltered: string;

  timeForFiltering = [];
  timeFiltered: Date;

  selectAvailable: boolean;
  page = 0;

  page_title: string;
  showDistance: boolean = true;
  noMoreTimes: boolean = false;
  locationSub: Subscription;
  paramMapSub: Subscription;

  CATEGORY_PATH = environment.categoryPath.replace('/', '');
  TYPE_PATH = environment.typePath.replace('/', '');
  ACTIVITY_PATH = environment.activityPath.replace('/', '');
  FACILITY_PATH = environment.facilityPath.replace('/', '');
  @ViewChild('sorting_buttons') sortingButtons: ElementRef;

  constructor(private route: ActivatedRoute, private dataService: DataService, private datePipe: DatePipe) {
    this.resetButtons();
    this.timeForFiltering = Array.from({ length: 16 }, (v, i) => 7 + i * 1);
    this.timeForFiltering = this.timeForFiltering.map(time => {
      let today = new Date();
      today.setHours(time, 0, 0);
      return today;
    });
    this.setDaysForFiltering();
  }

  set activities(activities: Activity[]) {
    this._activities = activities;
  }

  get activities() {
    return this._activities;
  }

  set activitiesOrigin(activities: Activity[]) {
    if (!isEqual(this._activitiesOrigin, activities)) {
      this.resetButtons();
      this._activitiesOrigin = activities;
      this.setFacilitiesForFiltering(activities);
      this.filter();
    }
  }

  get activitiesOrigin() {
    return this._activitiesOrigin;
  }

  set pagenation(pagenation: Pagenation) {
    if (!isEqual(this._pagenation, pagenation)) {
      this._pagenation = pagenation;
    }
  }

  get pagenation() {
    return this._pagenation;
  }

  setDaysForFiltering() {

    const today = new Date();
    this._daysForFiltering.push('Today');
    this._daysForFiltering.push('Tomorrow');

    for (var i = 2; i < 7; i++) {
      const t = new Date();
      t.setDate(today.getDate() + i);
      this._daysForFiltering.push(this.datePipe.transform(t, "EEEE"));
    }

  }

  get daysForFiltering(): string[] {
    return this._daysForFiltering;
  }

  setFacilitiesForFiltering(activities: Activity[]) {
    this._facilitiesForFiltering = Array.from(new Set(activities.map(activity => {
      return activity.facility.title;
    })));
  }

  get facilitiesForFiltering() {
    return this._facilitiesForFiltering;
  }

  ngOnInit(): void {
    this.paramMapSub = this.route.paramMap.pipe(
      map(paramMap => {
        if (paramMap.get('facilityId')) {
          this.mode = 'facility';
          this.facilityId = +paramMap.get('facilityId');
          if (paramMap.get('category')) {
            this.category = paramMap.get('category');
            this.typeId = +paramMap.get('typeId');
          } else {
            this.route.queryParams.subscribe(
              queryParams => {
                if (queryParams['typeId']) {
                  this.typeId = +queryParams['typeId'];
                  this.category = queryParams['category'];
                }
              }
            );
          }
        } else if (!isNaN(+paramMap.get('categoryId'))) {
          this.mode = 'activity';
          this.categoryId = +paramMap.get('categoryId');
          this.typeId = +paramMap.get('typeId');

        } else {
          this.mode = 'popularTypes';
          this.category = paramMap.get('categoryId');
          this.typeId = +paramMap.get('typeId');
        }
      }),
      switchMap(() => {
        if (this.mode === 'activity') {
          return this.dataService.getActivities();
        } else if (this.mode === 'facility') {
          return this.dataService.getFacilities().pipe(
            map(facilities => {
              return facilities.state.find((facility, index) => {
                return facility.facility.id === this.facilityId;
              })
            }));
        } else {
          return this.dataService.getPopularTypes().pipe(
            map(popularTypes => {
              return popularTypes.find(type => {
                return type.type.id === this.typeId;
              })
            })
          );
        }
      }),
    ).subscribe((activities) => {
      if (this.mode === 'activity') {
        const activityArr = <ActivityState[]>activities;
        try {
          const activityState = activityArr.find((activityState: ActivityState, index) => {
            return activityState.typeId === this.typeId;
          });
          this.dataService.getTypes().pipe(
            filter(types => types.state.length !== 0),
            take(1),
            map(type => type.state.find(category => category.categoryId === this.categoryId).types.find(type => type.id === this.typeId))
          ).subscribe(type =>
            this.page_title = type.title
          );
          this.activitiesOrigin = activityState.activities;
          this.pagenation = activityState.pagenation;
        } catch (error) { }
      } else if (this.mode === 'facility') {
        activities = <FacilityState>activities;
        try {
          if (!this.typeId && !this.category) {
            this.category = activities.activities[0].categoryName;
            this.typeId = activities.activities[0].types[0].type.id;
          }

          const state = activities.activities.find((i, index) => {
            return i.categoryName === this.category;
          }).types.find((i, index) => {
            return i.type.id === this.typeId;
          });

          this.page_title = state.type.title;
          this.activitiesOrigin = state.activities;
          this.pagenation = state.pagenation;
        } catch (error) { }
      } else {
        activities = <{
          categoryName: string;
          type: Type;
          activities: Activity[];
          pagenation: Pagenation;
        }>activities;
        try {
          this.dataService.getPopularTypes().pipe(
            filter(popular => popular.length !== 0),
            take(1),
            map(popular => popular.find(type => type.type.id === this.typeId))
          ).subscribe(type =>
            this.page_title = type.type.title
          )
          this.activitiesOrigin = activities.activities;
          this.pagenation = activities.pagenation;
        } catch (error) { }
      }

      if (this.activitiesOrigin == null) {
        this.noMoreTimes = true;
      }

    });

    this.locationSub = this.dataService.getLocationObs().pipe(
      filter(location => location !== null),
      take(1)
    ).subscribe(location => {
      if (isEmpty(location)) {
        this.showDistance = false;
      }
    }
    )
  }

  ngOnDestroy(): void {
    this.paramMapSub.unsubscribe();
    this.locationSub.unsubscribe();
  }

  getUrl(activityId: number) {
    if (this.mode === 'activity') {
      return [this.CATEGORY_PATH, this.categoryId.toString(), this.TYPE_PATH, this.typeId.toString(), this.ACTIVITY_PATH, activityId.toString()];
    } else if (this.mode === 'facility') {
      return [this.FACILITY_PATH, this.facilityId.toString(), 'category', this.category, this.TYPE_PATH, this.typeId.toString(), this.ACTIVITY_PATH, activityId.toString()];
    } else {
      return [this.CATEGORY_PATH, this.category, this.TYPE_PATH, this.typeId.toString(), this.ACTIVITY_PATH, activityId.toString()];
    }

  }

  onSorting(sortBy: string) {
    this.sortBy = sortBy;
    this.filter();
  }

  onFilteringDay(day: string) {
    this.dayFiltered = day;
    this.filter();
  }

  onCancelFilteringDay() {
    this.dayFiltered = null;
    this.filter();
  }

  onFilteringFacility(facility: string) {
    this.facilityFiltered = facility;
    this.filter();
  }

  onCancelFilteringFacility() {
    this.facilityFiltered = null;
    this.filter();
  }

  onFilteringTime(time: Date) {
    this.timeFiltered = time;
    this.filter();
  }

  onCancelFilteringTime() {
    this.timeFiltered = null;
    this.filter();
  }

  toggleSelectAvailable() {
    this.selectAvailable = !this.selectAvailable;
    this.filter();
  }

  filter() {
    if (this.activitiesOrigin.length !== 0) {
      this.activities = this.activitiesOrigin;
      if (this.sortBy === 'distance') {
        this.activities = this.activities.slice().sort((a, b) => a.facility.distance - b.facility.distance);
      } else if (this.sortBy === 'time') {
        this.activities = this.activities.slice().sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
      }

      this.activities = this.activities
        .filter(activity => {
          if (this.dayFiltered) {
            return activity.dayOfWeek === this.dayFiltered;
          } else {
            return true;
          }
        })
        .filter(activity => {
          if (this.timeFiltered) {
            return (activity.startTime.getHours() <= this.timeFiltered.getHours()) && (activity.endTime.getHours() >= this.timeFiltered.getHours());
          } else {
            return true;
          }
        })
        .filter(activity => {
          if (this.facilityFiltered) {
            return activity.facility.title === this.facilityFiltered;
          } else {
            return true;
          }
        }).filter(activty => {
          if (this.selectAvailable) {
            return activty.isAvailable === this.selectAvailable;
          } else {
            return true;
          }
        })

      if (this.activities.length === 0) {
        this.noMoreTimes = true;
      } else {
        this.noMoreTimes = false;
      }
    }

  }

  resetButtons() {
    if (this.showDistance) {
      this.sortBy = 'distance';
    } else {
      this.sortBy = 'time';
    }

    this.dayFiltered = null;
    this.facilityFiltered = null;
    this.selectAvailable = false;
  }
}


