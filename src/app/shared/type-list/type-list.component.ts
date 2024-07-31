import { Component, Input, OnInit, QueryList, Renderer2, ViewChildren, AfterViewInit, OnDestroy } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { GridItemComponent } from '../../shared/grid-item/grid-item.component';
import { map, Subscription, switchMap } from 'rxjs';
import { Type } from '../../models/type.model';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../store/data.service';
import { CommonModule } from '@angular/common';
import { isEqual } from 'lodash';
import { WithGridListItems } from '../WithGridListItems';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-type-list',
  templateUrl: './type-list.component.html',
  styleUrl: './type-list.component.css',
  standalone: true,
  imports: [MatGridListModule, GridItemComponent, CommonModule],
  exportAs: 'TypeListComponent'
})
export class TypeListComponent extends WithGridListItems implements OnInit, AfterViewInit, OnDestroy {
  _types: Type[];
  categoryId: number;
  category: string;
  typeId!: number;
  mode: string;
  page_title: string;
  paramMapSub1: Subscription;
  paramMapSub2: Subscription;
  CATEGORY_PATH = environment.categoryPath.replace('/', '');
  TYPE_PATH = environment.typePath.replace('/', '');
  ACTIVITY_PATH = environment.activityPath.replace('/', '');

  @Input() cols: number;
  @ViewChildren(GridItemComponent) childComponents: QueryList<GridItemComponent>;

  constructor(private route: ActivatedRoute, private dataService: DataService, renderer: Renderer2) {
    super(renderer);
  }

  set types(types: Type[]) {
    if (!isEqual(types, this._types)) {
      this._types = types;
    }
  }

  get types() {
    return this._types;
  }
  ngAfterViewInit(): void {
    this.gridItems = this.childComponents;
    this.subscribeChanges();

    this.paramMapSub2 = this.route.paramMap.pipe(
      map(paramMap => +paramMap.get('typeId'))
    ).subscribe(typeId => {
      if (!isNaN(typeId)) {
        this.gridItems.notifyOnChanges();
      }
    })

  }

  ngOnInit(): void {
    this.paramMapSub1 = this.route.paramMap.pipe(
      map((paramMap) => {
        if (paramMap.get('typeId')) {
          this.typeId = +paramMap.get('typeId');
        }
        return +paramMap.get('categoryId');
      }),
      switchMap((categoryId) => {
        this.categoryId = categoryId;
        return this.dataService.getTypes();
      }),
      map(types => {
        return types.state.find((type, index) => {
          return type.categoryId === this.categoryId;
        })
      })
    ).subscribe((types) => {
      try {
        this.types = types.types;
        this.page_title = this.types[0].category;
      } catch (error) { }
    });
  }

  ngOnDestroy(): void {
    this.paramMapSub1.unsubscribe();
    this.paramMapSub2.unsubscribe();
  }

  ngAfterViewChecked() {
    if (this.changesDetected) {
      this.changesDetected = false;
      this.focusGridListItem(this.typeId);
    }
  }

  getUrl(type: Type) {
    return [this.CATEGORY_PATH, this.categoryId.toString(), this.TYPE_PATH, type.id.toString(), this.ACTIVITY_PATH];
  }

}
