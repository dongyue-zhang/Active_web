
import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { ActivityResolver } from "./activity-resolver.service";
import { TypeResolver } from "./type-resolver.service";
import { LocationGuard } from "./location.guard";

const routes: Routes = [
    {
        path: '', pathMatch: 'full', redirectTo: 'categories'
    },
    {
        path: 'categories', children: [
            {
                path: '', loadComponent: () => import('./category/category.component').then(m => m.CategoryComponent), pathMatch: 'full'
            },
            {
                path: ':categoryId/types', children: [
                    {
                        path: '', loadComponent: () => import('./type/type.component').then(m => m.TypeComponent), pathMatch: 'full',
                        resolve: { type: TypeResolver }
                    },
                    {
                        path: ':typeId/activities',
                        children: [
                            {
                                path: '', loadComponent: () => import('./type-activity/type-activity.component').then(m => m.TypeActivityComponent), pathMatch: 'full',
                                canActivate: [LocationGuard],
                                resolve: { activity: ActivityResolver }
                            },
                            {
                                path: ':activityId',
                                loadComponent: () =>
                                    import('./activity/activity.component').then((m) => m.ActivityComponent),
                                canActivate: [LocationGuard],
                                resolve: { activity: ActivityResolver }
                            }
                        ]
                    }
                ]
            }
        ]
    },
    // {
    //     path: 'types/:typeId/activities', children: [
    //         {
    //             path: '', loadComponent: () => import('../../type-activity/type-activity.component').then(m => m.TypeActivityComponent),
    //         },
    //         {
    //             path: ':activityId',
    //             loadComponent: () =>
    //                 import('../../activity/activity.component').then((m) => m.ActivityComponent),
    //             resolve: { activity: ActivityResolver }
    //         }
    //     ]
    // },



]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ActivityRoutingModule { }