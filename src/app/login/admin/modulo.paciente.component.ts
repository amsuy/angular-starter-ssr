import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service'; // ⬅️ Importación correcta

@Component({
  selector: 'app-modulo-paciente',
  standalone: true,
  templateUrl: './modulo.paciente.component.html',
  styleUrls: ['./modulo.paciente.component.css'],
  imports: [CommonModule, FormsModule],
})
export class ModuloPacienteComponent {
  vista: string = '';
  modalActivo: boolean = false;

  paciente = {
    nombrecompleto: '',
    edad: null,
    nit: null,
    cui: null,
    direccion: '',
    telefono: null
  };

  mensaje = '';
  error = '';

  constructor(private adminService: AdminService) { } // ⬅️ Inyectamos el nuevo servicio

  abrirModal(modulo: string) {
    this.vista = modulo;
    this.modalActivo = true;
  }

  cerrarModal() {
    this.modalActivo = false;
    this.mensaje = '';
    this.error = '';
  }

  mostrarMensaje: boolean = false;


  guardarPaciente() {
    if (!this.paciente.nombrecompleto || !this.paciente.nit || !this.paciente.cui) {
      this.error = '❌ Por favor, completa los campos obligatorios.';
      this.mensaje = '';
      return;
    }

    this.adminService.guardarPacienteDesdeAdmin(this.paciente).subscribe({
      next: () => {
        this.mensaje = '✅ Paciente guardado correctamente.';
        this.error = '';
        this.mostrarMensaje = true;
        setTimeout(() => {
          this.mostrarMensaje = false;
        }, 4000);
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
        this.error = '❌ Paciente ya registrado.';
        this.mensaje = '';
        this.mostrarMensaje = true;
        setTimeout(() => {
          this.mostrarMensaje = false;
        }, 4000);
      }
    });
  }

  pacientes: any[] = [];
  mostrarPacientes = false;

  consultarPacientesDesdeBoton() {
    this.adminService.consultarPacientesDesdeAdmin().subscribe({
      next: (data) => {
        try {
          const parsed = typeof data === 'string' ? JSON.parse(data) : data;
          this.pacientes = parsed;
          this.mostrarPacientes = true;
          this.error = '';
          this.mensaje = '';
        } catch (e) {
          this.error = '❌ Error al interpretar la respuesta.';
          this.mostrarPacientes = false;
        }
      },
      error: () => {
        this.error = '❌ Error al consultar pacientes.';
        this.mostrarPacientes = false;
      }
    });
  }

  // Campos de filtro
  filtroId: number | null = null;
  filtroNit: string = '';
  filtroCui: string = '';
  filtroNombre: string = '';
  filtroDireccion: string = '';
  filtroTelefono: string = '';
  filtroFecha: string = '';

  filtrarPorId() {
    if (this.filtroId !== null) {
      this.adminService.buscarPacientePorId(this.filtroId).subscribe({
        next: (data) => {
          this.pacientes = [typeof data === 'string' ? JSON.parse(data) : data];
          this.mostrarPacientes = true;
          this.error = '';
        },
        error: () => {
          this.error = '❌ No se encontró paciente con ese ID.';
          this.pacientes = [];
          this.mostrarPacientes = false;
        }
      });
    }
  }

  filtrarPorNit() {
    if (this.filtroNit.trim() !== '') {
      this.adminService.buscarPacientePorNit(this.filtroNit).subscribe({
        next: (data) => {
          this.pacientes = typeof data === 'string' ? JSON.parse(data) : data; // 👈 sin corchetes
          this.mostrarPacientes = true;
          this.error = '';
        },
        error: (err) => {
          console.error(err);
          this.error = '❌ No se encontró paciente con ese NIT.';
          this.pacientes = [];
          this.mostrarPacientes = false;
        }
      });
    }
  }



  filtrarPorCui() {
    if (this.filtroCui.trim() !== '') {
      this.adminService.buscarPacientePorCui(this.filtroCui).subscribe({
        next: (data) => {
          this.pacientes = typeof data === 'string' ? JSON.parse(data) : data;
          this.mostrarPacientes = true;
          this.error = '';
        },
        error: (err) => {
          console.error(err);
          this.error = '❌ No se encontró paciente con ese CUI.';
          this.pacientes = [];
          this.mostrarPacientes = false;
        }
      });
    }
  }



