import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientsService, Client } from '../../Service/client-service';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-component.html',
  styleUrls: ['./client-component.css'],
})
export class CadastroHospedeComponent {
  // Builder de formulários reativo
  private fb = inject(FormBuilder);

  // Roteador para navegar entre telas
  private roteador = inject(Router);

  // Serviço responsável pelos hóspedes (ClientsService)
  private servicoHospedes = inject(ClientsService);

  // Formulário em PT-BR (os nomes aqui DEVEM bater com o HTML)
  form = this.fb.nonNullable.group({
    nomeCompleto: ['', [Validators.required, Validators.minLength(2)]],
    quarto: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', [Validators.required]],
    dataCheckin: ['', [Validators.required]],
    dataCheckout: ['', [Validators.required]],
  });

  // Banner de feedback (sucesso/erro) exibido acima do formulário
  banner: string | null = null;
  bannerType: 'success' | 'error' = 'success';
  private bannerTimer?: any;

  // Atalho para acessar os controles no HTML (f.nomeCompleto, f.quarto, etc.)
  get f() {
    return this.form.controls;
  }

  // Exibe o banner temporariamente
  private exibirBanner(
    mensagem: string,
    tipo: 'success' | 'error',
    ms = 3500,
  ) {
    this.banner = mensagem;
    this.bannerType = tipo;
    if (this.bannerTimer) clearTimeout(this.bannerTimer);
    this.bannerTimer = setTimeout(() => (this.banner = null), ms);
  }

  // Salva o hóspede usando o modelo Client
  // (name, room, email, phone, checkin, checkout, assignedFormId)
  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valor = this.form.getRawValue();

    const quarto = (valor.quarto ?? '').trim();
    const dataCheckin = valor.dataCheckin!;
    const dataCheckout = valor.dataCheckout!;

    // Validação de conflito de quarto no período
    const disponivel = this.servicoHospedes.isRoomAvailable(
      quarto,
      dataCheckin,
      dataCheckout,
    );

    if (!disponivel) {
      this.exibirBanner(
        'Quarto já direcionado a outro hóspede no período informado.',
        'error',
      );
      return;
    }

    // Monta o objeto Client com os campos esperados pelo serviço
    const novoHospede: Client = {
      id: this.gerarId(),          // ID do hóspede
      name: valor.nomeCompleto!,   // nome salvo no modelo Client
      email: valor.email!,
      phone: valor.telefone!,
      room: quarto,
      checkin: dataCheckin,
      checkout: dataCheckout,
      assignedFormId: null,        // ainda sem formulário atribuído
    };

    this.servicoHospedes.upsert(novoHospede);

    this.exibirBanner(
      `${valor.nomeCompleto} cadastrado com sucesso.`,
      'success',
    );

    this.form.reset();
  }

  cancelar() {
    this.voltarParaHome();
  }

  private voltarParaHome() {
    this.roteador.navigate(['/home']);
  }

  // Gera o ID do hóspede (usa crypto.randomUUID quando disponível)
  private gerarId(): string {
    try {
      return crypto.randomUUID();
    } catch {
      return Math.random().toString(36).slice(2);
    }
  }
}
