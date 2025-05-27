import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-modulo-doctor',
  standalone: true,
  templateUrl: './modulo.doctor.component.html',
  styleUrls: ['./modulo.doctor.component.css'],
  imports: [CommonModule, FormsModule],
})
export class ModuloDoctorComponent {
  vista: string = '';
  modalActivo: boolean = false;

  mensaje: string = '';
  error: string = '';

  constructor(private adminService: AdminService) { }

  abrirModal(modulo: string) {
    this.vista = modulo;
    this.modalActivo = true;
    this.mensaje = '';
    this.error = '';
  }

  cerrarModal() {
    this.modalActivo = false;
    this.vista = '';
    this.mensaje = '';
    this.error = '';
    this.limpiarFormulario();
  }

  // Formulario para registrar doctor
  doctor = {
    colegiado: '',
    nombrecompleto: '',
    especialidad: '',
    direccion: '',
    centrohospitalario: '',
    edad: null,
    observacion: ''
  };

  guardarDoctor() {
    if (
      !this.doctor.colegiado ||
      !this.doctor.nombrecompleto ||
      !this.doctor.especialidad ||
      this.doctor.edad == null
    ) {
      this.error = '❌ Por favor, completa todos los campos obligatorios.';
      this.mensaje = '';
      this.mostrarMensaje = true;

      // ⏳ Oculta el mensaje después de 4 segundos
      setTimeout(() => {
        this.error = '';
        this.mostrarMensaje = false;
      }, 4000);

      return;
    }

    this.adminService.guardarDoctorDesdeAdmin(this.doctor).subscribe({
      next: () => {
        this.mensaje = '✅ Doctor registrado exitosamente.';
        this.error = '';
        this.mostrarMensaje = true;
        this.limpiarFormulario();

        // ⏳ Oculta el mensaje luego de 4 segundos
        setTimeout(() => {
          this.mensaje = '';
          this.mostrarMensaje = false;
        }, 4000);
      },
      error: () => {
        this.error = '❌ Error al registrar el doctor.';
        this.mensaje = '';
        this.mostrarMensaje = true;

        // ⏳ Oculta el mensaje luego de 4 segundos
        setTimeout(() => {
          this.error = '';
          this.mostrarMensaje = false;
        }, 4000);
      }
    });
  }

  limpiarFormulario() {
    this.doctor = {
      colegiado: '',
      nombrecompleto: '',
      especialidad: '',
      direccion: '',
      centrohospitalario: '',
      edad: null,
      observacion: ''
    };
  }

  // Resultados
  doctores: any[] = [];

  // Filtros
  filtroNombre: string = '';
  filtroColegiado: string = '';
  filtroEspecialidad: string = '';
  filtroDireccion: string = '';
  filtroCentro: string = '';
  filtroEdad: number | null = null;
  filtroFecha: string = '';

  idDoctor: number | null = null;
  nombreDoctor: string = '';
  colegiado: string = '';
  especialidad: string = '';
  direccion: string = '';
  centrohospitalario: string = '';
  edadDoctor: number | null = null;
  fechaDoctor: string = '';
  estadoDoctor: string = ''; // 'activo' o 'inactivo'



  consultarDoctores() {
    this.adminService.consultarDoctoresDesdeAdmin().subscribe({
      next: (data) => {
        this.doctores = data;
        this.mensaje = '✅ Doctores cargados correctamente.';
        this.error = '';
      },
      error: () => {
        this.error = '❌ Error al cargar doctores.';
        this.mensaje = '';
      }
    });
  }

  buscarDoctorPorId() {
    if (this.idDoctor != null) {
      this.adminService.buscarDoctorPorId(this.idDoctor).subscribe({
        next: (data) => {
          this.doctores = [typeof data === 'string' ? JSON.parse(data) : data];
          this.mensaje = '✅ Doctor encontrado por ID.';
          this.error = '';
        },
        error: () => {
          this.error = '❌ No se encontró doctor con ese ID.';
          this.mensaje = '';
          this.doctores = [];
        }
      });
    }
  }


  buscarDoctorPorNombre() {
    this.adminService.buscarDoctorPorNombre(this.nombreDoctor).subscribe({
      next: (data) => {
        const resultado = typeof data === 'string' ? JSON.parse(data) : data;
        this.doctores = Array.isArray(resultado) ? resultado : [resultado];
        this.mensaje = '✅ Resultado por nombre.';
        this.error = '';
      },
      error: () => {
        this.error = '❌ No se encontró doctor con ese nombre.';
        this.mensaje = '';
        this.doctores = [];
      }
    });
  }

