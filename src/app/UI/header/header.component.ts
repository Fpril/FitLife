import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  menu: Array<any> = [];
  isActive: boolean = true;
  private isMobile = /Mobile|webOS|BlackBerry|IEMobile|MeeGo|mini|Fennec|Windows Phone|Android|iP(ad|od|hone)/i.test(navigator.userAgent);

  constructor(private httpService: HttpService,
              private router: Router) { 
                this.router.events.pipe(takeUntil(this.destroy)).subscribe(event => {
                  if (event instanceof NavigationStart) {
                    this.toggleActiveClass();
                  }
                });
              }

  ngOnInit(): void {
    this.initDevice();
    this.initMenu();
  }

  private initMenu(): void {
    this.httpService.getMenu().pipe(takeUntil(this.destroy)).subscribe(data => {
      this.menu = data.menu;
    }, err => {
      console.log(err)
    });
  }

  private initDevice(): void {
    let body = document.body;
    if (this.isMobile) {
      body.classList.add('touch');
    } else {
      body.classList.add('mouse');
    }
  }

  toggleActiveClass(): void {
    this.isActive = !this.isActive;
  }

  toggleSubMenu(arrow): void {
    const subMenu = arrow.nextElementSibling;
    subMenu.classList.toggle('open');
    arrow.classList.toggle('active');
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }
}
