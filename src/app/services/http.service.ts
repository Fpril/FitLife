import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private url: string = 'https://guarded-gorge-21245.herokuapp.com/';

  constructor(private http: HttpClient) { }

  public getMenu (): Observable<any> {
    return this.http.get('assets/config/menu.json')
  }

  public getTodayWorkoutList (): Observable<any> {
    const now = new Date();
    return this.http.get(`${this.url}gymnasticList/read/${new Date(now.getFullYear(), now.getMonth(), now.getDate())}`)
  }

  public getTodayFoodList (): Observable<any> {
    const now = new Date();
    return this.http.get(`${this.url}foodList/read/${new Date(now.getFullYear(), now.getMonth(), now.getDate())}`)
  }

  public updateGymnasticList (id, newObj): Observable<any> {
    return this.http.put(`${this.url}gymnasticList/update/${id}`, {gymnasticList: newObj})
  }

  public updateFoodList (id, newObj): Observable<any> {
    return this.http.put(`${this.url}foodList/update/${id}`, {foodList: newObj})
  }

  public getGymnastics (): Observable<any> {
    return this.http.get(`${this.url}gymnastic/read`)
  }

  public getFood (): Observable<any> {
    return this.http.get(`${this.url}food/read`)
  }

  public getWorkouts (): Observable<any> {
    return this.http.get(`${this.url}workout/read`)
  }

  public createTodayList (data): Observable<any> {
    return this.http.post(`${this.url}gymnasticList/create`, {gymnasticList: data})
  }

  public createTodayFoodList (data): Observable<any> {
    return this.http.post(`${this.url}foodList/create`, {foodList: data})
  }

  public getGymnastic (name): Observable<any> {
    return this.http.get(`${this.url}gymnastic/read/${name}`)
  }

  public createGymnastic (data): Observable<any> {
    return this.http.post(`${this.url}gymnastic/create`, {gymnastic: data})
  }

  public getGymnasticsByIds (array): Observable<any> {
    return this.http.post(`${this.url}gymnastic/readByIds`, {array: array})
  }

  public getFoodByIds (array): Observable<any> {
    return this.http.post(`${this.url}food/readByIds`, {array: array})
  }
}
