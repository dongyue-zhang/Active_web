import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { debounceTime, distinctUntilChanged, filter, map, Observable, Subscription, switchMap, take } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EffectsHelper } from '../../store/effects';
import { Facility } from '../../models/facility.model';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { Type } from '../../models/type.model';
import { DataService } from '../../store/data.service';
import { Category } from '../../models/category.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatIconModule, ReactiveFormsModule, MatListModule],
  exportAs: 'SearchBarComponent'
})
export class SearchBarComponent implements OnInit, AfterViewInit, OnDestroy {
  searchForm: FormGroup;
  searchResults: Facility[];
  showMenu = false;
  categories: Category[];

  @Input() placeHolder: string;
  @Input() searchFor: string;
  @ViewChild("searchFiled") searchFiled: ElementRef;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  searchSub: Subscription;
  categorySub: Subscription;
  searchChangeSub: Subscription;
  BASE_PATH: string = environment.basePath;
  ACTIVITY_PATH: string = environment.activityPath;
  CATEGORY_PATH: string = environment.categoryPath;
  TYPE_PATH: string = environment.typePath;
  FACILITY_PATH: string = environment.facilityPath;
  constructor(private dataService: DataService, private renderer: Renderer2, private http: HttpClient, private effectsHelper: EffectsHelper, private router: Router) { }

  private initForm() {
    this.searchForm = new FormGroup({
      search: new FormControl('')
    })
  }

  ngOnInit() {
    this.initForm();
    this.searchSub = this.searchForm.controls['search'].valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(value => value !== ''),
      switchMap(value => this.onSearch(value)),
      map((json) => {
        return json['content'].map((content) => {
          if (this.searchFor === 'facility') {
            return this.effectsHelper.getFacility(content);
          } else {
            return this.effectsHelper.getType(content);
          }

        })
      })
    ).subscribe(results => {
      if (results.length !== 0) {
        this.searchResults = results;
      }
      this.showMenu = true;

    });

    this.categorySub = this.dataService.getCategories().pipe(
      filter(categories => categories.length != 0),
      take(1)
    )
      .subscribe(
        categories => {
          this.categories = categories;
        }
      );

  }

  ngOnDestroy(): void {
    if (this.searchSub) {
      this.searchSub.unsubscribe();
    }
    if (this.searchChangeSub) {
      this.searchChangeSub.unsubscribe();
    }

  }

  ngAfterViewInit(): void {
    this.searchChangeSub = this.searchForm.controls['search'].valueChanges.subscribe(
      value => {
        if (!value) {
          this.showMenu = false;
        }
      }
    )
  }

  onFocus() {
    this.renderer.addClass(this.searchFiled.nativeElement.parentElement.parentElement, 'focus');
    this.onCancel();
  }

  onCancel() {
    this.searchForm.setValue({
      search: ''
    });
    this.searchResults = null;
    this.showMenu = false;
  }

  onSearch(value: string): Observable<Object> {
    let params = new HttpParams();
    params = params.set('q', value);
    if (this.searchFor === 'facility') {
      return this.effectsHelper.fetchResponse([this.BASE_PATH, this.FACILITY_PATH], params);
    } else {
      return this.effectsHelper.fetchResponse([this.BASE_PATH, this.TYPE_PATH], params);
    }

  }

  onSubmit() {

  }

  onSearchResult(result: Facility | Type) {
    let path;
    if (this.searchFor === 'facility') {
      result = <Facility>result;
      path = [this.FACILITY_PATH.replace('/', ''), result.id.toString()];

    } else {
      const type = result as Type;
      const category = this.categories.find(category => category.title === type.category);
      path = [this.CATEGORY_PATH.replace('/', ''), category.id.toString(), this.TYPE_PATH.replace('/', ''), result.id.toString(), this.ACTIVITY_PATH.replace('/', '')];
    }
    this.router.navigate(path);
    this.onCancel();
  }

  get search(): string {
    return this.searchForm.get("search").value;
  }

}
