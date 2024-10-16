import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { Invader } from './invader.model';

@Component({
  selector: 'app-choice-box',
  standalone: true,
  templateUrl: './choice-box.component.html',
  styleUrls: ['./choice-box.component.css']
})
export class ChoiceBoxComponent implements OnInit {
  invaders: Invader[] = []; // List of invaders
  private animationId: number | null = null; // ID for animation frame

  private isButtonclicked: boolean = false; // Flag to check if the button is clicked

  noButtonCursor: string = 'pointer'; // Curseur de la souris pour le bouton No
  noButtonOpacity: number = 1; // Opacité du bouton No
  buttonNoX: number = 0; // Position X du bouton No
  buttonNoY: number = 0; // Position Y du bouton No
  
  /**
   * Initializes a new instance of the ChoiceBoxComponent class.
   * @param renderer - The Renderer2 service for manipulating the DOM.
   * @param el - The ElementRef for accessing the component's native element.
   */
  constructor(private renderer: Renderer2, private el: ElementRef) {}

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   * Initializes the invaders and starts the animation loop.
   */
  ngOnInit(): void {
    this.invaders = [
      new Invader(0, 5, 35, 'top', 0.7, 0),
      new Invader(1, 15, 58, 'top', 0.7, 45),
      new Invader(2, 25, 24, 'bottom', 0.5, 90),
      new Invader(3, 35, 83, 'top', 1, 135),
      new Invader(4, 65, 46, 'bottom', 0.62, 180),
      new Invader(5, 75, 81, 'top', 0.62, 225),
      new Invader(6, 85, 23, 'bottom', 0.8, 270),
      new Invader(7, 95, 67, 'top', 0.84, 315),
    ];

    this.startAnimation(); // Start the animation loop
  }

  /**
   * Starts the animation loop for the invaders.
   * Calls the appropriate movement method based on the invader's target state.
   */
  startAnimation() {
    const animate = () => {
      this.invaders.forEach((invader) => {
        switch (invader.target) {
          case 0:
            invader.move(); // Normal movement
            break;
          case 1:
            invader.moveToTarget(2); // Move towards the target
            break;
          case 2:
            invader.dance(); // Dancing movement
            break;
            case 3:
              invader.moveToTarget(4); // Move towards the target
              break;
            case 4:
              if (this.allInvadersAtTarget(4)) {
                setTimeout(() => {
                  this.invaders.forEach(inv => {
                    this.kidnapNoButton(inv); // Kidnap each invader
                  });
                }, 200); // Attendre 500 ms avant de kidnapper
              }
                  break;
            case 5:
                invader.moveToTarget(6); // Move towards the target
              break;
              case 6:
                if (this.allInvadersAtTarget(6)) {
                  setTimeout(() => {
                    this.invaders.forEach(inv => {
                      invader.comebackInitialPos();
                    });
                  }, 1200); // Attendre 500 ms avant de kidnapper
                }
                break;
              case 7:
                invader.moveToTarget(0, false);
                break;
          default:
            break;
        }

        // Apply styles to the invader elements
        const invaderElement = this.el.nativeElement.querySelector(`.space-invader-${invader.id}`);
        this.renderer.setStyle(invaderElement, 'left', `${invader.x}%`);
        this.renderer.setStyle(invaderElement, 'top', `${invader.y}%`);
      });

      // Mettre à jour la position du bouton No
      const noButtonElement = this.el.nativeElement.querySelector('#no-button');
      this.renderer.setStyle(noButtonElement, 'left', `${this.buttonNoX}px`);
      this.renderer.setStyle(noButtonElement, 'top', `${this.buttonNoY}px`);


      // Check if all invaders have reached their target
      if (this.invaders.every(invader => invader.target === 2)) {
        this.invaders.forEach(invader => invader.target = 2); // Keep in dance state
      }

      // Request a new animation frame
      this.animationId = requestAnimationFrame(animate);
    };

    // Start the animation
    this.animationId = requestAnimationFrame(animate);
  }

  /**
   * Vérifie si tous les envahisseurs ont atteint leur cible spécifiée.
   * @param target - La cible à vérifier.
   * @returns true si tous les envahisseurs sont à la cible, sinon false.
   */
  private allInvadersAtTarget(target: number): boolean {
    return this.invaders.every(invader => invader.target === target);
  }

