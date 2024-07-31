import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { Location } from '../../store/reducer';
import { Loader } from '@googlemaps/js-api-loader';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
  standalone: true,
  imports: [GoogleMapsModule],
  exportAs: 'MapComponent'
})
export class MapComponent implements AfterViewInit, OnChanges {

  @Input() origin: Location;
  @Input() destination: Location;
  @Output() duration = new EventEmitter<string>();
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  directions: google.maps.DirectionsResult | undefined;
  directionsService!: google.maps.DirectionsService;
  directionsRenderer!: google.maps.DirectionsRenderer;
  advancedMarkerElement: google.maps.marker.AdvancedMarkerElement;
  travelMode: typeof google.maps.TravelMode;
  loader: Loader;
  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'terrain',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    maxZoom: 15,
    minZoom: 8,
    zoom: 12,
    mapId: '4504f8b37365c3d0'
  }
  map!: google.maps.Map;
  constructor() {
    this.loader = new Loader({
      apiKey: environment.googleMapKey,
      version: "weekly",
      libraries: ["maps", "routes", "marker"]
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['destination']) {
      this.initMap();
    }
  }

  async initMap() {
    this.mapOptions.center = this.destination;
    this.loader.importLibrary("maps").then(({ Map }) => {
      this.map = new Map(this.mapContainer.nativeElement, this.mapOptions);
    });

    if (!this.origin || !this.origin.lat || !this.origin.lng) {
      const { AdvancedMarkerElement } = await this.loader.importLibrary("marker");
      const maker = new AdvancedMarkerElement({
        map: this.map,
        position: this.destination
      })
    } else {
      const { DirectionsRenderer, TravelMode, DirectionsService } = await this.loader.importLibrary("routes");

      this.directionsRenderer = new DirectionsRenderer();

      this.directionsRenderer.setMap(this.map);
      const request: google.maps.DirectionsRequest = {
        origin: { lat: this.origin.lat, lng: this.origin.lng },
        destination: { lat: this.destination.lat, lng: this.destination.lng },
        travelMode: TravelMode.DRIVING
      };

      new DirectionsService().route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.directionsRenderer.setDirections(result);
          this.duration.emit(result.routes[0].legs[0].duration.text);
        } else {
          console.error('Error fetching directions', result);
        }
      })
    }


  }

}
