import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Modelo de hóspede (client) usado em toda a aplicação.
 */
export interface Client {
  id: string;                 // ID único do hóspede
  name: string;               // Nome completo
  email: string;              // E-mail de contato
  phone: string;              // Telefone / celular
  room: string;               // Número/quarto
  checkin: string;            // Data/hora de check-in (ISO)
  checkout: string;           // Data/hora de check-out (ISO)
  assignedFormId?: string | null; // ID do formulário atribuído (FormTemplate.id)
}

/**
 * Alias em PT-BR, se quiser usar: Hospede = Client
 */
export type Hospede = Client;

const LS_KEY = 'questio.clients';

@Injectable({ providedIn: 'root' })
export class ClientsService {
  // Estado em memória + sincronização com localStorage
  private _clients$ = new BehaviorSubject<Client[]>(this.read());
  clients$ = this._clients$.asObservable();

  /** Lista todos os hóspedes (cópia) */
  list(): Client[] {
    return this._clients$.value.slice();
  }

  /** Cria ou atualiza hóspede pelo id */
  upsert(c: Client) {
    const list = this.list();
    const idx = list.findIndex(x => x.id === c.id);
    if (idx >= 0) list[idx] = c;
    else list.push(c);
    this.persist(list);
  }

  /** Remove hóspede pelo id */
  remove(id: string) {
    const list = this.list().filter(x => x.id !== id);
    this.persist(list);
  }

  /** Atribui formulário a um hóspede */
  assignToForm(clientId: string, templateId: string): boolean {
    const list = this.list();
    const idx = list.findIndex(x => x.id === clientId);
    if (idx < 0) return false;

    if (list[idx].assignedFormId === templateId) return false;

    list[idx] = { ...list[idx], assignedFormId: templateId };
    this.persist(list);
    return true;
  }

  /** Remove atribuição de formulário do hóspede */
  unassignForm(clientId: string): boolean {
    const list = this.list();
    const idx = list.findIndex(x => x.id === clientId);
    if (idx < 0) return false;

    if (!list[idx].assignedFormId) return false;
    list[idx] = { ...list[idx], assignedFormId: null };
    this.persist(list);
    return true;
  }

  /**
   * Verifica disponibilidade de um quarto no intervalo [startISO, endISO].
   * Retorna false se houver conflito de datas com outro hóspede no mesmo quarto.
   */
  isRoomAvailable(
    room: string,
    startISO: string,
    endISO: string,
    ignoreClientId?: string
  ): boolean {
    const start = new Date(startISO).getTime();
    const end = new Date(endISO).getTime();
    if (isNaN(start) || isNaN(end) || start > end) return false;

    const sameRoom = this.list().filter(
      c => c.room.trim().toLowerCase() === room.trim().toLowerCase()
    );
    for (const c of sameRoom) {
      if (ignoreClientId && c.id === ignoreClientId) continue;
      const cStart = new Date(c.checkin).getTime();
      const cEnd = new Date(c.checkout).getTime();
      const overlap = start <= cEnd && end >= cStart;
      if (overlap) return false;
    }
    return true;
  }

  /** Lê do localStorage */
  private read(): Client[] {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? (JSON.parse(raw) as Client[]) : [];
    } catch {
      return [];
    }
  }

  /** Persiste no localStorage e atualiza o BehaviorSubject */
  private persist(list: Client[]) {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
    this._clients$.next(list);
  }
}

/**
 * Alias em PT-BR para o serviço:
 *  - Pode importar `HospedesService` se quiser, é o mesmo serviço.
 */
export { ClientsService as HospedesService };
