import { Component, inject } from '@angular/core';
import { ForexService } from '../forex.service';
import { ForexPair } from '../forex-pair/forex-pair';

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
export class Home {
  protected readonly quotes = inject(ForexService).quotes;
}
