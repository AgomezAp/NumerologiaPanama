import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnInit,
} from '@angular/core';

declare var particlesJS: any;
@Component({
  selector: 'app-particles',
  templateUrl: './particles.component.html',
  styleUrl: './particles.component.css',
})
export class ParticlesComponent implements OnInit{
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any>('/particulas2.json').subscribe(
      (config) => {
        particlesJS('particles-js', config, function() {
          console.log('callback - particles.js config loaded');
        });
      },
      (error) => {
        console.error('Error loading particles.js config:', error);
      }
    );
  }
  /* @ViewChild('contenedor3d') contenedor3d!: ElementRef;

  private escena!: THREE.Scene;
  private camara!: THREE.PerspectiveCamera;
  private renderizador!: THREE.WebGLRenderer;
  private geometria!: THREE.BufferGeometry;
  private material!: THREE.LineBasicMaterial;
  private lineas!: THREE.Line;
  private numParticulas = 150;
  private posiciones!: Float32Array;
  private velocidades!: Float32Array;
  private colores!: Float32Array;
  private circulos: THREE.Mesh[] = [];
  private umbralDistancia = 50; // Umbral para conectar puntos
  private margen = 250; // Margen para los bordes

  constructor(private ngZone: NgZone) { }

  ngAfterViewInit() {
    this.crearEscena();
    this.crearCamara();
    this.crearRenderizador();
    this.crearParticulas();
    this.animar();
  }

  private crearEscena() {
    this.escena = new THREE.Scene();
    this.escena.background = null; // Eliminar el fondo de la escena
  }

  private crearCamara() {
    const relacionAspecto =
      this.contenedor3d.nativeElement.clientWidth / this.contenedor3d.nativeElement.clientHeight;
    this.camara = new THREE.PerspectiveCamera(45, relacionAspecto, 0.1, 1000);
    this.camara.position.z = 400;
  }

  private crearRenderizador() {
    this.renderizador = new THREE.WebGLRenderer({ alpha: true }); // Habilitar transparencia
    this.renderizador.setSize(
      this.contenedor3d.nativeElement.clientWidth,
      this.contenedor3d.nativeElement.clientHeight
    );
    this.contenedor3d.nativeElement.appendChild(this.renderizador.domElement);
    this.renderizador.setClearColor(0xffffff, 0); // Establecer color de fondo transparente
  }

  private crearParticulas() {
    this.geometria = new THREE.BufferGeometry();
    this.posiciones = new Float32Array(this.numParticulas * 3);
    this.velocidades = new Float32Array(this.numParticulas * 3);
    this.colores = new Float32Array(this.numParticulas * 3);

    const geometryCirculos = new THREE.CircleGeometry(2, 32);
    const materialCirculos = new THREE.MeshBasicMaterial({ color: 0xccccc }); // Color grisáceo

    for (let i = 0; i < this.numParticulas; i++) {
      this.posiciones[i * 3] = (Math.random() - 0.5) * 200;
      this.posiciones[i * 3 + 1] = (Math.random() - 0.5) * 200;
      this.posiciones[i * 3 + 2] = (Math.random() - 0.5) * 200;

      this.velocidades[i * 3] = (Math.random() - 0.5) * 0.5;
      this.velocidades[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      this.velocidades[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

      this.colores[i * 3] = 0.8; // Color grisáceo para las líneas
      this.colores[i * 3 + 1] = 0.8;
      this.colores[i * 3 + 2] = 0.8;

      const circulo = new THREE.Mesh(geometryCirculos, materialCirculos);
      circulo.position.set(this.posiciones[i * 3], this.posiciones[i * 3 + 1], this.posiciones[i * 3 + 2]);
      this.escena.add(circulo);
      this.circulos.push(circulo);
    }

    this.geometria.setAttribute('position', new THREE.BufferAttribute(this.posiciones, 3));
    this.geometria.setAttribute('color', new THREE.BufferAttribute(this.colores, 3));

    this.material = new THREE.LineBasicMaterial({ color: 0xffffff, vertexColors: true }); // Líneas blancas
    this.lineas = new THREE.Line(this.geometria, this.material);
    this.escena.add(this.lineas);
  }

  private animar() {
    const animacion = () => {
      this.ngZone.runOutsideAngular(() => {
        requestAnimationFrame(animacion);

        for (let i = 0; i < this.numParticulas; i++) {
          this.posiciones[i * 3] += this.velocidades[i * 3];
          this.posiciones[i * 3 + 1] += this.velocidades[i * 3 + 1];
          this.posiciones[i * 3 + 2] += this.velocidades[i * 3 + 2];

          // Lógica de rebote
          if (Math.abs(this.posiciones[i * 3]) > this.margen) {
            this.velocidades[i * 3] *= -1;
          }
          if (Math.abs(this.posiciones[i * 3 + 1]) > this.margen) {
            this.velocidades[i * 3 + 1] *= -1;
          }

          this.circulos[i].position.set(
            this.posiciones[i * 3],
            this.posiciones[i * 3 + 1],
            this.posiciones[i * 3 + 2]
          );
        }

        this.actualizarLineas(); // Actualizar las líneas en cada frame

        this.geometria.attributes['position'].needsUpdate = true;
        this.renderizador.render(this.escena, this.camara);
      });
    };

    animacion();
  }

  private actualizarLineas() {
    const puntos = [];
    for (let i = 0; i < this.numParticulas; i++) {
      puntos.push(new THREE.Vector3(
        this.posiciones[i * 3],
        this.posiciones[i * 3 + 1],
        this.posiciones[i * 3 + 2]
      ));
    }

    const posicionesLineas = this.geometria.attributes['position'].array; // Obtener el array de posiciones existente

    let index = 0;
    for (let i = 0; i < this.numParticulas; i++) {
      for (let j = i + 1; j < this.numParticulas; j++) {
        const distancia = puntos[i].distanceTo(puntos[j]);
        if (distancia < this.umbralDistancia) {
          posicionesLineas[index++] = puntos[i].x;
          posicionesLineas[index++] = puntos[i].y;
          posicionesLineas[index++] = puntos[i].z;
          posicionesLineas[index++] = puntos[j].x;
          posicionesLineas[index++] = puntos[j].y;
          posicionesLineas[index++] = puntos[j].z;
        }
      }
    }

    this.geometria.attributes['position'].needsUpdate = true; // Indicar que la geometría ha cambiado
  } */
}