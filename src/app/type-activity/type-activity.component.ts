import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TypeListComponent } from '../shared/type-list/type-list.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { ActivityListComponent } from '../shared/activity-list/activity-list.component';
import { ActivatedRoute } from '@angular/router';
import { CategoryListComponent } from '../shared/category-list/category-list.component';

@Component({
  selector: 'app-type-activity',
  standalone: true,
  imports: [MatGridListModule, TypeListComponent, ActivityListComponent, CategoryListComponent],
  templateUrl: './type-activity.component.html',
  styleUrl: './type-activity.component.css',
  exportAs: 'TypeActivityComponent'
})
export class TypeActivityComponent implements OnInit {
  left_cols: number = 2;
  right_cols: number = 4;

  mode: string;

  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef) {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  ngOnInit(): void {
    this.onResize(null);

    this.route.params.subscribe(
      params => {
        if (params['categoryId'] === 'popular') {
          this.mode = 'popular';
        } else {
          this.mode = 'activity';
        }
      }
    )


  }

  private onResize(event: any): void {
    if (window.innerWidth <= 787) {
      this.left_cols = 0;
      this.right_cols = 2;
    } else {
      this.left_cols = 2;
      this.right_cols = 4;
    }

  }
}
