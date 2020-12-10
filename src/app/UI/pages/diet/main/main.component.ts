import { HttpService } from 'src/app/services/http.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  @ViewChild("container", {static: false}) container: ElementRef;
  @ViewChild("gmap", {static: true}) gmapElement: ElementRef;
  map: google.maps.Map;
  placeService: google.maps.places.PlacesService;
  private destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  todayList: Array<any>;
  foodObj: any;
  food: Array<any> = [];
  diets: Array<any> = [];
  checked: Array<any> = [];

  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
    // this.getTodayList();
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
      type: 'supermarket'
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

  // private getTodayList (): void {
  //   this.httpService.getTodayFoodList().pipe(takeUntil(this.destroy)).subscribe(res => {
  //     if (res.foodList) {
  //       this.foodObj = res.foodList.foodObj;
  //       const foodIds = this.foodObj.food.map(food => food.id);
  //       this.httpService.getFoodByIds(foodIds).pipe(takeUntil(this.destroy)).subscribe(res => {
  //         const foodArr = res.food;
  //         this.todayList = foodArr.map(food => {
  //           const index = this.foodObj.food.findIndex(item => item.id == food._id);
  //           return {
  //             id: food._id,
  //             name: food.name,
  //             grams: this.foodObj.food.grams,
  //             kcal: (this.foodObj.food.grams * this.food['grams per 100 kcal']) / 100
  //           }
  //         });
  //         console.log(this.todayList)
  //         console.log(this.foodObj)
  //       }, err => {
  //         console.log(err);
  //       });
  //     }
  //   }, err => {
  //     console.log(err)
  //   });
  // }

  // remove (obj): void {
  //   const index = this.foodObj.food.findIndex(food => obj.id === food.id);
  //   this.foodObj.food.splice(index, 1);
  //   this.todayList.splice(index, 1);
  //   this.httpService.updateFoodList(this.foodObj._id, this.foodObj).pipe(takeUntil(this.destroy)).subscribe(res => {
  //     if (res.foodList) {
  //       console.log(res.foodList)
  //     } else {
  //       this.foodObj = null;
  //     }
  //   }, err => {
  //     console.log(err);
  //   });
  // }

  // clear (): void {
  //   if (this.foodObj && this.foodObj.food.length) {
  //     this.foodObj.food.splice(0, this.foodObj.food.length);
  //     this.todayList.splice(0, this.todayList.length);
  //     this.httpService.updateFoodList(this.foodObj._id, this.foodObj).pipe(takeUntil(this.destroy)).subscribe(res => {
  //       if (res.foodList) {
  //         console.log(res.foodList)
  //       } else {
  //         this.foodObj = null;
  //       }
  //     }, err => {
  //       console.log(err);
  //     });
  //   }
  // }

  // toggle (name): void {
  //   this.container.nativeElement.classList.toggle('blur');
  //   const popup = document.querySelector(`.popup.${name}`);
  //   popup.classList.toggle('active');
  //   if (popup.classList.contains('active')) {
  //     if (popup.classList.contains('addFood')) {
  //       this.loadFood();
  //     } else {
  //       this.loadDiets();
  //     }
  //   }
  // }

  // private loadFood (): void {
  //   if (!this.food.length) {
  //     this.httpService.getFood().pipe(takeUntil(this.destroy)).subscribe(res => {
  //       this.food = res.allFood;
  //     }, err => {
  //       console.log(err);
  //     });
  //   }
  // }

  // private loadDiets (): void {

  // }

  // confirm (name): void {
  //   if (this.todayList && this.todayList.length) {
  //     this.checked.forEach(item => {
  //       const index = this.todayList.findIndex(food => food.id === item.id);
  //       if (index == -1) {
  //         this.todayList.push(Object.assign({}, item));
  //       } else {
  //         this.todayList[index].grams = item.grams;
  //         this.todayList[index].kcal = item.kcal;
  //       }
  //     });
  //   } else {
  //     this.todayList = [...this.checked];
  //   }
  //   const food = this.todayList.map(food => {
  //     return {id: food.id, grams: food.grams};
  //   });
  //   if (this.foodObj) {
  //     this.foodObj.food = [...food];
  //     this.httpService.updateFoodList(this.foodObj._id, this.foodObj).pipe(takeUntil(this.destroy)).subscribe(res => {
  //       console.log(res);
  //     }, err => {
  //       console.log(err);
  //     });
  //   } else {
  //     this.httpService.createTodayFoodList(food).pipe(takeUntil(this.destroy)).subscribe(res => {
  //       this.foodObj = res.foodList;
  //     }, err => {
  //       console.log(err);
  //     });
  //   }
  //   this.toggle(name);
  // }

  // addItem (event, obj): void {
  //   if (event.target.checked) {
  //     const input: any = document.getElementById(obj._id);
  //     console.log(obj['kcal per 100 grams'])
  //     const grams = +input.value;
  //     const food = {
  //       id: obj._id,
  //       grams: grams,
  //       name: obj.name,
  //       kcal: (grams * obj['kcal per 100 grams']) / 100
  //     };
  //     this.checked.push(food);
  //   } else {
  //     const index = this.checked.findIndex(item => item.id === obj.id);
  //     this.checked.splice(index, 1);
  //   }
  // }

  // editItem (event, obj): void {
  //   const index = this.checked.findIndex(item => item.id === obj._id);
  //   if (index != -1) {
  //     this.checked[index].times = +event.target.value;
  //   }
  // }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

}
