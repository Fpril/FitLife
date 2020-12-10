import { HttpService } from 'src/app/services/http.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-create-workout',
  templateUrl: './create-workout.component.html',
  styleUrls: ['./create-workout.component.scss']
})
export class CreateWorkoutComponent implements OnInit, OnDestroy {

  modeForm: FormGroup;
  gymnasticForm: FormGroup;
  private destroy: ReplaySubject<any> = new ReplaySubject<any>(1);

  constructor(private fb: FormBuilder,
              private httpService: HttpService) { }

  ngOnInit(): void {
    this.initForms();
  }

  private initForms (): void {
    this.modeForm = this.fb.group({
      mode: ['gymnastic', [Validators.required]]
    });

    this.gymnasticForm = this.fb.group({
      name: ['', [Validators.required]],
      units: ['повтори', [Validators.required]]
    });
  }

  saveGymnastic (): void {
    const span = document.querySelector('.gymnastic .red')
    if (this.gymnasticForm.valid) {
      let name = this.gymnasticForm.get('name').value;
      name = `${name[0].toUpperCase()}${name.slice(1).toLowerCase()}`;
      this.httpService.getGymnastic(name).pipe(takeUntil(this.destroy)).subscribe(res => {
        const gymnastic = res.gymnastic;
        if (gymnastic.length) {
          span.innerHTML = "Така вправа вже створена";
          span.classList.add('active');
        } else {
          span.classList.remove('active');
          const data = {
            name: name,
            units: this.gymnasticForm.get('units').value
          }
          this.httpService.createGymnastic(data).pipe(takeUntil(this.destroy)).subscribe(res => {
            console.log(res);
          }, err => {
            console.log(err);
          });
        }
      }, err => {
        console.log(err);
      });
    } else {
      span.innerHTML = "Введіть назву вправи";
      span.classList.add('active');
    }
  }

  ngOnDestroy (): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

}
