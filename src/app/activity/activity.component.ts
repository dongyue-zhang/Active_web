import { Component, OnInit } from '@angular/core';
import { ActivityListComponent } from '../shared/activity-list/activity-list.component';
import { ActivityDetailComponent } from '../shared/activity-detail/activity-detail.component';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-activity',
  standalone: true,
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.css',
  imports: [ActivityListComponent, ActivityDetailComponent, MatGridListModule],
  exportAs: 'ActivityComponent'
})
export class ActivityComponent implements OnInit {
  cols: number = 6;
  left_cols: number = 2;

  constructor() {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  ngOnInit(): void {
    this.onResize(null);
  }

  private onResize(event: any): void {
    if (window.innerWidth <= 787) {
      this.cols = 4;
      this.left_cols = 0;
    } else {
      this.cols = 6;
      this.left_cols = 2;
    }

  }
}