  campoSeleccionado: string = '';
  idActualizar: number | null = null;
  nuevoValor: string | number | null = null;





  buscarDoctorPorColegiado() {
    if (this.colegiado.trim() !== '') {
      this.adminService.buscarDoctorPorColegiado(this.colegiado).subscribe({
        next: (data) => {
          const resultado = typeof data === 'string' ? JSON.parse(data) : data;

          // ✅ Ya es un array, así que lo asignas directamente
          this.doctores = resultado;

          this.mensaje = '✅ Resultado por colegiado.';
          this.error = '';
        },
        error: () => {
          this.error = '❌ No se encontró doctor con ese colegiado.';
          this.mensaje = '';
          this.doctores = [];
        }
      });
    }
  }



  buscarDoctorPorEspecialidad() {
    this.adminService.buscarDoctorPorEspecialidad(this.especialidad).subscribe({
      next: (data) => {
        this.doctores = data;
        this.mensaje = '✅ Resultado por especialidad.';
        this.error = '';
      },
      error: () => {
        this.error = '❌ No se encontró doctor con esa especialidad.';
        this.mensaje = '';
      }
    });
  }

  buscarDoctorPorDireccion() {
    this.adminService.buscarDoctorPorDireccion(this.direccion).subscribe({
      next: (data) => {
        this.doctores = data;
        this.mensaje = '✅ Resultado por dirección.';
        this.error = '';
      },
      error: () => {
        this.error = '❌ No se encontró doctor con esa dirección.';
        this.mensaje = '';
      }
    });
  }

  buscarDoctorPorCentro() {
    this.adminService.buscarDoctorPorCentro(this.centrohospitalario).subscribe({
      next: (data) => {
        this.doctores = data;
        this.mensaje = '✅ Resultado por centro hospitalario.';
        this.error = '';
      },
      error: () => {
        this.error = '❌ No se encontró doctor en ese centro.';
        this.mensaje = '';
      }
    });
  }

  buscarDoctorPorEdad() {
    if (this.edadDoctor != null) {
      this.adminService.buscarDoctorPorEdad(this.edadDoctor).subscribe({
        next: (data) => {
          this.doctores = data;
          this.mensaje = '✅ Resultado por edad.';
          this.error = '';
        },
        error: () => {
          this.error = '❌ No se encontró doctor con esa edad.';
          this.mensaje = '';
        }
      });
    }
  }

  buscarDoctorPorFecha() {
    this.adminService.buscarDoctorPorFecha(this.fechaDoctor).subscribe({
      next: (data) => {
        this.doctores = data;
        this.mensaje = '✅ Resultado por fecha.';
        this.error = '';
      },
      error: () => {
        this.error = '❌ No se encontró doctor con esa fecha.';
        this.mensaje = '';
      }
    });
  }

  consultarDoctoresActivos() {
    this.adminService.consultarDoctoresActivos().subscribe({
      next: (data) => {
        this.doctores = data;
        this.mensaje = '✅ Doctores activos cargados.';
        this.error = '';
      },
      error: () => {
        this.error = '❌ Error al cargar doctores activos.';
        this.mensaje = '';
      }
    });
  }

  consultarDoctoresInactivos() {
    this.adminService.consultarDoctoresInactivos().subscribe({
      next: (data) => {
        this.doctores = data;
        this.mensaje = '✅ Doctores inactivos cargados.';
        this.error = '';
      },
      error: () => {
        this.error = '❌ Error al cargar doctores inactivos.';
        this.mensaje = '';
      }
    });
  }

  limpiarFiltrosDoctor() {
    this.idDoctor = null;
    this.nombreDoctor = '';
    this.colegiado = '';
    this.especialidad = '';
    this.direccion = '';
    this.centrohospitalario = '';
    this.edadDoctor = null;
    this.fechaDoctor = '';
    this.doctores = [];
    this.mensaje = '';
    this.error = '';
  }

  idEliminarDoctor: number | null = null;
  idRestaurarDoctor: number | null = null;

  limpiarCamposDoctorBorradoRestauracion() {
    this.idEliminarDoctor = null;
    this.idRestaurarDoctor = null;
    this.mensaje = '';
    this.error = '';
  }

  eliminarDoctor() {
    if (this.idEliminarDoctor != null) {
      this.adminService.borrarDoctor(this.idEliminarDoctor).subscribe({
        next: () => {
          this.mensaje = '✅ Doctor borrado correctamente.';
          this.error = '';
          this.idEliminarDoctor = null;
        },
        error: () => {
          this.error = '❌ No se pudo borrar el doctor.';
          this.mensaje = '';
        }
      });
    }
  }

