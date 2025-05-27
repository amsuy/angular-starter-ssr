import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Importa el servicio y los componentes
import { AdminService } from '../../services/admin.service';
import { ModuloCitasComponent } from './modulo.citas.component';
import { ModuloDoctorComponent } from './modulo.doctor.component';
import { ModuloLoginComponent } from './modulo.login.component';
import { ModuloPacienteComponent } from './modulo.paciente.component';


@Component({
  standalone: true,
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [
    CommonModule,
    FormsModule
  ],
})
export class AdminComponent {
  vista: string = '';
  seccionCitas: string = '';

  // 👉 instancia del componente citas (REUTILIZACIÓN DE FUNCIONES)
  citasComponent: ModuloCitasComponent;
  pacienteComponent: ModuloPacienteComponent;
  doctorComponent: ModuloDoctorComponent;
  loginComponent: ModuloLoginComponent;



  constructor(
    private router: Router,
    private adminService: AdminService
  ) {
    this.citasComponent = new ModuloCitasComponent(this.adminService);
    this.citasComponent.crearCita();
    this.pacienteComponent = new ModuloPacienteComponent(this.adminService);
    this.doctorComponent = new ModuloDoctorComponent(this.adminService);
    this.loginComponent = new ModuloLoginComponent(this.adminService);


  }

  get nuevaCita() {
    return this.citasComponent.nuevaCita;
  }
  set nuevaCita(value: any) {
    this.citasComponent.nuevaCita = value;
  }




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




  cambiarVista(modulo: string) {
    this.vista = modulo;
    if (modulo !== 'citas') {
      this.seccionCitas = '';
    }
  }

  limpiarPantalla(): void {
    this.vista = '';
    this.seccionCitas = '';
  }

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  cambiarSeccionCitas(seccion: string) {
    this.seccionCitas = seccion;
  }

  crearCitaDesdeAdmin(): void {
    this.citasComponent.crearCita();
  }

  get citasMostradas() {
    return this.citasComponent.citasMostradas;
  }

  get filtroIdCita() {
    return this.citasComponent.filtroIdCita;
  }
  set filtroIdCita(value: number | null) {
    this.citasComponent.filtroIdCita = value;
  }

  get filtroFecha() {
    return this.citasComponent.filtroFecha;
  }
  set filtroFecha(value: string) {
    this.citasComponent.filtroFecha = value;
  }

  consultarCitasProgramadas(): void {
    this.citasComponent.consultarCitasProgramadas();
  }

  consultarCitasRealizadas(): void {
    this.citasComponent.consultarCitasRealizadas();
  }

  consultarCitasCanceladas(): void {
    this.citasComponent.consultarCitasCanceladas();
  }

  buscarCitaPorId(): void {
    this.citasComponent.buscarCitaPorId();
  }

  buscarCitasPorFecha(): void {
    this.citasComponent.buscarCitasPorFecha();
  }

  limpiarConsultaCitas(): void {
    this.citasComponent.limpiarConsultaCitas();
  }


  get filtroColegiado() {
    return this.citasComponent.filtroColegiado;
  }
  set filtroColegiado(value: string) {
    this.citasComponent.filtroColegiado = value;
  }

  get filtroNit() {
    return this.citasComponent.filtroNit;
  }
  set filtroNit(value: number | null) {
    this.citasComponent.filtroNit = value;
  }

  marcarCitaRealizadaDesdeAdmin(): void {
    this.citasComponent.marcarComoRealizada();
  }

  limpiarCamposCambioEstado(): void {
    this.citasComponent.limpiarCamposCambioEstado();
  }

  marcarCitaCanceladaDesdeAdmin(): void {
    this.citasComponent.marcarComoCancelada();
  }

  buscarCitasPorNit(): void {
    if (this.filtroNit !== null) {
      this.citasComponent.buscarCitasPorNit(this.filtroNit);
    }
  }


