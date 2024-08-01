import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DataService } from './store/data.service';
import { Store } from '@ngrx/store';
import { AppState, Location } from './store/reducer';
import { setLocation } from './store/actions';
import { NgToastService, ToasterPosition } from 'ng-angular-popup';
import { filter, take } from 'rxjs';
import { isEmpty } from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'active';
  loading = true;
  ToasterPosition = ToasterPosition;
  toastMassege = "Please allow location access to get personalized services.";

  constructor(private dataService: DataService, private store: Store<AppState>, private toast: NgToastService) {

  }

  ngOnInit(): void {
    this.initLoading();


    this.dataService.fetchAllCategories();
    this.dataService.fetchPopluarTypes();
  }

  ngAfterViewInit(): void {
    this.dataService.getLocationObs().pipe(
      filter(location => location !== null),
      take(1)
    ).subscribe(
      location => {
        if (isEmpty(location)) {
          this.toast.info(this.toastMassege, "INFO", 10000)
        }
      }
    )
  }

  initLoading() {
    new Promise<Location>(async (resolve, reject) => {
      const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });

      if (permissionStatus.state === 'granted' || permissionStatus.state === 'prompt') {

        navigator.geolocation.getCurrentPosition((position) => {
          if (position) {
            const location = {
              lng: position.coords.longitude,
              lat: position.coords.latitude
            }
            resolve(location);
          }
        })

      } else {
        resolve(null);
      }
      this.loading = false;
    }).then(location => {
      this.store.dispatch(setLocation({ location }))
    })


  }
}
