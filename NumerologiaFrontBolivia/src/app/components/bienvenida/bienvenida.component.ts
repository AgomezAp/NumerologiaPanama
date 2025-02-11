import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ParticlesComponent } from '../../shared/particles/particles.component';

@Component({
  selector: 'app-bienvenida',
  imports: [CommonModule,ParticlesComponent ],
  templateUrl: './bienvenida.component.html',
  styleUrl: './bienvenida.component.css',
  animations: [
    trigger('fadeIn', [
        state('void', style({ opacity: 0 })),
        transition(':enter', [
          animate('1s ease-in', style({ opacity: 1 }))
        ])
      ])
  ],
})
export class BienvenidaComponent {
constructor(private router:Router) {}
  redirect() {
    console.log('redirecting to welcome');
    this.router.navigate(['/info']);
  }
}

