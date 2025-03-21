import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';

import { DataService } from '../../services/data.service';
import { DatosService } from '../../services/datos.service';
import { ParticlesComponent } from '../../shared/particles/particles.component';

@Component({
  selector: 'app-result',
  imports: [CommonModule, ParticlesComponent, FormsModule],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css',
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [animate('1s ease-in', style({ opacity: 1 }))]),
    ]),
  ],
})
export class ResultComponent implements OnInit {
  selectedCards: { src: string; number: number; descriptions: string[], specificDescription: string }[] = [];
  luckyDescription!: string;
  luckyNumbers!: string;
  countryCode: string = '';
  telefono: string = '';
  nombreCliente: string = '';
  private encryptionKey = 'U0qQ0TGufDDJqCNvQS0b795q8EZPAp9E';
  hoveredDescription: string | null = null;
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

  ngOnInit(): void {
    localStorage.setItem(('Descripciones'),this.luckyDescription)
    // Guardar datos de pago en localStorage
    const paymentData = {
      nombreCliente: this.dataService.getFormData().nombreCliente,
      selectedCards: this.selectedCards,
      luckyDescription: this.luckyDescription,
      luckyNumbers: this.luckyNumbers,
    };
    localStorage.setItem('paymentData', JSON.stringify(paymentData));
  }
  navigate(){
    this.router.navigate(['/enviar_datos']);
  }
  
  onCardMouseOver(specificDescription: string): void {
    this.hoveredDescription = specificDescription;
    console.log('Descripción específica:', specificDescription);
  }

  onCardMouseOut(): void {
    this.hoveredDescription = null;
  }
}