import { TestBed } from '@angular/core/testing';

import { DateFnsLocaleService } from './date-fns-locale-service';

describe('DateFnsLocaleService', () => {
  let service: DateFnsLocaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateFnsLocaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
