import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import { ModuloCitasComponent } from './modulo.citas.component';

describe('ModuloCitasComponent - Crear Cita', () => {
  let component: ModuloCitasComponent;
  let fixture: ComponentFixture<ModuloCitasComponent>;
  let mockAdminService: jasmine.SpyObj<AdminService>;

  beforeEach(async () => {
    mockAdminService = jasmine.createSpyObj('AdminService', ['crearCitaDesdeAdmin']);

    await TestBed.configureTestingModule({
      imports: [ModuloCitasComponent, FormsModule, CommonModule],
      providers: [
        { provide: AdminService, useValue: mockAdminService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModuloCitasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería abrir el modal de crear cita', () => {
    component.abrirModal('crear');
    expect(component.vista).toBe('crear');
    expect(component.modalActivo).toBeTrue();
  });

  it('no debería crear cita si faltan campos obligatorios', () => {
    component.nuevaCita = {
      idpaciente: null,
      nombrecompleto_paciente: '',
      nit: '',
      iddoctor: null,
      nombrecompleto_doctor: '',
      colegiado: '',
      fechacita: '',
      motivoconsulta: '',
      correo: ''
    };
    component.crearCita();
    expect(component.error).toContain('obligatorios');
  });

  it('debería crear cita exitosamente si todos los campos están completos', () => {
    component.nuevaCita = {
      idpaciente: 1,
      nombrecompleto_paciente: 'Juan Pérez',
      nit: '1234567',
      iddoctor: 2,
      nombrecompleto_doctor: 'Dra. López',
      colegiado: 'A1234',
      fechacita: '2025-06-01T10:00',
      motivoconsulta: 'Chequeo general',
      correo: 'juan@email.com'
    } as any;

    mockAdminService.crearCitaDesdeAdmin.and.returnValue(of({}));

    component.crearCita();

    expect(mockAdminService.crearCitaDesdeAdmin).toHaveBeenCalled();
    expect(component.mensaje).toContain('exitosamente');
    expect(component.error).toBe('');
  });

  it('debería manejar error al crear cita', () => {
    component.nuevaCita = {
      idpaciente: 1,
      nombrecompleto_paciente: 'Juan Pérez',
      nit: '1234567',
      iddoctor: 2,
      nombrecompleto_doctor: 'Dra. López',
      colegiado: 'A1234',
      fechacita: '2025-06-01T10:00',
      motivoconsulta: 'Chequeo general',
      correo: 'juan@email.com'
    } as any;

    mockAdminService.crearCitaDesdeAdmin.and.returnValue(throwError(() => new Error('Error de red')));

    component.crearCita();

    expect(component.error).toContain('error al crear');
    expect(component.mensaje).toBe('');
  });

  it('debería abrir el modal de consultar citas', () => {
    component.abrirModal('consultar');
    expect(component.vista).toBe('consultar');
    expect(component.modalActivo).toBeTrue();
  });

  it('debería buscar cita por ID correctamente', () => {
    const mockCita = { idcita: 1 };
    component.filtroIdCita = 1;
    mockAdminService.obtenerCitaPorId = jasmine.createSpy().and.returnValue(of(mockCita));

    component.buscarCitaPorId();

    expect(mockAdminService.obtenerCitaPorId).toHaveBeenCalledWith(1);
    expect(component.citasMostradas).toContain(mockCita);
    expect(component.error).toBe('');
  });

  it('debería manejar error al buscar cita por ID', () => {
    component.filtroIdCita = 999;
    mockAdminService.obtenerCitaPorId = jasmine.createSpy().and.returnValue(throwError(() => new Error()));

    component.buscarCitaPorId();

    expect(component.error).toContain('No se encontró');
  });

  it('debería buscar citas por fecha correctamente', () => {
    const mockCitas = [{ idcita: 1 }, { idcita: 2 }];
    component.filtroFecha = '2025-06-01';
    mockAdminService.obtenerCitasPorFecha = jasmine.createSpy().and.returnValue(of(mockCitas));

    component.buscarCitasPorFecha();

    expect(mockAdminService.obtenerCitasPorFecha).toHaveBeenCalledWith('2025-06-01');
    expect(component.citasMostradas.length).toBe(2);
  });

  it('debería manejar error al buscar por fecha inválida', () => {
    component.filtroFecha = '2025-06-02';
    mockAdminService.obtenerCitasPorFecha = jasmine.createSpy().and.returnValue(throwError(() => new Error()));

    component.buscarCitasPorFecha();

    expect(component.error).toContain('No se encontraron citas');
  });

  it('debería consultar citas programadas', () => {
    const mockData = [{ estado: 'PROGRAMADA' }];
    mockAdminService.consultarCitasProgramadas = jasmine.createSpy().and.returnValue(of(mockData));

    component.consultarCitasProgramadas();

    expect(component.citasMostradas).toEqual(mockData);
    expect(component.mensaje).toContain('programadas');
  });

  it('debería consultar citas realizadas', () => {
    const mockData = [{ estado: 'REALIZADA' }];
    mockAdminService.consultarCitasRealizadas = jasmine.createSpy().and.returnValue(of(mockData));

    component.consultarCitasRealizadas();

    expect(component.citasMostradas).toEqual(mockData);
    expect(component.mensaje).toContain('realizadas');
  });

  it('debería consultar citas canceladas', () => {
    const mockData = [{ estado: 'CANCELADA' }];
    mockAdminService.consultarCitasCanceladas = jasmine.createSpy().and.returnValue(of(mockData));

    component.consultarCitasCanceladas();

    expect(component.citasMostradas).toEqual(mockData);
    expect(component.mensaje).toContain('canceladas');
  });

  it('debería abrir el modal de marcar como realizada', () => {
    component.abrirModal('realizada');
    expect(component.vista).toBe('realizada');
    expect(component.modalActivo).toBeTrue();
  });

  it('no debería marcar como realizada si faltan campos obligatorios', () => {
    component.citaCambioEstado = {
      idcita: null,
      costo: null,
      fecha_fin: '',
      motivocancelacion: ''
    } as any;

    component.marcarComoRealizada();

    expect(component.error).toContain('obligatorios');
    expect(component.mensaje).toBe('');
  });

  it('debería marcar la cita como realizada exitosamente', () => {
    component.citaCambioEstado = {
      idcita: 10,
      costo: 250,
      fecha_fin: '2025-06-01',
      motivocancelacion: ''
    } as any;

    mockAdminService.finalizarCita = jasmine.createSpy().and.returnValue(of({}));

    component.marcarComoRealizada();

    expect(mockAdminService.finalizarCita).toHaveBeenCalledWith(10, {
      costo: 250,
      fecha_fin: '2025-06-01'
    });

    expect(component.mensaje).toContain('realizada exitosamente');
    expect(component.error).toBe('');
  });

  it('debería manejar error al marcar cita como realizada', () => {
    component.citaCambioEstado = {
      idcita: 10,
      costo: 250,
      fecha_fin: '2025-06-01',
      motivocancelacion: ''
    } as any;

    mockAdminService.finalizarCita = jasmine.createSpy().and.returnValue(throwError(() => new Error('Error')));

    component.marcarComoRealizada();

    expect(component.error).toContain('Error al marcar la cita como realizada');
    expect(component.mensaje).toBe('');
  });

  it('debería abrir el modal de marcar como cancelada', () => {
    component.abrirModal('cancelada');
    expect(component.vista).toBe('cancelada');
    expect(component.modalActivo).toBeTrue();
  });

  it('no debería cancelar cita si faltan campos obligatorios', () => {
    component.citaCambioEstado = {
      idcita: null,
      costo: null,
      fecha_fin: '',
      motivocancelacion: ''
    } as any;

    component.marcarComoCancelada();

    expect(component.error).toContain('Debes ingresar el ID de la cita');
    expect(component.mensaje).toBe('');
  });

  it('debería cancelar la cita exitosamente', () => {
    component.citaCambioEstado = {
      idcita: 12,
      costo: null,
      fecha_fin: '2025-06-02',
      motivocancelacion: 'Paciente no asistió'
    } as any;

    mockAdminService.cancelarCita = jasmine.createSpy().and.returnValue(of({}));

    component.marcarComoCancelada();

    expect(mockAdminService.cancelarCita).toHaveBeenCalledWith(12, {
      fecha_fin: '2025-06-02',
      motivocancelacion: 'Paciente no asistió'
    });

    expect(component.mensaje).toContain('Cita cancelada correctamente');
    expect(component.error).toBe('');
  });

  it('debería manejar error al cancelar cita', () => {
    component.citaCambioEstado = {
      idcita: 12,
      costo: null,
      fecha_fin: '2025-06-02',
      motivocancelacion: 'Paciente no asistió'
    } as any;

    mockAdminService.cancelarCita = jasmine.createSpy().and.returnValue(throwError(() => new Error('Error cancelación')));

    component.marcarComoCancelada();

    expect(component.error).toContain('Error al cancelar la cita');
    expect(component.mensaje).toBe('');
  });

  it('debería abrir el modal de historial clínico', () => {
    component.abrirModal('filtros');
    expect(component.vista).toBe('filtros');
    expect(component.modalActivo).toBeTrue();
  });

  it('debería buscar citas por ID de paciente correctamente', () => {
    const mockCitas = [{ idcita: 1 }];
    component.filtroIdPaciente = 100;

    mockAdminService.obtenerCitasPorIdPaciente = jasmine.createSpy().and.returnValue(of(mockCitas));

    component.buscarCitasPorIdPaciente(100);

    expect(mockAdminService.obtenerCitasPorIdPaciente).toHaveBeenCalledWith(100);
    expect(component.citasMostradas).toEqual(mockCitas);
    expect(component.mensaje).toContain('ID de paciente');
  });

  it('debería manejar error al buscar por ID de paciente', () => {
    component.filtroIdPaciente = 999;

    mockAdminService.obtenerCitasPorIdPaciente = jasmine.createSpy().and.returnValue(throwError(() => new Error()));

    component.buscarCitasPorIdPaciente(999);

    expect(component.error).toContain('ID de paciente');
  });

  it('debería buscar citas por ID de doctor correctamente', () => {
    const mockCitas = [{ idcita: 2 }];
    component.filtroIdDoctor = 200;

    mockAdminService.obtenerCitasPorIdDoctor = jasmine.createSpy().and.returnValue(of(mockCitas));

    component.buscarCitasPorIdDoctor(200);

    expect(mockAdminService.obtenerCitasPorIdDoctor).toHaveBeenCalledWith(200);
    expect(component.citasMostradas).toEqual(mockCitas);
    expect(component.mensaje).toContain('ID de doctor');
  });

  it('debería manejar error al buscar por ID de doctor', () => {
    component.filtroIdDoctor = 999;

    mockAdminService.obtenerCitasPorIdDoctor = jasmine.createSpy().and.returnValue(throwError(() => new Error()));

    component.buscarCitasPorIdDoctor(999);

    expect(component.error).toContain('ID de doctor');
  });

  it('debería buscar citas por colegiado correctamente', () => {
    const mockCitas = [{ idcita: 3 }];
    component.filtroColegiado = 'A123';

    mockAdminService.obtenerCitasPorColegiado = jasmine.createSpy().and.returnValue(of(mockCitas));

    component.buscarCitasPorColegiado('A123');

    expect(mockAdminService.obtenerCitasPorColegiado).toHaveBeenCalledWith('A123');
    expect(component.citasMostradas).toEqual(mockCitas);
    expect(component.mensaje).toContain('colegiado');
  });

  it('debería manejar error al buscar por colegiado', () => {
    component.filtroColegiado = 'ZZ999';

    mockAdminService.obtenerCitasPorColegiado = jasmine.createSpy().and.returnValue(throwError(() => new Error()));

    component.buscarCitasPorColegiado('ZZ999');

    expect(component.error).toContain('colegiado');
  });

  it('debería buscar citas por NIT correctamente', () => {
    const mockCitas = [{ idcita: 4 }];
    component.filtroNit = 12345678;

    mockAdminService.obtenerCitasPorNit = jasmine.createSpy().and.returnValue(of(mockCitas));

    component.buscarCitasPorNit(12345678);

    expect(mockAdminService.obtenerCitasPorNit).toHaveBeenCalledWith(12345678);
    expect(component.citasMostradas).toEqual(mockCitas);
    expect(component.mensaje).toContain('NIT');
  });

  it('debería manejar error al buscar por NIT', () => {
    component.filtroNit = 99999999;

    mockAdminService.obtenerCitasPorNit = jasmine.createSpy().and.returnValue(throwError(() => new Error()));

    component.buscarCitasPorNit(99999999);

    expect(component.error).toContain('NIT');
  });

  it('debería abrir el modal de menú actualizar', () => {
    component.abrirModal('actualizar');
    expect(component.vista).toBe('actualizar');
    expect(component.modalActivo).toBeTrue();
  });

  it('debería cargar datos de cita para actualizar', () => {
    const mockCita = {
      idcita: 1,
      iddoctor: 2,
      colegiado: 'C123',
      idpaciente: 3,
      nit: '4567890',
      motivoconsulta: 'Dolor de cabeza',
      fechacita: '2025-06-15T09:00',
      nombrecompletoPaciente: 'Pedro López',
      nombrecompletoDoctor: 'Dra. Ana'
    };

    (component.actualizacionCita as any).idcita = 1;
    mockAdminService.obtenerCitaPorId = jasmine.createSpy().and.returnValue(of(mockCita));

    component.cargarCitaParaActualizar();

    expect(mockAdminService.obtenerCitaPorId).toHaveBeenCalledWith(1);
    expect(component.actualizacionCita.nombrecompleto_paciente).toBe('Pedro López');
    expect(component.mensaje).toContain('actualización');
  });

  it('debería manejar error al cargar cita para actualizar', () => {
    (component.actualizacionCita as any).idcita = 999;
    mockAdminService.obtenerCitaPorId = jasmine.createSpy().and.returnValue(throwError(() => new Error()));

    component.cargarCitaParaActualizar();

    expect(component.error).toContain('No se pudo cargar');
  });

  it('debería actualizar doctor y colegiado correctamente', () => {
    component.actualizacionCita = { idcita: 1, iddoctor: 2, colegiado: 'Z900', idpaciente: null, nit: null, motivoconsulta: '', fechacita: '', nombrecompleto_paciente: '', nombrecompleto_doctor: '' }as any;

    mockAdminService.actualizarDoctorYColegiado = jasmine.createSpy().and.returnValue(of({}));

    component.actualizarDoctorYColegiado();

    expect(mockAdminService.actualizarDoctorYColegiado).toHaveBeenCalledWith(1, { iddoctor: 2, colegiado: 'Z900' });
    expect(component.mensaje).toContain('actualizados correctamente');
  });

  it('debería manejar error al actualizar doctor y colegiado', () => {
    component.actualizacionCita = { idcita: 1, iddoctor: 2, colegiado: 'Z900', idpaciente: null, nit: null, motivoconsulta: '', fechacita: '', nombrecompleto_paciente: '', nombrecompleto_doctor: '' }as any;

    mockAdminService.actualizarDoctorYColegiado = jasmine.createSpy().and.returnValue(throwError(() => new Error()));

    component.actualizarDoctorYColegiado();

    expect(component.error).toContain('Error al actualizar doctor');
  });

  it('debería actualizar paciente y NIT correctamente', () => {
    component.actualizacionCita = { idcita: 1, idpaciente: 5, nit: '88888', iddoctor: null, colegiado: '', motivoconsulta: '', fechacita: '', nombrecompleto_paciente: '', nombrecompleto_doctor: '' }as any;

    mockAdminService.actualizarPacienteYNit = jasmine.createSpy().and.returnValue(of({}));

    component.actualizarPacienteYNit();

    expect(mockAdminService.actualizarPacienteYNit).toHaveBeenCalledWith(1, { idpaciente: 5, nit: '88888' });
    expect(component.mensaje).toContain('actualizados correctamente');
  });

  it('debería actualizar motivo de consulta correctamente', () => {
    component.actualizacionCita = { idcita: 1, motivoconsulta: 'Dolor fuerte', iddoctor: null, colegiado: '', idpaciente: null, nit: null, fechacita: '', nombrecompleto_paciente: '', nombrecompleto_doctor: '' }as any;

    mockAdminService.actualizarMotivoConsulta = jasmine.createSpy().and.returnValue(of({}));

    component.actualizarMotivoConsulta();

    expect(mockAdminService.actualizarMotivoConsulta).toHaveBeenCalledWith(1, { motivoconsulta: 'Dolor fuerte' });
    expect(component.mensaje).toContain('actualizado');
  });

  it('debería actualizar fecha de cita correctamente', () => {
    component.actualizacionCita = { idcita: 1, fechacita: '2025-07-01T10:30', iddoctor: null, colegiado: '', idpaciente: null, nit: null, motivoconsulta: '', nombrecompleto_paciente: '', nombrecompleto_doctor: '' }as any;

    mockAdminService.actualizarFechaCita = jasmine.createSpy().and.returnValue(of({}));

    component.actualizarFechaCita();

    expect(mockAdminService.actualizarFechaCita).toHaveBeenCalledWith(1, { fechacita: '2025-07-01T10:30' });
    expect(component.mensaje).toContain('actualizada');
  });

  it('debería actualizar nombre de paciente correctamente', () => {
    component.actualizacionCita = { idcita: 1, nombrecompleto_paciente: 'Carlos Ruiz', iddoctor: null, colegiado: '', idpaciente: null, nit: null, motivoconsulta: '', fechacita: '', nombrecompleto_doctor: '' }as any;

    mockAdminService.actualizarNombrePacienteCita = jasmine.createSpy().and.returnValue(of({}));

    component.actualizarNombrePacienteCita();

    expect(mockAdminService.actualizarNombrePacienteCita).toHaveBeenCalledWith(1, { nombrecompletoPaciente: 'Carlos Ruiz' });
    expect(component.mensaje).toContain('paciente actualizado');
  });

  it('debería actualizar nombre de doctor correctamente', () => {
    component.actualizacionCita = { idcita: 1, nombrecompleto_doctor: 'Dr. Fernando', iddoctor: null, colegiado: '', idpaciente: null, nit: null, motivoconsulta: '', fechacita: '', nombrecompleto_paciente: '' }as any;

    mockAdminService.actualizarNombreDoctorCita = jasmine.createSpy().and.returnValue(of({}));

    component.actualizarNombreDoctorCita();

    expect(mockAdminService.actualizarNombreDoctorCita).toHaveBeenCalledWith(1, { nombrecompletoDoctor: 'Dr. Fernando' });
    expect(component.mensaje).toContain('doctor actualizado');
  });


});
