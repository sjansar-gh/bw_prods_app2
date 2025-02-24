import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileParentComponent } from './profile-parent.component';

describe('ProfileParentComponent', () => {
  let component: ProfileParentComponent;
  let fixture: ComponentFixture<ProfileParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileParentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
