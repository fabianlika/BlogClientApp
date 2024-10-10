import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPostPhotoComponent } from './upload-post-photo.component';

describe('UploadPostPhotoComponent', () => {
  let component: UploadPostPhotoComponent;
  let fixture: ComponentFixture<UploadPostPhotoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadPostPhotoComponent]
    });
    fixture = TestBed.createComponent(UploadPostPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
