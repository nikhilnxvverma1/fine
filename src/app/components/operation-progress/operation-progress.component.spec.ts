import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationProgressComponent } from './operation-progress.component';

describe('OperationProgressComponent', () => {
  let component: OperationProgressComponent;
  let fixture: ComponentFixture<OperationProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
