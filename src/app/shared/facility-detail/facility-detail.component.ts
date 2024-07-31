import { Component, OnDestroy, OnInit } from '@angular/core';
import { Facility } from '../../models/facility.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../store/data.service';
import { map, Subscription, switchMap } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { urlSplit } from '../url-split.pipe';
import { isEqual } from 'lodash';
import { MapComponent } from '../map/map.component';
import { AsyncPipe } from '@angular/common';
import { DirectionDetail } from '../DirectionDetail';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-facility-detail',
  standalone: true,
  imports: [MatIcon, urlSplit, MapComponent, AsyncPipe],
  templateUrl: './facility-detail.component.html',
  styleUrl: './facility-detail.component.css'
})
export class FacilityDetailComponent extends DirectionDetail implements OnInit, OnDestroy {

  _facility: Facility;
  facilityId: number;

  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'terrain',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    maxZoom: 15,
    minZoom: 8,
    zoom: 12,
    mapId: '4504f8b37365c3d0',
  }
  paramsSub: Subscription;
  FACILITY_PATH = environment.facilityPath.replace('/', '');
  ACTIVITY_PATH = environment.activityPath.replace('/', '');

  constructor(private route: ActivatedRoute, private dataService: DataService, private router: Router) {
    super();
  }

  set facility(facility: Facility) {
    if (!isEqual(this._facility, facility)) {
      this._facility = facility;
    }
  }

  get facility() {
    return this._facility;
  }

  ngOnInit(): void {
    this.paramsSub = this.route.params.pipe(
      map(params => {
        this.facilityId = +params['facilityId'];
      }),
      switchMap(() => {
        return this.dataService.getFacilities();
      })
    ).subscribe(facilities => {
      try {
        if (this.facilityId) {
          this.facility = facilities.state.map(facilityState => {
            return facilityState.facility;
          }).find((facility, index) => {
            return facility.id === this.facilityId;
          });
        } else {
          this.facility = facilities.state[0].facility;
        }
        const origin = this.dataService.getCurrentLocation();

        const destination = {
          lat: this.facility.latitude,
          lng: this.facility.longitude
        };

        this.direction = { origin: origin, destination: destination };

      } catch (error) { }
    });
  }

  ngOnDestroy(): void {
    this.paramsSub.unsubscribe();
  }

  browseActivities() {
    this.router.navigate([this.FACILITY_PATH, this.facility.id, this.ACTIVITY_PATH]);
  }

}
