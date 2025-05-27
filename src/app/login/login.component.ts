import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule],
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  loading = false;

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  login() {
    this.error = '';
    this.loading = true;

    if (!this.username || !this.password) {
      this.error = '⚠️ Completa ambos campos.';
      this.loading = false;
      return;
    }

    this.usuarioService.login({
      username: this.username.trim(),
      password: this.password.trim()
    }).subscribe({
      next: (resp) => {
        this.loading = false;

        if (resp.token) {
          localStorage.setItem('token', resp.token);
          localStorage.setItem('rol', resp.rol);

          if (resp.rol === 'RECEPCIONISTA') {
            this.router.navigate(['/recepcionista']);
          } else if (resp.rol === 'DOCTOR') {
            this.router.navigate(['/doctor']);
          } else if (resp.rol === 'ADMINISTRADOR') {
            this.router.navigate(['/admin']);
          } else {
            this.error = 'Rol no reconocido.';
          }
        } else {
          this.error = 'Error: Token no recibido del servidor.';
        }
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 401) {
          this.error = '❌ Usuario o contraseña incorrectos';
        } else if (err.status === 403) {
          this.error = '❌ Acceso denegado: Rol no autorizado o usuario inactivo';
        } else {
          this.error = '❌ Error del servidor. Intenta más tarde.';
        }
      }
    });
  }
}