  buscarCitasPorColegiado(): void {
    this.citasComponent.buscarCitasPorColegiado(this.filtroColegiado);
  }

  resetearFiltrosCitas(): void {
    this.citasComponent.resetearFiltrosCitas();
  }

  cargarCitaParaActualizar(): void {
    this.citasComponent.cargarCitaParaActualizar();
  }

  limpiarCamposActualizacion(): void {
    this.citasComponent.limpiarCamposActualizacion();
  }

  actualizarPacienteYNit(): void {
    this.citasComponent.actualizarPacienteYNit();
  }

  actualizarNombrePacienteCita(): void {
    this.citasComponent.actualizarNombrePacienteCita();
  }

  actualizarNombreDoctorCita(): void {
    this.citasComponent.actualizarNombreDoctorCita();
  }

  actualizarDoctorYColegiado(): void {
    this.citasComponent.actualizarDoctorYColegiado();
  }

  actualizarMotivoConsulta(): void {
    this.citasComponent.actualizarMotivoConsulta();
  }

  actualizarFechaCita(): void {
    this.citasComponent.actualizarFechaCita();
  }

  seccionPacientes: string = '';

  get paciente() {
    return this.pacienteComponent.paciente;
  }
  set paciente(value: any) {
    this.pacienteComponent.paciente = value;
  }

  guardarPacienteDesdeAdmin(): void {
    this.pacienteComponent.guardarPaciente();
  }

  limpiarCamposPaciente(): void {
    this.paciente = {
      nombrecompleto: '',
      edad: null,
      nit: null,
      cui: null,
      direccion: '',
      telefono: null
    };
    this.pacienteComponent.mensaje = '';
    this.pacienteComponent.error = '';
  }

  // 🆕 Variables y arreglo para mostrar pacientes
  pacientesMostrados: any[] = [];
  filtroIdPaciente: number | null = null;

  // 🆕 Método: consultar todos los pacientes
  consultarPacientesDesdeAdmin(): void {
    this.adminService.consultarPacientesDesdeAdmin().subscribe({
      next: (data) => {
        const pacientes = typeof data === 'string' ? JSON.parse(data) : data;
        this.pacientesMostrados = pacientes;
        this.pacienteComponent.pacientes = pacientes;
        this.pacienteComponent.mostrarPacientes = true;
        this.pacienteComponent.error = '';
        this.pacienteComponent.mensaje = '';
      },
      error: () => {
        this.pacienteComponent.error = '❌ No se encontraron pacientes.';
        this.pacienteComponent.mostrarPacientes = false;
        this.pacientesMostrados = [];
      }
    });
  }

  // 🆕 Método: buscar por ID
  buscarPacientePorIdDesdeAdmin(): void {
    this.pacienteComponent.filtroId = this.filtroIdPaciente; // sincronizar antes
    this.pacienteComponent.filtrarPorId();
    this.pacientesMostrados = this.pacienteComponent.pacientes;
  }



  setSeccionPacientes(seccion: string): void {
    this.seccionPacientes = seccion;

    if (seccion === 'consultar') {
      this.consultarPacientesDesdeAdmin(); // 👈 Ejecuta la consulta automáticamente
    }

  }

  filtroNitPaciente: string = '';
  filtroCuiPaciente: string = '';
  filtroNombrePaciente: string = '';
  filtroDireccionPaciente: string = '';
  filtroTelefonoPaciente: string = '';
  filtroFechaPaciente: string = '';

  buscarPacientePorNit(): void {
    this.pacienteComponent.filtroNit = this.filtroNitPaciente;
    this.pacienteComponent.filtrarPorNit();
    this.pacientesMostrados = this.pacienteComponent.pacientes;
  }

  buscarPacientePorCui(): void {
    this.pacienteComponent.filtroCui = this.filtroCuiPaciente;
    this.pacienteComponent.filtrarPorCui();
    this.pacientesMostrados = this.pacienteComponent.pacientes;
  }

