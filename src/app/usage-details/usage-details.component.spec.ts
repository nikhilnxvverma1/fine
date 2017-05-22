import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageDetailsComponent } from './usage-details.component';

describe('UsageDetailsComponent', () => {
  let component: UsageDetailsComponent;
  let fixture: ComponentFixture<UsageDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsageDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
