import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import { ModuloLoginComponent } from './modulo.login.component';

describe('ModuloLoginComponent - REGISTRAR USUARIO', () => {
  let component: ModuloLoginComponent;
  let fixture: ComponentFixture<ModuloLoginComponent>;
  let mockAdminService: jasmine.SpyObj<AdminService>;

  beforeEach(async () => {
    mockAdminService = jasmine.createSpyObj('AdminService', ['registrarUsuarioDesdeAdmin']);

    await TestBed.configureTestingModule({
      imports: [ModuloLoginComponent, FormsModule, CommonModule],
      providers: [
        { provide: AdminService, useValue: mockAdminService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModuloLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('no debe guardar usuario si no se selecciona JWT Secret', () => {
    component.usuario = {
      username: 'nuevoUsuario',
      password: '12345',
      rol: 'ADMINISTRADOR',
      jwtSecret: '' // ⚠️ Falta JWT
    };

    component.guardarUsuario();

    expect(component.mensajeError).toBe('Debe seleccionar el JWT Secret');
    expect(component.mensajeExito).toBe('');
  });

  it('debería registrar usuario exitosamente', () => {
    const mockResponse = { mensaje: '✅ Usuario registrado correctamente' };

    component.usuario = {
      username: 'nuevoUsuario',
      password: '12345',
      rol: 'ADMINISTRADOR',
      jwtSecret: 'jwt_secreto_administrador_123456'
    };

    mockAdminService.registrarUsuarioDesdeAdmin.and.returnValue(of(mockResponse));

    component.guardarUsuario();

    expect(mockAdminService.registrarUsuarioDesdeAdmin).toHaveBeenCalledWith({
      username: 'nuevoUsuario',
      password: '12345',
      rol: 'ADMINISTRADOR',
      jwtSecret: 'jwt_secreto_administrador_123456'
    });

    expect(component.mensajeExito).toBe(mockResponse.mensaje);
    expect(component.mensajeError).toBe('');
    expect(component.usuario.username).toBe('');
  });

  it('debería manejar error al registrar usuario', () => {
    component.usuario = {
      username: 'falloUsuario',
      password: '12345',
      rol: 'DOCTOR',
      jwtSecret: 'jwt_secreto_doctormedicina_123456'
    };

    mockAdminService.registrarUsuarioDesdeAdmin.and.returnValue(
      throwError(() => new Error('Error del servidor'))
    );

    component.guardarUsuario();

    expect(component.mensajeError).toBe('Error al registrar usuario');
    expect(component.mensajeExito).toBe('');
  });

  describe('ModuloLoginComponent - CONSULTAR USUARIOS', () => {
    let component: ModuloLoginComponent;
    let fixture: ComponentFixture<ModuloLoginComponent>;
    let mockAdminService: jasmine.SpyObj<AdminService>;

    beforeEach(async () => {
      mockAdminService = jasmine.createSpyObj('AdminService', [
        'consultarUsuariosActivos',
        'consultarUsuariosInactivos',
        'obtenerUsuarioActivoPorId',
        'obtenerUsuarioActivoPorUsername',
        'obtenerUsuarioInactivoPorId',
        'obtenerUsuarioInactivoPorUsername'
      ]);

      await TestBed.configureTestingModule({
        imports: [ModuloLoginComponent, FormsModule, CommonModule],
        providers: [{ provide: AdminService, useValue: mockAdminService }]
      }).compileComponents();

      fixture = TestBed.createComponent(ModuloLoginComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('debería consultar todos los usuarios activos', () => {
      const mockUsuariosActivos = [
        { id: 1, username: 'recepcionista1', rol: 'RECEPCIONISTA', estado: 'ACTIVO' }
      ];

      component.filtroEstado = 'ACTIVO';
      component.filtroId = null;
      component.filtroUsername = '';

      mockAdminService.consultarUsuariosActivos.and.returnValue(of(mockUsuariosActivos));

      component.consultarUsuarios();

      expect(mockAdminService.consultarUsuariosActivos).toHaveBeenCalled();
      expect(component.resultadoUsuarios).toEqual(mockUsuariosActivos);
    });

    it('debería consultar usuario activo por ID', () => {
      const usuarioMock = { id: 18, username: 'cvdlacer', estado: 'ACTIVO' };

      component.filtroEstado = 'ACTIVO';
      component.filtroId = 18;

      mockAdminService.obtenerUsuarioActivoPorId.and.returnValue(of(usuarioMock));

      component.consultarUsuarios();

      expect(mockAdminService.obtenerUsuarioActivoPorId).toHaveBeenCalledWith(18);
      expect(component.resultadoUsuarios).toEqual([usuarioMock]);
    });

    it('debería consultar usuario inactivo por username', () => {
      const usuarioInactivo = { id: 99, username: 'usuarioX', estado: 'INACTIVO' };

      component.filtroEstado = 'INACTIVO';
      component.filtroUsername = 'usuarioX';

      mockAdminService.obtenerUsuarioInactivoPorUsername.and.returnValue(of(usuarioInactivo));

      component.consultarUsuarios();

      expect(mockAdminService.obtenerUsuarioInactivoPorUsername).toHaveBeenCalledWith('usuarioX');
      expect(component.resultadoUsuarios).toEqual([usuarioInactivo]);
    });

    it('debería consultar ambos estados y combinarlos', () => {
      const activos = [
        { id: 1, username: 'admin', estado: 'ACTIVO' }
      ];
      const inactivos = [
        { id: 2, username: 'borrado', estado: 'INACTIVO' }
      ];

      component.filtroEstado = 'TODOS';

      mockAdminService.consultarUsuariosActivos.and.returnValue(of(activos));
      mockAdminService.consultarUsuariosInactivos.and.returnValue(of(inactivos));

      component.consultarUsuarios();

      expect(mockAdminService.consultarUsuariosActivos).toHaveBeenCalled();
      expect(mockAdminService.consultarUsuariosInactivos).toHaveBeenCalled();
      expect(component.resultadoUsuarios).toEqual([...activos, ...inactivos]);
    });
  });

  describe('ModuloLoginComponent - CAMBIAR CONTRASEÑA', () => {
    let component: ModuloLoginComponent;
    let fixture: ComponentFixture<ModuloLoginComponent>;
    let mockAdminService: jasmine.SpyObj<AdminService>;

    beforeEach(async () => {
      mockAdminService = jasmine.createSpyObj('AdminService', [
        'cambiarPasswordUsuario'
      ]);

      await TestBed.configureTestingModule({
        imports: [ModuloLoginComponent, FormsModule, CommonModule],
        providers: [{ provide: AdminService, useValue: mockAdminService }]
      }).compileComponents();

      fixture = TestBed.createComponent(ModuloLoginComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('no debería cambiar la contraseña si faltan datos', () => {
      component.idCambioPassword = 0;
      component.nuevaPassword = '';

      component.cambiarPassword();

      expect(component.mensajeCambioPassword).toBe('⚠️ Debe ingresar el ID y la nueva contraseña');
      expect(mockAdminService.cambiarPasswordUsuario).not.toHaveBeenCalled();
    });

    it('debería cambiar la contraseña exitosamente', () => {
      component.idCambioPassword = 15;
      component.nuevaPassword = 'nuevaClave123';

      mockAdminService.cambiarPasswordUsuario.and.returnValue(
        of({ mensaje: 'Contraseña actualizada correctamente' })
      );

      component.cambiarPassword();

      expect(mockAdminService.cambiarPasswordUsuario)
        .toHaveBeenCalledWith(15, 'nuevaClave123');

      expect(component.mensajeCambioPassword).toBe('✅ Contraseña actualizada correctamente');
      expect(component.idCambioPassword).toBe(0);
      expect(component.nuevaPassword).toBe('');
    });

    it('debería manejar error al cambiar la contraseña', () => {
      component.idCambioPassword = 88;
      component.nuevaPassword = 'claveError';

      mockAdminService.cambiarPasswordUsuario.and.returnValue(
        throwError(() => new Error('Error del servidor'))
      );

      component.cambiarPassword();

      expect(component.mensajeCambioPassword).toBe('❌ Error al actualizar contraseña');
    });
  });

  describe('ModuloLoginComponent - BORRAR USUARIO', () => {
    let component: ModuloLoginComponent;
    let fixture: ComponentFixture<ModuloLoginComponent>;
    let mockAdminService: jasmine.SpyObj<AdminService>;

    beforeEach(async () => {
      mockAdminService = jasmine.createSpyObj('AdminService', ['desactivarUsuario']);

      await TestBed.configureTestingModule({
        imports: [ModuloLoginComponent, FormsModule, CommonModule],
        providers: [
          { provide: AdminService, useValue: mockAdminService }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ModuloLoginComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('no debería desactivar si el ID está vacío', () => {
      component.idDesactivar = 0;

      component.desactivarUsuario();

      expect(component.mensajeDesactivar).toBe('⚠️ Debe ingresar un ID válido');
      expect(mockAdminService.desactivarUsuario).not.toHaveBeenCalled();
    });

    it('debería desactivar usuario exitosamente', () => {
      component.idDesactivar = 18;

      mockAdminService.desactivarUsuario.and.returnValue(
        of({ mensaje: '✅ Usuario desactivado correctamente' })
      );

      component.desactivarUsuario();

      expect(mockAdminService.desactivarUsuario).toHaveBeenCalledWith(18);
      expect(component.mensajeDesactivar).toBe('✅ Usuario desactivado correctamente');
      expect(component.idDesactivar).toBe(0);
    });

    it('debería manejar error al desactivar usuario', () => {
      component.idDesactivar = 33;

      mockAdminService.desactivarUsuario.and.returnValue(
        throwError(() => new Error('Error al desactivar'))
      );

      component.desactivarUsuario();

      expect(component.mensajeDesactivar).toBe('❌ Error al desactivar usuario');
    });
  });

  describe('ModuloLoginComponent - RESTAURAR USUARIO', () => {
    let component: ModuloLoginComponent;
    let fixture: ComponentFixture<ModuloLoginComponent>;
    let mockAdminService: jasmine.SpyObj<AdminService>;

    beforeEach(async () => {
      mockAdminService = jasmine.createSpyObj('AdminService', ['restaurarUsuario']);

      await TestBed.configureTestingModule({
        imports: [ModuloLoginComponent, FormsModule, CommonModule],
        providers: [
          { provide: AdminService, useValue: mockAdminService }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ModuloLoginComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('no debería restaurar si el ID está vacío', () => {
      component.idRestaurar = 0;

      component.restaurarUsuario();

      expect(component.mensajeRestaurar).toBe('⚠️ Debe ingresar un ID válido');
      expect(mockAdminService.restaurarUsuario).not.toHaveBeenCalled();
    });

    it('debería restaurar usuario exitosamente', () => {
      component.idRestaurar = 20;

      mockAdminService.restaurarUsuario.and.returnValue(
        of({ mensaje: '✅ Usuario restaurado correctamente' })
      );

      component.restaurarUsuario();

      expect(mockAdminService.restaurarUsuario).toHaveBeenCalledWith(20);
      expect(component.mensajeRestaurar).toBe('✅ Usuario restaurado correctamente');
      expect(component.idRestaurar).toBe(0);
    });

    it('debería manejar error al restaurar usuario', () => {
      component.idRestaurar = 999;

      mockAdminService.restaurarUsuario.and.returnValue(
        throwError(() => new Error('Error al restaurar'))
      );

      component.restaurarUsuario();

      expect(component.mensajeRestaurar).toBe('❌ Error al restaurar usuario');
    });
  });




});