  buscarPacientePorNombre(): void {
    this.pacienteComponent.filtroNombre = this.filtroNombrePaciente;
    this.pacienteComponent.filtrarPorNombre();
    this.pacientesMostrados = this.pacienteComponent.pacientes;
  }

  buscarPacientePorDireccion(): void {
    this.pacienteComponent.filtroDireccion = this.filtroDireccionPaciente;
    this.pacienteComponent.filtrarPorDireccion();
    this.pacientesMostrados = this.pacienteComponent.pacientes;
  }

  buscarPacientePorTelefono(): void {
    this.pacienteComponent.filtroTelefono = this.filtroTelefonoPaciente;
    this.pacienteComponent.filtrarPorTelefono();
    this.pacientesMostrados = this.pacienteComponent.pacientes;
  }

  buscarPacientePorFecha(): void {
    this.pacienteComponent.filtroFecha = this.filtroFechaPaciente;
    this.pacienteComponent.filtrarPorFecha();
    this.pacientesMostrados = this.pacienteComponent.pacientes;
  }

  limpiarConsultaPacientes(): void {
    this.filtroIdPaciente = null;
    this.filtroNitPaciente = '';
    this.filtroCuiPaciente = '';
    this.filtroNombrePaciente = '';
    this.filtroDireccionPaciente = '';
    this.filtroTelefonoPaciente = '';
    this.filtroFechaPaciente = '';

    this.pacienteComponent.limpiarFiltros();
    this.pacientesMostrados = [];
    this.consultarPacientesDesdeAdmin();

  }

  filtroIdEliminarPaciente: number | null = null;
  filtroIdRestaurarPaciente: number | null = null;

  eliminarPacienteDesdeAdmin(): void {
    this.pacienteComponent.idEliminar = this.filtroIdEliminarPaciente;
    this.pacienteComponent.eliminarPaciente();
  }

  restaurarPacienteDesdeAdmin(): void {
    this.pacienteComponent.idRestaurar = this.filtroIdRestaurarPaciente;
    this.pacienteComponent.restaurarPaciente();
  }

  seccionDoctor: string = '';

  get doctor() {
    return this.doctorComponent.doctor;
  }
  set doctor(value: any) {
    this.doctorComponent.doctor = value;
  }

  // Guardar doctor
  guardarDoctorDesdeAdmin(): void {
    this.doctorComponent.guardarDoctor();
  }

  // Limpiar campos
  limpiarCamposDoctor(): void {
    this.doctor = {
      colegiado: '',
      nombrecompleto: '',
      especialidad: '',
      direccion: '',
      centrohospitalario: '',
      edad: null,
      observacion: ''
    };
    this.doctorComponent.mensaje = '';
    this.doctorComponent.error = '';
  }

  // Consultar todos los doctores
  doctoresMostrados: any[] = [];
  filtroIdDoctor: number | null = null;

  // Consultar todos los doctores
  consultarDoctoresDesdeAdmin(): void {
    this.adminService.consultarDoctoresDesdeAdmin().subscribe({
      next: (data) => {
        const doctores = typeof data === 'string' ? JSON.parse(data) : data;
        this.doctoresMostrados = doctores;
        this.doctorComponent.doctores = doctores;
        this.doctorComponent.mostrarDoctores = true;
        this.doctorComponent.error = '';
        this.doctorComponent.mensaje = '';
      },
      error: () => {
        this.doctorComponent.error = '❌ No se encontraron doctores.';
        this.doctorComponent.mostrarDoctores = false;
        this.doctoresMostrados = [];
      }
    });
  }





  buscarDoctorPorIdDesdeAdmin(): void {
    this.doctorComponent.filtroId = this.filtroIdDoctor;
    this.doctorComponent.filtrarPorId();
    this.doctoresMostrados = this.doctorComponent.doctores;
  }

