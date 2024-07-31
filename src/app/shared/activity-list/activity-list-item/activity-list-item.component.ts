import { Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Activity } from '../../../models/activity.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { CommonModule, DatePipe } from '@angular/common';
import { DistancePipe } from '../../distance.pipe';
import { MatIconModule } from '@angular/material/icon';
import { DataService } from '../../../store/data.service';
import { filter, Subscription, take } from 'rxjs';
import { isEmpty } from 'lodash';

@Component({
  selector: 'app-activity-list-item',
  standalone: true,
  imports: [MatListModule, CommonModule, DistancePipe, MatIconModule, DatePipe],
  providers: [DatePipe],
  templateUrl: './activity-list-item.component.html',
  styleUrl: './activity-list-item.component.css',
  exportAs: 'ActivityListItemComponent'
})
export class ActivityListItemComponent implements OnInit, OnDestroy {
  @Input() activity: Activity;
  @Input() url: string[];
  @ViewChild('list_item', { static: true }) listItem!: ElementRef;
  activityId: number;
  showDistance: boolean = true;
  paramsSub: Subscription;
  locationSub: Subscription;
  constructor(private router: Router, private route: ActivatedRoute, private renderer: Renderer2, private dataService: DataService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.paramsSub = this.route.params.subscribe(params => {
      this.activityId = +params['activityId'];

      if (this.activityId && this.activity.id === this.activityId) {
        this.renderer.addClass(this.listItem.nativeElement, 'focused');
      } else {
        this.renderer.removeClass(this.listItem.nativeElement, 'focused');
      }
    })

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
    this.paramsSub.unsubscribe();
    this.locationSub.unsubscribe();
  }

  onRedirect() {
    this.router.navigate(this.url);
  }

}
