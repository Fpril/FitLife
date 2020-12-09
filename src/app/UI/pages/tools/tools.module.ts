import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityComponent } from './activity/activity.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'activity',
    component: ActivityComponent
  }
]

@NgModule({
  declarations: [ActivityComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ToolsModule { }
