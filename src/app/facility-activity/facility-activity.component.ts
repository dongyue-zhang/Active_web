import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FacilityActivityListComponent } from '../shared/facility-activity-list/facility-activity-list.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { ActivityListComponent } from '../shared/activity-list/activity-list.component';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-facility-activity',
  standalone: true,
  imports: [FacilityActivityListComponent, MatGridListModule, ActivityListComponent],
  templateUrl: './facility-activity.component.html',
  styleUrl: './facility-activity.component.css'
})
export class FacilityActivityComponent implements AfterViewInit {

  cols: number = 6;
  left_cols: number = 2;
  hideLeft: boolean = false;
  @ViewChild('facilityActivityList', { read: ElementRef }) facilityActivityList: ElementRef;
  @ViewChild('activityList', { read: ElementRef }) activityList: ElementRef;
  constructor(private route: ActivatedRoute, private renderer: Renderer2) {
    window.addEventListener('resize', this.onResize.bind(this));
  }


  ngAfterViewInit(): void {
    this.route.queryParamMap.pipe(
      filter(queryParamMap => queryParamMap.get('category') !== null && queryParamMap.get('typeId') !== null),
    ).subscribe(queryParamMap => {
      if (queryParamMap) {
        this.hideLeft = true;
      }
    })
    this.onResize(null);
  }

  private onResize(event: any): void {
    if (window.innerWidth <= 787) {
      this.cols = 4;
      this.left_cols = 0;
      if (this.hideLeft) {
        this.renderer.addClass(this.facilityActivityList.nativeElement, 'hidden');
      } else {
        this.renderer.addClass(this.activityList.nativeElement, 'hidden');
      }
    } else {
      this.cols = 6;
      this.left_cols = 2;
      this.renderer.removeClass(this.facilityActivityList.nativeElement, 'hidden');
      this.renderer.removeClass(this.activityList.nativeElement, 'hidden');
    }

  }
}
