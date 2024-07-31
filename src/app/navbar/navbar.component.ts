import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  exportAs: 'NavbarComponent'
})
export class NavbarComponent implements AfterViewInit {
  @ViewChild('activitiesButton', { read: ElementRef }) activitiesButton: ElementRef;
  @ViewChild('facilitiesButton', { read: ElementRef }) facilitiesButton: ElementRef;

  constructor(private router: Router, private renderer: Renderer2) { }

  toActivities(event: MouseEvent) {
    this.router.navigate(['categories']);
  }

  toFacilities(event: MouseEvent) {
    this.router.navigate(['facilities']);
  }

  ngAfterViewInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    )
      .subscribe(event => {
        if (event['urlAfterRedirects'].split('/')[1] === 'categories') {
          this.renderer.removeClass(this.facilitiesButton.nativeElement, "focused");
          this.renderer.addClass(this.activitiesButton.nativeElement, "focused");
        } else if (event['urlAfterRedirects'].split('/')[1] === 'facilities') {
          this.renderer.removeClass(this.activitiesButton.nativeElement, "focused");
          this.renderer.addClass(this.facilitiesButton.nativeElement, "focused");
        }
      });
  }

}
