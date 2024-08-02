import { Component, ElementRef, Input } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-grid-item',
  templateUrl: './grid-item.component.html',
  styleUrl: './grid-item.component.css',
  standalone: true,
  imports: [MatGridListModule, RouterModule],
  exportAs: 'GridItemComponent'
})
export class GridItemComponent {
  CATEGORY_PATH = environment.categoryPath;
  @Input() id: number;
  @Input() title: string;
  @Input() url: string | { path: string[]; queryParams: { queryParams: Object } } | string[];
  @Input() icon: string;

  constructor(private router: Router, public elementRef: ElementRef) { }
  onRedirect() {
    if (Array.isArray(this.url)) {
      this.router.navigate(this.url);
    } else if (typeof this.url === 'string') {
      this.router.navigate([this.url]);
    } else {
      this.router.navigateByUrl(this.CATEGORY_PATH, { skipLocationChange: true }).then(() => {
        this.router.navigate(this.url['path'], this.url['queryParams']);
      });
    }
  }

}
