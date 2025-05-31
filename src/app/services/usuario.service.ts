import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private rolesUrl = 'https://optimistic-appreciation-production-b7e1.up.railway.app';

  constructor(private http: HttpClient) {}

  // 🔐 Login
  login(datos: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.rolesUrl}/api/login`, datos);
  }

  // ✅ Guardar paciente como recepcionista
  guardarPacienteRecepcionista(paciente: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.rolesUrl}/api/recepcionista/paciente`, paciente, { headers });
  }

  // ✅ Guardar paciente como administrador
  guardarPacienteAdministrador(paciente: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.rolesUrl}/api/admin/paciente`, paciente, { headers });
  }

  // ✅ Obtener todos los pacientes (doctor)
  obtenerPacientes(): Observable<any> {
    return this.http.get(`${this.rolesUrl}/api/doctor/pacientes`);
  }

  // 📄 Consultar pacientes
consultarPacientes(): Observable<any> {
  return this.http.get(`${this.rolesUrl}/api/recepcionista/pacientes`);
}

// 📄 Crear nueva cita
crearCitaRecepcionista(cita: any): Observable<any> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.post(`${this.rolesUrl}/api/recepcionista/cita`, cita, { headers });
}

// 🔎 Buscar citas por NIT y estado
buscarCitasPorNitYEstado(nit: number, estado: string): Observable<any> {
  return this.http.get(`${this.rolesUrl}/api/recepcionista/citas/nit-estado/${nit}/${estado}`);
}


// 📄 Consultar citas por estado (según endpoints definidos en el backend)
consultarCitasPorEstado(estado: string): Observable<any> {
  const endpoint = estado.toUpperCase(); // PROGRAMADAS, REALIZADAS, CANCELADAS

  let url = '';

  if (endpoint === 'PROGRAMADAS') {
    url = `${this.rolesUrl}/api/recepcionista/citas/programadas`;
  } else if (endpoint === 'REALIZADAS') {
    url = `${this.rolesUrl}/api/recepcionista/citas/realizadas`;
  } else if (endpoint === 'CANCELADAS') {
    url = `${this.rolesUrl}/api/recepcionista/citas/canceladas`;
  } else {
    throw new Error('Estado de cita no válido');
  }

  return this.http.get(url);
}

// ✅ Cambiar estado a REALIZADA
marcarComoRealizada(id: number, datos: any): Observable<any> {
  const headers = { 'Content-Type': 'application/json' };
  return this.http.put(`https://micro-citas-production.up.railway.app/api/citas/finalizar/${id}`, datos, { headers });
}

// ✅ Cambiar estado a CANCELADA (ahora también recibe fechaFin)
marcarComoCancelada(id: number, datos: any): Observable<any> {
  const headers = { 'Content-Type': 'application/json' };
  return this.http.put(`https://micro-citas-production.up.railway.app/api/citas/cancelar/${id}`, datos, { headers });
}



// ✅ Obtener doctores activos (vía microservicio roles)
obtenerDoctores(): Observable<any> {
  return this.http.get(`${this.rolesUrl}/api/recepcionista/doctores`);
}

// 🔎 Buscar paciente por nombre
buscarPacientePorNombre(nombre: string): Observable<any> {
  return this.http.get(`${this.rolesUrl}/api/recepcionista/pacientes/nombre/${nombre}`);
}

// 🔎 Buscar paciente por NIT
buscarPacientePorNit(nit: number): Observable<any> {
  return this.http.get(`${this.rolesUrl}/api/recepcionista/pacientes/nit/${nit}`);
}

// 🔎 Buscar paciente por CUI
buscarPacientePorCui(cui: number): Observable<any> {
  return this.http.get(`${this.rolesUrl}/api/recepcionista/pacientes/cui/${cui}`);
}

// 🔎 Buscar doctor por nombre
buscarDoctorPorNombre(nombre: string): Observable<any> {
  return this.http.get(`${this.rolesUrl}/api/recepcionista/doctores/nombre/${nombre}`);
}

// 🔎 Buscar doctor por colegiado
buscarDoctorPorColegiado(colegiado: string): Observable<any> {
  return this.http.get(`${this.rolesUrl}/api/recepcionista/doctores/colegiado/${colegiado}`);
}

// 🔎 Buscar doctor por especialidad
buscarDoctorPorEspecialidad(especialidad: string): Observable<any> {
  return this.http.get(`${this.rolesUrl}/api/recepcionista/doctores/especialidad/${especialidad}`);
}

buscarPacientePorId(id: number): Observable<any> {
  return this.http.get(`${this.rolesUrl}/api/recepcionista/pacientes/id/${id}`);
}

buscarPacientePorFecha(fecha: string): Observable<any> {
  return this.http.get(`${this.rolesUrl}/api/recepcionista/pacientes/fecha/${fecha}`);
}

buscarDoctorPorId(id: number): Observable<any> {
  return this.http.get(`${this.rolesUrl}/api/recepcionista/doctores/id/${id}`);
}

buscarDoctorPorFecha(fecha: string): Observable<any> {
  return this.http.get(`${this.rolesUrl}/api/recepcionista/doctores/fecha/${fecha}`);
}

buscarCitasPorPacienteYEstado(id: number, estado: string): Observable<any> {
  return this.http.get(`${this.rolesUrl}/api/recepcionista/citas/paciente-estado/${id}/${estado}`);
}






}
