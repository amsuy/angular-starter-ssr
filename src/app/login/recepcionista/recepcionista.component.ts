import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';


@Component({
  standalone: true,
  selector: 'app-recepcionista',
  templateUrl: './recepcionista.component.html',
  styleUrls: ['./recepcionista-dashboard.component.css'],
  imports: [CommonModule, FormsModule],
})
export class RecepcionistaComponent implements OnInit {
  paciente = {
    nombrecompleto: '',
    edad: null,
    nit: null,
    cui: null,
    direccion: '',
    telefono: null
  };

  cita = {
    idpaciente: null,
    nombrecompleto_paciente: '',
    nit: null,
    iddoctor: null,
    nombrecompleto_doctor: '',
    colegiado: '',
    motivoconsulta: '',
    fechacita: '',
    correo: ''
  };

  formRealizada = {
    id: 0,
    costo: 0,
    fechaFin: ''
  };

  formCancelada = {
    id: 0,
    fechaFin: '',
    motivocancelacion: ''
  };


  pacientes: any[] = [];
  citas: any[] = [];

  mensaje = '';
  error = '';

  modal = {
    paciente: false,
    cita: false,
    pacientes: false,
    realizada: false,
    cancelada: false,
    doctores: false,
    consultacitas: false



  };

  // Campos de búsqueda para filtros personalizados
  busquedaPaciente = '';
  busquedaNit = '';
  busquedaCui = '';

  busquedaDoctorNombre = '';
  busquedaDoctorColegiado = '';
  busquedaDoctorEspecialidad = '';

  busquedaPacienteId = '';
  busquedaPacienteFecha = '';

  busquedaDoctorId = '';
  busquedaDoctorFecha = '';

  estadoProgramada = false;
  estadoRealizada = false;
  estadoCancelada = false;
  busquedaIdPaciente = '';
  resultadoCitas: any[] = [];


  limpiarPaciente() {
    this.paciente = {
      nombrecompleto: '',
      edad: null,
      nit: null,
      cui: null,
      direccion: '',
      telefono: null
    };
  }

  limpiarCita() {
    this.cita = {
      idpaciente: null,
      nombrecompleto_paciente: '',
      nit: null,
      iddoctor: null,
      nombrecompleto_doctor: '',
      colegiado: '',
      motivoconsulta: '',
      fechacita: '',
      correo: ''
    };
  }


  limpiarFormRealizada() {
    this.formRealizada = {
      id: 0,
      costo: 0,
      fechaFin: ''
    };
  }

  limpiarFormCancelada() {
    this.formCancelada = {
      id: 0,
      fechaFin: '',
      motivocancelacion: ''
    };

  }

  limpiarCamposBusquedaPacientes() {
    this.busquedaPacienteId = '';
    this.busquedaPaciente = '';
    this.busquedaNit = '';
    this.busquedaCui = '';
    this.busquedaPacienteFecha = '';
  }

  limpiarCamposBusquedaDoctores() {
    this.busquedaDoctorId = '';
    this.busquedaDoctorNombre = '';
    this.busquedaDoctorColegiado = '';
    this.busquedaDoctorEspecialidad = '';
    this.busquedaDoctorFecha = '';
  }


  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  ngOnInit() {
    const rol = localStorage.getItem('rol');
    console.log('Rol actual:', rol);
    this.consultarCitasPorEstado('programadas');
  }

  toggleModal(nombre: keyof typeof this.modal, estado: boolean) {
    this.modal[nombre] = estado;

    // Limpia mensajes si se abre el modal
    if (estado) {
      this.mensaje = '';
      this.error = '';
    }
  }


  guardarPaciente() {
    if (!this.paciente.nombrecompleto || !this.paciente.nit || !this.paciente.cui) {
      this.error = '❌ Por favor, completa los campos obligatorios';
      this.mensaje = '';
      return;
    }

    this.usuarioService.guardarPacienteRecepcionista(this.paciente).subscribe({
      next: () => {
        this.mensaje = '✅ Paciente guardado correctamente';
        this.error = '';
        this.paciente = {
          nombrecompleto: '',
          edad: null,
          nit: null,
          cui: null,
          direccion: '',
          telefono: null
        };
      },
      error: () => {
        this.error = '❌ Error al guardar el paciente';
        this.mensaje = '';
      },
    });
  }

  crearCita() {
    this.usuarioService.crearCitaRecepcionista(this.cita).subscribe({
      next: () => {
        alert('✅ Cita creada correctamente');
        this.cita = {
          idpaciente: null,
          nombrecompleto_paciente: '',
          nit: null,
          iddoctor: null,
          nombrecompleto_doctor: '',
          colegiado: '',
          motivoconsulta: '',
          fechacita: '',
          correo: ''
        };
      },
      error: () => alert('❌ Error al crear cita')
    });
  }

