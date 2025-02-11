import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { DataService } from '../../services/data.service';
import { ParticlesComponent } from '../../shared/particles/particles.component';

@Component({
  selector: 'app-info',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ParticlesComponent],
  templateUrl: './info.component.html',
  styleUrl: './info.component.css',
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [animate('1s ease-in', style({ opacity: 1 }))]),
    ]),
  ],
})
export class InfoComponent {
  infoForm: FormGroup;
  maxDate: string;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private dataService: DataService
  ) {
    this.infoForm = this.fb.group({
      nombreCliente: ['', Validators.required],
      birthDate: ['', [Validators.required]],
      gender: ['', Validators.required],
    });

    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.infoForm.valid) {
      const formData = this.infoForm.value;
      this.dataService.setFormData(formData);
      localStorage.setItem('nombreCliente', formData.nombreCliente);
      this.router.navigate(['/additional-info']);
    } else {
      this.infoForm.markAllAsTouched(); // Marca todos los campos para mostrar errores si no están llenos.
    }
  }
}
