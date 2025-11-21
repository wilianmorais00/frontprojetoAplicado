import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Modelo de usuário do sistema (login)
export interface UsuarioSistema {
  id: string;                           // ID único do usuário
  name: string;
  email: string;
  password: string;
  role: 'colaborador' | 'gestor' | 'admin'; // Perfil de acesso
  active: boolean;
}

const LS_USERS = 'questio.users';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  // Lista reativa de usuários carregada de localStorage
  private _users$ = new BehaviorSubject<UsuarioSistema[]>(this.read());
  users$ = this._users$.asObservable();

  list(): UsuarioSistema[] {
    return this._users$.value.slice();
  }

  // Cria novo usuário (ID gerado automaticamente)
  create(u: Omit<UsuarioSistema, 'id'>): void {
    const id = this.newId(); // ID único de usuário
    const novo: UsuarioSistema = { id, ...u };
    const list = this.list();
    list.push(novo);
    this.persist(list);
  }

  // Atualiza usuário existente pelo ID
  update(u: UsuarioSistema): void {
    const list = this.list();
    const i = list.findIndex((x) => x.id === u.id);
    if (i >= 0) {
      list[i] = { ...u };
      this.persist(list);
    }
  }

  remove(id: string): void {
    const list = this.list().filter((x) => x.id !== id);
    this.persist(list);
  }

  private read(): UsuarioSistema[] {
    try {
      const raw = localStorage.getItem(LS_USERS);
      return raw ? (JSON.parse(raw) as UsuarioSistema[]) : [];
    } catch {
      return [];
    }
  }

  private persist(list: UsuarioSistema[]) {
    localStorage.setItem(LS_USERS, JSON.stringify(list));
    this._users$.next(list);
  }

  // Gera ID único para o usuário
  private newId(): string {
    try {
      return crypto.randomUUID();
    } catch {
      return Math.random().toString(36).slice(2);
    }
  }
}
