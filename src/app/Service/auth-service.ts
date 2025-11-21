import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UsuariosService, UsuarioSistema as Usuario } from './user-service';

const LS_CURRENT = 'questio.currentUser';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Usuário atualmente logado (observável)
  private _current$ = new BehaviorSubject<Usuario | null>(this.read());
  current$ = this._current$.asObservable();

  constructor(private users: UsuariosService) {}

  /**
   * Autentica o usuário pelo e-mail/senha.
   * Possui um usuário master hardcoded (administrador@gmail.com / 202558).
   */
  login(email: string, password: string): boolean {
    if (email.trim().toLowerCase() === 'administrador@gmail.com' && password === '202558') {
      const admin: Usuario = {
        id: 'admin',
        name: 'Administrador',
        email: 'administrador@gmail.com',
        password: '202558',
        role: 'admin',
        active: true,
      };
      this.persist(admin);
      return true;
    }

    // Autenticação baseada na lista de usuários cadastrados
    const u = this.users
      .list()
      .find(
        (x) =>
          x.active &&
          x.email.trim().toLowerCase() === email.trim().toLowerCase() &&
          x.password === password
      );
    if (!u) return false;

    this.persist(u);
    return true;
  }

  logout() {
    localStorage.removeItem(LS_CURRENT);
    this._current$.next(null);
  }

  get current(): Usuario | null {
    return this._current$.value;
  }

  // Verifica se o usuário possui papel de administrador (ou é o master hardcoded)
  isAdmin(): boolean {
    const u = this._current$.value;
    if (!u) return false;
    const master =
      u.email.toLowerCase() === 'administrador@gmail.com' && u.password === '202558';
    const roleAdmin = u.role === 'admin';
    return master || roleAdmin;
  }

  private read(): Usuario | null {
    try {
      const raw = localStorage.getItem(LS_CURRENT);
      return raw ? (JSON.parse(raw) as Usuario) : null;
    } catch {
      return null;
    }
  }

  // Persiste usuário logado em localStorage
  private persist(u: Usuario) {
    localStorage.setItem(LS_CURRENT, JSON.stringify(u));
    this._current$.next(u);
  }
}