  setSeccionDoctor(seccion: string): void {
    this.seccionDoctor = seccion;

    if (seccion === 'consultar') {
      this.consultarDoctoresDesdeAdmin();
    }
  }

  // Filtros
  filtroNombreDoctor: string = '';
  filtroColegiadoDoctor: string = '';
  filtroEspecialidadDoctor: string = '';
  filtroCentroDoctor: string = '';
  filtroFechaDoctor: string = '';
  filtroIdEliminarDoctor: number | null = null;
  filtroIdRestaurarDoctor: number | null = null;


  // Buscar por filtros
  buscarDoctorPorNombre(): void {
    this.sincronizarFiltrosDoctor();
    this.doctorComponent.nombreDoctor = this.filtroNombreDoctor;
    this.doctorComponent.buscarDoctorPorNombre();
    this.doctoresMostrados = this.doctorComponent.doctores;
  }

  buscarDoctorPorColegiado(): void {
    this.sincronizarFiltrosDoctor();
    this.doctorComponent.colegiado = this.filtroColegiadoDoctor;
    this.doctorComponent.buscarDoctorPorColegiado();
    this.doctoresMostrados = this.doctorComponent.doctores;
  }

  buscarDoctorPorEspecialidad(): void {
    this.sincronizarFiltrosDoctor();
    this.doctorComponent.especialidad = this.filtroEspecialidadDoctor;
    this.doctorComponent.buscarDoctorPorEspecialidad();
    this.doctoresMostrados = this.doctorComponent.doctores;
  }

  buscarDoctorPorCentro(): void {
    this.sincronizarFiltrosDoctor();
    this.doctorComponent.centrohospitalario = this.filtroCentroDoctor;
    this.doctorComponent.buscarDoctorPorCentro();
    this.doctoresMostrados = this.doctorComponent.doctores;
  }

  buscarDoctorPorFecha(): void {
    this.sincronizarFiltrosDoctor();
    this.doctorComponent.fechaDoctor = this.filtroFechaDoctor;
    this.doctorComponent.buscarDoctorPorFecha();
    this.doctoresMostrados = this.doctorComponent.doctores;
  }

  // Limpiar filtros y recargar
  limpiarConsultaDoctores(): void {
    this.filtroIdDoctor = null;
    this.filtroNombreDoctor = '';
    this.filtroColegiadoDoctor = '';
    this.filtroEspecialidadDoctor = '';
    this.filtroCentroDoctor = '';
    this.filtroFechaDoctor = '';

    this.doctorComponent.limpiarFiltrosDoctor();
    this.doctoresMostrados = [];
    this.consultarDoctoresDesdeAdmin();
  }

  eliminarDoctorDesdeAdmin(): void {
    this.doctorComponent.idEliminarDoctor = this.filtroIdEliminarDoctor;
    this.doctorComponent.eliminarDoctor();

    setTimeout(() => {
      this.consultarDoctoresDesdeAdmin();
      this.filtroIdEliminarDoctor = null;
    }, 5000); // Espera breve para asegurar que la BD actualice
  }



  restaurarDoctorDesdeAdmin(): void {
    this.doctorComponent.idRestaurarDoctor = this.filtroIdRestaurarDoctor;
    this.doctorComponent.restaurarDoctor();

    setTimeout(() => {
      this.consultarDoctoresDesdeAdmin();
      this.filtroIdRestaurarDoctor = null;
    }, 5000);
  }


  sincronizarFiltrosDoctor(): void {
    this.doctorComponent.nombreDoctor = this.filtroNombreDoctor;
    this.doctorComponent.colegiado = this.filtroColegiadoDoctor;
    this.doctorComponent.especialidad = this.filtroEspecialidadDoctor;
    this.doctorComponent.centrohospitalario = this.filtroCentroDoctor;
    this.doctorComponent.fechaDoctor = this.filtroFechaDoctor;
    this.doctorComponent.idDoctor = this.filtroIdDoctor;
  }

