import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { inject } from "@angular/core";
import { DataService } from "./store/data.service";
import { take, switchMap, of } from "rxjs";
import { Facility } from "./models/facility.model";
import { FacilityState } from "./store/reducer";

export const FacilityActivityDetailResolver: ResolveFn<Facility[]> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
) => {
    const dataService = inject(DataService);
    const facilityId: number = +route.paramMap.get('facilityId');
    const category: string = route.paramMap.get('category');
    const typeId: number = +route.paramMap.get('typeId');
    const activityId: number = +route.paramMap.get('activityId');
    let loading: boolean;

    dataService.getLoadingStatus().subscribe(
        status => {
            loading = status;
        }
    );

    let found: FacilityState;
    let loop: boolean = true;

    return dataService.getFacilities().pipe(
        take(1),
        switchMap(facilities => {
            found = facilities.state.find(facility => facility.facility.id === facilityId);
            if (facilities.state.length === 0 || !found) {
                dataService.fetchAllFacilities_TypesAndActivitiesByFacility(facilityId, category, typeId);
            }
            return of([]);
        }))
}