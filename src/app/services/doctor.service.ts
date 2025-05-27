import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DoctorService {

  private baseUrl = 'http://localhost:9494/api/doctor';

  constructor(private http: HttpClient) { }

  // ✅ Obtener todos los pacientes registrados
  obtenerPacientes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/pacientes`);
  }

  // 📄 Consultar citas por estado: PROGRAMADA, REALIZADA, CANCELADA
  consultarCitasPorEstado(estado: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/citas/estado/${estado}`);
  }

  // 🔍 Consultar citas por paciente y estado (por ID y estado)
  consultarCitasPorPacienteYEstado(idPaciente: number, estado: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/citas/paciente-estado/${idPaciente}/${estado}`);
  }

  // 📆 Consultar citas por fecha exacta (formato YYYY-MM-DD)
  consultarCitasPorFecha(fecha: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/citas/fecha/${fecha}`);
  }

  // 📅 Consultar citas del día de hoy por ID del doctor
  consultarCitasDeHoyPorIdDoctor(idDoctor: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/citas/hoy/idDoctor/${idDoctor}`);
  }

  // 📅 Consultar citas del día de hoy por colegiado
  consultarCitasDeHoyPorColegiado(colegiado: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/citas/hoy/colegiado/${colegiado}`);
  }

  // 📊 Consultar historial (REALIZADAS o CANCELADAS) por ID del doctor
  historialPorIdDoctor(id: number, inicio: string, fin: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/citas/historial/idDoctor/${id}/${inicio}/${fin}`);
  }

  // 📊 Consultar historial (REALIZADAS o CANCELADAS) por colegiado
  historialPorColegiado(colegiado: string, inicio: string, fin: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/citas/historial/colegiado/${colegiado}/${inicio}/${fin}`);
  }

  // 🗓️ Consultar citas por rango de fechas (formato: YYYY-MM-DDTHH:mm:ss)
  consultarCitasPorRangoFechas(inicio: string, fin: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/citas/rango-fechas/${inicio}/${fin}`);
  }

  // 🔍 Consultar citas por NIT del paciente y estado
  consultarCitasPorNitYEstado(nit: number, estado: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/citas/nit-estado/${nit}/${estado}`);
  }

  // 👤 Buscar pacientes por NIT
  buscarPacientesPorNit(nit: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/pacientes/nit/${nit}`);
  }

  // ✅ Finalizar una cita (marcar como REALIZADA)
  finalizarCita(idCita: number, datos: { costo: number, fechaFin: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/cita/${idCita}/realizada`, datos);
  }




}
