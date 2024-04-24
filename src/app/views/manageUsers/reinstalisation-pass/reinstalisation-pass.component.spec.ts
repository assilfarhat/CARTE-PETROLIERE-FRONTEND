import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReinstalisationPassComponent } from './reinstalisation-pass.component';

describe('ReinstalisationPassComponent', () => {
  let component: ReinstalisationPassComponent;
  let fixture: ComponentFixture<ReinstalisationPassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReinstalisationPassComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReinstalisationPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
