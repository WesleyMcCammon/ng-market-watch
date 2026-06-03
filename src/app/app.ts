import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LiveDataService } from './service/live-data-service';
import { FooterComponent } from './layout/footer-component/footer-component';
import { BannerComponent } from './layout/banner-component/banner-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BannerComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('ng-market-watch');

  constructor(private liveDataService: LiveDataService) {}

  ngOnInit() {
    
    this.liveDataService.start();
    this.liveDataService.prices$.subscribe(data => {
    });
  }
}
