
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { inject } from "@angular/core";
import { DataService } from "./store/data.service";
import { take, of, concatMap } from "rxjs";
import { Facility } from "./models/facility.model";

export const FacilityResolver: ResolveFn<Facility[]> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
) => {
    const dataService = inject(DataService);
    let facilityId: number;

    if (!isNaN(+route.paramMap.get('facilityId'))) {
        facilityId = +route.paramMap.get('facilityId');
    }
    return dataService.getFacilities().pipe(
        take(1),
        concatMap(facilities => {
            if (facilities.state.length === 0 || facilities.pagenation === null) {
                dataService.fetchAllFacilities(0);
            }

            if (facilityId && !facilities.state.find(facility => facility.facility.id === facilityId)) {
                dataService.fetchFacilityById(facilityId);
            }
            return of([]);
        }))
}