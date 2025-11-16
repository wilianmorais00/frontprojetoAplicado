import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentVisualizacao } from './component-visualizacao';

describe('ComponentVisualizacao', () => {
  let component: ComponentVisualizacao;
  let fixture: ComponentFixture<ComponentVisualizacao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentVisualizacao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentVisualizacao);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