  restaurarDoctor() {
    if (this.idRestaurarDoctor != null) {
      this.adminService.restaurarDoctor(this.idRestaurarDoctor).subscribe({
        next: () => {
          this.mensaje = '✅ Doctor restaurado correctamente.';
          this.error = '';
          this.idRestaurarDoctor = null;
        },
        error: () => {
          this.error = '❌ No se pudo restaurar el doctor.';
          this.mensaje = '';
        }
      });
    }
  }

  doctorActualizar: any = {
    iddoctor: null,
    colegiado: '',
    nombrecompleto: '',
    especialidad: '',
    direccion: '',
    centrohospitalario: '',
    edad: null,
    observacion: ''
  };

  buscarDoctorParaActualizar() {
    if (this.doctorActualizar.iddoctor != null) {
      this.adminService.buscarDoctorPorId(this.doctorActualizar.iddoctor).subscribe({
        next: (data) => {
          const doctor = typeof data === 'string' ? JSON.parse(data) : data;
          this.doctorActualizar = { ...doctor };
          this.mensaje = '✅ Doctor cargado correctamente.';
          this.error = '';
        },
        error: () => {
          this.error = '❌ No se encontró el doctor.';
          this.mensaje = '';
          this.doctorActualizar = {
            iddoctor: null,
            colegiado: '',
            nombrecompleto: '',
            especialidad: '',
            direccion: '',
            centrohospitalario: '',
            edad: null,
            observacion: ''
          };
        }
      });
    }
  }

  actualizarDoctor() {
    if (this.doctorActualizar.iddoctor != null) {
      this.adminService.actualizarDoctorCompleto(this.doctorActualizar.iddoctor, this.doctorActualizar).subscribe({
        next: () => {
          this.mensaje = '✅ Doctor actualizado correctamente.';
          this.error = '';
          this.limpiarActualizarDoctor();

          // ✅ Borra el mensaje después de 4 segundos
          setTimeout(() => {
            this.mensaje = '';
          }, 4000);
        },
        error: () => {
          this.error = '❌ Error al actualizar doctor.';
          this.mensaje = '';
        }
      });
    }
  }


  limpiarActualizarDoctor() {
    this.doctorActualizar = {
      iddoctor: null,
      colegiado: '',
      nombrecompleto: '',
      especialidad: '',
      direccion: '',
      centrohospitalario: '',
      edad: null,
      observacion: ''
    };
    // ✅ Ya no borrar mensaje ni error aquí
  }


  actualizarNombreDoctor() {
    if (this.doctorActualizar.iddoctor && this.doctorActualizar.nombrecompleto) {
      this.adminService.actualizarNombreDoctor(this.doctorActualizar.iddoctor, this.doctorActualizar.nombrecompleto).subscribe({
        next: () => {
          this.mensaje = '✅ Nombre actualizado correctamente.';
          this.error = '';
          this.mostrarMensaje = true;

          setTimeout(() => {
            this.mensaje = '';
            this.mostrarMensaje = false;
          }, 4000);
        },
        error: () => {
          this.error = '❌ Error al actualizar el nombre.';
          this.mensaje = '';
          this.mostrarMensaje = true;

          setTimeout(() => {
            this.error = '';
            this.mostrarMensaje = false;
          }, 4000);
        }
      });
    }
  }

  actualizarColegiadoDoctor() {
    if (this.doctorActualizar.iddoctor && this.doctorActualizar.colegiado) {
      this.adminService.actualizarColegiadoDoctor(this.doctorActualizar.iddoctor, this.doctorActualizar.colegiado).subscribe({
        next: () => {
          this.mensaje = '✅ Colegiado actualizado correctamente.';
          this.error = '';
          this.mostrarMensaje = true;

          setTimeout(() => {
            this.mensaje = '';
            this.mostrarMensaje = false;
          }, 4000);
        },
        error: () => {
          this.error = '❌ Error al actualizar el Colegiado.';
          this.mensaje = '';
          this.mostrarMensaje = true;

          setTimeout(() => {
            this.error = '';
            this.mostrarMensaje = false;
          }, 4000);
        }
      });
    }
  }

  actualizarEspecialidadDoctor() {
    if (this.doctorActualizar.iddoctor && this.doctorActualizar.especialidad) {
      this.adminService.actualizarEspecialidadDoctor(this.doctorActualizar.iddoctor, this.doctorActualizar.especialidad).subscribe({
        next: () => {
          this.mensaje = '✅ Especialidad actualizada correctamente.';
          this.error = '';
          this.mostrarMensaje = true;

          setTimeout(() => {
            this.mensaje = '';
            this.mostrarMensaje = false;
          }, 4000);
        },
        error: () => {
          this.error = '❌ Error al actualizar la especialidad.';
          this.mensaje = '';
          this.mostrarMensaje = true;

          setTimeout(() => {
            this.mensaje = '';
            this.mostrarMensaje = false;
          }, 4000);
        }
      });
    }
  }

