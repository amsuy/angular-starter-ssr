import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';


@Component({
  selector: 'app-modulo-citas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modulo.citas.component.html',
  styleUrls: ['./modulo.citas.component.css']
})
export class ModuloCitasComponent {
  vista: string = '';
  mensaje: string = '';
  error: string = '';
  modalActivo: boolean = false;

  abrirModal(opcion: string): void {
    this.vista = opcion;
    this.modalActivo = true;
    this.mensaje = '';
    this.error = '';
  }

  cerrarModal(): void {
    this.vista = '';
    this.modalActivo = false;
    this.mensaje = '';
    this.error = '';
  }

  constructor(private adminService: AdminService) { }

  nuevaCita = {
    nombrecompleto_paciente: '',
    nit: '',
    nombrecompleto_doctor: '',
    colegiado: '',
    fechacita: '',
    motivoconsulta: '',
    correo: ''
  };

  crearCita(): void {
    const { nombrecompleto_paciente, nit, nombrecompleto_doctor, colegiado, fechacita, motivoconsulta, correo } = this.nuevaCita;

    if (!nombrecompleto_paciente || !nit || !nombrecompleto_doctor || !colegiado || !fechacita || !motivoconsulta || !correo) {
      this.error = '❌ Todos los campos son obligatorios.';
      this.mensaje = '';
      return;
    }

    this.adminService.crearCitaDesdeAdmin(this.nuevaCita).subscribe({
      next: () => {
        this.mensaje = '✅ Cita creada exitosamente.';
        this.error = '';
        this.mostrarMensaje = true;
        this.limpiarCamposCita();
        setTimeout(() => {
          this.mostrarMensaje = false;
          this.mensaje = '';
        }, 4000);

      },
      error: () => {
        this.error = '❌ Ocurrió un error al crear la cita.';
        this.mensaje = '';

        setTimeout(() => {
          this.mostrarMensaje = false;
          this.error = '';
        }, 4000);
      }
    });
  }

  mostrarMensaje: boolean = false;


  limpiarCamposCita(): void {
    this.nuevaCita = {

      nombrecompleto_paciente: '',
      nit: '',

      nombrecompleto_doctor: '',
      colegiado: '',
      fechacita: '',
      motivoconsulta: '',
      correo: ''
    };
  }

  // Datos para finalizar o cancelar una cita
  citaCambioEstado = {
    idcita: null,
    costo: null,           // Solo se usa para marcar como realizada
    fecha_fin: '',
    motivocancelacion: ''
  };

  // ✅ Marcar cita como Realizada
  marcarComoRealizada(): void {
    const { idcita, costo, fecha_fin } = this.citaCambioEstado;

    if (!idcita || !costo || !fecha_fin) {
      this.error = '❌ Todos los campos son obligatorios para marcar como realizada.';
      this.mensaje = '';
      return;
    }

    this.adminService.finalizarCita(idcita, { costo, fecha_fin }).subscribe({
      next: () => {
        this.mensaje = '✅ Cita marcada como realizada exitosamente.';
        this.error = '';
        this.limpiarCamposCambioEstado();
      },
      error: () => {
        this.error = '❌ Error al marcar la cita como realizada.';
        this.mensaje = '';
      }
    });
  }

  // ✅ Marcar cita como Cancelada
  marcarComoCancelada(): void {
    const { idcita, fecha_fin, motivocancelacion } = this.citaCambioEstado;

    if (!idcita || !fecha_fin || !motivocancelacion) {
      this.error = '❌ Debes ingresar el ID de la cita, la fecha de cancelación y el motivo.';
      this.mensaje = '';
      return;
    }

    const citaDTO = {
      fecha_fin,
      motivocancelacion
    };

    this.adminService.cancelarCita(idcita, citaDTO).subscribe({
      next: () => {
        this.mensaje = '✅ Cita cancelada correctamente.';
        this.error = '';
        this.limpiarCamposCambioEstado();
      },
      error: () => {
        this.error = '❌ Error al cancelar la cita.';
        this.mensaje = '';
      }
    });
  }


  // 🔄 Limpiar campos usados para finalizar o cancelar
  limpiarCamposCambioEstado(): void {
    this.citaCambioEstado = {
      idcita: null,
      costo: null,
      fecha_fin: '',
      motivocancelacion: ''
    };
  }

  // ✅ Listas de citas por estado
  citasProgramadas: any[] = [];
  citasRealizadas: any[] = [];
  citasCanceladas: any[] = [];

  // ✅ Filtros
  filtroIdCita: number | null = null;
  filtroFecha: string = '';

  consultarCitasProgramadas(): void {
    this.adminService.consultarCitasProgramadas().subscribe({
      next: (data) => {
        this.citasMostradas = data;
        this.mensaje = '✅ Citas programadas cargadas.';
        this.error = '';
      },
      error: () => {
        this.error = '❌ Error al consultar citas programadas.';
        this.mensaje = '';
      }
    });
  }

