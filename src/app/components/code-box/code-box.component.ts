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

  displayedCode: string = '';  // The code currently displayed to the user.
  userCode: string = '';       // The code currently typed by the user.
  increment: number = 4;       // Number of characters to display on each key press.
  caretVisible: boolean = true;  // To toggle the caret visibility.
  isTextClicked: boolean = false; // To track if the div is clicked.
  progress: number = 0;        // Store the progress percentage

  /**
   * Handles the keydown event.
   * Displays the next segment of code and updates the user's input.
   * @param event The keyboard event containing information about the key pressed.
   */
  onKeydown(event: KeyboardEvent) {
    this.isTextClicked = true;  // The user has started interacting, hide the placeholder text.

    // Check that the user has not exceeded the length of fullCode.
    if (this.displayedCode.length < this.fullCode.length) {
      // Display the characters based on the increment.
      this.displayedCode += this.fullCode.slice(this.displayedCode.length, this.displayedCode.length + this.increment);
    }

    // Add the typed character to userCode.
    this.userCode += event.key;

    // Handle the "Backspace" key.
    if (event.key === 'Backspace' && this.userCode.length > 0) {
      this.userCode = this.userCode.slice(0, -1);
      this.displayedCode = this.fullCode.slice(0, this.userCode.length);
    }

    // Update the progress percentage
    this.progress = Math.min((this.userCode.length / this.fullCode.length) * 100 * 4, 100);

    // Detect if the user has finished typing.
    if (this.displayedCode.length === this.fullCode.length) {
      this.endTypingAnimation();
    }
  }

  /**
   * Returns the rounded progress percentage.
   * @returns The rounded progress percentage.
   */
  getRoundedProgress() {
    return Math.round(this.progress);
  }

  /**
   * Triggers the end of typing animation after a delay.
   * It scales down and fades out the user's typed code.
   */
  endTypingAnimation() {
    setTimeout(() => {
      const userCodeElement = document.querySelector('.user_code') as HTMLElement;
      if (userCodeElement) {
        // Animation to shrink the text size and fade it out.
        userCodeElement.style.transition = 'transform 1s ease, opacity 1s ease';
        userCodeElement.style.transform = 'scale(0)'; // Shrinks the text.
        userCodeElement.style.opacity = '0'; // Fades out the text.

        // Start the invaders' animation after the text has disappeared.
        setTimeout(() => {
          this.animateInvadersColor(); // Call the invaders' animation function.
        }, 1000); // Delay matching the animation duration.
      }
    }, 1000); // One second before starting the animation.
  }

  /**
   * Animates all invaders by randomly positioning them and setting their movement intervals.
   */
  animateInvadersColor() {
    const invaders = document.querySelectorAll('.invader-color');
    invaders.forEach(invader => {
      // Initial spawn at a random location.
      this.spawnInvaderColor(invader as HTMLElement);

      // Set a random speed for each invader (between 3 and 7 seconds).
      const randomSpeed = Math.random() * 4000 + 3000;

      // Change direction at random intervals.
      setInterval(() => {
        this.moveInvaderColor(invader as HTMLElement);
      }, randomSpeed);
    });
  }

  /**
   * Positions an invader at a random location within the header container.
   * @param invader The invader element to position.
   */
  spawnInvaderColor(invader: HTMLElement) {
    const headerContainer = document.querySelector('.black_box') as HTMLElement;
    const maxX = headerContainer.clientWidth - invader.clientWidth;
    const maxY = headerContainer.clientHeight - invader.clientHeight;

    // Add margins to prevent the invader from going outside the box.
    const randomX = Math.floor(Math.random() * (maxX + 1)); // includes maxX
    const randomY = Math.floor(Math.random() * (maxY + 1)); // includes maxY

    invader.style.transform = `translate(${randomX}px, ${randomY}px)`;
    invader.style.opacity = '1'; // Make the invader visible.
  }

  /**
   * Moves an invader to a new random location within the header container.
   * @param invader The invader element to move.
   */
  moveInvaderColor(invader: HTMLElement) {
    const headerContainer = document.querySelector('.black_box') as HTMLElement;
    const maxX = headerContainer.clientWidth - invader.clientWidth;
    const maxY = headerContainer.clientHeight - invader.clientHeight;

    // Add margins to prevent the invader from going outside the box.
    const randomX = Math.floor(Math.random() * (maxX + 1)); // includes maxX
    const randomY = Math.floor(Math.random() * (maxY + 1)); // includes maxY

    invader.style.transition = `transform ${Math.random() * 1 + 0.8}s linear`; // Transition with a random duration.
    invader.style.transform = `translate(${randomX}px, ${randomY}px)`;
  }

  /**
   * Toggles the caret visibility to create the blinking effect.
   */
  toggleCaretVisibility() {
    this.caretVisible = !this.caretVisible;
  }

}
