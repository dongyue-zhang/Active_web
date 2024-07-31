
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Type } from "./models/type.model";
import { inject } from "@angular/core";
import { DataService } from "./store/data.service";
import { take, switchMap, of, filter } from "rxjs";

export const FacilityActivityResolver: ResolveFn<Type[]> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const dataService = inject(DataService);

    const facilityId = +route.params['facilityId'];
    let category: string;
    let typeId: number;

    if (route.queryParams['category'] && route.queryParams['typeId']) {
        category = route.queryParams['category'];
        typeId = +route.queryParams['typeId'];
    }

    return dataService.getFacilities().pipe(
        take(1),
        switchMap(facilities => {
            let found = facilities.state.find((facility, index) => {
                return facility.facility.id === facilityId;
            });
            if (!found && facilityId) {
                dataService.fetchFacilityAndTypesByFacility(facilityId);
            } else if (found && found.activities.length === 0) {
                dataService.fetchTypesByFacility(facilityId);
            }

            dataService.getFacilities().pipe(
                filter(facilityState => facilityState.state.length !== 0),
                filter(facilityState => facilityState.state.find(state => state.facility.id === facilityId).activities !== null),
                filter(facilityState => facilityState.state.find(state => state.facility.id === facilityId).activities.length !== 0),
                filter(facilityState => {
                    if (typeId && category) {
                        return facilityState.state.find(state => state.facility.id === facilityId).activities.find(i => i.categoryName === category).types !== null;
                    } else {
                        return facilityState.state.find(state => state.facility.id === facilityId).activities[0].types[0] !== null
                    }
                }),
                take(1),
            ).subscribe(facilityState => {
                if (!(typeId && category)) {
                    category = facilityState.state.find(state => state.facility.id === facilityId).activities[0].categoryName;
                    typeId = facilityState.state.find(state => state.facility.id === facilityId).activities[0].types[0].type.id;
                }
                dataService.fetchActivitiesByFacilityAndType(facilityId, category, typeId);

            })
            return of([]);
        })
    )
}