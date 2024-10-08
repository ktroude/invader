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
          default:
            break;
        }

        // Apply styles to the invader elements
        const invaderElement = this.el.nativeElement.querySelector(`.space-invader-${invader.id}`);
        this.renderer.setStyle(invaderElement, 'left', `${invader.x}%`);
        this.renderer.setStyle(invaderElement, 'top', `${invader.y}%`);
      });

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
   * Event handler for when the "Yes" button is clicked.
   * Calculates the target positions for the invaders to move towards in an oval pattern.
   */
  onYesClick(): void {
    const yesButton = this.el.nativeElement.querySelector('#yes-button');
    const yesButtonRect = yesButton.getBoundingClientRect();
    
    // Calculate the center of the "Yes" button
    const centerX = Math.round(yesButtonRect.left + yesButtonRect.width / 2);
    const centerY = Math.round(yesButtonRect.top + yesButtonRect.height / 2);
    
    // Define radii for the oval
    const radiusX = 140; // Horizontal radius (width)
    const radiusY = 160; // Vertical radius (height)
    
    this.invaders.forEach((invader) => {
      if (invader.target === 2) {
        return;
      }
      const angleInRadians = invader.angle * (Math.PI / 180);
      const targetX = centerX + (radiusX * Math.cos(angleInRadians));
      const targetY = centerY + (radiusY * Math.sin(angleInRadians) - 100);
      
      // Adjust the coordinates
      invader.targetX = targetX - (invader.width / 2);
      invader.targetY = targetY - (invader.height / 2);

      invader.target = 1; // Indicate that the invader should move towards the target
    });
  }

    /**
   * Event handler for when the "No" button is clicked.
   * Stop mouving for now.
   */
  onNoClick(): void {
    this.invaders.forEach((invader) => {
      invader.target = 5; // Indicate that the invader should start dancing
    });
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
