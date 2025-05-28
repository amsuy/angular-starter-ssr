import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'https://optimistic-appreciation-production-b7e1.up.railway.app/api/admin';

  constructor(private http: HttpClient) { }

  // ✅ Guardar paciente desde el AdministradorController
  guardarPacienteDesdeAdmin(paciente: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/pacientes/ingresar`, paciente, { headers });
  }

  // ✅ Cambiar rol y JWT secret del usuario
cambiarRolManual(id: number, datos: { rol: string, jwtSecret: string }): Observable<any> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.put(`${this.baseUrl}/usuarios/${id}/cambiar-rol`, datos, { headers, responseType: 'text' });
}


  // ✅ Consultar pacientes desde AdministradorController
  consultarPacientesDesdeAdmin(): Observable<any> {
    return this.http.get(`${this.baseUrl}/pacientes/consultar`);
  }

  // ✅ Buscar paciente por ID
  buscarPacientePorId(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/pacientes/buscar/id/${id}`);
  }

  // ✅ Buscar paciente por NIT
  buscarPacientePorNit(nit: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/pacientes/buscar/nit/${nit}`);
  }

  // ✅ Buscar paciente por CUI
  buscarPacientePorCui(cui: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/pacientes/buscar/cui/${cui}`);
  }

  // ✅ Buscar paciente por nombre
  buscarPacientePorNombre(nombre: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/pacientes/buscar/nombre/${nombre}`);
  }

  // ✅ Buscar paciente por dirección
  buscarPacientePorDireccion(direccion: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/pacientes/buscar/direccion/${direccion}`);
  }

  // ✅ Buscar paciente por teléfono
  buscarPacientePorTelefono(telefono: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/pacientes/buscar/telefono/${telefono}`);
  }

  // ✅ Buscar paciente por fecha
  buscarPacientePorFecha(fecha: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/pacientes/buscar/fecha/${fecha}`);
  }

  // 🔴 Borrar paciente
  borrarPaciente(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/pacientes/borrar/${id}`, null, { responseType: 'text' });
  }

  // 🟢 Restaurar paciente
  restaurarPaciente(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/pacientes/restaurar/${id}`, null, { responseType: 'text' });
  }

  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  actualizarPacienteCompleto(id: number, paciente: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/pacientes/actualizar/${id}`,
      paciente,
      {
        headers: this.headers,
        responseType: 'text' as 'json'  // ✅ Esta línea evita el falso error
      }
    );
  }


  obtenerPacientePorId(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/pacientes/buscar/id/${id}`);
  }


  actualizarNombrePaciente(id: number, nombre: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/pacientes/actualizar/nombre/${id}/${nombre}`, null, { responseType: 'text' });
  }

  actualizarEdadPaciente(id: number, edad: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/pacientes/actualizar/edad/${id}/${edad}`, null, { responseType: 'text' });
  }

  actualizarDireccionPaciente(id: number, direccion: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/pacientes/actualizar/direccion/${id}/${direccion}`, null, { responseType: 'text' });
  }

  actualizarNitPaciente(id: number, nit: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/pacientes/actualizar/nit/${id}/${nit}`, null, { responseType: 'text' });
  }

  actualizarCuiPaciente(id: number, cui: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/pacientes/actualizar/cui/${id}/${cui}`, null, { responseType: 'text' });
  }

  actualizarTelefonoPaciente(id: number, telefono: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/pacientes/actualizar/telefono/${id}/${telefono}`, null, { responseType: 'text' });
  }

  // ✅ Guardar doctor desde el AdministradorController
  guardarDoctorDesdeAdmin(doctor: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/doctores/ingresar`, doctor, { headers });
  }

  // ✅ Consultar todos los doctores
  consultarDoctoresDesdeAdmin(): Observable<any> {
    return this.http.get(`${this.baseUrl}/doctores/consultar`);
  }

  // ✅ Buscar doctor por ID
  buscarDoctorPorId(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/doctores/buscar/id/${id}`);
  }

  // ✅ Buscar doctor por nombre
  buscarDoctorPorNombre(nombre: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/doctores/buscar/nombre/${nombre}`);
  }

  // ✅ Buscar doctor por colegiado
  buscarDoctorPorColegiado(colegiado: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/doctores/buscar/colegiado/${colegiado}`);
  }

  // ✅ Buscar doctor por especialidad
  buscarDoctorPorEspecialidad(especialidad: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/doctores/buscar/especialidad/${especialidad}`);
  }

  // ✅ Buscar doctor por dirección
  buscarDoctorPorDireccion(direccion: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/doctores/buscar/direccion/${direccion}`);
  }

  // ✅ Buscar doctor por centro hospitalario
  buscarDoctorPorCentro(centro: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/doctores/buscar/centrohospitalario/${centro}`);
  }

  // ✅ Buscar doctor por edad
  buscarDoctorPorEdad(edad: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/doctores/buscar/edad/${edad}`);
  }

  // ✅ Buscar doctor por fecha
  buscarDoctorPorFecha(fecha: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/doctores/buscar/fecha/${fecha}`);
  }

  // ✅ Consultar doctores activos
  consultarDoctoresActivos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/doctores/buscar/estado/activo`);
  }

  // ✅ Consultar doctores inactivos
  consultarDoctoresInactivos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/doctores/buscar/estado/inactivo`);
  }

  // 🔴 Borrar doctor (cambiar estado a INACTIVO)
  borrarDoctor(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/doctores/borrar/${id}`, null, { responseType: 'text' });
  }

  // 🟢 Restaurar doctor (cambiar estado a ACTIVO)
  restaurarDoctor(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/doctores/restaurar/${id}`, null, { responseType: 'text' });
  }

  actualizarDoctorCompleto(id: number, doctor: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.baseUrl}/doctores/actualizar/${id}`, doctor, {
      headers,
      responseType: 'text' as 'json' // Evita errores de tipo cuando el backend devuelve texto plano
    });
  }

  // ✅ Actualizar dirección del doctor
  actualizarDireccionDoctor(id: number, direccion: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/doctores/actualizar/direccion/${id}/${direccion}`, null, { responseType: 'text' });
  }

  // ✅ Actualizar centro hospitalario del doctor
  actualizarCentroHospitalarioDoctor(id: number, centro: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/doctores/actualizar/centrohospitalario/${id}/${centro}`, null, { responseType: 'text' });
  }

  // ✅ Actualizar especialidad del doctor
  actualizarEspecialidadDoctor(id: number, especialidad: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/doctores/actualizar/especialidad/${id}/${especialidad}`, null, { responseType: 'text' });
  }

  // ✅ Actualizar colegiado del doctor
  actualizarColegiadoDoctor(id: number, colegiado: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/doctores/actualizar/colegiado/${id}/${colegiado}`, null, { responseType: 'text' });
  }

  // ✅ Actualizar edad del doctor
  actualizarEdadDoctor(id: number, edad: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/doctores/actualizar/edad/${id}/${edad}`, null, { responseType: 'text' });
  }

  // ✅ Actualizar nombre del doctor
  actualizarNombreDoctor(id: number, nombre: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/doctores/actualizar/nombre/${id}/${nombre}`, null, { responseType: 'text' });
  }

  // ✅ Actualizar observación del doctor
  actualizarObservacionDoctor(id: number, observacion: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/doctores/actualizar/observacion/${id}/${observacion}`, null, { responseType: 'text' });
  }

  // ✅ Crear una nueva cita desde AdministradorController
  crearCitaDesdeAdmin(cita: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/citas/crear`, cita, { headers });
  }

  // ✅ Finalizar una cita (Marcar como Realizada)
  finalizarCita(id: number, cita: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.baseUrl}/citas/finalizar/${id}`, cita, { headers, responseType: 'text' });
  }

  // ✅ Cancelar una cita (Marcar como Cancelada)
  cancelarCita(id: number, cita: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.baseUrl}/citas/cancelar/${id}`, cita, { headers, responseType: 'text' });
  }

  // ✅ Consultar citas programadas
  consultarCitasProgramadas(): Observable<any> {
    return this.http.get(`${this.baseUrl}/citas/buscar/estado/PROGRAMADA`);
  }

  // ✅ CONSULTA DE CITAS REALIZADAS
  consultarCitasRealizadas(): Observable<any> {
    return this.http.get(`${this.baseUrl}/citas/listar/realizadas`);
  }

  // ✅ CONSULTA DE CITAS CANCELADAS
  consultarCitasCanceladas(): Observable<any> {
    return this.http.get(`${this.baseUrl}/citas/listar/canceladas`);
  }

  // ✅ Buscar cita por ID
  obtenerCitaPorId(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/citas/buscar/id/${id}`);
  }

  // ✅ Buscar citas por fecha
  obtenerCitasPorFecha(fecha: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/citas/buscar/fecha/${fecha}`);
  }

  obtenerCitasPorIdPaciente(idPaciente: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/citas/buscar/paciente/${idPaciente}`);
  }

  obtenerCitasPorIdDoctor(idDoctor: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/citas/buscar/doctor/${idDoctor}`);
  }

  obtenerCitasPorColegiado(colegiado: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/citas/buscar/colegiado/${colegiado}`);
  }

  obtenerCitasPorNit(nit: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/citas/buscar/nit/${nit}`);
  }

  actualizarPacienteYNit(id: number, cita: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.baseUrl}/citas/actualizar/paciente-nit/${id}`, cita, { headers, responseType: 'text' });
  }

  actualizarDoctorYColegiado(id: number, cita: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.baseUrl}/citas/actualizar/doctor-colegiado/${id}`, cita, { headers, responseType: 'text' });
  }


  actualizarMotivoConsulta(id: number, cita: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.baseUrl}/citas/actualizar/motivo/${id}`, cita, { headers, responseType: 'text' });
  }

  actualizarFechaCita(id: number, cita: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.baseUrl}/citas/actualizar/fecha-cita/${id}`, cita, { headers, responseType: 'text' });
  }

  actualizarNombrePacienteCita(id: number, cita: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.baseUrl}/citas/actualizar/nombre-paciente/${id}`, cita, { headers, responseType: 'text' });
  }

  actualizarNombreDoctorCita(id: number, cita: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.baseUrl}/citas/actualizar/nombre-doctor/${id}`, cita, { headers, responseType: 'text' });
  }

  // ====================== FUNCIONES DE USUARIOS ======================

  // ✅ Registrar un nuevo usuario
  registrarUsuarioDesdeAdmin(usuario: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/usuarios/registrar`, usuario, { headers });
  }

  // ✅ Consultar usuarios activos
  consultarUsuariosActivos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/usuarios/consultar/activos`);
  }

  // ✅ Consultar usuarios inactivos
  consultarUsuariosInactivos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/usuarios/consultar/inactivos`);
  }

  // ✅ Obtener usuario activo por ID
  obtenerUsuarioActivoPorId(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/usuarios/activos/id/${id}`);
  }

  // ✅ Obtener usuario activo por username
  obtenerUsuarioActivoPorUsername(username: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/usuarios/activos/username/${username}`);
  }

  // ✅ Obtener usuario inactivo por ID
  obtenerUsuarioInactivoPorId(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/usuarios/inactivos/id/${id}`);
  }

  // ✅ Obtener usuario inactivo por username
  obtenerUsuarioInactivoPorUsername(username: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/usuarios/inactivos/username/${username}`);
  }

  // 🔒 Cambiar contraseña del usuario
  cambiarPasswordUsuario(id: number, password: string): Observable<any> {
    const body = { password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.baseUrl}/usuarios/${id}/cambiar-password`, body, { headers, responseType: 'text' });
  }

  // 🔴 Desactivar usuario (borrado lógico)
  desactivarUsuario(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/usuarios/${id}/desactivar`, null, { responseType: 'text' });
  }

  // 🟢 Restaurar usuario
  restaurarUsuario(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/usuarios/${id}/restaurar`, null, { responseType: 'text' });
  }




}
