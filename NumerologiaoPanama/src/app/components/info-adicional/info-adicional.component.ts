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
  selector: 'app-info-adicional',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ParticlesComponent],
  templateUrl: './info-adicional.component.html',
  styleUrl: './info-adicional.component.css',
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [
        animate('1s ease-in', style({ opacity: 1 }))
      ])
    ])
  ],
})
export class InfoAdicionalComponent {
  additionalInfoForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder, private dataService: DataService) {
    this.additionalInfoForm = this.fb.group({
      mood: ['', Validators.required],
      focus: ['', Validators.required]
    });
    const previousData = this.dataService.getFormData();
    this.additionalInfoForm.patchValue(previousData);
  }


  ngOnInit(): void { }

  onSubmit(): void {
    console.log('Formulario enviado:', this.additionalInfoForm.value);
    if (this.additionalInfoForm.valid) {
      const formData = this.additionalInfoForm.value;
      console.log('Form Data:', formData);
      this.dataService.setFormData(formData);
      // Redirige a otra ruta si es necesario
      this.router.navigate(['/cards']);
    }
  }
}
