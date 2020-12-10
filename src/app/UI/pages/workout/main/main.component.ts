import { HttpService } from 'src/app/services/http.service';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  @ViewChild("container", {static: false}) container: ElementRef;
  @ViewChild("gmap", {static: true}) gmapElement: ElementRef;
  map: google.maps.Map;
  placeService: google.maps.places.PlacesService;
  private destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  todayList: Array<any>;
  gymnasticObj: any;
  gymnastics: Array<any> = [];
  workouts: Array<any> = [];
  checked: Array<any> = [];
  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
    this.getTodayList();
    this.initMap();
  }

  private initMap (): void {
    const Lviv = new google.maps.LatLng(49.82460512240315, 24.010532607235202)
    const mapProp = {
      center: Lviv,
      zoom: 15,
      mapTypedId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    const request = {
      location: Lviv,
      radius: 2000,
      type: 'gym'
    }

    this.placeService = new google.maps.places.PlacesService(this.map);
    this.placeService.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        results.forEach(result => {
          new google.maps.Marker({
            position: result.geometry.location,
            map: this.map,
            title: result.name
          })
        });
      }
    });
  }

  private getTodayList (): void {
    this.httpService.getTodayWorkoutList().pipe(takeUntil(this.destroy)).subscribe(res => {
      if (res.gymnasticList) {
        this.gymnasticObj = res.gymnasticList.gymnasticObj;
        const gymnasticIds = this.gymnasticObj.gymnastics.map(gymnastic => gymnastic.id);
        this.httpService.getGymnasticsByIds(gymnasticIds).pipe(takeUntil(this.destroy)).subscribe(res => {
          const gymnastics = res.gymnastics;
          this.todayList = gymnastics.map(gymnastic => {
            const index = this.gymnasticObj.gymnastics.findIndex(item => item.id == gymnastic._id);
            return {
              id: gymnastic._id,
              name: gymnastic.name,
              units: gymnastic.units,
              times: this.gymnasticObj.gymnastics[index].times
            }
          });
          console.log(this.todayList)
        }, err => {
          console.log(err);
        });
      }
    }, err => {
      console.log(err)
    });
  }

  remove (obj): void {
    const index = this.gymnasticObj.gymnastics.findIndex(gymnastic => obj.id === gymnastic.id);
    this.gymnasticObj.gymnastics.splice(index, 1);
    this.todayList.splice(index, 1);
    this.httpService.updateGymnasticList(this.gymnasticObj._id, this.gymnasticObj).pipe(takeUntil(this.destroy)).subscribe(res => {
      if (res.gymnasticList) {
        console.log(res.gymnasticList)
      } else {
        this.gymnasticObj = null;
      }
    }, err => {
      console.log(err);
    });
  }

  clear (): void {
    if (this.gymnasticObj && this.gymnasticObj.gymnastics.length) {
      this.gymnasticObj.gymnastics.splice(0, this.gymnasticObj.gymnastics.length);
      this.todayList.splice(0, this.todayList.length);
      this.httpService.updateGymnasticList(this.gymnasticObj._id, this.gymnasticObj).pipe(takeUntil(this.destroy)).subscribe(res => {
        if (res.gymnasticList) {
          console.log(res.gymnasticList)
        } else {
          this.gymnasticObj = null;
        }
      }, err => {
        console.log(err);
      });
    }
  }

  toggle (name): void {
    this.container.nativeElement.classList.toggle('blur');
    const popup = document.querySelector(`.popup.${name}`);
    popup.classList.toggle('active');
    if (popup.classList.contains('active')) {
      if (popup.classList.contains('addGymnastic')) {
        this.loadGymnastics();
      } else {
        this.loadWorkouts();
      }
    }
  }

  private loadGymnastics (): void {
    if (!this.gymnastics.length) {
      this.httpService.getGymnastics().pipe(takeUntil(this.destroy)).subscribe(res => {
        this.gymnastics = res.gymnastics;
      }, err => {
        console.log(err);
      });
    }
  }

  private loadWorkouts (): void {

  }

  confirm (name): void {
    if (this.todayList && this.todayList.length) {
      this.checked.forEach(item => {
        const index = this.todayList.findIndex(gymnastic => gymnastic.id === item.id);
        if (index == -1) {
          this.todayList.push(Object.assign({}, item));
        } else {
          this.todayList[index].times = item.times;
        }
      });
    } else {
      this.todayList = [...this.checked];
    }
    const gymnastics = this.todayList.map(gymnastic => {
      return {id: gymnastic.id, times: gymnastic.times};
    });
    if (this.gymnasticObj) {
      this.gymnasticObj.gymnastics = [...gymnastics];
      this.httpService.updateGymnasticList(this.gymnasticObj._id, this.gymnasticObj).pipe(takeUntil(this.destroy)).subscribe(res => {
        console.log(res);
      }, err => {
        console.log(err);
      });
    } else {
      this.httpService.createTodayList(gymnastics).pipe(takeUntil(this.destroy)).subscribe(res => {
        this.gymnasticObj = res.gymnasticList;
      }, err => {
        console.log(err);
      });
    }
    this.toggle(name);
  }

  addItem (event, obj): void {
    if (event.target.checked) {
      const input: any = document.getElementById(obj._id);
      const times = +input.value;
      const gymnastic = {
        id: obj._id,
        times: times,
        name: obj.name,
        units: obj.units
      };
      this.checked.push(gymnastic);
    } else {
      const index = this.checked.findIndex(item => item.id === obj.id);
      this.checked.splice(index, 1);
    }
  }

  editItem (event, obj): void {
    const index = this.checked.findIndex(item => item.id === obj._id);
    if (index != -1) {
      this.checked[index].times = +event.target.value;
    }
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

}
