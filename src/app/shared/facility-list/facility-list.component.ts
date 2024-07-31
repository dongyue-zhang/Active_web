import { AfterViewInit, Component, OnDestroy, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { Facility } from '../../models/facility.model';
import { MatListModule } from '@angular/material/list';
import { DataService } from '../../store/data.service';
import { ActivatedRoute } from '@angular/router';
import { Pagenation } from '../../store/reducer';
import { isEmpty, isEqual } from 'lodash';
import { IInfiniteScrollEvent, InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { FacilityListItemComponent } from './facility-list-item/facility-list-item.component';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { filter, Subscription, take } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-facility-list',
  standalone: true,
  imports: [MatListModule, FacilityListItemComponent, SearchBarComponent, InfiniteScrollDirective, MatButton, MatDivider],
  templateUrl: './facility-list.component.html',
  styleUrl: './facility-list.component.css',
  exportAs: 'FacilityListComponent'
})
export class FacilityListComponent implements OnInit, AfterViewInit, OnDestroy {
  _facilities: Facility[];
  _facilityId: number;
  _pagenation: Pagenation;
  sortBy: string;
  location: {
    lat: number;
    lng: number;
  }
  changesDetected: boolean = false;
  showDistance: boolean = true;
  facilitySub: Subscription;
  locationSub: Subscription;
  listItemsChangeSub: Subscription;
  FACILITY_PATH = environment.facilityPath.replace('/', '');
  @ViewChildren(FacilityListItemComponent) listItems: QueryList<FacilityListItemComponent>;

  constructor(private dataService: DataService, private route: ActivatedRoute, private renderer: Renderer2) {
  }

  set facilityId(facilityId: number) {
    if (this._facilityId !== facilityId) {
      this._facilityId = facilityId;
      this.focuseListItem();
    }
  }

  get facilityId() {
    return this._facilityId;
  }
  setFacilities(facilities) {
    const newFacilities = facilities.state.map(state => state.facility);
    if (newFacilities.length !== 0 && !isEqual(this._facilities, newFacilities)) {
      this._facilities = newFacilities;
      this.sortBy = facilities.sortBy;
      this.pagenation = facilities.pagenation;
      if (this.facilityId && !this._facilities.find(facility => facility.id === this.facilityId)) {
        this.loadMore();
      }
    }
  }

  get facilities() {
    return this._facilities;
  }

  set pagenation(pagenation: Pagenation) {
    if (!isEqual(this._pagenation, pagenation)) {
      this._pagenation = pagenation;
    }
  }

  get pagenation() {
    return this._pagenation;
  }

  ngOnInit(): void {
    this.facilitySub = this.dataService.getFacilities().subscribe(facilities => {
      try {
        this.setFacilities(facilities);
      } catch (error) { }
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
    this.facilitySub.unsubscribe();
    this.locationSub.unsubscribe();
    this.listItemsChangeSub.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.listItemsChangeSub = this.listItems.changes.subscribe((listItems) => {
      this.changesDetected = true;
    })
    this.route.params.subscribe(params => {
      if (!isNaN(+params['facilityId'])) {
        this.facilityId = +params['facilityId'];
        this.listItems.notifyOnChanges();
      }
    });



  }

  ngAfterViewChecked() {
    if (this.changesDetected) {
      this.changesDetected = false;
      this.focuseListItem();
    }
  }

  getUrl(facilityId: number) {
    return [this.FACILITY_PATH, facilityId.toString()];
  }

  onScroll(event: IInfiniteScrollEvent) {
    this.loadMore();
  }

  loadMore() {
    if (!this.pagenation.last) {
      this.dataService.fetchAllFacilities(this.pagenation.number + 1, this.sortBy);
    }

  }

  sortByDistance() {
    if (this.sortBy !== 'distance') {
      this.sortBy = 'distance';
      this.dataService.fetchAllFacilities(0, this.sortBy);
    }

  }

  sortByAlphabet() {
    if (this.sortBy !== 'title') {
      this.sortBy = 'title';
      this.dataService.fetchAllFacilities(0, this.sortBy);
    }

  }

  focuseListItem() {
    this.listItems.forEach((item, index) => {
      if ((this.facilityId && item.facility.id === this.facilityId) || (!this.facilityId && index == 0 && window.innerWidth >= 787)) {
        this.renderer.addClass(item.element.nativeElement, 'focused');
      } else {
        this.renderer.removeClass(item.element.nativeElement, 'focused');
      }

    });
  }
}
