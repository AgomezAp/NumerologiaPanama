import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import {
  emotionalAlerts,
  esotericRecommendations,
  genderDescriptions,
  getRandomItem,
} from '../../assets/data';
import { DataService } from '../../services/data.service';
import { ParticlesComponent } from '../../shared/particles/particles.component';

@Component({
  selector: 'app-maquina-casino',
  imports: [CommonModule, FormsModule, ParticlesComponent],
  templateUrl: './maquina-casino.component.html',
  styleUrls: ['./maquina-casino.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [
        animate('1s ease-in', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class MaquinaCasinoComponent implements OnInit {
  additionalInfoForm: FormGroup;
  spinning = false;
  slot1Src!: string;
  slot2Src!: string;
  slot3Src!: string;
  luckyDescription!: string;
  luckyNumbers!: string;
  selectedCards: {
    src: string;
    number: number;
    descriptions: string[];
    specificDescription: string;
  }[] = [];
  spinStartTime!: number;
  lastSlotUpdateTime = 0; 
  desiredUpdateInterval = 2
  spinDuration = 3500; // Duración de la animación en milisegundos (3 seg)

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private dataService: DataService
  ) {
    this.additionalInfoForm = this.fb.group({
      mood: ['', Validators.required],
      focus: ['', Validators.required],
      birthDate: ['', Validators.required],
      gender: ['', Validators.required],
    });
    const formData = this.dataService.getFormData();
    this.additionalInfoForm.patchValue(formData);
    console.log('Datos del formulario cargados:', formData);
  }

  ngOnInit(): void {
    if (this.additionalInfoForm.valid) {
      console.log('Formulario inicializado:', this.additionalInfoForm.value);
    }
  }

  startSpinSlots(): void {
    this.spinning = true;
    this.spinStartTime = performance.now();
    this.animateSlots();
  }

  animateSlots(): void {
    if (!this.spinning) {
      return;
    }
  
    const currentTime = performance.now();
    // Actualiza las imágenes solo si ha pasado el tiempo deseado desde la última actualización
    if (currentTime - this.lastSlotUpdateTime >= this.desiredUpdateInterval) {
      const random1 = getRandomItem();
      const random2 = getRandomItem();
      const random3 = getRandomItem();
  
      this.slot1Src = random1.src;
      this.slot2Src = random2.src;
      this.slot3Src = random3.src;
  
      this.selectedCards = [
        {
          src: random1.src,
          number: random1.number,
          descriptions: random1.descriptions,
          specificDescription: random1.specificDescription ?? '',
        },
        {
          src: random2.src,
          number: random2.number,
          descriptions: random2.descriptions,
          specificDescription: random2.specificDescription ?? '',
        },
        {
          src: random3.src,
          number: random3.number,
          descriptions: random3.descriptions,
          specificDescription: random3.specificDescription ?? '',
        },
      ];
  
      // Actualiza el tiempo de la última actualización
      this.lastSlotUpdateTime = currentTime;
    }
  
    // Verifica si ya transcurrió la duración total para detener el giro
    if (currentTime - this.spinStartTime < this.spinDuration) {
      requestAnimationFrame(() => this.animateSlots());
    } else {
      this.stopSpinSlots();
    }
  }
  async stopSpinSlots(): Promise<void> {
    if (this.spinning) {
      this.spinning = false;
      // Espera un momento para asegurar que la animación se detenga visualmente
      await this.delay(0);

      // Obtener el signo zodiacal del usuario (almacenado previamente)
      const birthDateString = this.additionalInfoForm.get('birthDate')?.value;
      if (!birthDateString) {
        console.error('Birth date is not defined');
        return;
      }
      const birthDate = new Date(birthDateString);
      const zodiacSign = this.calculateZodiacSign(birthDate);

      // Seleccionar una descripción aleatoria de la primera carta
      const descriptions = this.selectedCards[0]?.descriptions;
      if (!descriptions || descriptions.length === 0) {
        console.error('Descriptions are not defined or empty');
        return;
      }
      const randomDescription =
        descriptions[Math.floor(Math.random() * descriptions.length)];

      // Obtener el género seleccionado
      const genderValue = this.additionalInfoForm.get('gender')?.value as keyof typeof genderDescriptions;
      if (!genderValue || !genderDescriptions[genderValue]) {
        console.error('Gender value is not defined or invalid');
        return;
      }
      const randomGenderDescription =
        genderDescriptions[genderValue][
          Math.floor(Math.random() * genderDescriptions[genderValue].length)
        ];

      // Seleccionar una recomendación esotérica según el enfoque del usuario
      const focusValue = this.additionalInfoForm.get('focus')?.value as keyof typeof esotericRecommendations;
      if (!focusValue || !esotericRecommendations[focusValue]) {
        console.error('Focus value is not defined or invalid');
        return;
      }
      const randomEsotericRecommendation =
        esotericRecommendations[focusValue][
          Math.floor(Math.random() * esotericRecommendations[focusValue].length)
        ];

      // Seleccionar una alerta emocional
      const moodValue = this.additionalInfoForm.get('mood')?.value as keyof typeof emotionalAlerts;
      if (!moodValue || !emotionalAlerts[moodValue]) {
        console.error('Mood value is not defined or invalid');
        return;
      }
      const randomEmotionalAlert =
        emotionalAlerts[moodValue][
          Math.floor(Math.random() * emotionalAlerts[moodValue].length)
        ];

      // Construir la descripción final y los números de la suerte
      this.luckyDescription = `${zodiacSign}: ${randomDescription} ${randomGenderDescription} ${randomEmotionalAlert} ${randomEsotericRecommendation}`;
      this.luckyNumbers = `${this.selectedCards[0].number}, ${this.selectedCards[1].number}, ${this.selectedCards[2].number}`;

      // Redirigir a la página de resultados pasando la información necesaria
      this.router.navigate(['/result'], {
        state: {
          selectedCards: this.selectedCards,
          luckyDescription: this.luckyDescription,
          luckyNumbers: this.luckyNumbers,
        },
      });
    }
  }

  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  calculateZodiacSign(birthDate: Date): string {
    const zodiacSigns = [
      { sign: "Capricornio", start: new Date(0, 0, 1), end: new Date(0, 0, 19) },
      { sign: "Acuario", start: new Date(0, 0, 20), end: new Date(0, 1, 18) },
      { sign: "Piscis", start: new Date(0, 1, 19), end: new Date(0, 2, 20) },
      { sign: "Aries", start: new Date(0, 2, 21), end: new Date(0, 3, 19) },
      { sign: "Tauro", start: new Date(0, 3, 20), end: new Date(0, 4, 20) },
      { sign: "Géminis", start: new Date(0, 4, 21), end: new Date(0, 5, 20) },
      { sign: "Cáncer", start: new Date(0, 5, 21), end: new Date(0, 6, 22) },
      { sign: "Leo", start: new Date(0, 6, 23), end: new Date(0, 7, 22) },
      { sign: "Virgo", start: new Date(0, 7, 23), end: new Date(0, 8, 22) },
      { sign: "Libra", start: new Date(0, 8, 23), end: new Date(0, 9, 22) },
      { sign: "Escorpio", start: new Date(0, 9, 23), end: new Date(0, 10, 21) },
      { sign: "Sagitario", start: new Date(0, 10, 22), end: new Date(0, 11, 21) },
      { sign: "Capricornio", start: new Date(0, 11, 22), end: new Date(0, 11, 31) }
    ];

    const month = birthDate.getMonth();
    const day = birthDate.getDate();

    for (const zodiac of zodiacSigns) {
      if (
        (month === zodiac.start.getMonth() && day >= zodiac.start.getDate()) ||
        (month === zodiac.end.getMonth() && day <= zodiac.end.getDate())
      ) {
        return zodiac.sign;
      }
    }
    return "Signo desconocido";
  }
}
