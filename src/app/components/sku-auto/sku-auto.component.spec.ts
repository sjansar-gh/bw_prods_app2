import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkuAutoComponent } from './sku-auto.component';

describe('SkuAutoComponent', () => {
  let component: SkuAutoComponent;
  let fixture: ComponentFixture<SkuAutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkuAutoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkuAutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
