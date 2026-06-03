import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-banner-component',
  imports: [CommonModule],
  templateUrl: './banner-component.html',
  styleUrl: './banner-component.css',
})
export class BannerComponent {

  menuItems = [
    'Home',
    'Forex Basics',
    'Currency Pairs',
    'Strategies',
    'Technical Analysis',
    'Risk Management',
    'Contact'
  ];
}
