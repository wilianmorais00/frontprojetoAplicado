import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { FormsService, FormTemplate } from '../../Service/forms-service/forms-service';
import { ClientsService, Client } from '../../Service/forms-service/client-service';

type OpenFormCard = FormTemplate;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './homeComponent.html',
  styleUrls: ['./homeComponent.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private formsSvc = inject(FormsService);
  private clientsSvc = inject(ClientsService);

  username = 'USUÁRIO';

  openFormCards: OpenFormCard[] = [];
  banner: string | null = null;
  private bannerTimer?: any;

  private formsSub?: Subscription;
  private clientsSub?: Subscription;

  // ---- BUSCA / EDIÇÃO DE HÓSPEDES ----
  clients: Client[] = [];
  searchCtrl = this.fb.control<string>('', { nonNullable: true });
  selected?: Client | null = null;

  editForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    room: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.openFormCards = this.formsSvc.list();
    this.formsSub = this.formsSvc.templates$.subscribe(list => (this.openFormCards = list));

    this.clients = this.clientsSvc.list();
    this.clientsSub = this.clientsSvc.clients$.subscribe(list => (this.clients = list));

    const state = history.state as { banner?: string };
    if (state?.banner) {
      this.banner = state.banner;
      queueMicrotask(() => history.replaceState({}, document.title));
      this.bannerTimer = setTimeout(() => (this.banner = null), 4000);
    }
  }

  ngOnDestroy(): void {
    this.formsSub?.unsubscribe();
    this.clientsSub?.unsubscribe();
    if (this.bannerTimer) clearTimeout(this.bannerTimer);
  }

  // ---- FORMULÁRIOS EM ABERTO ----
  get hasOpenForms() { return this.openFormCards.length > 0; }
  goHome() {}
  openSettings() {}
  onClickNewForm() { this.router.navigate(['/forms/new']); }
  onClickNewClient() { this.router.navigate(['/client/new']); }
  formatDate(iso: string) { return iso ? new Date(iso).toLocaleDateString() : ''; }

  // ---- BUSCA / AÇÕES DE HÓSPEDES ----
  get hasQuery() { return this.searchCtrl.value.trim().length >= 2; }

  get filteredClients(): Client[] {
    const q = this.searchCtrl.value.trim().toLowerCase();
    if (q.length < 2) return [];
    return this.clients.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.room.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q)
    );
  }

  editClient(c: Client) {
    this.selected = { ...c };
    this.editForm.setValue({
      name: c.name,
      room: c.room,
      email: c.email,
      phone: c.phone
    });
  }

  cancelEdit() {
    this.selected = null;
    this.editForm.reset();
  }

  saveEdits() {
    if (!this.selected || this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    this.clientsSvc.update(this.selected.id, this.editForm.getRawValue());
    this.cancelEdit();
  }

  deleteClient(c: Client) {
    if (!confirm(`Excluir hóspede "${c.name}"?`)) return;
    this.clientsSvc.remove(c.id);
    if (this.selected?.id === c.id) this.cancelEdit();
  }

  assignToForm(c: Client) {
    this.router.navigate(['/forms/new'], { state: { prefillClientId: c.id, prefillClientName: c.name } });
  }

  accessForm(_card: OpenFormCard) {}
  deleteForm(card: OpenFormCard) {
    const next = this.openFormCards.filter(t => t.id !== card.id);
    if (next.length !== this.openFormCards.length) {
      this.openFormCards = next;
      localStorage.setItem('questio.templates', JSON.stringify(next));
    }
  }
}
