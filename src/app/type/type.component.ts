import { Component, OnInit } from '@angular/core';
import { TypeListComponent } from '../shared/type-list/type-list.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { CategoryListComponent } from '../shared/category-list/category-list.component';

@Component({
  selector: 'app-type',
  standalone: true,
  imports: [MatGridListModule, TypeListComponent, CategoryListComponent],
  templateUrl: './type.component.html',
  styleUrl: './type.component.css',
  exportAs: 'TypeComponent'
})
export class TypeComponent implements OnInit {
  left_cols: number = 2;
  right_cols: number = 4;

  constructor() {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  ngOnInit(): void {
    this.onResize(null);
  }

  private onResize(event: any): void {
    if (window.innerWidth <= 787) {
      this.left_cols = 0;
      this.right_cols = 2;
    } else if (window.innerWidth <= 1400) {
      this.left_cols = 2;
      this.right_cols = 3;
    } else {
      this.left_cols = 2;
      this.right_cols = 4;
    }

  }


}
