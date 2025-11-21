import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../Service/auth-service';

/**
 * Tela de login da aplicação (rota /login).
 * Importante: classe em PT-BR, mas no final exporto também como LoginComponent
 * para manter compatibilidade com qualquer import antigo.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgOptimizedImage],
  templateUrl: './logComponent.html',
  styleUrls: ['./logComponent.css'],
})
export class TelaLoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);

  // Formulário de login (e-mail e senha)
  form = this.fb.group({
    email: ['administrador@gmail.com', [Validators.required, Validators.email]],
    password: ['202558', [Validators.required]],
  });

  // Atalhos para os controles no template (email, password)
  get email() {
    return this.form.controls.email;
  }
  get password() {
    return this.form.controls.password;
  }

  /**
   * Envia o formulário de login.
   * No HTML é chamado em (ngSubmit)="submit()".
   */
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();

    const ok = this.auth.login(String(email), String(password));
    if (!ok) {
      alert('Credenciais inválidas ou usuário inativo.');
      return;
    }

    this.router.navigate(['/home']);
  }
}

/**
 * Alias para manter compatibilidade:
 * se em algum lugar ainda houver `import { LoginComponent } ...`,
 * isso continua funcionando.
 */
export { TelaLoginComponent as LoginComponent };
