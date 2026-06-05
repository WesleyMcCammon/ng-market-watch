import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ForexPair } from '../forex-pair/forex-pair';
import { ForexService } from '../forex.service';
import { ForexHubService } from '../forex-hub.service';

@Component({
  selector: 'app-home',
  imports: [ForexPair],
  templateUrl: './home.html',
  styles: [
    `
      .masonry {
        columns: 1;
        column-gap: 1rem;
      }
      .masonry-item {
        break-inside: avoid;
        margin-bottom: 1rem;
      }
      @media (min-width: 576px) {
        .masonry {
          columns: 2;
        }
      }
      @media (min-width: 992px) {
        .masonry {
          columns: 3;
        }
      }
      @media (min-width: 1400px) {
        .masonry {
          columns: 4;
        }
      }
    `,
  ],
})
export class Home implements OnInit {
  protected readonly quotes = inject(ForexService).quotes;

  protected readonly filterType = signal<'all' | 'base' | 'quote'>('all');
  protected readonly selectedCurrency = signal('');

  protected readonly currencyOptions = computed(() => {
    const type = this.filterType();
    if (type === 'all') {
      return [] as string[];
    }

    const index = type === 'base' ? 0 : 1;
    return [...new Set(this.quotes().map((quote) => quote.pair.split('/')[index]))].sort();
  });

  protected readonly filteredQuotes = computed(() => {
    const type = this.filterType();
    const currency = this.selectedCurrency().trim();
    if (type === 'all' || !currency) {
      return this.quotes();
    }

    const index = type === 'base' ? 0 : 1;
    return this.quotes().filter((quote) => quote.pair.split('/')[index] === currency);
  });


  readonly hubBid = computed(() => {
    const latest = this.forexHubService.latest();  
    console.log('Home component checking latest price update:', latest);
  });

  constructor(private forexHubService: ForexHubService) {}
    
  ngOnInit() {
    this.forexHubService.connect();

  } 
}
