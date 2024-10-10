import { Component, OnInit } from '@angular/core';
import { Missile } from './missile';

/**
 * HeaderComponent handles the animation of invaders and missile shooting
 * in the space invader game header. It initializes the game grid, animates
 * the invaders, and manages the missile firing logic.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private invaderStepY = 10; // How much to move down when they hit a border
  private cellSize: number = 30; // Size of each cell

  /**
   * ngOnInit initializes the component by creating the grid and starting 
   * the invader animation.
   */
  ngOnInit() {
    this.createGrid(); // Create the grid of cells
    this.animateInvaders(); // Initialize the animation of invaders
  }


  /**
   * Creates a grid of cells in the header container.
   * The size and position of each cell are determined based on the container's dimensions.
   */
  createGrid() {
    const headerContainer = document.querySelector('.header_container') as HTMLElement;

    const numRows = Math.round(headerContainer.clientHeight / this.cellSize);
    const numCols = Math.round(headerContainer.clientWidth / this.cellSize);

    // Create a grid of cells
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.style.width = `${this.cellSize}px`;
        cell.style.height = `${this.cellSize}px`;
        cell.style.position = 'absolute';
        cell.style.left = `${col * this.cellSize}px`;
        cell.style.top = `${row * this.cellSize}px`;
        cell.dataset['destroyed'] = 'false'; // Mark the cell as intact
        headerContainer.appendChild(cell);
      }
    }
  }

  /**
   * Animates the invaders by moving them horizontally and vertically within 
   * the header. The invaders also shoot missiles at random intervals.
   */
  animateInvaders() {
    const invaders = document.querySelectorAll('.invader') as NodeListOf<HTMLElement>;
    const numRows = 2; // Number of rows of invaders
    const numCols = Math.floor(invaders.length / numRows); // Calculate the number of columns
    const horizontalSpeed = 2; // Horizontal movement speed in pixels
    let direction = 1; // Start moving to the right
    let maxRight = window.innerWidth - 60; // Right edge of the screen (considering invader width)
    let maxLeft = 0; // Left edge of the screen
    const threshold = document.querySelector('.header_container')!.clientHeight / 3; // 1/3 of the height of the div

    // Arrange the invaders in a grid
    this.arrangeInvadersInGrid(invaders, numRows, numCols);

    // Set interval to move invaders
    setInterval(() => {
      let reachedEdge = false;

      invaders.forEach(invader => {
        const currentLeft = parseFloat(invader.style.left || '0');
        invader.style.left = `${currentLeft + horizontalSpeed * direction}px`;

        // Check if the invader touches the edge of the screen
        if (currentLeft + horizontalSpeed * direction >= maxRight || currentLeft + horizontalSpeed * direction <= maxLeft) {
          reachedEdge = true;
        }

        // Check if the invader has reached the height threshold
        const currentTop = parseFloat(invader.style.top || '0');
        if (currentTop >= threshold) {
          direction *= -1; // Reverse horizontal direction
          invader.style.top = `${currentTop - this.invaderStepY}px`; // Move the invader up
        }
      });

      // If an invader reaches an edge, reverse direction and move down
      if (reachedEdge) {
        direction *= -1; // Reverse direction
        invaders.forEach(invader => {
          const currentTop = parseFloat(invader.style.top || '0');
          const newTop = currentTop + this.invaderStepY;

          // If the invader hits the bottom of the div, move slightly up
          if (newTop < window.innerHeight * 0.66) { // Keep invaders in the upper third
            invader.style.top = `${newTop}px`;
          } else {
            invader.style.top = `${currentTop - this.invaderStepY}px`;
          }
        });
      }

      // Shoot missiles randomly
      invaders.forEach(invader => {
        if (this.isInvaderInCenter(invader)) {
          this.shoot(invader); // Call the shoot function
        }
      });
    }, 10); // Adjust the time interval for smoother movement
  }

  /**
   * Arranges the invaders in a grid based on specified number of rows and columns.
   * 
   * @param invaders - A NodeList of invader elements to be arranged.
   * @param numRows - The number of rows for the invaders.
   * @param numCols - The number of columns for the invaders.
   */
  arrangeInvadersInGrid(invaders: NodeListOf<HTMLElement>, numRows: number, numCols: number) {
    const invaderSpacingX = 120; // Horizontal spacing between invaders
    const invaderSpacingY = 70; // Vertical spacing between invaders
    let index = 0;

    for (let row = 0; row < numRows; row++) {
      // Offset for odd rows
      const offsetX = (row % 2 === 0) ? 0 : invaderSpacingX / 2; // Offset to create a staggered effect

      for (let col = 0; col < numCols; col++) {
        const invader = invaders[index];
        if (invader) {
          // Calculate the position with offset
          invader.style.left = `${col * invaderSpacingX + offsetX}px`;
          invader.style.top = `${row * invaderSpacingY}px`;
        }
        index++;
      }
    }
  }

  /**
   * Shoots a missile from the given invader with a random chance.
   * If the invader is selected to shoot, it finds a target cell and creates a new missile.
   * 
   * @param invader - The invader element that will shoot.
   */
  shoot(invader: HTMLElement) {
    const shouldShoot = Math.random() < 0.01; // Probability of shooting a missile
    if (!shouldShoot) return;

    // Find a target cell in the column of the invader
    const targetCell = this.findTargetCell(invader);
    if (!targetCell) return; // If no cell is available, do not shoot

    const invaderRect = invader.getBoundingClientRect();
    const headerContainer = document.querySelector('.header_container') as HTMLElement;

    // Initial position of the missile
    const initialX = invaderRect.left - headerContainer.getBoundingClientRect().left + invaderRect.width / 2;
    const initialY = invaderRect.top - headerContainer.getBoundingClientRect().top + invaderRect.height;

    // Create a new missile
    new Missile(initialX, initialY, targetCell);
  }

  /**
   * Finds the last available target cell in the column of the given invader.
   * 
   * @param invader - The invader element for which to find the target cell.
   * @returns The last available cell below the invader, or null if none are available.
   */
  private findTargetCell(invader: HTMLElement): HTMLElement | null {
    const cells = document.querySelectorAll('.cell') as NodeListOf<HTMLElement>;
    const invaderRect = invader.getBoundingClientRect();

    // Determine the index of the invader's column
    const columnIndex = Math.floor((invaderRect.left + invaderRect.width / 2) / this.cellSize);

    // Initialize a variable to store the last available cell
    let lastAvailableCell: HTMLElement | null = null;

    // Loop through the cells in the column to find the last non-destroyed cell
    for (let row = 0; row < cells.length / Math.floor(document.querySelector('.header_container')!.clientWidth / this.cellSize); row++) {
      const cell = cells[row * Math.floor(document.querySelector('.header_container')!.clientWidth / this.cellSize) + columnIndex];
      if (cell && cell.dataset['destroyed'] === 'false') {
        const cellRect = cell.getBoundingClientRect();
        // Check that the cell is below the invader
        if (cellRect.top > invaderRect.bottom) {
          lastAvailableCell = cell; // Update the last available cell
        }
      }
    }

    return lastAvailableCell; // Return the last non-destroyed cell found
  }

  /**
   * Checks if the given invader is positioned in the center of a cell.
   * 
   * @param invader - The invader element to check.
   * @returns True if the invader is centered in a cell, false otherwise.
   */
  isInvaderInCenter(invader: HTMLElement): boolean {
    const invaderRect = invader.getBoundingClientRect();

    // Check if the invader is in the center of a cell
    const centerX = Math.round((invaderRect.left + invaderRect.right) / 2);
    const centerY = Math.round((invaderRect.top + invaderRect.bottom) / 2);

    // Check if the invader's center position matches a cell
    return (centerX % this.cellSize === 0);
  }
}