  consultarPacientes() {
    this.usuarioService.consultarPacientes().subscribe({
      next: (data) => {
        try {
          this.pacientes = typeof data === 'string' ? JSON.parse(data) : data;
        } catch {
          this.pacientes = data;
        }
      },
      error: () => alert('❌ Error al consultar pacientes')
    });
  }

  consultarCitasPorEstado(estado: string) {
    this.usuarioService.consultarCitasPorEstado(estado).subscribe({
      next: (data) => {
        try {
          this.citas = typeof data === 'string' ? JSON.parse(data) : data;
        } catch (e) {
          console.error('❌ Error al parsear citas:', e);
          this.citas = [];
        }
      },
      error: () => alert('❌ Error al consultar citas')
    });
  }

  confirmarRealizada() {
    const id = this.formRealizada.id;
    const datos = {
      costo: this.formRealizada.costo,
      fechaFin: this.formRealizada.fechaFin,
      motivoconsulta: '', // requerido si el backend espera el DTO completo
      correo: '', // puedes dejarlo vacío si no lo usas en esta acción
      idpaciente: 0, // opcional según la validación del backend
      iddoctor: 0
    };

    this.usuarioService.marcarComoRealizada(id, datos).subscribe({
      next: () => {
        alert('✅ Cita marcada como REALIZADA');
        this.modal.realizada = false;
        this.consultarCitasPorEstado('programadas');
      },
      error: () => alert('❌ Error al actualizar estado a REALIZADA')
    });
  }

  marcarComoCancelada(id: number) {
    this.formCancelada.id = id;
    this.toggleModal('cancelada', true);
  }

  confirmarCancelada() {
    const id = this.formCancelada.id;
    const datos = {
      fechaFin: this.formCancelada.fechaFin,
      motivocancelacion: this.formCancelada.motivocancelacion
    };

    if (id) {
      this.usuarioService.marcarComoCancelada(id, datos).subscribe({
        next: () => {
          alert('✅ Cita marcada como CANCELADA');
          this.toggleModal('cancelada', false);
          this.consultarCitasPorEstado('programadas');
        },
        error: () => alert('❌ Error al actualizar estado a CANCELADA')
      });
    }
  }


  doctores: any[] = [];

  verDoctores() {
    this.usuarioService.obtenerDoctores().subscribe({
      next: (data) => {
        this.doctores = data;
        console.log("Doctores cargados:", this.doctores);
      },
      error: (error) => {
        console.error("Error al obtener doctores", error);
      }
    });
  }

  buscarPacientePorNombre() {
    if (!this.busquedaPaciente) return;
    this.usuarioService.buscarPacientePorNombre(this.busquedaPaciente).subscribe({
      next: (data) => this.pacientes = data,
      error: () => alert('❌ Error al buscar paciente por nombre')
    });
  }

  buscarPacientePorNit() {
    if (!this.busquedaNit) return;
    this.usuarioService.buscarPacientePorNit(Number(this.busquedaNit)).subscribe({
      next: (data) => this.pacientes = data,
      error: () => alert('❌ Error al buscar paciente por NIT')
    });
  }

  buscarPacientePorCui() {
    if (!this.busquedaCui) return;
    this.usuarioService.buscarPacientePorCui(Number(this.busquedaCui)).subscribe({
      next: (data) => this.pacientes = data,
      error: () => alert('❌ Error al buscar paciente por CUI')
    });
  }

  buscarDoctorPorNombre() {
    if (!this.busquedaDoctorNombre) return;
    this.usuarioService.buscarDoctorPorNombre(this.busquedaDoctorNombre).subscribe({
      next: (data) => this.doctores = data,
      error: () => alert('❌ Error al buscar doctor por nombre')
    });
  }

  buscarDoctorPorColegiado() {
    if (!this.busquedaDoctorColegiado) return;
    this.usuarioService.buscarDoctorPorColegiado(this.busquedaDoctorColegiado).subscribe({
      next: (data) => this.doctores = data,
      error: () => alert('❌ Error al buscar doctor por colegiado')
    });
  }

  buscarDoctorPorEspecialidad() {
    if (!this.busquedaDoctorEspecialidad) return;
    this.usuarioService.buscarDoctorPorEspecialidad(this.busquedaDoctorEspecialidad).subscribe({
      next: (data) => this.doctores = data,
      error: () => alert('❌ Error al buscar doctor por especialidad')
    });
  }

