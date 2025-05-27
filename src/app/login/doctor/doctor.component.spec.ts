import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { DoctorService } from '../../services/doctor.service';
import { DoctorComponent } from './doctor.component';

describe('DoctorComponent - Citas por Estado', () => {
  let component: DoctorComponent;
  let fixture: ComponentFixture<DoctorComponent>;
  let doctorServiceSpy: jasmine.SpyObj<DoctorService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('DoctorService', ['consultarCitasPorEstado']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [DoctorComponent, HttpClientTestingModule, FormsModule],
      providers: [{ provide: DoctorService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorComponent);
    component = fixture.componentInstance;
    doctorServiceSpy = TestBed.inject(DoctorService) as jasmine.SpyObj<DoctorService>;
    fixture.detectChanges();
  });

  it('debería consultar citas por estado y cerrar el modal', fakeAsync(() => {
    const mockCitas = [
      {
        idcita: 1,
        estado: 'PROGRAMADA',
        nombrecompletoPaciente: 'Juan Pérez',
        motivoconsulta: 'Chequeo general'
      }
    ];

    component.estado = 'PROGRAMADA';
    doctorServiceSpy.consultarCitasPorEstado.and.returnValue(of(mockCitas));

    component.consultarCitasPorEstado();
    tick(); // espera asincrónica

    expect(doctorServiceSpy.consultarCitasPorEstado).toHaveBeenCalledWith('PROGRAMADA');
    expect(component.citas).toEqual(mockCitas);
    expect(component.modal['estado']).toBeFalse();

  }));

  it('debería consultar citas por paciente y estado y cerrar el modal', fakeAsync(() => {
    const mockCitas = [
      {
        idcita: 2,
        estado: 'REALIZADA',
        nombrecompletoPaciente: 'Luis Gómez',
        motivoconsulta: 'Chequeo general'
      }
    ];

    component.idPaciente = 5;
    component.estado = 'REALIZADA';
    doctorServiceSpy.consultarCitasPorPacienteYEstado.and.returnValue(of(mockCitas));

    component.consultarCitasPorPacienteYEstado();
    tick(); // espera asincrónica

    expect(doctorServiceSpy.consultarCitasPorPacienteYEstado).toHaveBeenCalledWith(5, 'REALIZADA');
    expect(component.citas).toEqual(mockCitas);
    expect(component.modal['pacienteEstado']).toBeFalse();
  }));

  it('debería consultar citas por fecha y cerrar el modal', fakeAsync(() => {
    const mockCitas = [
      {
        idcita: 3,
        estado: 'PROGRAMADA',
        nombrecompletoPaciente: 'Ana Martínez',
        fechacita: '2025-05-15T10:00:00',
        motivoconsulta: 'Control anual'
      }
    ];

    component.fecha = '2025-05-15';
    doctorServiceSpy.consultarCitasPorFecha.and.returnValue(of(mockCitas));

    component.consultarCitasPorFecha();
    tick(); // espera asincrónica

    expect(doctorServiceSpy.consultarCitasPorFecha).toHaveBeenCalledWith('2025-05-15');
    expect(component.citas).toEqual(mockCitas);
    expect(component.modal['fecha']).toBeFalse();
  }));

  it('debería consultar citas de hoy por ID del doctor y cerrar el modal', fakeAsync(() => {
    const mockCitas = [
      {
        idcita: 7,
        estado: 'PROGRAMADA',
        nombrecompletoPaciente: 'Luis Gómez',
        fechacita: '2025-05-15T09:30:00',
        motivoconsulta: 'Dolor de cabeza'
      }
    ];

    component.idDoctor = 123;
    doctorServiceSpy.consultarCitasDeHoyPorIdDoctor.and.returnValue(of(mockCitas));

    component.consultarCitasDeHoyPorIdDoctor();
    tick(); // espera asincrónica

    expect(doctorServiceSpy.consultarCitasDeHoyPorIdDoctor).toHaveBeenCalledWith(123);
    expect(component.citas).toEqual(mockCitas);
    expect(component.modal['hoyId']).toBeFalse();
  }));

  it('debería consultar citas de hoy por colegiado y cerrar el modal', fakeAsync(() => {
    const mockCitas = [
      {
        idcita: 10,
        estado: 'PROGRAMADA',
        nombrecompletoPaciente: 'Ana López',
        colegiado: 'COL-456',
        fechacita: '2025-05-15T11:00:00',
        motivoconsulta: 'Control de presión'
      }
    ];

    component.colegiado = 'COL-456';
    doctorServiceSpy.consultarCitasDeHoyPorColegiado.and.returnValue(of(mockCitas));

    component.consultarCitasDeHoyPorColegiado();
    tick(); // espera asincrónica

    expect(doctorServiceSpy.consultarCitasDeHoyPorColegiado).toHaveBeenCalledWith('COL-456');
    expect(component.citas).toEqual(mockCitas);
    expect(component.modal['hoyColegiado']).toBeFalse();
  }));

  it('debería consultar historial por ID de doctor y cerrar el modal', fakeAsync(() => {
    const mockHistorial = [
      {
        idcita: 99,
        iddoctor: 7,
        nombrecompletoDoctor: 'Dr. Martínez',
        fechacita: '2025-04-01T10:00:00',
        fechaFin: '2025-04-01T10:30:00',
        estado: 'REALIZADA'
      }
    ];

    component.idDoctor = 7;
    component.fechaInicio = '2025-04-01';
    component.fechaFin = '2025-04-30';
    doctorServiceSpy.historialPorIdDoctor.and.returnValue(of(mockHistorial));

    component.consultarHistorialPorIdDoctor();
    tick(); // espera asincrónica

    expect(doctorServiceSpy.historialPorIdDoctor).toHaveBeenCalledWith(7, '2025-04-01', '2025-04-30');
    expect(component.citas).toEqual(mockHistorial);
    expect(component.modal['historialId']).toBeFalse();
  }));

  it('debería consultar historial por colegiado y cerrar el modal', fakeAsync(() => {
    const mockHistorial = [
      {
        idcita: 202,
        colegiado: 'D-4455',
        nombrecompletoDoctor: 'Dra. Pérez',
        fechacita: '2025-04-10T09:00:00',
        fechaFin: '2025-04-10T09:30:00',
        estado: 'REALIZADA'
      }
    ];

    component.colegiado = 'D-4455';
    component.fechaInicio = '2025-04-01';
    component.fechaFin = '2025-04-30';
    doctorServiceSpy.historialPorColegiado.and.returnValue(of(mockHistorial));

    component.consultarHistorialPorColegiado();
    tick(); // espera asincrónica

    expect(doctorServiceSpy.historialPorColegiado).toHaveBeenCalledWith('D-4455', '2025-04-01', '2025-04-30');
    expect(component.citas).toEqual(mockHistorial);
    expect(component.modal['historialColegiado']).toBeFalse();
  }));

  it('debería buscar citas por ID paciente y estados seleccionados', fakeAsync(() => {
    const mockCitasProgramadas = [
      {
        idcita: 101,
        estado: 'PROGRAMADA',
        nombrecompletoPaciente: 'Luis Gómez',
        nombrecompletoDoctor: 'Dra. Mariela Ruiz',
        colegiado: 'B-0012',
        fechacita: '2025-05-15T09:00:00',
      }
    ];
    const mockCitasRealizadas = [
      {
        idcita: 102,
        estado: 'REALIZADA',
        nombrecompletoPaciente: 'Luis Gómez',
        nombrecompletoDoctor: 'Dra. Mariela Ruiz',
        colegiado: 'B-0012',
        fechacita: '2025-05-12T08:30:00',
        fechaFin: '2025-05-12T09:00:00'
      }
    ];

    component.busquedaIdPaciente = '10';
    component.estadoProgramada = true;
    component.estadoRealizada = true;
    component.estadoCancelada = false;

    // Simula respuestas de servicio
    doctorServiceSpy.consultarCitasPorPacienteYEstado.withArgs(10, 'PROGRAMADA').and.returnValue(of(mockCitasProgramadas));
    doctorServiceSpy.consultarCitasPorPacienteYEstado.withArgs(10, 'REALIZADA').and.returnValue(of(mockCitasRealizadas));

    component.buscarCitasPorEstadosSeleccionados();
    tick();

    expect(doctorServiceSpy.consultarCitasPorPacienteYEstado).toHaveBeenCalledWith(10, 'PROGRAMADA');
    expect(doctorServiceSpy.consultarCitasPorPacienteYEstado).toHaveBeenCalledWith(10, 'REALIZADA');
    expect(component.resultadoCitas).toContain(mockCitasProgramadas[0]);
    expect(component.resultadoCitas).toContain(mockCitasRealizadas[0]);
  }));




});
