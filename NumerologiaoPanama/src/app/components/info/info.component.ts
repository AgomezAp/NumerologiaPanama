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
  Nombre: string = '';
  fecha_nacimiento: Date = new Date();
  genero: string = '';
  /* telefono: string = ''; */
  infoForm: FormGroup;
  maxDate: string;

  /**
   * Constructor del componente.
   * @param router Servicio de enrutamiento de Angular.
   * @param fb Constructor de formularios reactivos.
   * @param dataService Servicio para manejar los datos del formulario.
   */
constructor(
    private router: Router,
    private fb: FormBuilder,
    private dataService: DataService
  ) {
    this.infoForm = this.fb.group({
      Nombre: ['', Validators.required],
      fecha_nacimiento: ['', [Validators.required]],
      genero: ['', Validators.required],
   /*    telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]], */
    });

    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];
  }
 /**
   * Método para manejar el envío del formulario.
   */
  onSubmit(): void {
    if (this.infoForm.valid) {
      const formData = this.infoForm.value;
      this.dataService.setFormData(formData);
      localStorage.setItem('Nombre', formData.Nombre);
      localStorage.setItem('fecha_nacimiento', formData.fecha_nacimiento);
      localStorage.setItem('genero', formData.genero);
/*       localStorage.setItem('telefono', formData.telefono); */
      this.router.navigate(['/additional-info']);
    } else {
      this.infoForm.markAllAsTouched(); // Marca todos los campos para mostrar errores si no están llenos.
    }
  }
}
