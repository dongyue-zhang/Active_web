import { AfterViewChecked, AfterViewInit, Component, OnDestroy, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { Facility } from '../../models/facility.model';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../store/data.service';
import { map, switchMap } from 'rxjs/operators';
import { FacilityState } from '../../store/reducer';
import { MatGridListModule } from '@angular/material/grid-list';
import { GridItemComponent } from '../grid-item/grid-item.component';
import { WithGridListItems } from '../WithGridListItems';
import { MatDividerModule } from '@angular/material/divider';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-facility-activity-list',
  standalone: true,
  imports: [MatGridListModule, GridItemComponent, MatDividerModule],
  templateUrl: './facility-activity-list.component.html',
  styleUrl: './facility-activity-list.component.css'
})
export class FacilityActivityListComponent extends WithGridListItems implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  facility: Facility;
  facilityId: number;
  facilityState: FacilityState;
  facilities;
  gutterSize: string;
  _category: string;
  _typeId: number;
  paramsSub: Subscription;
  ACTIVITY_PATH = environment.activityPath.replace('/', '');
  FACILITY_PATH = environment.facilityPath.replace('/', '');
  @ViewChildren(GridItemComponent) viewChildren: QueryList<GridItemComponent>


  set category(category: string) {
    if (this._category !== category) {
      this._category = category;
    }
  }

  get category() {
    return this._category;
  }

  set typeId(typeId: number) {
    if (this._typeId !== typeId) {
      this._typeId = typeId;
    }
  }

  get typeId() {
    return this._typeId;
  }

  ngOnInit(): void {
    this.paramsSub = this.route.params.pipe(
      map(params => {
        this.facilityId = +params['facilityId'];
        return;
      }),
      switchMap(() => {
        return this.dataServic.getFacilities();
      })
    ).subscribe(facilities => {
      try {
        let facilityState = facilities.state.find((facility, index) => {
          return facility.facility.id === this.facilityId;
        });
        this.facilityState = facilityState;
        if (!this.typeId && !this.category && window.innerWidth >= 787) {
          this.category = this.facilityState.activities[0].categoryName;
          this.typeId = this.facilityState.activities[0].types[0].type.id;
        }
      } catch (error) {

      }

    }
    )

    this.onResize(null);
  }

  ngOnDestroy(): void {
    this.paramsSub.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.gridItems = this.viewChildren;
    this.route.queryParams.subscribe(
      queryParams => {
        if (queryParams['category'] && !isNaN(+queryParams['typeId'])) {
          this.category = queryParams['category'];
          this.typeId = +queryParams['typeId'];
          this.gridItems.notifyOnChanges();
        }
      }
    )

    this.subscribeChanges();
  }


  ngAfterViewChecked() {
    if (this.changesDetected) {
      this.changesDetected = false;
      this.focusGridListItem(this.typeId);
    }
  }

  constructor(private route: ActivatedRoute, private dataServic: DataService, renderer: Renderer2) {

    super(renderer);
    window.addEventListener('resize', this.onResize.bind(this));
  };

  onResize(event: any) {
    if (window.innerWidth <= 787) {
      this.gutterSize = '5px';
    } else {
      this.gutterSize = '10px';
    }
  }

  getUrl(category: string, typeId: number) {
    const arr = {
      path: [this.FACILITY_PATH, this.facilityId.toString(), this.ACTIVITY_PATH],
      queryParams: { queryParams: { category: category, typeId: typeId } }
    };

    return arr;
  }

}
