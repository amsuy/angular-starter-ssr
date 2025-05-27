import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import { ModuloDoctorComponent } from './modulo.doctor.component';

describe('ModuloDoctorComponent - REGISTRAR DOCTOR', () => {
  let component: ModuloDoctorComponent;
  let fixture: ComponentFixture<ModuloDoctorComponent>;
  let mockAdminService: jasmine.SpyObj<AdminService>;

  beforeEach(async () => {
    mockAdminService = jasmine.createSpyObj('AdminService', ['guardarDoctorDesdeAdmin']);

    await TestBed.configureTestingModule({
      imports: [ModuloDoctorComponent, FormsModule, CommonModule],
      providers: [
        { provide: AdminService, useValue: mockAdminService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModuloDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('no debería guardar doctor si faltan campos obligatorios', () => {
    component.doctor = {
      colegiado: '',
      nombrecompleto: '',
      especialidad: '',
      direccion: '',
      centrohospitalario: '',
      edad: null,
      observacion: ''
    };

    component.guardarDoctor();

    expect(component.error).toContain('obligatorios');
    expect(component.mensaje).toBe('');
  });

  it('debería guardar doctor exitosamente si todos los campos están completos', () => {
    component.doctor = {
      colegiado: 'C1234',
      nombrecompleto: 'Dr. Juan Pérez',
      especialidad: 'Pediatría',
      direccion: 'Zona 1',
      centrohospitalario: 'Hospital Central',
      edad: 45,
      observacion: 'Ninguna'
    } as any;

    mockAdminService.guardarDoctorDesdeAdmin.and.returnValue(of({}));

    component.guardarDoctor();

    expect(mockAdminService.guardarDoctorDesdeAdmin).toHaveBeenCalledWith(component.doctor);
    expect(component.mensaje).toContain('exitosamente');
    expect(component.error).toBe('');
  });

  it('debería manejar error al guardar doctor', () => {
    component.doctor = {
      colegiado: 'C1234',
      nombrecompleto: 'Dr. Juan Pérez',
      especialidad: 'Pediatría',
      direccion: 'Zona 1',
      centrohospitalario: 'Hospital Central',
      edad: 45,
      observacion: 'Ninguna'
    } as any;

    mockAdminService.guardarDoctorDesdeAdmin.and.returnValue(throwError(() => new Error('Error servidor')));

    component.guardarDoctor();

    expect(component.error).toContain('Error al registrar');
    expect(component.mensaje).toBe('');
  });

  describe('ModuloDoctorComponent - CONSULTAR DOCTORES', () => {
    let component: ModuloDoctorComponent;
    let fixture: ComponentFixture<ModuloDoctorComponent>;
    let mockAdminService: jasmine.SpyObj<AdminService>;

    beforeEach(async () => {
      mockAdminService = jasmine.createSpyObj('AdminService', ['consultarDoctoresDesdeAdmin']);

      await TestBed.configureTestingModule({
        imports: [ModuloDoctorComponent, FormsModule, CommonModule],
        providers: [
          { provide: AdminService, useValue: mockAdminService }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ModuloDoctorComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('debería consultar doctores exitosamente', () => {
      const doctoresMock = [
        { iddoctor: 1, nombrecompleto: 'Dr. Juan Pérez' },
        { iddoctor: 2, nombrecompleto: 'Dra. Ana López' }
      ];

      mockAdminService.consultarDoctoresDesdeAdmin.and.returnValue(of(doctoresMock));

      component.consultarDoctores();

      expect(mockAdminService.consultarDoctoresDesdeAdmin).toHaveBeenCalled();
      expect(component.doctores.length).toBe(2);
      expect(component.mensaje).toContain('Doctores cargados');
      expect(component.error).toBe('');
    });

    it('debería manejar error al consultar doctores', () => {
      mockAdminService.consultarDoctoresDesdeAdmin.and.returnValue(throwError(() => new Error('Error de servidor')));

      component.consultarDoctores();

      expect(component.doctores).toEqual([]);
      expect(component.error).toContain('Error al cargar doctores');
      expect(component.mensaje).toBe('');
    });
  });

  describe('ModuloDoctorComponent - ELIMINAR DOCTOR', () => {
    let component: ModuloDoctorComponent;
    let fixture: ComponentFixture<ModuloDoctorComponent>;
    let mockAdminService: jasmine.SpyObj<AdminService>;

    beforeEach(async () => {
      mockAdminService = jasmine.createSpyObj('AdminService', ['borrarDoctor']);

      await TestBed.configureTestingModule({
        imports: [ModuloDoctorComponent, FormsModule, CommonModule],
        providers: [
          { provide: AdminService, useValue: mockAdminService }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ModuloDoctorComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('debería eliminar doctor exitosamente', () => {
      component.idEliminarDoctor = 5;

      mockAdminService.borrarDoctor.and.returnValue(of({}));

      component.eliminarDoctor();

      expect(mockAdminService.borrarDoctor).toHaveBeenCalledWith(5);
      expect(component.mensaje).toContain('borrado correctamente');
      expect(component.error).toBe('');
      expect(component.idEliminarDoctor).toBeNull();
    });

    it('debería manejar error al eliminar doctor', () => {
      component.idEliminarDoctor = 99;

      mockAdminService.borrarDoctor.and.returnValue(throwError(() => new Error('Error al borrar')));

      component.eliminarDoctor();

      expect(mockAdminService.borrarDoctor).toHaveBeenCalledWith(99);
      expect(component.error).toContain('No se pudo borrar');
      expect(component.mensaje).toBe('');
    });
  });

  describe('ModuloDoctorComponent - RESTAURAR DOCTOR', () => {
    let component: ModuloDoctorComponent;
    let fixture: ComponentFixture<ModuloDoctorComponent>;
    let mockAdminService: jasmine.SpyObj<AdminService>;

    beforeEach(async () => {
      mockAdminService = jasmine.createSpyObj('AdminService', ['restaurarDoctor']);

      await TestBed.configureTestingModule({
        imports: [ModuloDoctorComponent, FormsModule, CommonModule],
        providers: [
          { provide: AdminService, useValue: mockAdminService }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ModuloDoctorComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('debería restaurar doctor exitosamente', () => {
      component.idRestaurarDoctor = 7;

      mockAdminService.restaurarDoctor.and.returnValue(of({}));

      component.restaurarDoctor();

      expect(mockAdminService.restaurarDoctor).toHaveBeenCalledWith(7);
      expect(component.mensaje).toContain('restaurado correctamente');
      expect(component.error).toBe('');
      expect(component.idRestaurarDoctor).toBeNull();
    });

    it('debería manejar error al restaurar doctor', () => {
      component.idRestaurarDoctor = 100;

      mockAdminService.restaurarDoctor.and.returnValue(throwError(() => new Error('Error restaurando doctor')));

      component.restaurarDoctor();

      expect(mockAdminService.restaurarDoctor).toHaveBeenCalledWith(100);
      expect(component.error).toContain('No se pudo restaurar');
      expect(component.mensaje).toBe('');
    });
  });

  describe('ModuloDoctorComponent - ACTUALIZAR DOCTOR', () => {
    let component: ModuloDoctorComponent;
    let fixture: ComponentFixture<ModuloDoctorComponent>;
    let mockAdminService: jasmine.SpyObj<AdminService>;

    beforeEach(async () => {
      mockAdminService = jasmine.createSpyObj('AdminService', ['actualizarDoctorCompleto']);

      await TestBed.configureTestingModule({
        imports: [ModuloDoctorComponent, FormsModule, CommonModule],
        providers: [{ provide: AdminService, useValue: mockAdminService }]
      }).compileComponents();

      fixture = TestBed.createComponent(ModuloDoctorComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('debería actualizar doctor correctamente', () => {
      const doctor = {
        iddoctor: 5,
        colegiado: 'C-456',
        nombrecompleto: 'Dr. Carlos Pérez',
        especialidad: 'Ginecología',
        direccion: 'Zona 9',
        centrohospitalario: 'Hospital Central',
        edad: 42,
        observacion: 'Sin observaciones'
      };

      component.doctorActualizar = { ...doctor };

      mockAdminService.actualizarDoctorCompleto.and.returnValue(of({}));

      component.actualizarDoctor();

      expect(mockAdminService.actualizarDoctorCompleto)
        .toHaveBeenCalledWith(5, doctor);
      expect(component.mensaje).toContain('actualizado correctamente');
      expect(component.error).toBe('');
    });

    it('debería manejar error al actualizar doctor', () => {
      const doctor = {
        iddoctor: 6,
        colegiado: 'C-789',
        nombrecompleto: 'Dra. María López',
        especialidad: 'Dermatología',
        direccion: 'Zona 10',
        centrohospitalario: 'Hospital San Juan',
        edad: 39,
        observacion: 'Atención pediátrica'
      };

      component.doctorActualizar = { ...doctor };

      mockAdminService.actualizarDoctorCompleto.and.returnValue(
        throwError(() => new Error('Error de servidor'))
      );

      component.actualizarDoctor();

      expect(mockAdminService.actualizarDoctorCompleto)
        .toHaveBeenCalledWith(6, doctor);
      expect(component.error).toContain('Error al actualizar doctor');
      expect(component.mensaje).toBe('');
    });
  });

  describe('ModuloDoctorComponent - MENÚ ACTUALIZAR DOCTOR (campos individuales)', () => {
    let component: ModuloDoctorComponent;
    let fixture: ComponentFixture<ModuloDoctorComponent>;
    let mockAdminService: jasmine.SpyObj<AdminService>;

    beforeEach(async () => {
      mockAdminService = jasmine.createSpyObj('AdminService', [
        'actualizarNombreDoctor',
        'actualizarColegiadoDoctor',
        'actualizarEspecialidadDoctor',
        'actualizarDireccionDoctor',
        'actualizarCentroHospitalarioDoctor',
        'actualizarEdadDoctor',
        'actualizarObservacionDoctor'
      ]);

      await TestBed.configureTestingModule({
        imports: [ModuloDoctorComponent, FormsModule, CommonModule],
        providers: [{ provide: AdminService, useValue: mockAdminService }]
      }).compileComponents();

      fixture = TestBed.createComponent(ModuloDoctorComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('debería actualizar nombre del doctor', () => {
      component.doctorActualizar.iddoctor = 1;
      component.doctorActualizar.nombrecompleto = 'Dr. Nombre Actualizado';

      mockAdminService.actualizarNombreDoctor.and.returnValue(of({}));

      component.actualizarNombreDoctor();

      expect(mockAdminService.actualizarNombreDoctor)
        .toHaveBeenCalledWith(1, 'Dr. Nombre Actualizado');
      expect(component.mensaje).toContain('Nombre actualizado');
      expect(component.error).toBe('');
    });

    it('debería actualizar colegiado del doctor', () => {
      component.doctorActualizar.iddoctor = 2;
      component.doctorActualizar.colegiado = 'C-999';

      mockAdminService.actualizarColegiadoDoctor.and.returnValue(of({}));

      component.actualizarColegiadoDoctor();

      expect(mockAdminService.actualizarColegiadoDoctor)
        .toHaveBeenCalledWith(2, 'C-999');
      expect(component.mensaje).toContain('Colegiado actualizado');
      expect(component.error).toBe('');
    });

    it('debería actualizar especialidad del doctor', () => {
      component.doctorActualizar.iddoctor = 3;
      component.doctorActualizar.especialidad = 'Cardiología';

      mockAdminService.actualizarEspecialidadDoctor.and.returnValue(of({}));

      component.actualizarEspecialidadDoctor();

      expect(mockAdminService.actualizarEspecialidadDoctor)
        .toHaveBeenCalledWith(3, 'Cardiología');
    });

    it('debería actualizar dirección del doctor', () => {
      component.doctorActualizar.iddoctor = 4;
      component.doctorActualizar.direccion = 'Zona 12';

      mockAdminService.actualizarDireccionDoctor.and.returnValue(of({}));

      component.actualizarDireccionDoctor();

      expect(mockAdminService.actualizarDireccionDoctor)
        .toHaveBeenCalledWith(4, 'Zona 12');
    });

    it('debería actualizar centro hospitalario del doctor', () => {
      component.doctorActualizar.iddoctor = 5;
      component.doctorActualizar.centrohospitalario = 'Nuevo Centro Médico';

      mockAdminService.actualizarCentroHospitalarioDoctor.and.returnValue(of({}));

      component.actualizarCentroDoctor();

      expect(mockAdminService.actualizarCentroHospitalarioDoctor)
        .toHaveBeenCalledWith(5, 'Nuevo Centro Médico');
    });

    it('debería actualizar edad del doctor', () => {
      component.doctorActualizar.iddoctor = 6;
      component.doctorActualizar.edad = 50;

      mockAdminService.actualizarEdadDoctor.and.returnValue(of({}));

      component.actualizarEdadDoctor();

      expect(mockAdminService.actualizarEdadDoctor)
        .toHaveBeenCalledWith(6, 50);
    });

    it('debería actualizar observación del doctor', () => {
      component.doctorActualizar.iddoctor = 7;
      component.doctorActualizar.observacion = 'Actualización de prueba';

      mockAdminService.actualizarObservacionDoctor.and.returnValue(of({}));

      component.actualizarObservacionDoctor();

      expect(mockAdminService.actualizarObservacionDoctor)
        .toHaveBeenCalledWith(7, 'Actualización de prueba');
    });
  });


});
