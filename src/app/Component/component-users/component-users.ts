import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UsuariosService, UsuarioSistema } from '../../Service/user-service';

/**
 * Tela de gerenciamento de usuários do sistema.
 * Permite:
 * - criar/editar usuários
 * - ativar/desativar
 * - remover usuários
 */
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './component-users.html',
  styleUrls: ['./component-users.css'],
})
export class GerenciamentoUsuariosComponent {
  private fb = inject(FormBuilder);
  private usersSvc = inject(UsuariosService);

  // Lista reativa de usuários (carregada de localStorage)
  users = signal<UsuarioSistema[]>(this.usersSvc.list());

  // Mensagens rápidas (flash) na tela
  flashMsg: string | null = null;
  flashKind: 'success' | 'info' | 'danger' = 'success';
  private flashTimer: any;
  private showFlash(msg: string, kind: 'success' | 'info' | 'danger' = 'success') {
    this.flashMsg = msg;
    this.flashKind = kind;
    if (this.flashTimer) clearTimeout(this.flashTimer);
    this.flashTimer = setTimeout(() => (this.flashMsg = null), 3000);
  }

  // ID do usuário pendente de confirmação de exclusão
  pendingDeleteId = signal<string | null>(null);

  // Formulário reativo para cadastro/edição de usuário
  form = this.fb.nonNullable.group({
    id: [''],
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    role: ['colaborador', [Validators.required]],
    active: [true],
  });

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const value = {
      id: raw.id,
      name: raw.name,
      email: raw.email,
      password: raw.password,
      role: raw.role as UsuarioSistema['role'],
      active: raw.active as boolean,
    };

    // Criação de novo usuário (ID é gerado no service)
    if (!value.id) {
      this.usersSvc.create({
        name: value.name,
        email: value.email,
        password: value.password,
        role: value.role,
        active: value.active,
      });
      this.showFlash('Usuário cadastrado com sucesso.', 'success');
    } else {
      // Atualização de usuário existente (por ID)
      this.usersSvc.update({
        id: value.id,
        name: value.name,
        email: value.email,
        password: value.password,
        role: value.role,
        active: value.active,
      });
      this.showFlash('Usuário atualizado com sucesso.', 'info');
    }

    this.refresh();
    this.clear();
  }

  clear() {
    this.form.reset({
      id: '',
      name: '',
      email: '',
      password: '',
      role: 'colaborador',
      active: true,
    });
  }

  // Preenche o formulário com os dados do usuário selecionado
  edit(u: UsuarioSistema) {
    this.form.setValue({
      id: u.id ?? '',
      name: u.name,
      email: u.email,
      password: u.password ?? '',
      role: u.role,
      active: !!u.active,
    });
  }

  askRemove(u: UsuarioSistema) {
    if (!u.id) return;
    this.pendingDeleteId.set(u.id);
  }

  cancelRemove() {
    this.pendingDeleteId.set(null);
  }

  // Confirma a remoção de um usuário pelo ID
  confirmRemove(u: UsuarioSistema) {
    if (!u.id) return;
    this.usersSvc.remove(u.id);
    this.refresh();
    if (this.form.value.id === u.id) this.clear();
    this.pendingDeleteId.set(null);
    this.showFlash(`Usuário "${u.name}" removido.`, 'danger');
  }

  // TrackBy por ID para evitar recriação desnecessária de elementos da lista
  trackById = (_: number, u: UsuarioSistema) => u.id ?? '';

  private refresh() {
    this.users.set(this.usersSvc.list());
  }
}
