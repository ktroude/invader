import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-code-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './code-box.component.html',
  styleUrls: ['./code-box.component.css']
})
export class CodeBoxComponent {

  fullCode: string = `
function animateInvaders() : void {
  const invaders = document.querySelectorAll('.invader');
  invaders.forEach(invader => {
    this.spawnInvader(invader as HTMLElement);
    const randomSpeed = Math.random() * 4000 + 3000;
    setInterval(() => {
      this.moveInvader(invader as HTMLElement);
      this.shoot(invader as HTMLElement);
    }, randomSpeed);
  });
}`;
  displayedCode: string = '';      // Code currently displayed
  totalKeystrokes: number = 0;     // Total number of keystrokes
  increment: number = 4;           // Number of characters to display per key press
  caretVisible: boolean = true;    // Blinking caret
  isTextClicked: boolean = false;  // Check if the input area is clicked
  progress: number = 0;            // Progress percentage
  hideProgressBar: boolean = false;// To hide the progress bar

  /**
   * Handles keydown events and increments displayed code based on keystrokes.
   */
  onKeydown(event: KeyboardEvent) {
    this.isTextClicked = true;  // User has clicked on the text box

    if (event.key === 'Tab' || event.ctrlKey || event.altKey) {
      return;  // Skip certain keys (Tab, Ctrl, Alt)
    }

    // Incrementally show the code based on user keystrokes
    if (this.totalKeystrokes * this.increment < this.fullCode.length) {
      this.totalKeystrokes++;
      this.displayedCode = this.fullCode.slice(0, this.totalKeystrokes * this.increment);
    }

    // Update the progress based on the amount of code displayed
    this.progress = Math.min((this.totalKeystrokes * this.increment / this.fullCode.length) * 100, 100);

    // End typing animation if the full code is displayed
    if (this.displayedCode.length === this.fullCode.length) {
      this.endTypingAnimation();
    }
  }

  /**
   * Ends the typing animation, then hides the progress bar after a 1-second delay.
   */
  endTypingAnimation() {
    setTimeout(() => {
      const userCodeElement = document.querySelector('.user_code') as HTMLElement;
      if (userCodeElement) {
        // Shrink and fade out the displayed code
        userCodeElement.style.transition = 'transform 1s ease, opacity 1s ease';
        userCodeElement.style.transform = 'scale(0)';
        userCodeElement.style.opacity = '0';

        // Start invaders' animation and hide progress bar after 1 second
        setTimeout(() => {
          this.animateInvadersColor();  // Start the invaders' animation

          // Hide progress bar with 1 second delay
          setTimeout(() => {
            this.hideProgressBarAnimation();
          }, 1000);  // Delay of 1 second after invaders appear
        }, 1000);
      }
    }, 1000);
  }

  /**
   * Animates invaders, then hides the progress bar.
   */
  animateInvadersColor() {
    const invaders = document.querySelectorAll('.invader-color');
    invaders.forEach(invader => {
      this.spawnInvaderColor(invader as HTMLElement);
      const randomSpeed = Math.random() * 4000 + 3000;
      setInterval(() => {
        this.moveInvaderColor(invader as HTMLElement);
      }, randomSpeed);
    });
  }

/**
 * Hides the progress bar with a fading animation.
 */
hideProgressBarAnimation() {
  const progressBar = document.querySelector('.progress-bar-container') as HTMLElement;
  if (progressBar) {
    // Set the opacity to 0 for a fade-out effect
    progressBar.style.transition = 'opacity 1s ease';
    progressBar.style.opacity = '0';
    
    // After the transition, set display to none to completely hide it from the DOM
    setTimeout(() => {
      progressBar.style.display = 'none';
    }, 800); // 1 second delay matching the fade-out transition
  }
}

  /**
   * Spawns invader at a random location within the header container.
   */
  spawnInvaderColor(invader: HTMLElement) {
    const headerContainer = document.querySelector('.black_box') as HTMLElement;
    const maxX = headerContainer.clientWidth - invader.clientWidth;
    const maxY = headerContainer.clientHeight - invader.clientHeight;

    // Random location
    const randomX = Math.floor(Math.random() * (maxX + 1));
    const randomY = Math.floor(Math.random() * (maxY + 1));

    invader.style.transform = `translate(${randomX}px, ${randomY}px)`;
    invader.style.opacity = '1';
  }

  /**
   * Moves invader to a new random location.
   */
  moveInvaderColor(invader: HTMLElement) {
    const headerContainer = document.querySelector('.black_box') as HTMLElement;
    const maxX = headerContainer.clientWidth - invader.clientWidth;
    const maxY = headerContainer.clientHeight - invader.clientHeight;

    const randomX = Math.floor(Math.random() * (maxX + 1));
    const randomY = Math.floor(Math.random() * (maxY + 1));

    invader.style.transition = `transform ${Math.random() * 1 + 0.8}s linear`;
    invader.style.transform = `translate(${randomX}px, ${randomY}px)`;
  }

    /**
   * Returns the rounded progress percentage.
   */
    getRoundedProgress() {
      return Math.round(this.progress);
    }

}
