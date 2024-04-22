import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FidaliteComponent } from './fidalite.component';

describe('FidaliteComponent', () => {
  let component: FidaliteComponent;
  let fixture: ComponentFixture<FidaliteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FidaliteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FidaliteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
