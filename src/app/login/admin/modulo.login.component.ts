import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';


@Component({
  selector: 'app-modulo-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modulo.login.component.html',
  styleUrls: ['./modulo.login.component.css']
})
export class ModuloLoginComponent {
  vista: string = '';  // Aquí se guarda la vista activa

  abrirModal(opcion: string): void {
    this.vista = opcion;
    console.log(`Modal abierto: ${opcion}`);
    // Aquí puedes activar el modal real más adelante
  }

  constructor(private adminService: AdminService) { }

  usuario = {
    username: '',
    password: '',
    rol: '',
    jwtSecret: ''
  };

  mensajeExito: string = '';
  mensajeError: string = '';

  guardarUsuario(): void {
    if (!this.usuario.jwtSecret) {
      this.mensajeError = 'Debe seleccionar el JWT Secret';
      return;
    }

    this.adminService.registrarUsuarioDesdeAdmin(this.usuario).subscribe({
      next: (res) => {
        this.mensajeExito = res.mensaje;
        this.mensajeError = '';
        this.usuario = { username: '', password: '', rol: '', jwtSecret: '' };
        this.ocultarMensajesUsuario();
      },
      error: (err) => {
        this.mensajeError = 'Error al registrar usuario';
        this.mensajeExito = '';
        console.error(err);
        this.ocultarMensajesUsuario();
      }
    });
  }

  private ocultarMensajesUsuario(): void {
    setTimeout(() => {
      this.mensajeExito = '';
      this.mensajeError = '';
    }, 4000);
  }

  limpiarFormulario(): void {
    this.usuario = { username: '', password: '', rol: '', jwtSecret: '' };
    this.mensajeExito = '';
    this.mensajeError = '';
  }

  cerrarModal(): void {
    this.vista = '';
    this.limpiarFormulario();
  }

  usuarios: any[] = [];
  filtroUsername: string = '';
  filtroId: number | null = null;
  filtroEstado: string = 'TODOS';
  resultadoUsuarios: any[] = [];

  consultarUsuarios(): void {
    if (this.filtroEstado === 'ACTIVO') {
      if (this.filtroId) {
        this.adminService.obtenerUsuarioActivoPorId(this.filtroId).subscribe(res => this.resultadoUsuarios = [res]);
      } else if (this.filtroUsername) {
        this.adminService.obtenerUsuarioActivoPorUsername(this.filtroUsername).subscribe(res => this.resultadoUsuarios = [res]);
      } else {
        this.adminService.consultarUsuariosActivos().subscribe(res => this.resultadoUsuarios = res);
      }
    } else if (this.filtroEstado === 'INACTIVO') {
      if (this.filtroId) {
        this.adminService.obtenerUsuarioInactivoPorId(this.filtroId).subscribe(res => this.resultadoUsuarios = [res]);
      } else if (this.filtroUsername) {
        this.adminService.obtenerUsuarioInactivoPorUsername(this.filtroUsername).subscribe(res => this.resultadoUsuarios = [res]);
      } else {
        this.adminService.consultarUsuariosInactivos().subscribe(res => this.resultadoUsuarios = res);
      }
    } else {
      // Ambos estados
      this.adminService.consultarUsuariosActivos().subscribe(res1 => {
        this.adminService.consultarUsuariosInactivos().subscribe(res2 => {
          this.resultadoUsuarios = [...res1, ...res2];
        });
      });
    }
  }


  limpiarFiltrosUsuarios(): void {
    this.filtroId = null;
    this.filtroUsername = '';
    this.filtroEstado = 'TODOS';
    this.resultadoUsuarios = [];
  }

  // Para cambiar contraseña
  idCambioPassword: number = 0;
  nuevaPassword: string = '';
  mensajeCambioPassword: string = '';

  cambiarPassword(): void {


    if (!this.idCambioPassword || !this.nuevaPassword) {
      this.mensajeCambioPassword = '⚠️ Debe ingresar el ID y la nueva contraseña';
      return;
    }

    this.adminService.cambiarPasswordUsuario(this.idCambioPassword, this.nuevaPassword).subscribe({
      next: () => {
        this.mensajeCambioPassword = '✅ Contraseña actualizada correctamente';
        this.idCambioPassword = 0;
        this.nuevaPassword = '';
        this.ocultarMensajeCambioPassword();
      },
      error: (err) => {
        this.mensajeCambioPassword = '❌ Error al actualizar contraseña';
        console.error(err);
        this.ocultarMensajeCambioPassword();
      }
    });
  }

  private ocultarMensajeCambioPassword(): void {
    setTimeout(() => {
      this.mensajeCambioPassword = '';
    }, 4000);
  }

  idCambioRol: number = 0;
  nuevoRol: string = '';
  nuevoJwtSecret: string = '';
  mensajeCambioRol: string = '';

  cambiarRolManual(): void {
    if (!this.idCambioRol || !this.nuevoRol || !this.nuevoJwtSecret) {
      this.mensajeCambioRol = '⚠️ Debe ingresar ID, nuevo rol y JWT secret';
      this.ocultarMensajeCambioRol();
      return;
    }

    const datos = {
      rol: this.nuevoRol,
      jwtSecret: this.nuevoJwtSecret
    };

    this.adminService.cambiarRolManual(this.idCambioRol, datos).subscribe({
      next: (res) => {
        this.mensajeCambioRol = '✅ Rol y JWT actualizados correctamente';
        this.limpiarCambioRol();
        this.ocultarMensajeCambioRol();
      },
      error: (err) => {
        this.mensajeCambioRol = '❌ Error al actualizar rol';
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




  limpiarCambioPassword(): void {
    this.idCambioPassword = 0;
    this.nuevaPassword = '';
    this.mensajeCambioPassword = '';
  }

  idDesactivar: number = 0;
  mensajeDesactivar: string = '';

  idRestaurar: number = 0;
  mensajeRestaurar: string = '';

  desactivarUsuario(): void {
    if (!this.idDesactivar) {
      this.mensajeDesactivar = '⚠️ Debe ingresar un ID válido';
      return;
    }

    this.adminService.desactivarUsuario(this.idDesactivar).subscribe({
      next: () => {
        this.mensajeDesactivar = '✅ Usuario desactivado correctamente';
        this.idDesactivar = 0;
        this.ocultarMensajeDesactivar();
      },
      error: (err) => {
        this.mensajeDesactivar = '❌ Error al desactivar usuario';
        console.error(err);
        this.ocultarMensajeDesactivar();
      }
    });
  }

  private ocultarMensajeDesactivar(): void {
    setTimeout(() => {
      this.mensajeDesactivar = '';
    }, 4000);
  }

  restaurarUsuario(): void {
    if (!this.idRestaurar) {
      this.mensajeRestaurar = '⚠️ Debe ingresar un ID válido';
      return;
    }

    this.adminService.restaurarUsuario(this.idRestaurar).subscribe({
      next: () => {
        this.mensajeRestaurar = '✅ Usuario restaurado correctamente';
        this.idRestaurar = 0;
        this.ocultarMensajeRestaurar();
      },
      error: (err) => {
        this.mensajeRestaurar = '❌ Error al restaurar usuario';
        console.error(err);
        this.ocultarMensajeRestaurar();
      }
    });
  }

  private ocultarMensajeRestaurar(): void {
    setTimeout(() => {
      this.mensajeRestaurar = '';
    }, 4000);
  }


  limpiarDesactivar(): void {
    this.idDesactivar = 0;
    this.mensajeDesactivar = '';
  }

  limpiarRestaurar(): void {
    this.idRestaurar = 0;
    this.mensajeRestaurar = '';
  }




}
