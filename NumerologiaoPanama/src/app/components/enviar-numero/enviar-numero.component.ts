import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';

import { Datos } from '../../interfaces/datos';
import { DataService } from '../../services/data.service';
import { DatosService } from '../../services/datos.service';
import { ParticlesComponent } from '../../shared/particles/particles.component';

@Component({
  selector: 'app-enviar-numero',
  imports: [ParticlesComponent,CommonModule,FormsModule],
  templateUrl: './enviar-numero.component.html',
  styleUrl: './enviar-numero.component.css',
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [animate('1s ease-in', style({ opacity: 1 }))]),
    ]),
  ],
})
export class EnviarNumeroComponent {

  selectedCards: { src: string; number: number; descriptions: string[], specificDescription: string }[] = [];
  luckyDescription!: string;
  luckyNumbers!: string;
  countryCode: string = '';
  telefono: string = '';
  nombreCliente: string = '';
  pais: string = '';
  isPaid: boolean = false;
  showPopupFlag: boolean = false;
  termsAccepted: boolean = false;
  private encryptionKey = 'U0qQ0TGufDDJqCNvQS0b795q8EZPAp9E';
  hoveredDescription: string | null = null;
  Nombre = localStorage.getItem('Nombre');
  fecha_nacimiento = localStorage.getItem('fecha_nacimiento');
  genero = localStorage.getItem('genero');
  /* telefono = localStorage.getItem('telefono'); */
  
  numero_suerte = localStorage.getItem('numero_suerte');
  estado_animo = localStorage.getItem('estado_animo');
  descripcion= localStorage.getItem('Descripciones');
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private dataService: DataService,
    private datosService: DatosService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      selectedCards: {
        src: string;
        number: number;
        descriptions: string[];
        specificDescription: string;
      }[];
      luckyDescription: string;
      luckyNumbers: string;
    };
    
    if (state) {
      this.selectedCards = state.selectedCards;
      this.luckyDescription = state.luckyDescription;
      this.luckyNumbers = state.luckyNumbers;
    }
  }

submitPhone(): void {
  const errorMessage = document.getElementById('errorMessage');
  const numErrorMessage = document.getElementById('numErrorMessage');
  if (!this.termsAccepted) {
    alert('Debes aceptar los términos y condiciones para continuar.');
    return;
  }
  if (isNaN(Number(this.telefono))) {
    numErrorMessage?.classList.add('show');
    numErrorMessage?.classList.remove('none');
    return;
  } else {
    numErrorMessage?.classList.remove('show');
    numErrorMessage?.classList.add('none');
  }

  if (!this.countryCode) {
    errorMessage?.classList.add('show');
    errorMessage?.classList.remove('none');
    return;
  } else {
    errorMessage?.classList.remove('show');
    errorMessage?.classList.add('none');
  }

  if (this.telefono) {
    document.getElementById('phoneContainer')?.classList.remove('show');
    setTimeout(() => {
      document.getElementById('phoneContainer')!.style.display = 'none';
      document.getElementById('thankYouMessage')!.style.display = 'block';
      document.getElementById('thankYouMessage')!.classList.add('show');
    }, 500);
  } else {
    alert('Por favor, ingresa tu número de teléfono.');
  }

  const numeroCliente = `${this.countryCode}${this.telefono}`;
  const numeroMaestro = '+573217374091';
  const Descripciones = this.descripcion; 
  const datosMod = {
    sessionId: '1234',
    phoneNumberCliente: numeroCliente,
    phoneNumberMaestro: numeroMaestro,
    nombreDelCliente: this.Nombre,
    message: `Nueva consulta de ${this.Nombre} (${numeroCliente}): \n\n${Descripciones} \n\nPonte en contacto con el cliente:\n\nhttps://wa.me/${numeroCliente}`,
  };

  const url = 'https://gestor-de-mesajeria-via-whatsapp-g5hc.onrender.com/api/messages/CrearMensaje';
  this.http.post(url, datosMod).subscribe(
    (response) => {
      console.log('Respuesta del servidor:', response);
    },
    (error) => {
      console.error('Error al realizar el POST:', error);
    }
  );
  // Validar que los datos en localStorage no sean null
  if (
    !this.Nombre ||
    !this.fecha_nacimiento ||
    !this.genero ||
    !this.numero_suerte ||
    !this.estado_animo
  ) {

    console.error('Faltan datos en localStorage');
    return;
  }
  this.pais =  this.countryCode
  // Crear el objeto formData
  const formData: Datos = {
    Nombre: this.Nombre,
    fecha_nacimiento: new Date(this.fecha_nacimiento),
    genero: this.genero,
    telefono: this.telefono,
    numero_suerte: this.numero_suerte,
    estado_animo: this.estado_animo,
    pais: this.pais
  };

  this.datosService.registrar(formData).subscribe(
    (response) => {
      console.log('Datos registrados con éxito:', response);
    },
    (error) => {
      console.error('Error al registrar los datos:', error);
    }
  );

  this.router.navigate(['/enviar_datos']);
}

}
