import { TestBed } from '@angular/core/testing';

import { LibService } from './lib.service';

describe('LibService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LibService = TestBed.get(LibService);
    expect(service).toBeTruthy();
  });
});