  consultarCitasRealizadas(): void {
    this.adminService.consultarCitasRealizadas().subscribe({
      next: (data) => {
        this.citasMostradas = data;
        this.mensaje = '✅ Citas realizadas cargadas.';
        this.error = '';
      },
      error: () => {
        this.error = '❌ Error al consultar citas realizadas.';
        this.mensaje = '';
      }
    });
  }

  consultarCitasCanceladas(): void {
    this.adminService.consultarCitasCanceladas().subscribe({
      next: (data) => {
        this.citasMostradas = data;
        this.mensaje = '✅ Citas canceladas cargadas.';
        this.error = '';
      },
      error: () => {
        this.error = '❌ Error al consultar citas canceladas.';
        this.mensaje = '';
      }
    });
  }



  // Buscar por ID de cita
  buscarCitaPorId(): void {
    if (!this.filtroIdCita) {
      this.error = '❌ Debes ingresar un ID de cita.';
      this.mensaje = '';
      return;
    }

    this.adminService.obtenerCitaPorId(this.filtroIdCita).subscribe({
      next: (data) => {
        this.citasMostradas = [data]; // ✅ Mostrar en la tabla dinámica
        this.error = '';
        this.mensaje = '✅ Cita encontrada.';
      },
      error: () => {
        this.error = '❌ No se encontró una cita con ese ID.';
        this.mensaje = '';
      }
    });
  }

  // Buscar por fecha de registro
  buscarCitasPorFecha(): void {
    if (!this.filtroFecha) {
      this.error = '❌ Debes ingresar una fecha.';
      this.mensaje = '';
      return;
    }

    this.adminService.obtenerCitasPorFecha(this.filtroFecha).subscribe({
      next: (data) => {
        this.citasMostradas = data; // ✅ Mostrar en la tabla dinámica
        this.error = '';
        this.mensaje = '✅ Citas encontradas por fecha.';
      },
      error: () => {
        this.error = '❌ No se encontraron citas en esa fecha.';
        this.mensaje = '';
      }
    });
  }


  citasMostradas: any[] = []; // ← Aquí se mostrarán dinámicamente

  limpiarConsultaCitas(): void {
    this.filtroIdCita = null;
    this.filtroFecha = '';
    this.citasMostradas = [];
    this.mensaje = '';
    this.error = '';
  }

  buscarCitasPorIdPaciente(idPaciente: number): void {
    this.adminService.obtenerCitasPorIdPaciente(idPaciente).subscribe({
      next: (data) => {
        this.citasMostradas = data;
        this.mensaje = '✅ Citas encontradas por ID de paciente.';
        this.error = '';
      },
      error: () => {
        this.error = '❌ No se encontraron citas para ese ID de paciente.';
        this.mensaje = '';
      }
    });
  }

  buscarCitasPorIdDoctor(idDoctor: number): void {
    this.adminService.obtenerCitasPorIdDoctor(idDoctor).subscribe({
      next: (data) => {
        this.citasMostradas = data;
        this.mensaje = '✅ Citas encontradas por ID de doctor.';
        this.error = '';
      },
      error: () => {
        this.error = '❌ No se encontraron citas para ese ID de doctor.';
        this.mensaje = '';
      }
    });
  }

  buscarCitasPorColegiado(colegiado: string): void {
    this.adminService.obtenerCitasPorColegiado(colegiado).subscribe({
      next: (data) => {
        this.citasMostradas = data;
        this.mensaje = '✅ Citas encontradas por colegiado.';
        this.error = '';
      },
      error: () => {
        this.error = '❌ No se encontraron citas para ese colegiado.';
        this.mensaje = '';
      }
    });
  }

  buscarCitasPorNit(nit: number): void {
    this.adminService.obtenerCitasPorNit(nit).subscribe({
      next: (data) => {
        this.citasMostradas = data;
        this.mensaje = '✅ Citas encontradas por NIT.';
        this.error = '';
      },
      error: () => {
        this.error = '❌ No se encontraron citas para ese NIT.';
        this.mensaje = '';
      }
    });
  }

  filtroIdPaciente: number | null = null;
  filtroIdDoctor: number | null = null;
  filtroColegiado: string = '';
  filtroNit: number | null = null;

  resetearFiltrosCitas(): void {
    this.filtroIdCita = null;
    this.filtroFecha = '';
    this.filtroIdPaciente = null;
    this.filtroIdDoctor = null;
    this.filtroColegiado = '';
    this.filtroNit = null;
    this.citasMostradas = [];
    this.mensaje = '';
    this.error = '';
  }


  actualizacionCita = {
    idcita: null,
    iddoctor: null,
    colegiado: '',
    idpaciente: null,
    nit: null,
    motivoconsulta: '',
    fechacita: '',
    nombrecompleto_paciente: '',
    nombrecompleto_doctor: ''
  };

  limpiarCamposActualizacion(): void {
    this.actualizacionCita = {
      idcita: null,
      iddoctor: null,
      colegiado: '',
      idpaciente: null,
      nit: null,
      motivoconsulta: '',
      fechacita: '',
      nombrecompleto_paciente: '',
      nombrecompleto_doctor: ''
    };
  }


