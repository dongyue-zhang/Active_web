import { ViewContainerRef } from "@angular/core";
import { Location } from "./../store/reducer"


export class DirectionDetail {
    _direction: {
        origin: Location;
        destination: Location
    } = {
            origin: {
                lat: 0,
                lng: 0
            },
            destination: {
                lat: 0,
                lng: 0
            }
        };
    _duration: string;
    _mapContainer: ViewContainerRef;
    isDirectionSet: boolean = false;
    isMapContainerSet: boolean = false;

    set direction(direction: { origin: Location; destination: Location }) {
        if (this._direction.origin.lat !== direction.origin.lat && this._direction.origin.lng !== direction.origin.lng && this._direction.destination.lat !== direction.destination.lat && this._direction.destination.lng !== direction.destination.lng) {
            this._direction = direction;
            this.isDirectionSet = true;
        }
    }

    get direction() {
        return this._direction;
    }

    setDuration(duration: string) {
        this._duration = duration;
    }

    get duration() {
        return this._duration;
    }

    set mapContainer(mapContainer: ViewContainerRef) {
        this._mapContainer = mapContainer;
        this.isMapContainerSet = true;
    }

    get mapContainer() {
        return this._mapContainer;
    }

}