import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionFieldComponent } from './selection-field.component';

describe('SelectionFieldComponent', () => {
  let component: SelectionFieldComponent;
  let fixture: ComponentFixture<SelectionFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