  filtrarPorNombre() {
    if (this.filtroNombre.trim() !== '') {
      this.adminService.buscarPacientePorNombre(this.filtroNombre).subscribe({
        next: (data) => {
          this.pacientes = typeof data === 'string' ? JSON.parse(data) : data;
          this.mostrarPacientes = true;
          this.error = '';
        },
        error: () => {
          this.error = '❌ No se encontraron pacientes con ese nombre.';
          this.pacientes = [];
          this.mostrarPacientes = false;
        }
      });
    }
  }

  filtrarPorDireccion() {
    if (this.filtroDireccion.trim() !== '') {
      this.adminService.buscarPacientePorDireccion(this.filtroDireccion).subscribe({
        next: (data) => {
          this.pacientes = typeof data === 'string' ? JSON.parse(data) : data;
          this.mostrarPacientes = true;
          this.error = '';
        },
        error: () => {
          this.error = '❌ No se encontraron pacientes con esa dirección.';
          this.pacientes = [];
          this.mostrarPacientes = false;
        }
      });
    }
  }

  filtrarPorTelefono() {
    if (this.filtroTelefono.trim() !== '') {
      this.adminService.buscarPacientePorTelefono(this.filtroTelefono).subscribe({
        next: (data) => {
          this.pacientes = typeof data === 'string' ? JSON.parse(data) : data;
          this.mostrarPacientes = true;
          this.error = '';
        },
        error: (err) => {
          console.error(err);
          this.error = '❌ No se encontró paciente con ese teléfono.';
          this.pacientes = [];
          this.mostrarPacientes = false;
        }
      });
    }
  }



  filtrarPorFecha() {
    if (this.filtroFecha !== '') {
      this.adminService.buscarPacientePorFecha(this.filtroFecha).subscribe({
        next: (data) => {
          this.pacientes = typeof data === 'string' ? JSON.parse(data) : data;
          this.mostrarPacientes = true;
          this.error = '';
        },
        error: () => {
          this.error = '❌ No se encontraron pacientes en esa fecha.';
          this.pacientes = [];
          this.mostrarPacientes = false;
        }
      });
    }
  }

  limpiarFiltros() {
    this.filtroId = null;
    this.filtroNit = '';
    this.filtroCui = '';
    this.filtroNombre = '';
    this.filtroDireccion = '';
    this.filtroTelefono = '';
    this.filtroFecha = '';

    this.pacientes = [];
    this.mostrarPacientes = false;
    this.error = '';
    this.mensaje = '';
  }

  idEliminar: number | null = null;
  idRestaurar: number | null = null;

  eliminarPaciente() {
    if (this.idEliminar) {
      this.adminService.borrarPaciente(this.idEliminar).subscribe({
        next: () => {
          this.mensaje = '✅ Paciente eliminado correctamente.';
          this.error = '';
          this.mostrarMensaje = true;
          setTimeout(() => {
            this.mostrarMensaje = false;
          }, 4000);
          this.idEliminar = null;
        },
        error: () => {
          this.error = '❌ No se pudo eliminar el paciente.';
          this.mensaje = '';
          this.mostrarMensaje = true;
          setTimeout(() => {
            this.mostrarMensaje = false;
          }, 4000);
        }
      });
    }
  }

  restaurarPaciente() {
    if (this.idRestaurar) {
      this.adminService.restaurarPaciente(this.idRestaurar).subscribe({
        next: () => {
          this.mensaje = '✅ Paciente restaurado correctamente.';
          this.error = '';
          this.mostrarMensaje = true;
          setTimeout(() => {
            this.mostrarMensaje = false;
          }, 4000);
          this.idRestaurar = null;
        },
        error: () => {
          this.error = '❌ No se pudo restaurar el paciente.';
          this.mensaje = '';
          this.mostrarMensaje = true;
          setTimeout(() => {
            this.mostrarMensaje = false;
          }, 4000);
        }
      });
    }
  }

  actualizarPacienteCompleto(id: number) {
    this.adminService.actualizarPacienteCompleto(id, this.paciente).subscribe({
      next: () => {
        this.mensaje = '✅ Paciente actualizado completamente.';
        this.error = '';
      },
      error: () => {
        this.error = '❌ Error al actualizar el paciente.';
        this.mensaje = '';
      }
    });
  }

  idActualizar: number | null = null;

  // 🔄 Obtener datos del paciente por ID
  cargarDatosPacientePorId() {
    if (this.idActualizar !== null) {
      this.adminService.obtenerPacientePorId(this.idActualizar).subscribe({
        next: (data) => {
          const paciente = typeof data === 'string' ? JSON.parse(data) : data;
          this.paciente = {
            nombrecompleto: paciente.nombrecompleto,
            edad: paciente.edad,
            nit: paciente.nit,
            cui: paciente.cui,
            direccion: paciente.direccion,
            telefono: paciente.telefono
          };
          this.error = '';
          this.mensaje = '';
        },
        error: () => {
          this.error = '❌ No se encontró paciente con ese ID.';
          this.paciente = {
            nombrecompleto: '',
            edad: null,
            nit: null,
            cui: null,
            direccion: '',
            telefono: null
          };
        }
      });
    }
  }

