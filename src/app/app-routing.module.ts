import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivityRoutingModule } from './activity-routing.module';
import { FacilityRoutingModule } from './facility-routing.module';

const routes: Routes = [
  {
    path: '', pathMatch: 'full',
    loadChildren: () => import('./activity-routing.module').then(m => m.ActivityRoutingModule)
  },
  {
    path: 'facilities', loadChildren: () => import('./facility-routing.module').then(m => m.FacilityRoutingModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' }), ActivityRoutingModule, FacilityRoutingModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