  actualizarDoctorYColegiado(): void {
    const { idcita, colegiado } = this.actualizacionCita;

    if (!idcita || !colegiado) {
      this.error = '❌ Debes ingresar ID cita y colegiado.';
      this.mensaje = '';
      return;
    }

    const dto = { colegiado };

    this.adminService.actualizarDoctorYColegiado(idcita, dto).subscribe({
      next: () => {
        this.mensaje = '✅ Colegiado actualizado correctamente.';
        this.error = '';
        this.limpiarCamposActualizacion();
      },
      error: () => {
        this.error = '❌ Error al actualizar el colegiado.';
        this.mensaje = '';
      }
    });
  }


  actualizarPacienteYNit(): void {
    const { idcita, nit } = this.actualizacionCita;

    if (!idcita || !nit) {
      this.error = '❌ Debes ingresar ID cita y NIT.';
      this.mensaje = '';
      return;
    }

    const dto = { nit };

    this.adminService.actualizarPacienteYNit(idcita, dto).subscribe({
      next: () => {
        this.mensaje = '✅ NIT del paciente actualizado correctamente.';
        this.error = '';
        this.limpiarCamposActualizacion();
      },
      error: () => {
        this.error = '❌ Error al actualizar el NIT.';
        this.mensaje = '';
      }
    });
  }


  actualizarMotivoConsulta(): void {
    const { idcita, motivoconsulta } = this.actualizacionCita;

    if (!idcita || !motivoconsulta) {
      this.error = '❌ Debes ingresar ID cita y motivo de consulta.';
      this.mensaje = '';
      return;
    }

    const dto = { motivoconsulta };

    this.adminService.actualizarMotivoConsulta(idcita, dto).subscribe({
      next: () => {
        this.mensaje = '✅ Motivo de consulta actualizado.';
        this.error = '';
        this.limpiarCamposActualizacion();
      },
      error: () => {
        this.error = '❌ Error al actualizar motivo de consulta.';
        this.mensaje = '';
      }
    });
  }

  actualizarFechaCita(): void {
    const { idcita, fechacita } = this.actualizacionCita;

    if (!idcita || !fechacita) {
      this.error = '❌ Debes ingresar ID cita y fecha de la cita.';
      this.mensaje = '';
      return;
    }

    const dto = { fechacita };

    this.adminService.actualizarFechaCita(idcita, dto).subscribe({
      next: () => {
        this.mensaje = '✅ Fecha de cita actualizada.';
        this.error = '';
        this.limpiarCamposActualizacion();
      },
      error: () => {
        this.error = '❌ Error al actualizar la fecha de cita.';
        this.mensaje = '';
      }
    });
  }

  actualizarNombrePacienteCita(): void {
    const { idcita, nombrecompleto_paciente } = this.actualizacionCita;

    if (!idcita || !nombrecompleto_paciente) {
      this.error = '❌ Debes ingresar ID cita y nombre del paciente.';
      this.mensaje = '';
      return;
    }

    const dto = { nombrecompletoPaciente: nombrecompleto_paciente };

    this.adminService.actualizarNombrePacienteCita(idcita, dto).subscribe({
      next: () => {
        this.mensaje = '✅ Nombre del paciente actualizado.';
        this.error = '';
        this.limpiarCamposActualizacion();
      },
      error: () => {
        this.error = '❌ Error al actualizar nombre del paciente.';
        this.mensaje = '';
      }
    });
  }

  actualizarNombreDoctorCita(): void {
    const { idcita, nombrecompleto_doctor } = this.actualizacionCita;

    if (!idcita || !nombrecompleto_doctor) {
      this.error = '❌ Debes ingresar ID cita y nombre del doctor.';
      this.mensaje = '';
      return;
    }

    const dto = { nombrecompletoDoctor: nombrecompleto_doctor };

    this.adminService.actualizarNombreDoctorCita(idcita, dto).subscribe({
      next: () => {
        this.mensaje = '✅ Nombre del doctor actualizado.';
        this.error = '';
        this.limpiarCamposActualizacion();
      },
      error: () => {
        this.error = '❌ Error al actualizar nombre del doctor.';
        this.mensaje = '';
      }
    });
  }

  cargarCitaParaActualizar(): void {
    const id = this.actualizacionCita.idcita;
    if (!id) {
      this.error = '❌ Debes ingresar el ID de la cita para cargar.';
      this.mensaje = '';
      return;
    }

    this.adminService.obtenerCitaPorId(id).subscribe({
      next: (data) => {
        this.actualizacionCita = {
          idcita: data.idcita,
          iddoctor: data.iddoctor,
          colegiado: data.colegiado,
          idpaciente: data.idpaciente,
          nit: data.nit,
          motivoconsulta: data.motivoconsulta,
          fechacita: data.fechacita,
          nombrecompleto_paciente: data.nombrecompletoPaciente,
          nombrecompleto_doctor: data.nombrecompletoDoctor
        };
        this.mensaje = '✅ Cita cargada para actualización.';
        this.error = '';
      },
      error: () => {
        this.error = '❌ No se pudo cargar la cita.';
        this.mensaje = '';
      }
    });
  }








}
