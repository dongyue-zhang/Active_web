
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Type } from "./models/type.model";
import { inject } from "@angular/core";
import { DataService } from "./store/data.service";
import { take, switchMap, of } from "rxjs";

export const TypeResolver: ResolveFn<Type[]> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
) => {
    const dataService = inject(DataService);
    return dataService.getTypes().pipe(
        take(1),
        switchMap(types => {
            let categoryId = +route.params['categoryId'];
            let found = types.state.find((type, index) => {
                return type.categoryId === categoryId;
            });
            if (types.state.length === 0 || !found) {
                dataService.fetchTypesByCategory(categoryId);
            }
            return of([]);
        })
    )
}