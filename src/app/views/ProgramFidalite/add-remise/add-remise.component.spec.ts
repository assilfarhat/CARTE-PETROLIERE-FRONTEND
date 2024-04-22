import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRemiseComponent } from './add-remise.component';

describe('AddRemiseComponent', () => {
  let component: AddRemiseComponent;
  let fixture: ComponentFixture<AddRemiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRemiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRemiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