  seccionLogin: string = '';

  // 👉 Usuario (guardar)
  usuario = {
    username: '',
    password: '',
    rol: '',
    jwtSecret: ''
  };

  mensajeUsuarioExito: string = '';
  mensajeUsuarioError: string = '';

  guardarUsuarioDesdeAdmin(): void {
    if (!this.usuario.jwtSecret) {
      this.mensajeUsuarioError = '⚠️ Debe seleccionar el JWT Secret';
      return;
    }

    this.adminService.registrarUsuarioDesdeAdmin(this.usuario).subscribe({
      next: (res) => {
        this.mensajeUsuarioExito = res.mensaje;
        this.mensajeUsuarioError = '';
        this.usuario = { username: '', password: '', rol: '', jwtSecret: '' };
        setTimeout(() => this.mensajeUsuarioExito = '', 4000);
      },
      error: () => {
        this.mensajeUsuarioError = '❌ Error al registrar usuario';
        this.mensajeUsuarioExito = '';
        setTimeout(() => this.mensajeUsuarioError = '', 4000);
      }
    });
  }

  limpiarFormularioUsuario(): void {
    this.usuario = { username: '', password: '', rol: '', jwtSecret: '' };
    this.mensajeUsuarioExito = '';
    this.mensajeUsuarioError = '';
  }


  // Variables de filtro
  filtroIdUsuario: number | null = null;
  filtroUsernameUsuario: string = '';
  filtroEstadoUsuario: string = 'TODOS';

  // Resultados
  usuariosMostrados: any[] = [];

  // Método para consultar usuarios
  consultarUsuariosDesdeAdmin(): void {
    if (this.filtroEstadoUsuario === 'ACTIVO') {
      if (this.filtroIdUsuario) {
        this.adminService.obtenerUsuarioActivoPorId(this.filtroIdUsuario).subscribe(res => {
          this.usuariosMostrados = [res];
        });
      } else if (this.filtroUsernameUsuario) {
        this.adminService.obtenerUsuarioActivoPorUsername(this.filtroUsernameUsuario).subscribe(res => {
          this.usuariosMostrados = [res];
        });
      } else {
        this.adminService.consultarUsuariosActivos().subscribe(res => {
          this.usuariosMostrados = res;
        });
      }
    } else if (this.filtroEstadoUsuario === 'INACTIVO') {
      if (this.filtroIdUsuario) {
        this.adminService.obtenerUsuarioInactivoPorId(this.filtroIdUsuario).subscribe(res => {
          this.usuariosMostrados = [res];
        });
      } else if (this.filtroUsernameUsuario) {
        this.adminService.obtenerUsuarioInactivoPorUsername(this.filtroUsernameUsuario).subscribe(res => {
          this.usuariosMostrados = [res];
        });
      } else {
        this.adminService.consultarUsuariosInactivos().subscribe(res => {
          this.usuariosMostrados = res;
        });
      }
    } else {
      this.adminService.consultarUsuariosActivos().subscribe(res1 => {
        this.adminService.consultarUsuariosInactivos().subscribe(res2 => {
          this.usuariosMostrados = [...res1, ...res2];
        });
      });
    }
  }

  limpiarConsultaUsuarios(): void {
    this.filtroIdUsuario = null;
    this.filtroUsernameUsuario = '';
    this.filtroEstadoUsuario = 'TODOS';
    this.usuariosMostrados = [];
  }

  // Variables para cambiar contraseña
  idCambioPassword: number = 0;
  nuevaPassword: string = '';
  mensajeCambioPassword: string = '';

