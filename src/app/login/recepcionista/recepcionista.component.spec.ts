import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { UsuarioService } from '../../services/usuario.service';
import { RecepcionistaComponent } from './recepcionista.component';


describe('RecepcionistaComponent', () => {
  let component: RecepcionistaComponent;
  let fixture: ComponentFixture<RecepcionistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecepcionistaComponent, FormsModule, HttpClientTestingModule],
      providers: [UsuarioService]
    }).compileComponents();

    fixture = TestBed.createComponent(RecepcionistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar error si faltan campos requeridos', () => {
    component.paciente = {
      nombrecompleto: '',
      edad: null,
      nit: null,
      cui: null,
      direccion: '',
      telefono: null
    };
    component.guardarPaciente();
    expect(component.error).toContain('completa los campos obligatorios');
  });

  it('debería guardar al paciente correctamente si los campos requeridos están completos', () => {
    const pacienteValido = {
      nombrecompleto: 'Juan Pérez',
      edad: 35,
      nit: 1234567890123,
      cui: 9876543210123,
      direccion: 'Zona 1',
      telefono: 41234567
    } as any; // 👈 fuerza que TypeScript no verifique tipos exactos

    const servicioSpy = spyOn(TestBed.inject(UsuarioService), 'guardarPacienteRecepcionista')
      .and.returnValue(of(null)); // simula éxito

    component.paciente = pacienteValido;
    component.guardarPaciente();

    expect(servicioSpy).toHaveBeenCalledWith(pacienteValido);
    expect(component.mensaje).toContain('Paciente guardado correctamente');
    expect(component.error).toBe('');
  });

  it('debería crear una cita correctamente cuando los datos son válidos', () => {
    const citaValida = {
      idpaciente: 1,
      nombrecompleto_paciente: 'Juan Pérez',
      nit: 1234567890123,
      iddoctor: 2,
      nombrecompleto_doctor: 'Dra. López',
      colegiado: 'COL-1234',
      motivoconsulta: 'Dolor de cabeza',
      fechacita: '2025-05-14T10:00',
      correo: 'juan@example.com'
    } as any;

    const servicioSpy = spyOn(TestBed.inject(UsuarioService), 'crearCitaRecepcionista')
      .and.returnValue(of(null)); // Simulamos éxito

    component.cita = citaValida;
    component.crearCita();

    expect(servicioSpy).toHaveBeenCalledWith(citaValida);
    expect(component.cita.nombrecompleto_paciente).toBe(''); // Verifica que se limpió el campo
  });



  it('debería consultar pacientes correctamente y llenar la lista', () => {
    const pacientesMock = [
      {
        idpaciente: 1,
        nombrecompleto: 'Ana Martínez',
        edad: 30,
        nit: 1234567890123,
        cui: 9876543210123,
        direccion: 'Zona 1',
        telefono: 55556666,
        fecha: '2025-05-13',
        estado: 'ACTIVO'
      },
      {
        idpaciente: 2,
        nombrecompleto: 'Carlos Pérez',
        edad: 45,
        nit: 1234567890999,
        cui: 9876543210999,
        direccion: 'Zona 5',
        telefono: 55443322,
        fecha: '2025-05-12',
        estado: 'ACTIVO'
      }
    ];

    const servicioSpy = spyOn(TestBed.inject(UsuarioService), 'consultarPacientes')
      .and.returnValue(of(pacientesMock)); // Simulamos éxito

    component.consultarPacientes();

    expect(servicioSpy).toHaveBeenCalled();
    expect(component.pacientes.length).toBe(2);
    expect(component.pacientes[0].nombrecompleto).toBe('Ana Martínez');
  });


  it('debería cargar correctamente la lista de doctores con verDoctores()', () => {
    const doctoresMock = [
      {
        iddoctor: 1,
        nombrecompleto: 'Dr. Juan Pérez',
        colegiado: 'A12345',
        especialidad: 'Cardiología',
        fecharegistro: '2025-05-13',
        direccion: 'Zona 10',
        centrohospitalario: 'Hospital La Paz',
        edad: 45,
        observacion: '',
        estado: 'ACTIVO'
      },
      {
        iddoctor: 2,
        nombrecompleto: 'Dra. María López',
        colegiado: 'B67890',
        especialidad: 'Pediatría',
        fecharegistro: '2025-05-10',
        direccion: 'Zona 1',
        centrohospitalario: 'Hospital Infantil',
        edad: 38,
        observacion: 'Vacaciones en junio',
        estado: 'ACTIVO'
      }
    ];

    const service = TestBed.inject(UsuarioService);
    spyOn(service, 'obtenerDoctores').and.returnValue(of(doctoresMock));

    component.verDoctores();

    expect(service.obtenerDoctores).toHaveBeenCalled();
    expect(component.doctores.length).toBe(2);
    expect(component.doctores[0].nombrecompleto).toBe('Dr. Juan Pérez');
  });

  it('debería consultar y cargar citas PROGRAMADAS correctamente', fakeAsync(() => {
    const citasMock = [
      {
        idcita: 1,
        idpaciente: 101,
        nombrecompletoPaciente: 'Carlos Pérez',
        nit: 1234567,
        iddoctor: 201,
        nombrecompletoDoctor: 'Dr. Martínez',
        colegiado: 'MED123',
        fechacita: '2025-05-14T10:00:00',
        motivoconsulta: 'Control general',
        estado: 'PROGRAMADA',
        costo: null,
        fechaFin: null,
        motivocancelacion: null
      }
    ];

    const service = TestBed.inject(UsuarioService);
    spyOn(service, 'consultarCitasPorEstado').and.returnValue(of(citasMock));

    component.consultarCitasPorEstado('programadas');
    tick();

    expect(service.consultarCitasPorEstado).toHaveBeenCalledWith('programadas');
    expect(component.citas.length).toBe(1);
    expect(component.citas[0].estado).toBe('PROGRAMADA');
  }));

  it('debería consultar y cargar citas REALIZADAS correctamente', fakeAsync(() => {
    const citasMock = [
      {
        idcita: 2,
        idpaciente: 102,
        nombrecompletoPaciente: 'Ana López',
        nit: 7654321,
        iddoctor: 202,
        nombrecompletoDoctor: 'Dra. Ramírez',
        colegiado: 'MED789',
        fechacita: '2025-05-13T15:00:00',
        motivoconsulta: 'Dolor de cabeza',
        estado: 'REALIZADA',
        costo: 350,
        fechaFin: '2025-05-13T16:00:00',
        motivocancelacion: null
      }
    ];

    const service = TestBed.inject(UsuarioService);
    spyOn(service, 'consultarCitasPorEstado').and.returnValue(of(citasMock));

    component.consultarCitasPorEstado('realizadas');
    tick();

    expect(service.consultarCitasPorEstado).toHaveBeenCalledWith('realizadas');
    expect(component.citas[0].estado).toBe('REALIZADA');
  }));

  it('debería consultar y cargar citas CANCELADAS correctamente', fakeAsync(() => {
    const citasMock = [
      {
        idcita: 3,
        idpaciente: 103,
        nombrecompletoPaciente: 'Luis Gómez',
        nit: 1112223,
        iddoctor: 203,
        nombrecompletoDoctor: 'Dr. Salazar',
        colegiado: 'MED456',
        fechacita: '2025-05-15T09:00:00',
        motivoconsulta: 'Chequeo de rutina',
        estado: 'CANCELADA',
        costo: null,
        fechaFin: '2025-05-15T09:30:00',
        motivocancelacion: 'Paciente no asistió'
      }
    ];

    const service = TestBed.inject(UsuarioService);
    spyOn(service, 'consultarCitasPorEstado').and.returnValue(of(citasMock));

    component.consultarCitasPorEstado('canceladas');
    tick();

    expect(service.consultarCitasPorEstado).toHaveBeenCalledWith('canceladas');
    expect(component.citas[0].estado).toBe('CANCELADA');
  }));

  it('debería marcar una cita como REALIZADA correctamente', fakeAsync(() => {
    // Arrange
    const citaId = 27;
    const datos = {
      costo: 200,
      fechaFin: '2025-05-13T16:00',
      motivoconsulta: '',
      correo: '',
      idpaciente: 0,
      iddoctor: 0
    };

    component.formRealizada = {
      id: citaId,
      costo: datos.costo,
      fechaFin: datos.fechaFin
    };

    const service = TestBed.inject(UsuarioService);
    const consultarSpy = spyOn(component, 'consultarCitasPorEstado').and.callFake(() => { });
    const marcarSpy = spyOn(service, 'marcarComoRealizada').and.returnValue(of({}));

    // Act
    component.confirmarRealizada();
    tick();

    // Assert
    expect(marcarSpy).toHaveBeenCalledWith(citaId, datos);
    expect(component.modal.realizada).toBeFalse();
    expect(consultarSpy).toHaveBeenCalledWith('programadas');
  }));

  it('debería mostrar error si falla al marcar como REALIZADA', fakeAsync(() => {
    const citaId = 30;
    const datos = {
      costo: 150,
      fechaFin: '2025-05-13T17:00',
      motivoconsulta: '',
      correo: '',
      idpaciente: 0,
      iddoctor: 0
    };

    component.formRealizada = {
      id: citaId,
      costo: datos.costo,
      fechaFin: datos.fechaFin
    };

    const service = TestBed.inject(UsuarioService);
    spyOn(service, 'marcarComoRealizada').and.returnValue(throwError(() => new Error('Error al actualizar')));

    spyOn(window, 'alert'); // Espía para evitar mostrar alert real

    component.confirmarRealizada();
    tick();

    expect(window.alert).toHaveBeenCalledWith('❌ Error al actualizar estado a REALIZADA');
  }));


  it('debería mostrar error si falla al marcar como CANCELADA', fakeAsync(() => {
    const citaId = 33;
    const datos = {
      fechaFin: '2025-05-13T17:00',
      motivocancelacion: 'El paciente no se presentó'
    };

    // Simular formulario lleno
    component.formCancelada = {
      id: citaId,
      fechaFin: datos.fechaFin,
      motivocancelacion: datos.motivocancelacion
    };

    // Espiar servicio y simular error
    const service = TestBed.inject(UsuarioService);
    spyOn(service, 'marcarComoCancelada').and.returnValue(throwError(() => new Error('Error al cancelar')));

    spyOn(window, 'alert'); // Evitar alert real

    component.confirmarCancelada();
    tick();

    expect(window.alert).toHaveBeenCalledWith('❌ Error al actualizar estado a CANCELADA');
  }));

  it('debería buscar citas por ID de paciente y múltiples estados', fakeAsync(() => {
    const citasProgramadas = [
      { idcita: 1, estado: 'PROGRAMADA' },
      { idcita: 2, estado: 'PROGRAMADA' }
    ];
    const citasRealizadas = [
      { idcita: 3, estado: 'REALIZADA' }
    ];

    component.busquedaIdPaciente = '15';
    component.estadoProgramada = true;
    component.estadoRealizada = true;
    component.estadoCancelada = false;

    const service = TestBed.inject(UsuarioService);
    spyOn(service, 'buscarCitasPorPacienteYEstado').and.callFake((id, estado) => {
      if (estado === 'PROGRAMADA') return of(citasProgramadas);
      if (estado === 'REALIZADA') return of(citasRealizadas);
      return of([]);
    });

    component.buscarCitasPorEstadosSeleccionados();
    tick();

    expect(component.resultadoCitas.length).toBe(3);
    expect(component.resultadoCitas).toContain(jasmine.objectContaining({ estado: 'PROGRAMADA' }));
    expect(component.resultadoCitas).toContain(jasmine.objectContaining({ estado: 'REALIZADA' }));
  }));



});
