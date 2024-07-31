import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FacilityResolver } from "./facility-resolver.service";
import { FacilityActivityResolver } from "./facility-activity-resolver.service";
import { FacilityActivityDetailResolver } from "./facility-activity-detail-resolver.service";
import { LocationGuard } from "./location.guard";

const routes: Routes = [

    {
        path: '', pathMatch: 'full', redirectTo: '/:facilityId'
    },
    {
        path: ':facilityId',
        children: [
            {
                path: '', pathMatch: 'full', loadComponent: () => import('./facility/facility.component').then(m => m.FacilityComponent),
                canActivate: [LocationGuard],
                resolve: { facilities: FacilityResolver }
            },
            {
                path: 'activities', loadComponent: () => import('./facility-activity/facility-activity.component').then(m => m.FacilityActivityComponent),
                canActivate: [LocationGuard],
                resolve: { activities: FacilityActivityResolver }
            },
            {
                path: 'category/:category/types/:typeId/activities/:activityId', loadComponent: () => import('./activity/activity.component').then(m => m.ActivityComponent),
                canActivate: [LocationGuard],
                resolve: { activities: FacilityActivityDetailResolver }
            }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FacilityRoutingModule { }