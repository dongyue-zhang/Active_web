import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Activity } from "./models/activity.model";
import { of, switchMap, take } from "rxjs";
import { inject } from "@angular/core";
import { DataService } from "./store/data.service";


export const ActivityResolver: ResolveFn<Activity[]> = (
    route: ActivatedRouteSnapshot
) => {
    const dataService = inject(DataService);
    const category = route.paramMap.get('categoryId');
    const typeId = +route.params['typeId'];
    if (!isNaN(+category)) {
        return dataService.getActivities().pipe(
            take(1),
            switchMap(activities => {
                const found = activities.find((activity, index) => {
                    return activity.typeId === typeId;
                })
                if (!found) {
                    dataService.fetchTypesByCategory(+category);
                    dataService.fetchActivitiesByType(typeId);
                }
                return of([]);
            })
        )
    } else {
        return dataService.getPopularTypes().pipe(
            take(1),
            switchMap(types => {
                const found = types.find(type => {
                    return type.type.id === typeId;
                });
                if (!found) {
                    dataService.fetchPopularTypes_ActivitiesForPopularType(typeId);
                } else if (found.activities.length === 0) {
                    dataService.fetchActivitiesByPopularType(typeId);
                }
                return of([]);
            })
        )
    }


}