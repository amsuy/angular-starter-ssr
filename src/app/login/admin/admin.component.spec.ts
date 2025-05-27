import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminComponent } from './admin.component';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminComponent, CommonModule, FormsModule, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cambiar la vista correctamente', () => {
    component.cambiarVista('paciente');
    expect(component.vista).toBe('paciente');

    component.cambiarVista('doctor');
    expect(component.vista).toBe('doctor');
  });

  it('debería cerrar sesión y redirigir al login', () => {
    const navigateSpy = spyOn(router, 'navigate');
    spyOn(localStorage, 'clear');

    component.cerrarSesion();

    expect(localStorage.clear).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
