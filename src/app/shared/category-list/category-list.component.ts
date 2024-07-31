import { AfterViewChecked, AfterViewInit, Component, Input, OnDestroy, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { GridItemComponent } from '../../shared/grid-item/grid-item.component';
import { Category } from '../../models/category.model';
import { DataService } from '../../store/data.service';
import { Type } from '../../models/type.model';
import { WithGridListItems } from '../WithGridListItems';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css',
  standalone: true,
  imports: [SearchBarComponent, MatGridListModule, GridItemComponent],
  exportAs: 'CategoryListComponent'
})
export class CategoryListComponent extends WithGridListItems implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  categories: Category[];
  popularTypes: Type[];
  _categoryId: number;
  _typeId: number;
  categorySub: Subscription;
  popularSub: Subscription;
  paramMapSub: Subscription;
  CATEGORY_PATH = environment.categoryPath.replace('/', '');
  TYPE_PATH = environment.typePath.replace('/', '');
  ACTIVITY_PATH = environment.activityPath.replace('/', '');

  @Input() cols: number;
  @ViewChildren(GridItemComponent) viewChildren: QueryList<GridItemComponent>

  constructor(private dataService: DataService, renderer: Renderer2, private route: ActivatedRoute) {
    super(renderer);
  }

  set categoryId(categoryId: number) {
    if (this._categoryId !== categoryId) {
      this._categoryId = categoryId;
    }
  }

  get categoryId() {
    return this._categoryId;
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
    this.categorySub = this.dataService.getCategories().subscribe(categories => {
      this.categories = categories;
    });

    this.popularSub = this.dataService.getPopularTypes().subscribe((types) => {
      this.popularTypes = types.map(i => i.type)
    })
  }

  ngOnDestroy(): void {
    this.categorySub.unsubscribe();
    this.popularSub.unsubscribe();
    this.paramMapSub.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.gridItems = this.viewChildren;
    this.subscribeChanges();
    this.paramMapSub = this.route.paramMap.subscribe(paramMap => {

      if (+paramMap.get('categoryId')) {
        this.categoryId = +paramMap.get('categoryId');
      }
      if (+paramMap.get('typeId')) {
        this.typeId = +paramMap.get('typeId');
      }

      this.gridItems.notifyOnChanges();

    })



  }

  ngAfterViewChecked() {
    if (this.changesDetected) {
      this.changesDetected = false;
      if (this.typeId) {
        this.focusGridListItem(this.typeId);
      } else {
        this.focusGridListItem(this.categoryId);
      }

    }
  }



  getUrl(categoryId: number) {
    return [this.CATEGORY_PATH, categoryId.toString(), this.TYPE_PATH];
  }

  getPopUrl(type: Type) {
    return [this.CATEGORY_PATH, 'popular', this.TYPE_PATH, type.id.toString(), this.ACTIVITY_PATH];
  }
}
