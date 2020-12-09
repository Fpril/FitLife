import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { MainComponent } from './UI/pages/main/main.component';

const routes: Routes = [
  {
    path: 'diet',
    loadChildren: () => import('./UI/pages/diet/diet.module').then(m => m.DietModule)
  },
  {
    path: 'workout',
    loadChildren: () => import('./UI/pages/workout/workout.module').then(m => m.WorkoutModule)
  },
  {
    path: 'tools',
    loadChildren: () => import('./UI/pages/tools/tools.module').then(m => m.ToolsModule)
  },
  {
    path: '**',
    component: MainComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
