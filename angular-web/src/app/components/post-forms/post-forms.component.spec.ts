import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostFormsComponent } from './post-forms.component';

describe('PostFormsComponent', () => {
  let component: PostFormsComponent;
  let fixture: ComponentFixture<PostFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
