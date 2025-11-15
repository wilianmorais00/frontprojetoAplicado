import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  room: string;
  checkin?: string;
  checkout?: string;
  assignedFormId?: string;
}

const LS_KEY = 'questio.clients';

@Injectable({ providedIn: 'root' })
export class ClientsService {
  private _clients$ = new BehaviorSubject<Client[]>(this.load());
  clients$ = this._clients$.asObservable();

  list(): Client[] { return this._clients$.value; }

  add(input: Omit<Client, 'id'>): Client {
    const c: Client = { id: this.uuid(), ...input };
    const next = [c, ...this._clients$.value];
    this._clients$.next(next);
    this.persist(next);
    return c;
  }

  update(id: string, patch: Partial<Client>) {
    const next = this._clients$.value.map(c => (c.id === id ? { ...c, ...patch } : c));
    this._clients$.next(next);
    this.persist(next);
  }

<<<<<<< HEAD
=======
  upsert(client: Client) {
    const exists = this._clients$.value.some(c => c.id === client.id);
    const next = exists
      ? this._clients$.value.map(c => (c.id === client.id ? { ...c, ...client } : c))
      : [client, ...this._clients$.value];
    this._clients$.next(next);
    this.persist(next);
  }

>>>>>>> 32539fe (Sincroniza projeto local com o repositório remoto)
  remove(id: string) {
    const next = this._clients$.value.filter(c => c.id !== id);
    this._clients$.next(next);
    this.persist(next);
  }

  assignToForm(clientId: string, templateId: string) {
    this.update(clientId, { assignedFormId: templateId });
  }

  private load(): Client[] {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? (JSON.parse(raw) as Client[]) : [];
    } catch { return []; }
  }

  private persist(list: Client[]) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch {}
  }

  private uuid(): string {
    try { return crypto.randomUUID(); }
    catch { return Math.random().toString(36).slice(2); }
  }
}