  filtrarPacientes() {
    this.pacientes = this.pacientes.filter(p =>
      (!this.busquedaPaciente || p.nombrecompleto.toLowerCase().includes(this.busquedaPaciente.toLowerCase())) &&
      (!this.busquedaNit || p.nit?.toString().includes(this.busquedaNit.toString())) &&
      (!this.busquedaCui || p.cui?.toString().includes(this.busquedaCui.toString())) &&
      (!this.busquedaPacienteId || p.idpaciente?.toString().includes(this.busquedaPacienteId.toString())) &&
      (!this.busquedaPacienteFecha || (p.fecha && p.fecha.startsWith(this.busquedaPacienteFecha))) // formato yyyy-MM-dd
    );
  }


  filtrarDoctores() {
    this.doctores = this.doctores.filter(d =>
      (!this.busquedaDoctorNombre || d.nombrecompleto.toLowerCase().includes(this.busquedaDoctorNombre.toLowerCase())) &&
      (!this.busquedaDoctorColegiado || d.colegiado?.toString().includes(this.busquedaDoctorColegiado.toString())) &&
      (!this.busquedaDoctorEspecialidad || d.especialidad?.toLowerCase().includes(this.busquedaDoctorEspecialidad.toLowerCase())) &&
      (!this.busquedaDoctorId || d.iddoctor?.toString().includes(this.busquedaDoctorId.toString())) &&
      (!this.busquedaDoctorFecha || (d.fecharegistro && d.fecharegistro.startsWith(this.busquedaDoctorFecha))) // formato yyyy-MM-dd
    );
  }


  buscarPacientePorId() {
    if (!this.busquedaPacienteId) return;
    this.usuarioService.buscarPacientePorId(Number(this.busquedaPacienteId)).subscribe({
      next: (data) => this.pacientes = [data],
      error: () => alert('❌ Error al buscar paciente por ID')
    });
  }

  buscarPacientePorFecha() {
    if (!this.busquedaPacienteFecha) return;
    this.usuarioService.buscarPacientePorFecha(this.busquedaPacienteFecha).subscribe({
      next: (data) => this.pacientes = data,
      error: () => alert('❌ Error al buscar paciente por fecha')
    });
  }

  buscarDoctorPorId() {
    if (!this.busquedaDoctorId) return;
    this.usuarioService.buscarDoctorPorId(Number(this.busquedaDoctorId)).subscribe({
      next: (data) => this.doctores = [data],
      error: () => alert('❌ Error al buscar doctor por ID')
    });
  }

  buscarDoctorPorFecha() {
    if (!this.busquedaDoctorFecha) return;
    this.usuarioService.buscarDoctorPorFecha(this.busquedaDoctorFecha).subscribe({
      next: (data) => this.doctores = data,
      error: () => alert('❌ Error al buscar doctor por fecha')
    });
  }

  cerrarSesion() {
    localStorage.clear(); // Opcional: eliminar datos del usuario
    this.router.navigate(['/login']);
  }


  buscarCitasPorEstadosSeleccionados() {
    const nit = Number(this.busquedaNit);
    this.resultadoCitas = [];

    const estados = [];
    if (this.estadoProgramada) estados.push('PROGRAMADA');
    if (this.estadoRealizada) estados.push('REALIZADA');
    if (this.estadoCancelada) estados.push('CANCELADA');

    if (!nit || estados.length === 0) {
      alert('❌ Por favor ingresa un NIT válido y al menos un estado.');
      return;
    }


    estados.forEach(estado => {
      this.usuarioService.buscarCitasPorNitYEstado(nit, estado).subscribe({
        next: (data) => {
          try {
            const citas = typeof data === 'string' ? JSON.parse(data) : data;
            this.resultadoCitas = [...this.resultadoCitas, ...citas];
          } catch (e) {
            console.error('Error al parsear:', e);
          }
        },
        error: () => alert(`❌ Error al buscar citas con estado ${estado}`)
      });
    });
  }


  // Al principio de la clase
  username: string = '';
  seccionActiva: string = '';

  mostrarSeccion(seccion: string) {
    this.seccionActiva = seccion;

    // Carga automática si entra a una sección vacía
    if (seccion === 'verPacientes' && this.pacientes.length === 0) {
      this.consultarPacientes();
    }

    if (seccion === 'verDoctores' && this.doctores.length === 0) {
      this.verDoctores();
    }
  }

  // Limpia la sección activa (opcional)
  limpiarPantalla() {
    this.seccionActiva = '';
  }

  verCitasPorEstado(estado: string, seccion: string) {
    this.limpiarPantalla(); // Limpia la pantalla primero
    setTimeout(() => {
      this.consultarCitasPorEstado(estado); // Luego consulta las citas
      this.seccionActiva = seccion; // Y muestra la sección
    }, 0);
  }

  limpiarCamposFiltroCitas(): void {
    this.busquedaIdPaciente = '';
    this.estadoProgramada = false;
    this.estadoRealizada = false;
    this.estadoCancelada = false;
    this.resultadoCitas = [];
  }

  busquedaNitPaciente = '';




}
