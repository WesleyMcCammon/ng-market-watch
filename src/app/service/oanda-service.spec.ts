import { TestBed } from '@angular/core/testing';

import { OandaService } from './oanda-service';

describe('OandaService', () => {
  let service: OandaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OandaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
