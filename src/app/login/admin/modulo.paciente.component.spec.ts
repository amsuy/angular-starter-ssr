import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModuloPacienteComponent } from './modulo.paciente.component';

describe('ModuloPacienteComponent', () => {
  let component: ModuloPacienteComponent;
  let fixture: ComponentFixture<ModuloPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuloPacienteComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ModuloPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
