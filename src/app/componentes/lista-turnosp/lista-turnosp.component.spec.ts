import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaTurnospComponent } from './lista-turnosp.component';

describe('ListaTurnospComponent', () => {
  let component: ListaTurnospComponent;
  let fixture: ComponentFixture<ListaTurnospComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaTurnospComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaTurnospComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
