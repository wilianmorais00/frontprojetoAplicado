import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgOptimizedImage],
  templateUrl: './logComponent.html',
  styleUrls: ['./logComponent.css'],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private routes = inject(Router);

  form = this.fb.group({
    email: ['wilianmorais@gmail.com', [Validators.required, Validators.email]],
    password: ['12345', [Validators.required]],
  });

  get email() { return this.form.controls.email; }
  get password() { return this.form.controls.password; }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('Login Bem Sucedido]', this.form.getRawValue());

    this.routes.navigate(['/home']);
  }
}
