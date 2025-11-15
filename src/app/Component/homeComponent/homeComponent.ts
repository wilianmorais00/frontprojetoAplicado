import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
<<<<<<< HEAD
import { FormsModule } from '@angular/forms';
=======
>>>>>>> 32539fe (Sincroniza projeto local com o repositório remoto)
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { FormsService, FormTemplate } from '../../Service/forms-service/forms-service';
import { ClientsService, Client } from '../../Service/forms-service/client-service';

type OpenFormCard = FormTemplate;

@Component({
  selector: 'app-home',
  standalone: true,
<<<<<<< HEAD
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
=======
  imports: [CommonModule, ReactiveFormsModule],
>>>>>>> 32539fe (Sincroniza projeto local com o repositório remoto)
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
<<<<<<< HEAD
  private subForms?: Subscription;
  private subClients?: Subscription;

  clients: Client[] = [];
  searchCtrl = this.fb.control<string>('', { nonNullable: true });
  selected?: Client | null = null;

  assigningClient: Client | null = null;
  selectedTemplateId: string | null = null;

  ngOnInit(): void {
    this.openFormCards = this.formsSvc.list();
    this.subForms = this.formsSvc.templates$.subscribe(list => (this.openFormCards = list));

    this.clients = this.clientsSvc.list();
    this.subClients = this.clientsSvc.clients$.subscribe(list => (this.clients = list));

    const state = history.state as { banner?: string };
    if (state?.banner) {
      this.banner = state.banner;
      queueMicrotask(() => history.replaceState({}, document.title));
      this.bannerTimer = setTimeout(() => (this.banner = null), 4000);
    }
  }

  ngOnDestroy(): void {
    this.subForms?.unsubscribe();
    this.subClients?.unsubscribe();
    if (this.bannerTimer) clearTimeout(this.bannerTimer);
  }

  get hasOpenForms() { return this.openFormCards.length > 0; }
  get hasQuery() { return this.searchCtrl.value.trim().length >= 2; }

  get filteredClients(): Client[] {
=======
  private sub?: Subscription;

  searchCtrl = this.fb.control<string>('', { nonNullable: true });
  showAllClients = false;
  selected?: Client | null = null;

  editForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    room: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]] ,
    phone: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.openFormCards = this.formsSvc.list();
    this.sub = this.formsSvc.templates$.subscribe(list => (this.openFormCards = list));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    if (this.bannerTimer) clearTimeout(this.bannerTimer);
  }

  private setBanner(text: string, ms = 3000) {
    this.banner = text;
    if (this.bannerTimer) clearTimeout(this.bannerTimer);
    this.bannerTimer = setTimeout(() => (this.banner = null), ms);
  }

  get hasOpenForms() { return this.openFormCards.length > 0; }
  get hasQuery() { return this.searchCtrl.value.trim().length >= 2; }
  get clients(): Client[] { return this.clientsSvc.list(); }

  get filteredClients(): Client[] {
    if (this.showAllClients) return this.clients;
>>>>>>> 32539fe (Sincroniza projeto local com o repositório remoto)
    const q = this.searchCtrl.value.trim().toLowerCase();
    if (q.length < 2) return [];
    return this.clients.filter(c =>
      c.name.toLowerCase().includes(q) || c.room.toLowerCase().includes(q)
    );
  }

<<<<<<< HEAD
  goHome() {}
  openSettings() {}

  onClickNewForm() { this.router.navigate(['/forms/new']); }
  onClickNewClient() { this.router.navigate(['/client/new']); }

  openForm(_card: OpenFormCard) {}
  openFormMenu(e: MouseEvent, _card: OpenFormCard) { e.stopPropagation(); }
  formatDate(iso: string) { return iso ? new Date(iso).toLocaleDateString() : ''; }
=======
  listAllClients(): void { this.showAllClients = true; }
  clearSearch(): void { this.showAllClients = false; this.searchCtrl.setValue(''); }
>>>>>>> 32539fe (Sincroniza projeto local com o repositório remoto)

  selectClient(c: Client) {
    this.selected = { ...c };
    this.editForm.setValue({
      name: c.name,
      room: c.room,
      email: c.email,
      phone: c.phone
    });
  }
<<<<<<< HEAD
  cancelEdit() { this.selected = null; this.editForm.reset(); }
  editForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    room: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
  });
  saveEdits() {
    if (!this.selected || this.editForm.invalid) { this.editForm.markAllAsTouched(); return; }
    this.clientsSvc.update(this.selected.id, this.editForm.getRawValue());
    this.cancelEdit();
  }

  startAssign(c: Client) {
    this.assigningClient = c;
    this.selectedTemplateId = this.openFormCards[0]?.id ?? null;
  }
  confirmAssign() {
    if (!this.assigningClient || !this.selectedTemplateId) return;
    this.clientsSvc.assignToForm(this.assigningClient.id, this.selectedTemplateId);
    const name = this.assigningClient.name;
    this.closeAssign();
    this.banner = `Hóspede "${name}" atribuído ao formulário.`;
    if (this.bannerTimer) clearTimeout(this.bannerTimer);
    this.bannerTimer = setTimeout(() => (this.banner = null), 3000);
  }
  closeAssign() {
    this.assigningClient = null;
    this.selectedTemplateId = null;
  }

  accessForm(_c: OpenFormCard) {}
  deleteForm(c: OpenFormCard) {
    const next = this.openFormCards.filter(x => x.id !== c.id);
    this.openFormCards = next;
    localStorage.setItem('questio.templates', JSON.stringify(next));
  }
=======

  cancelEdit() { this.selected = null; this.editForm.reset(); }

  saveEdits() {
    if (!this.selected || this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    const idx = this.clients.findIndex(x => x.id === this.selected!.id);
    if (idx >= 0) {
      this.clients[idx] = { id: this.selected!.id, ...this.editForm.getRawValue() };
      this.clientsSvc.upsert(this.clients[idx]);
      this.setBanner(`Hóspede "${this.clients[idx].name}" atualizado`);
    }
    this.cancelEdit();
  }

  assignOpen = false;
  assignFor?: Client | null = null;

  assignToClient(c: Client, ev?: MouseEvent) { ev?.stopPropagation(); this.openAssign(c); }
  editClient(c: Client, ev?: MouseEvent)   { ev?.stopPropagation(); this.selectClient(c); }
  deleteClient(c: Client, ev?: MouseEvent) {
    ev?.stopPropagation();
    this.clientsSvc.remove(c.id);
    this.setBanner(`Hóspede "${c.name}" apagado`);
    if (this.selected?.id === c.id) this.cancelEdit();
  }

  openAssign(c: Client) { this.assignFor = c; this.assignOpen = true; }
  closeAssign() { this.assignOpen = false; this.assignFor = null; }

  goHome() {}
  openSettings() {}
  onClickNewForm() { this.router.navigate(['/forms/new']); }
  onClickNewClient() { this.router.navigate(['/client/new']); }
  openForm(_card: OpenFormCard) {}
  openFormMenu(e: MouseEvent, _card: OpenFormCard) { e.stopPropagation(); }
  formatDate(iso: string) { return iso ? new Date(iso).toLocaleDateString() : ''; }
>>>>>>> 32539fe (Sincroniza projeto local com o repositório remoto)
}
