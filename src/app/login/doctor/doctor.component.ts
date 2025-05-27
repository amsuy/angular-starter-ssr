import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';

@Component({
  selector: 'app-doctor',
  standalone: true,
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor-dashboard.component.css'],
  imports: [CommonModule, FormsModule]
})
export class DoctorComponent {
  pacientes: any[] = [];
  citas: any[] = [];
  resultadoCitas: any[] = [];

  // Parámetros
  idDoctor: number = 0;
  colegiado: string = '';
  idPaciente: number = 0;
  estado: string = '';
  fecha: string = '';
  fechaInicio: string = '';
  fechaFin: string = '';

  // Para búsqueda combinada
  busquedaIdPaciente: string = '';
  estadoProgramada: boolean = false;
  estadoRealizada: boolean = false;
  estadoCancelada: boolean = false;

  // Control de modales
  modal: { [key: string]: boolean } = {
    estado: false,
    pacienteEstado: false,
    fecha: false,
    hoyId: false,
    hoyColegiado: false,
    historialId: false,
    historialColegiado: false,
    consultacitas: false
  };

  limpiarCamposEstado() {
    this.estado = '';
  }

  limpiarCamposPacienteEstado() {
    this.idPaciente = 0;
    this.estado = '';
  }

  limpiarCamposFecha() {
    this.fecha = '';
  }

  limpiarCamposHoyId() {
    this.idDoctor = 0;
  }

  limpiarCamposHoyColegiado() {
    this.colegiado = '';
  }

  limpiarCamposHistorialId() {
    this.idDoctor = 0;
    this.fechaInicio = '';
    this.fechaFin = '';
  }

  limpiarCamposHistorialColegiado() {
    this.colegiado = '';
    this.fechaInicio = '';
    this.fechaFin = '';
  }

  limpiarCamposConsultaCitas() {
    this.busquedaIdPaciente = '';
    this.estadoProgramada = false;
    this.estadoRealizada = false;
    this.estadoCancelada = false;
    this.resultadoCitas = [];
  }


  constructor(private doctorService: DoctorService, private router: Router) {
    this.username = localStorage.getItem('username') || 'Doctor';
  }


  toggleModal(nombre: keyof typeof this.modal, visible: boolean) {
    this.modal[nombre] = visible;
  }

  obtenerPacientes() {
    this.doctorService.obtenerPacientes().subscribe(data => this.pacientes = data);
  }

  consultarCitasPorEstado() {
    this.doctorService.consultarCitasPorEstado(this.estado).subscribe(data => {
      this.citas = data;
      this.toggleModal('estado', false);
    });
  }

  consultarCitasPorPacienteYEstado() {
    this.doctorService.consultarCitasPorPacienteYEstado(this.idPaciente, this.estado).subscribe(data => {
      this.citas = data;
      this.toggleModal('pacienteEstado', false);
    });
  }

  consultarCitasPorFecha() {
    this.doctorService.consultarCitasPorFecha(this.fecha).subscribe(data => {
      this.citas = data;
      this.toggleModal('fecha', false);
    });
  }

  consultarCitasDeHoyPorIdDoctor() {
    this.doctorService.consultarCitasDeHoyPorIdDoctor(this.idDoctor).subscribe(data => {
      this.citas = data;
      this.toggleModal('hoyId', false);
    });
  }

  consultarCitasDeHoyPorColegiado() {
    this.doctorService.consultarCitasDeHoyPorColegiado(this.colegiado).subscribe(data => {
      this.citas = data;
      this.toggleModal('hoyColegiado', false);
    });
  }

  consultarHistorialPorIdDoctor() {
    this.doctorService.historialPorIdDoctor(this.idDoctor, this.fechaInicio, this.fechaFin).subscribe(data => {
      this.citas = data;
      this.toggleModal('historialId', false);
    });
  }