  // Método para cambiar contraseña
  cambiarPasswordDesdeAdmin(): void {
    if (!this.idCambioPassword || !this.nuevaPassword) {
      this.mensajeCambioPassword = '⚠️ Debe ingresar el ID y la nueva contraseña';
      return;
    }

    this.adminService.cambiarPasswordUsuario(this.idCambioPassword, this.nuevaPassword).subscribe({
      next: () => {
        this.mensajeCambioPassword = '✅ Contraseña actualizada correctamente';
        this.idCambioPassword = 0;
        this.nuevaPassword = '';
        setTimeout(() => this.mensajeCambioPassword = '', 4000);
      },
      error: () => {
        this.mensajeCambioPassword = '❌ Error al actualizar contraseña';
        setTimeout(() => this.mensajeCambioPassword = '', 4000);
      }
    });
  }

  // Método para limpiar campos
  limpiarCambioPassword(): void {
    this.idCambioPassword = 0;
    this.nuevaPassword = '';
    this.mensajeCambioPassword = '';
  }

  // Variables para desactivar y restaurar usuarios
  idDesactivarUsuario: number = 0;
  mensajeDesactivarUsuario: string = '';

  idRestaurarUsuario: number = 0;
  mensajeRestaurarUsuario: string = '';

  // Método para desactivar usuario
  desactivarUsuarioDesdeAdmin(): void {
    if (!this.idDesactivarUsuario) {
      this.mensajeDesactivarUsuario = '⚠️ Debe ingresar un ID válido';
      return;
    }

    this.adminService.desactivarUsuario(this.idDesactivarUsuario).subscribe({
      next: () => {
        this.mensajeDesactivarUsuario = '✅ Usuario desactivado correctamente';
        this.idDesactivarUsuario = 0;
        setTimeout(() => this.mensajeDesactivarUsuario = '', 4000);
      },
      error: () => {
        this.mensajeDesactivarUsuario = '❌ Error al desactivar usuario';
        setTimeout(() => this.mensajeDesactivarUsuario = '', 4000);
      }
    });
  }

  // Método para restaurar usuario
  restaurarUsuarioDesdeAdmin(): void {
    if (!this.idRestaurarUsuario) {
      this.mensajeRestaurarUsuario = '⚠️ Debe ingresar un ID válido';
      return;
    }

    this.adminService.restaurarUsuario(this.idRestaurarUsuario).subscribe({
      next: () => {
        this.mensajeRestaurarUsuario = '✅ Usuario restaurado correctamente';
        this.idRestaurarUsuario = 0;
        setTimeout(() => this.mensajeRestaurarUsuario = '', 4000);
      },
      error: () => {
        this.mensajeRestaurarUsuario = '❌ Error al restaurar usuario';
        setTimeout(() => this.mensajeRestaurarUsuario = '', 4000);
      }
    });
  }

  idCambioRol: number = 0;
  nuevoRol: string = '';
  nuevoJwtSecret: string = '';
  mensajeCambioRol: string = '';

  cambiarRolManual(): void {
    if (!this.idCambioRol || !this.nuevoRol || !this.nuevoJwtSecret) {
      this.mensajeCambioRol = '⚠️ Debe ingresar todos los campos';
      this.ocultarMensajeCambioRol();
      return;
    }

    const datos = {
      rol: this.nuevoRol,
      jwtSecret: this.nuevoJwtSecret
    };

    this.adminService.cambiarRolManual(this.idCambioRol, datos).subscribe({
      next: () => {
        this.mensajeCambioRol = '✅ Rol y JWT actualizados correctamente';
        this.limpiarCambioRol();
        this.ocultarMensajeCambioRol();
      },
      error: (err) => {
        this.mensajeCambioRol = '❌ Error al actualizar el rol';
        console.error(err);
        this.ocultarMensajeCambioRol();
      }
    });
  }

  private ocultarMensajeCambioRol(): void {
    setTimeout(() => {
      this.mensajeCambioRol = '';
    }, 4000);
  }

  limpiarCambioRol(): void {
    this.idCambioRol = 0;
    this.nuevoRol = '';
    this.nuevoJwtSecret = '';
  }



}
