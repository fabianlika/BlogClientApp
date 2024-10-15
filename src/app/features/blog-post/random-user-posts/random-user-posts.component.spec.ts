import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomUserPostsComponent } from './random-user-posts.component';

describe('RandomUserPostsComponent', () => {
  let component: RandomUserPostsComponent;
  let fixture: ComponentFixture<RandomUserPostsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RandomUserPostsComponent]
    });
    fixture = TestBed.createComponent(RandomUserPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