  /**
   * Event handler for when the "Yes" button is clicked.
   * Calculates the target positions for the invaders to move towards in an oval pattern.
   */
  onYesClick(): void {
    if (this.isButtonclicked) {return;}
    
    const yesButton = this.el.nativeElement.querySelector('#yes-button');
    const container = this.el.nativeElement.querySelector('.choice-container');
  
    const yesButtonRect = yesButton.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    

    const deltaY = heightToDeltaY.find(([height]) => window.innerHeight >= height)?.[1] ?? 120;
    
    const centerX = Math.round(yesButtonRect.left + yesButtonRect.width / 2 + window.scrollX);
    const centerY = Math.round(yesButtonRect.top + yesButtonRect.height / 2 + window.scrollY) + deltaY;
  
    const containerX = Math.round(containerRect.left + window.scrollX);
    const containerY = Math.round(containerRect.top + window.scrollY);
  
    const relativeCenterX = centerX - containerX;
    const relativeCenterY = centerY - containerY;

    const radiusX =  140;
    const radiusY = 160;
  
    this.invaders.forEach((invader) => {
      if (invader.target === 2) {
        return;
      }
  
      const angleInRadians = invader.angle * (Math.PI / 180);
      const targetX = relativeCenterX + (radiusX * Math.cos(angleInRadians));
      const targetY = relativeCenterY + (radiusY * Math.sin(angleInRadians));
  
      invader.targetX = targetX - (invader.width / 2);
      invader.targetY = targetY - (invader.height / 2);
  
      invader.target = 1;
    });
    this.isButtonclicked = true;
    this.hideNoButtonGradually(); // Rendre le bouton invisible progressivement
  }
  

  onNoClick(): void {
    if (this.isButtonclicked) {return;}

    const noButton = this.el.nativeElement.querySelector('#no-button');
    const container = this.el.nativeElement.querySelector('.choice-container');
    
    const noButtonRect = noButton.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
  
    const deltaY = heightToDeltaY.find(([height]) => window.innerHeight >= height)?.[1] ?? 120;
    
    const centerX = Math.round(noButtonRect.left + noButtonRect.width / 2 + window.scrollX);
    const centerY = Math.round(noButtonRect.top + noButtonRect.height / 2 + window.scrollY) + deltaY;
    
    const containerX = Math.round(containerRect.left + window.scrollX);
    const containerY = Math.round(containerRect.top + window.scrollY);
    
    const relativeCenterX = centerX - containerX;
    const relativeCenterY = centerY - containerY;
  
    const radiusX = 140;
    const radiusY = 160;
    
    this.invaders.forEach((invader) => {
      if (invader.target >= 3) {
        return;
      }
    
      const angleInRadians = invader.angle * (Math.PI / 180);
      const targetX = relativeCenterX + (radiusX * Math.cos(angleInRadians));
      const targetY = relativeCenterY + (radiusY * Math.sin(angleInRadians));
    
      invader.targetX = targetX - (invader.width / 2);
      invader.targetY = targetY - (invader.height / 2);
    
      invader.target = 3;
  
      // Calculer la nouvelle position du bouton No
      this.buttonNoX = targetX; // Update the button's position
      this.buttonNoY = targetY + 20; // You can adjust this value as needed
    });
  }
  
  kidnapNoButton(invader: Invader): void {
    // invader.targetX = window.innerWidth * 0.8;
    invader.targetY = -100; 
    invader.target = 5; 
  }

  gobackInit(invader: Invader): void {
    invader.targetX = invader.originalX;
    invader.targetY = invader.originalY;
    invader.target = 7;
  }

  hideNoButtonGradually(): void {
    const duration = 2000; // Durée de 2 secondes
    const interval = 50; // Intervalle de temps en millisecondes
    const decrement = interval / duration; // Calculer le changement d'opacité à chaque intervalle
    let opacity = this.noButtonOpacity;
  
    const fadeOut = setInterval(() => {
      opacity -= decrement; // Diminuer l'opacité
      if (opacity <= 0) {
        opacity = 0; // S'assurer que l'opacité ne soit pas inférieure à 0
        clearInterval(fadeOut); // Arrêter l'intervalle lorsque l'opacité est à 0
      }
      this.noButtonOpacity = opacity; // Appliquer la nouvelle opacité
    }, interval);
    this.noButtonCursor = 'default'; // Changer le curseur de la souris
  }


  /**
   * Lifecycle hook that is called just before the component is destroyed.
   * Cancels the animation frame to clean up resources.
   */
  ngOnDestroy(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId); // Cancel the animation when the component is destroyed
    }
  }
}


const heightToDeltaY: [number, number][] = [
  [2100, 1100],
  [2000, 1060],
  [1900, 960],
  [1800, 880],
  [1700, 800],
  [1600, 760],
  [1500, 680],
  [1400, 600],
  [1300, 530],
  [1200, 480],
  [1100, 400],
  [1000, 330],
  [900, 250],
  [800, 180],
  [700, 120],
  [600, 50],
  [500, -40],
  [0, 120]  // Valeur par défaut si aucune correspondance
];
