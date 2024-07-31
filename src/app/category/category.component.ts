import { Component, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { CategoryListComponent } from '../shared/category-list/category-list.component';
import { SearchBarComponent } from '../shared/search-bar/search-bar.component';
import { GridItemComponent } from '../shared/grid-item/grid-item.component';
import { Type } from '../models/type.model';
import { DataService } from '../store/data.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [MatGridListModule, CategoryListComponent, SearchBarComponent, GridItemComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
  exportAs: 'CategoryComponent'
})
export class CategoryComponent implements OnInit {
  left_cols: number = 4;
  right_cols: number = 2;

  popularTypes: Type[];

  constructor(private dataService: DataService) {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  ngOnInit(): void {
    this.onResize(null);
    this.dataService.getPopularTypes().subscribe((types) => {
      this.popularTypes = types.map(i => i.type)
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
