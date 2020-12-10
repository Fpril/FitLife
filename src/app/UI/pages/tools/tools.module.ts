import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CreateWorkoutComponent } from './create-workout/create-workout.component';
import { CreateFoodComponent } from './create-food/create-food.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: 'createWorkout',
    component: CreateWorkoutComponent
  },
  {
    path: 'createFood',
    component: CreateFoodComponent
  }
]

@NgModule({
  declarations: [CreateWorkoutComponent, CreateFoodComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    RouterModule
  ]
})
export class ToolsModule { }
