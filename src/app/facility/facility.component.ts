import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { SearchBarComponent } from '../shared/search-bar/search-bar.component';
import { FacilityListComponent } from '../shared/facility-list/facility-list.component';
import { FacilityDetailComponent } from '../shared/facility-detail/facility-detail.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs';


@Component({
  selector: 'app-facility',
  standalone: true,
  imports: [SearchBarComponent, FacilityListComponent, FacilityDetailComponent, MatGridListModule],
  templateUrl: './facility.component.html',
  styleUrl: './facility.component.css',
  exportAs: 'FacilityComponent'
})
export class FacilityComponent implements AfterViewInit {
  cols: number = 6;
  left_cols: number = 2;
  hideLeft: boolean = false;
  @ViewChild("facilityList", { read: ElementRef }) facilityList: ElementRef;
  @ViewChild("facilityDetail", { read: ElementRef }) facilityDetail: ElementRef;

  constructor(private route: ActivatedRoute, private renderer: Renderer2) {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  ngAfterViewInit(): void {
    this.route.paramMap.pipe(
      map(paramMap => paramMap.get('facilityId')),
      filter(facilityId => facilityId !== 'facilities')
    ).subscribe(facilityId => {
      if (facilityId) {
        this.hideLeft = true;
      } else {

      }
    })
    this.onResize(null);
  }

  private onResize(event: any): void {
    if (window.innerWidth <= 787) {
      this.cols = 4;
      this.left_cols = 0;
      if (this.hideLeft) {
        this.renderer.addClass(this.facilityList.nativeElement, 'hidden');
      } else {
        this.renderer.addClass(this.facilityDetail.nativeElement, 'hidden');
      }
    } else {
      this.cols = 6;
      this.left_cols = 2;
      this.renderer.removeClass(this.facilityList.nativeElement, 'hidden');
      this.renderer.removeClass(this.facilityDetail.nativeElement, 'hidden');
    }

  }
}
