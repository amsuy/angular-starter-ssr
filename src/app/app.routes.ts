import { Routes } from '@angular/router';
import { PrincipalComponent } from './app/principal/principal.component';
import { AdminComponent } from './login/admin/admin.component';
import { DoctorComponent } from './login/doctor/doctor.component';
import { LoginComponent } from './login/login.component';
import { RecepcionistaComponent } from './login/recepcionista/recepcionista.component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', component: PrincipalComponent },
  { path: 'login', component: LoginComponent },
  { path: 'recepcionista', component: RecepcionistaComponent, canActivate: [AuthGuard] },
  { path: 'doctor', component: DoctorComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] }
];

