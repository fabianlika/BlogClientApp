import { TestBed } from '@angular/core/testing';

import { PostPhotoService } from './post-photo.service';

describe('PostPhotoService', () => {
  let service: PostPhotoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostPhotoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
