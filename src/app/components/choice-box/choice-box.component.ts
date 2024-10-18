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

  noButtonCursor: string = 'pointer'; // Mouse cursor for the "No" button
  noButtonOpacity: number = 1; // Opacity of the "No" button
  buttonNoXPercent: number = 0; // X position of the "No" button as a percentage
  buttonNoYPercent: number = 0; // Y position of the "No" button as a percentage

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
    const noButtonElement = this.el.nativeElement.querySelector('#no-button');

    // Get dimensions of the parent container (or window if needed)
    const parentElement = noButtonElement.offsetParent as HTMLElement;
    const parentWidth = parentElement.offsetWidth;
    const parentHeight = parentElement.offsetHeight;
    
    // Get button positions relative to the parent container
    const buttonLeft = noButtonElement.offsetLeft;
    const buttonTop = noButtonElement.offsetTop;
    
    // Convert positions to percentages
    this.buttonNoXPercent = (buttonLeft / parentWidth) * 100;
    this.buttonNoYPercent = (buttonTop / parentHeight) * 100;
    console.log('Button positions in INIT:', this.buttonNoXPercent, this.buttonNoYPercent);

    // Initialize invaders with their positions, angles, and speeds
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
  startAnimation(): void {
    const animate = () => {
      this.invaders.forEach((invader) => {
        switch (invader.target) {
          case 0:
            if (this.isButtonclicked) {
              this.isButtonclicked = false; // Reset button click flag
            }
            invader.move(); // Normal movement
            break;
          case 1:
            invader.moveToTarget(2); // Move towards the target
            break;
          case 2:
            invader.dance(); // Dancing movement around the "Yes" button
            break;
          case 3:
            invader.moveToTarget(4); // Move towards the "No" button
            break;
          case 4:
            if (this.allInvadersAtTarget(4)) {
              setTimeout(() => {
                this.invaders.forEach(inv => this.kidnapNoButton(inv)); // Kidnap the "No" button
              }, 200); 
            }
            break;
          case 5:
            invader.moveToTarget(6); // Move invaders away after kidnapping
            if (invader.id === 0) this.buttonNoYPercent -= 1; // Update "No" button Y position
            break;
          case 6:
            if (this.allInvadersAtTarget(6)) {
              setTimeout(() => {
                this.invaders.forEach(inv => invader.comebackInitialPos()); // Reset to initial position
              }, 1200);
            }
            break;
          case 7:
            invader.moveToTarget(0, false); // Return to initial position
            break;
          default:
            break;
        }

        // Apply styles to invader elements based on their updated positions
        const invaderElement = this.el.nativeElement.querySelector(`.space-invader-${invader.id}`);
        this.renderer.setStyle(invaderElement, 'left', `${invader.x}%`);
        this.renderer.setStyle(invaderElement, 'top', `${invader.y}%`);
      });

      // Update "No" button position
      const noButtonElement = this.el.nativeElement.querySelector('#no-button');
      this.renderer.setStyle(noButtonElement, 'left', `calc(60% - 94px)`);
      this.renderer.setStyle(noButtonElement, 'top', `${this.buttonNoYPercent}%`);
  
      // Keep invaders dancing if they have reached the target
      if (this.invaders.every(invader => invader.target === 2)) {
        this.invaders.forEach(invader => invader.target = 2);
      }

      // Request a new animation frame
      this.animationId = requestAnimationFrame(animate);
    };

    // Start the animation
    this.animationId = requestAnimationFrame(animate);
  }

  /**
   * Checks if all invaders have reached a specified target.
   * @param target - The target state to check for.
   * @returns true if all invaders are at the target, false otherwise.
   */
  private allInvadersAtTarget(target: number): boolean {
    return this.invaders.every(invader => invader.target === target);
  }

  /**
   * Event handler for when the "Yes" button is clicked.
   * Calculates target positions for the invaders to move in an oval pattern around the button.
   */
  onYesClick(): void {
    if (this.isButtonclicked) return;

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

    const radiusX = 140;
    const radiusY = 160;
  
    this.invaders.forEach((invader) => {
      if (invader.target === 2) return;
  
      const angleInRadians = invader.angle * (Math.PI / 180);
      const targetX = relativeCenterX + (radiusX * Math.cos(angleInRadians));
      const targetY = relativeCenterY + (radiusY * Math.sin(angleInRadians));
  
      invader.targetX = targetX - (invader.width / 2);
      invader.targetY = targetY - (invader.height / 2);
  
      invader.target = 1; // Set target to move towards the "Yes" button
    });

    this.isButtonclicked = true;
    this.hideNoButtonGradually(); // Gradually hide the "No" button
  }

  /**
   * Event handler for when the "No" button is clicked.
   * Moves invaders towards the "No" button to kidnap it.
   */
  onNoClick(): void {
    if (this.isButtonclicked) return;

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
      if (invader.target >= 3) return;
    
      const angleInRadians = invader.angle * (Math.PI / 180);
      const targetX = relativeCenterX + (radiusX * Math.cos(angleInRadians));
      const targetY = relativeCenterY + (radiusY * Math.sin(angleInRadians));
    
      invader.targetX = targetX - (invader.width / 2);
      invader.targetY = targetY - (invader.height / 2);
    
      invader.target = 3; // Set target to kidnap the "No" button
      this.isButtonclicked = true;
    });
  }

  /**
   * Sets the invader to kidnap the "No" button by moving it offscreen.
   * @param invader - The invader that will kidnap the button.
   */
  kidnapNoButton(invader: Invader): void {
    invader.targetY = -150; // Move the "No" button offscreen
    invader.target = 5; // Update target state
  }

  /**
   * Resets an invader to its initial position.
   * @param invader - The invader to reset.
   */
  gobackInit(invader: Invader): void {
    invader.targetX = invader.originalX;
    invader.targetY = invader.originalY;
    invader.target = 7; // Update target state
  }

  /**
   * Gradually hides the "No" button by decreasing its opacity over time.
   */
  hideNoButtonGradually(): void {
    const duration = 2000; // Duration of 2 seconds
    const interval = 50; // Interval time in milliseconds
    const decrement = interval / duration; // Calculate opacity change at each interval
    let opacity = this.noButtonOpacity;
  
    const fadeOut = setInterval(() => {
      opacity -= decrement; // Decrease opacity
      if (opacity <= 0) {
        opacity = 0; // Ensure opacity doesn't go below 0
        clearInterval(fadeOut); // Stop interval when opacity reaches 0
      }
      this.noButtonOpacity = opacity; // Apply the new opacity
    }, interval);

    this.noButtonCursor = 'default'; // Change mouse cursor
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

// Mapping of window height to delta Y offset for invader animation
const heightToDeltaY: [number, number][] = [
  [2100, 1100],
  [2000, 1060],
  [1900, 960],
  [1800, 880],
  [1700, 800],
  [1600, 760],
  [1500, 680],
  [1450, 640],
  [1400, 600],
  [1350, 570],
  [1300, 530],
  [1250, 500],
  [1200, 480],
  [1150, 440],
  [1100, 400],
  [1050, 360],
  [1000, 330],
  [950, 290],
  [900, 250],
  [850, 210],
  [800, 180],
  [750, 140],
  [700, 120],
  [650, 80],
  [600, 50],
  [500, -40],
  [0, 120]  // Default value if no match
];