  // 🔄 Limpiar campos del formulario
  limpiarFormularioActualizar() {
    this.idActualizar = null;
    this.paciente = {
      nombrecompleto: '',
      edad: null,
      nit: null,
      cui: null,
      direccion: '',
      telefono: null
    };
    this.mensaje = '';
    this.error = '';
  }


  actualizarNombre(id: number, nombre: string) {
    this.adminService.actualizarNombrePaciente(id, nombre).subscribe({
      next: () => {
        this.mensaje = '✅ Nombre actualizado.';
        this.error = '';
        this.mostrarMensaje = true;
        setTimeout(() => {
          this.mostrarMensaje = false;
        }, 4000);
      },
      error: () => {
        this.error = '❌ Error al actualizar el nombre.';
        this.mensaje = '';
        this.mostrarMensaje = true;
        setTimeout(() => {
          this.mostrarMensaje = false;
        }, 4000);
      }
    });
  }

  actualizarEdad(id: number, edad: number) {
    this.adminService.actualizarEdadPaciente(id, edad).subscribe({
      next: () => {
        this.mensaje = '✅ Edad actualizada.';
        this.error = '';
        this.mostrarMensaje = true;
        setTimeout(() => {
          this.mostrarMensaje = false;
        }, 4000);
      },
      error: () => {
        this.error = '❌ Error al actualizar la edad.';
        this.mensaje = '';
        this.mostrarMensaje = true;
        setTimeout(() => {
          this.mostrarMensaje = false;
        }, 4000);
      }
    });
  }

  actualizarDireccion(id: number, direccion: string) {
    this.adminService.actualizarDireccionPaciente(id, direccion).subscribe({
      next: () => {
        this.mensaje = '✅ Direccion actualizada.';
        this.error = '';
        this.mostrarMensaje = true;
        setTimeout(() => {
          this.mostrarMensaje = false;
        }, 4000);
      },
      error: () => {
        this.error = '❌ Error al actualizar la direccion.';
        this.mensaje = '';
        this.mostrarMensaje = true;
        setTimeout(() => {
          this.mostrarMensaje = false;
        }, 4000);
      }
    });
  }

  actualizarNit(id: number, nit: number) {
    this.adminService.actualizarNitPaciente(id, nit).subscribe({
      next: () => {
        this.mensaje = '✅ NIT actualizado.';
        this.error = '';
        this.mostrarMensaje = true;
        setTimeout(() => {
          this.mostrarMensaje = false;
        }, 4000);
      },
      error: () => {
        this.error = '❌ Error al actualizar el NIT.';
        this.mensaje = '';
        this.mostrarMensaje = true;
        setTimeout(() => {
          this.mostrarMensaje = false;
        }, 4000);
      }
    });
  }

  actualizarCui(id: number, cui: number) {
    this.adminService.actualizarCuiPaciente(id, cui).subscribe({
      next: () => {
        this.mensaje = '✅ CUI o DPI actualizado.';
        this.error = '';
        this.mostrarMensaje = true;
        setTimeout(() => {
          this.mostrarMensaje = false;
        }, 4000);
      },
      error: () => {
        this.error = '❌ Error al actualizar el CUI o DPI.';
        this.mensaje = '';
        this.mostrarMensaje = true;
        setTimeout(() => {
          this.mostrarMensaje = false;
        }, 4000);
      }
    });
  }

  actualizarTelefono(id: number, telefono: number) {
    this.adminService.actualizarTelefonoPaciente(id, telefono).subscribe({
      next: () => {
        this.mensaje = '✅ Telefono actualizado.';
        this.error = '';
        this.mostrarMensaje = true;
        setTimeout(() => {
          this.mostrarMensaje = false;
        }, 4000);
      },
      error: () => {
        this.error = '❌ Error al actualizar el Telefono.';
        this.mensaje = '';
        this.mostrarMensaje = true;
        setTimeout(() => {
          this.mostrarMensaje = false;
        }, 4000);
      }
    });
  }

  campoSeleccionado: string = '';
  nuevoValor: any = '';

  limpiarCampos() {
    this.idActualizar = null;
    this.nuevoValor = '';
    this.mensaje = '';
    this.error = '';
  }



}
