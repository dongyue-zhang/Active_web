import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { DataService } from "./store/data.service";
import { filter, map, shareReplay, take } from "rxjs/operators";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";



@Injectable({
    providedIn: 'root'
})
class CanActivateService {
    constructor(private router: Router, private dateService: DataService) { }
    canActivated(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const obs = this.dateService.getLocationObs().pipe(
            filter(location => location !== null),
            take(1),
            map(location => {
                return true;
            }),
            shareReplay()
        )
        return obs;
    }
}

export const LocationGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
    return inject(CanActivateService).canActivated(route, state);
} 