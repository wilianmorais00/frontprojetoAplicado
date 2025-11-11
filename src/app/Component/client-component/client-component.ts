import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientsService } from '../../Service/forms-service/client-service';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-component.html',
  styleUrls: ['./client-component.css'],
})
export class ClientComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private clientsSvc = inject(ClientsService);

  form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]] ,
    phone: ['', [Validators.required, Validators.minLength(8)]],
    room: ['', [Validators.required]],
    checkin: ['', [Validators.required]],
    checkout: ['', [Validators.required]],
  });

  get f() { return this.form.controls; }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue();
    this.clientsSvc.add({
      name: v.fullName.trim(),
      email: v.email.trim(),
      phone: v.phone.trim(),
      room: v.room.trim(),
      checkin: v.checkin,
      checkout: v.checkout,
    });
    this.router.navigate(['/home']);
  }

  cancel() { this.router.navigate(['/home']); }
}