  actualizarDireccionDoctor() {
    if (this.doctorActualizar.iddoctor && this.doctorActualizar.direccion) {
      this.adminService.actualizarDireccionDoctor(this.doctorActualizar.iddoctor, this.doctorActualizar.direccion).subscribe({
        next: () => {
          this.mensaje = '✅ Dirección actualizada correctamente.';
          this.error = '';
          this.mostrarMensaje = true;

          setTimeout(() => {
            this.mensaje = '';
            this.mostrarMensaje = false;
          }, 4000);
        },
        error: () => {
          this.error = '❌ Error al actualizar la dirección.';
          this.mensaje = '';
          this.mostrarMensaje = true;

          setTimeout(() => {
            this.mensaje = '';
            this.mostrarMensaje = false;
          }, 4000);
        }
      });
    }
  }

  actualizarCentroDoctor() {
    if (this.doctorActualizar.iddoctor && this.doctorActualizar.centrohospitalario) {
      this.adminService.actualizarCentroHospitalarioDoctor(this.doctorActualizar.iddoctor, this.doctorActualizar.centrohospitalario).subscribe({
        next: () => {
          this.mensaje = '✅ Centro hospitalario actualizado correctamente.';
          this.error = '';
          this.mostrarMensaje = true;

          setTimeout(() => {
            this.mensaje = '';
            this.mostrarMensaje = false;
          }, 4000);
        },
        error: () => {
          this.error = '❌ Error al actualizar el centro hospitalario.';
          this.mensaje = '';
          this.mostrarMensaje = true;

          setTimeout(() => {
            this.mensaje = '';
            this.mostrarMensaje = false;
          }, 4000);
        }
      });
    }
  }

  actualizarEdadDoctor() {
    if (this.doctorActualizar.iddoctor && this.doctorActualizar.edad != null) {
      this.adminService.actualizarEdadDoctor(this.doctorActualizar.iddoctor, this.doctorActualizar.edad).subscribe({
        next: () => {
          this.mensaje = '✅ Edad actualizada correctamente.';
          this.error = '';
          this.mostrarMensaje = true;

          setTimeout(() => {
            this.mensaje = '';
            this.mostrarMensaje = false;
          }, 4000);
        },
        error: () => {
          this.error = '❌ Error al actualizar la edad.';
          this.mensaje = '';
          this.mostrarMensaje = true;

          setTimeout(() => {
            this.mensaje = '';
            this.mostrarMensaje = false;
          }, 4000);
        }
      });
    }
  }

  actualizarObservacionDoctor() {
    if (this.doctorActualizar.iddoctor && this.doctorActualizar.observacion) {
      this.adminService.actualizarObservacionDoctor(this.doctorActualizar.iddoctor, this.doctorActualizar.observacion).subscribe({
        next: () => {
          this.mensaje = '✅ Observación actualizada correctamente.';
          this.error = '';
          this.mostrarMensaje = true;

          setTimeout(() => {
            this.mensaje = '';
            this.mostrarMensaje = false;
          }, 4000);
        },
        error: () => {
          this.error = '❌ Error al actualizar la observación.';
          this.mensaje = '';
          this.mostrarMensaje = true;

          setTimeout(() => {
            this.mensaje = '';
            this.mostrarMensaje = false;
          }, 4000);
        }
      });
    }
  }

  limpiarCamposActualizarIndividual() {
    this.doctorActualizar = {
      iddoctor: null,
      colegiado: '',
      nombrecompleto: '',
      especialidad: '',
      direccion: '',
      centrohospitalario: '',
      edad: null,
      observacion: ''
    };
    this.mensaje = '';
    this.error = '';
  }

  mostrarDoctores: boolean = false;
  filtroId: number | null = null;

  filtrarPorId(): void {
    if (this.filtroId != null) {
      this.adminService.buscarDoctorPorId(this.filtroId).subscribe({
        next: (data) => {
          this.doctores = [typeof data === 'string' ? JSON.parse(data) : data];
          this.mensaje = '✅ Doctor encontrado por ID.';
          this.error = '';
          this.mostrarDoctores = true;
        },
        error: () => {
          this.error = '❌ No se encontró doctor con ese ID.';
          this.mensaje = '';
          this.doctores = [];
          this.mostrarDoctores = false;
        }
      });
    }
  }

  mostrarMensaje: boolean = true;




}
