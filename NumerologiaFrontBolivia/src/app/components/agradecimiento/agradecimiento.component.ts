import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ParticlesComponent } from '../../shared/particles/particles.component';

declare var anime: any; 
@Component({
  selector: 'app-agradecimiento',
  imports: [ParticlesComponent],
  templateUrl: './agradecimiento.component.html',
  styleUrl: './agradecimiento.component.css',
})
export class AgradecimientoComponent {
  
  constructor(private router:Router) {}

  redirigir(){
    this.router.navigate(['/info']);
  }
}
