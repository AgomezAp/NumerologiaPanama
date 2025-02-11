import { Routes } from '@angular/router';

import {
  AgradecimientoComponent,
} from './components/agradecimiento/agradecimiento.component';
import {
  BienvenidaComponent,
} from './components/bienvenida/bienvenida.component';
import {
  InfoAdicionalComponent,
} from './components/info-adicional/info-adicional.component';
import { InfoComponent } from './components/info/info.component';
import {
  MaquinaCasinoComponent,
} from './components/maquina-casino/maquina-casino.component';
import { ResultComponent } from './components/result/result.component';
import { ParticlesComponent } from './shared/particles/particles.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },
  {
    path: 'welcome',
    component: BienvenidaComponent,
  },
  {
    path: 'info',
    component: InfoComponent,
  },
  {
    path: 'additional-info',
    component: InfoAdicionalComponent,
  },
  {
    path: 'cards',
    component: MaquinaCasinoComponent,
  },
  {
    path: 'result',
    component: ResultComponent,
  },
  {
    path: 'particles',
    component: ParticlesComponent,
  },
  {
    path: 'agradecimiento',
    component: AgradecimientoComponent,
  },
];