  consultarHistorialPorColegiado() {
    this.doctorService.historialPorColegiado(this.colegiado, this.fechaInicio, this.fechaFin).subscribe(data => {
      this.citas = data;
      this.toggleModal('historialColegiado', false);
    });
  }

  buscarCitasPorEstadosSeleccionados() {
    const id = Number(this.busquedaIdPaciente);
    const estados = [];

    if (this.estadoProgramada) estados.push('PROGRAMADA');
    if (this.estadoRealizada) estados.push('REALIZADA');
    if (this.estadoCancelada) estados.push('CANCELADA');

    if (!id || estados.length === 0) {
      alert('❌ Por favor ingresa un ID válido y selecciona al menos un estado.');
      return;
    }

    this.resultadoCitas = [];

    estados.forEach(estado => {
      this.doctorService.consultarCitasPorPacienteYEstado(id, estado).subscribe(data => {
        this.resultadoCitas = [...this.resultadoCitas, ...data];
      });
    });

    // ❌ Ya no se cierra el modal aquí
    // this.toggleModal('consultacitas', false);
  }

  cerrarSesion() {
    localStorage.clear(); // Opcional: eliminar datos del usuario
    this.router.navigate(['/login']);
  }

  consultarCitasPorRangoFechas() {
    if (!this.fechaInicio || !this.fechaFin) {
      alert('⚠️ Debes ingresar ambas fechas.');
      return;
    }

    this.doctorService.consultarCitasPorRangoFechas(this.fechaInicio, this.fechaFin).subscribe(data => {
      this.citas = data;
      this.toggleModal('consultacitas', false);
    });
  }

  nitPaciente: number = 0;

  consultarCitasPorNitYEstado() {
    if (!this.nitPaciente || !this.estado) {
      alert('⚠️ Ingresa el NIT y el estado.');
      return;
    }

    this.doctorService.consultarCitasPorNitYEstado(this.nitPaciente, this.estado).subscribe(data => {
      this.citas = data;
      this.toggleModal('consultacitas', false);
    });
  }

  buscarPacientesPorNit() {
    if (!this.nitPaciente) {
      alert('⚠️ Ingresa el NIT.');
      return;
    }

    this.doctorService.buscarPacientesPorNit(this.nitPaciente).subscribe(data => {
      this.pacientes = data;
      this.toggleModal('consultacitas', false);
    });
  }

  idCitaFinalizar: number = 0;
  costoCita: number = 0;
  fechaFinCita: string = ''; // formato ISO

  finalizarCita() {
    if (!this.idCitaFinalizar || !this.costoCita) {
      alert('⚠️ Debes ingresar ID y costo de la cita.');
      return;
    }

    const datos = {
      costo: this.costoCita,
      fechaFin: this.fechaFinCita || new Date().toISOString()
    };

    this.doctorService.finalizarCita(this.idCitaFinalizar, datos).subscribe({
      next: () => {
        alert('✅ Cita marcada como REALIZADA correctamente.');
        this.obtenerPacientes(); // refrescar si quieres
      },
      error: () => {
        alert('❌ Error al finalizar la cita.');
      }
    });
  }

  limpiarCamposFinalizarCita() {
    this.idCitaFinalizar = 0;
    this.costoCita = 0;
    this.fechaFinCita = '';
  }

  limpiarCamposRangoFechas() {
    this.fechaInicio = '';
    this.fechaFin = '';
  }

  limpiarCamposNitYEstado() {
    this.nitPaciente = 0;
    this.estado = '';
  }

  limpiarCamposPacientePorNit() {
    this.nitPaciente = 0;
    this.pacientes = [];
  }




  username: string = '';
  seccionActiva: string = '';



  mostrarSeccion(nombre: string) {
    this.seccionActiva = nombre;
  }

limpiarPantalla() {
  this.citas = [];
  this.pacientes = [];
  this.resultadoCitas = [];
  this.seccionActiva = '';
}








}
