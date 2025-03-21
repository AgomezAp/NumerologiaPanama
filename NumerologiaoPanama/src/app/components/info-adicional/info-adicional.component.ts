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
import { DatosService } from '../../services/datos.service';
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
  numero_suerte: string ='';
  isLoading: boolean = false;
  estado_animo: string =  '';
  /**
  * Constructor del componente.
  * @param router Servicio de enrutamiento de Angular.
  * @param fb Constructor de formularios reactivos.
  * @param dataService Servicio para manejar los datos del formulario.
  */

  constructor(private router: Router, private fb: FormBuilder, private dataService: DataService,private datosService:DatosService) {
    this.additionalInfoForm = this.fb.group({
      estado_animo: ['', Validators.required],
      numero_suerte: ['', Validators.required]
    });
    const previousData = this.dataService.getFormData();
    this.additionalInfoForm.patchValue(previousData);
  }


  ngOnInit(): void { }
  /**
   * Método para manejar el envío del formulario.
   */
  onSubmit(): void {
    console.log('Formulario enviado:', this.additionalInfoForm.value);
    if (this.additionalInfoForm.valid) {
      const formData = this.additionalInfoForm.value;
      console.log('Form Data:', formData);
      this.dataService.setFormData(formData);
      localStorage.setItem('estado_animo', formData.estado_animo);
      localStorage.setItem('numero_suerte', formData.numero_suerte);
      // Redirige a otra ruta si es necesario
      this.router.navigate(['/cards']);
    }
  }
}
