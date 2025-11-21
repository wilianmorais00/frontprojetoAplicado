import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeService } from '../../Service/theme.service';

/**
 * Painel lateral de configurações:
 * - Alterna tema claro/escuro
 * - Faz logout e volta para a tela de login
 */
@Component({
  selector: 'app-component-configuration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './component-configuration.html',
  styleUrls: ['./component-configuration.css'],
})
export class PainelConfiguracoesComponent {
  @Output() closed = new EventEmitter<void>();

  constructor(private router: Router, private theme: ThemeService) {}

  get isDark(): boolean {
    return this.theme.isDark;
  }

  close() {
    this.closed.emit();
  }

  onLangChange(_: string) {}

  // Alterna o tema da aplicação (classe CSS 'theme-dark' no <html>)
  toggleTheme() {
    this.theme.toggle();
  }

  // Logout simples baseado em AuthService + navegação para /login
  logout() {
    this.close();
    this.router.navigate(['/login']);
  }
}
