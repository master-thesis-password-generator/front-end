import { TestBed, inject } from '@angular/core/testing';

import { PGToastrService } from './pgtoastr.service';

describe('PGToastrService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PGToastrService]
    });
  });

  it('should be created', inject([PGToastrService], (service: PGToastrService) => {
    expect(service).toBeTruthy();
  }));
});
