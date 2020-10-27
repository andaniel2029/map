import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UsaMapComponent} from './usa-map/usa-map.component';

const routes: Routes = [
  { path: 'map-view', component: UsaMapComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
