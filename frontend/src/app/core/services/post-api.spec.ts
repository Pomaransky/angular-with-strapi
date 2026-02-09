import { TestBed } from '@angular/core/testing';

import { PostApi } from './post-api';

describe('PostApi', () => {
  let service: PostApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
