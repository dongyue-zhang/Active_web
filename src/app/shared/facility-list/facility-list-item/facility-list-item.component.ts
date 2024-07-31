import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Facility } from '../../../models/facility.model';
import { Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { DistancePipe } from '../../distance.pipe';
import { Subscription, take } from 'rxjs';
import { isEmpty } from 'lodash';
import { DataService } from '../../../store/data.service';

@Component({
  selector: 'app-facility-list-item',
  templateUrl: './facility-list-item.component.html',
  styleUrl: './facility-list-item.component.css',
  standalone: true,
  imports: [MatListModule, DistancePipe],
  exportAs: 'FacilityListItemComponent'
})
export class FacilityListItemComponent implements OnInit, OnDestroy {
  showDistance: boolean = true;
  @Input() facility: Facility;
  @Input() url: string[];
  @ViewChild('list_item', { static: false }) element: ElementRef;
  locationSub: Subscription;
  constructor(private router: Router, private dataService: DataService) { }

  ngOnInit(): void {
    this.locationSub = this.dataService.getLocationObs().pipe(
      take(1)
    ).subscribe(
      location => {
        if (isEmpty(location)) {
          this.showDistance = false;
        }
      }
    )
  }

  ngOnDestroy(): void {
    this.locationSub.unsubscribe();
  }

  onRedirect() {
    this.router.navigate(this.url);
  }
}
