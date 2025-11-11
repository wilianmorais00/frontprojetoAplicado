import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Formscomponent } from './formscomponent';

describe('Formscomponent', () => {
  let component: Formscomponent;
  let fixture: ComponentFixture<Formscomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Formscomponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Formscomponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
