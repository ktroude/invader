import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private explosionDuration = 10000; // Duration before the explosion disappears

  ngOnInit() {
    // Initialize the invader animation when the component is loaded
    this.animateInvaders();
  }

  animateInvaders() {
    const invaders = document.querySelectorAll('.invader') as NodeListOf<HTMLElement>;
    const numRows = 2; // Nombre de lignes d'invaders
    const numCols = Math.floor(invaders.length / numRows); // Nombre de colonnes d'invaders
    const horizontalSpeed = 2; // Vitesse horizontale
    let direction = 1; // Direction horizontale (1 pour droite, -1 pour gauche)
    let invaderStepY = 10; // Descente (ou montée) en pixels
    let maxRight = window.innerWidth - 60; // Bord droit de l'écran
    let maxLeft = 0; // Bord gauche de l'écran
    let headerContainer = document.querySelector('.header_container') as HTMLElement;
    let maxHeight = headerContainer.clientHeight; // Hauteur de la div principale
    const thresholdHeight = maxHeight / 3; // 1/3 de la hauteur
    let movingDown = true; // Si les invaders doivent descendre ou monter
  
    // Organise les invaders en quinconce
    this.arrangeInvadersInGrid(invaders, numRows, numCols);
  
    // Intervalle pour animer les invaders
    setInterval(() => {
      let reachedEdge = false; // Détecte si un invader a touché un bord
  
      invaders.forEach(invader => {
        // Position horizontale actuelle
        const currentLeft = parseFloat(invader.style.left || '0');
        const currentTop = parseFloat(invader.style.top || '0');
  
        // Mouvement horizontal
        invader.style.left = `${currentLeft + horizontalSpeed * direction}px`;
  
        // Si un invader touche le bord droit ou gauche, on signale
        if (currentLeft + horizontalSpeed * direction >= maxRight || currentLeft + horizontalSpeed * direction <= maxLeft) {
          reachedEdge = true;
        }
  
        // Mouvement vertical : descente ou montée selon la phase
        if (movingDown) {
          // Si les invaders atteignent le seuil de 1/3 de la hauteur, on inverse
          if (currentTop + invaderStepY >= thresholdHeight) {
            movingDown = false; // Commence à remonter
          }
        } else {
          // Si les invaders atteignent le haut de la div, ils redescendent
          if (currentTop <= 0) {
            movingDown = true; // Recommence à descendre
          }
        }
      });
  
      // Si un invader touche un bord, on descend ou monte tous les invaders d'un step Y
      if (reachedEdge) {
        direction *= -1; // Change la direction horizontale
        invaders.forEach(invader => {
          const currentTop = parseFloat(invader.style.top || '0');
          if (movingDown) {
            // Descente
            invader.style.top = `${currentTop + invaderStepY}px`;
          } else {
            // Montée
            invader.style.top = `${currentTop - invaderStepY}px`;
          }
        });
      }
    }, 1); // Intervalle de 100ms pour un mouvement fluide
  }
  
  
  
  
  /**
   * Arranges invaders in a grid formation.
   * @param invaders List of invaders to arrange.
   * @param numRows Number of rows in the grid.
   * @param numCols Number of columns in the grid.
   */
  arrangeInvadersInGrid(invaders: NodeListOf<HTMLElement>, numRows: number, numCols: number) {
    const invaderSpacingX = 120; // Horizontal space between invaders
    const invaderSpacingY = 70;  // Vertical space between invaders
    let index = 0;
  
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const invader = invaders[index];
        if (invader) {
          // For every even row, shift the invaders horizontally by half the spacing
          const offsetX = (row % 2 === 0) ? 0 : invaderSpacingX / 2;
          invader.style.left = `${col * invaderSpacingX + offsetX}px`;
          invader.style.top = `${row * invaderSpacingY}px`;
        }
        index++;
      }
    }
  }
  

  /**
   * Positions an invader at a random location within the header container.
   * @param invader The invader element to position.
   */
  spawnInvader(invader: HTMLElement) {
    const headerContainer = document.querySelector('.header_container') as HTMLElement;
    const maxX = headerContainer.clientWidth - invader.clientWidth;
    const maxY = headerContainer.clientHeight - invader.clientHeight;

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    invader.style.transform = `translate(${randomX}px, ${randomY}px)`;
    invader.style.opacity = '1'; // Make the invader visible
  }

  /**
   * Moves an invader to a new random location within the header container.
   * @param invader The invader element to move.
   */
  moveInvader(invader: HTMLElement) {
    const headerContainer = document.querySelector('.header_container') as HTMLElement;
    const maxX = headerContainer.clientWidth - invader.clientWidth;
    const maxY = headerContainer.clientHeight - invader.clientHeight;

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    invader.style.transition = `transform ${Math.random() * 1 + 1}s linear`; // Transition with a random duration
    invader.style.transform = `translate(${randomX}px, ${randomY}px)`;
  }

  /**
   * Randomly determines whether an invader should shoot, then creates and animates a missile if it does.
   * @param invader The invader element that might shoot.
   */
  shoot(invader: HTMLElement) {
    const shouldShoot = Math.random() > 0.5;
    if (!shouldShoot) return;

    // Create the missile div
    const missile = document.createElement('div');
    missile.classList.add('missile');

    // Position the missile just below the invader
    const invaderRect = invader.getBoundingClientRect();
    const headerContainer = document.querySelector('.header_container') as HTMLElement;
    const headerRect = headerContainer.getBoundingClientRect();

    missile.style.position = 'absolute';
    missile.style.width = '5px';
    missile.style.height = '20px';
    missile.style.backgroundColor = 'black';

    // Position the missile just below the invader
    missile.style.left = `${invaderRect.left - headerRect.left + invaderRect.width / 2}px`;
    missile.style.top = `${invaderRect.top - headerRect.top + invaderRect.height}px`;

    // Add the missile to the container
    headerContainer.appendChild(missile);

    // Animate the missile to move downwards
    this.animateMissile(missile);
  }

  /**
   * Animates a missile to move downwards and creates an explosion when it reaches the bottom.
   * @param missile The missile element to animate.
   */
  animateMissile(missile: HTMLElement) {
    const headerContainer = document.querySelector('.header_container') as HTMLElement;
    const containerRect = headerContainer.getBoundingClientRect();

    // Calculate the distance the missile needs to travel
    const missileRect = missile.getBoundingClientRect();
    const distanceToBottom = containerRect.bottom - missileRect.bottom;

    // Adjust the transition duration based on the distance
    const duration = distanceToBottom / 1000 * 2; // 5 seconds to descend completely
    missile.style.transition = `transform ${duration}s linear`;
    missile.style.transform = `translateY(${distanceToBottom}px)`;

    // Create a white square explosion when the missile reaches the bottom
    setTimeout(() => {
      this.createExplosion(missile);
      missile.remove(); // Clean up the missile after the explosion
    }, duration * 1000); // Delay based on the animation duration
  }

  /**
   * Creates an explosion at the position where the missile has landed.
   * @param missile The missile element that triggered the explosion.
   */
  createExplosion(missile: HTMLElement) {
    const explosion = document.createElement('div');
    explosion.classList.add('explosion');

    // Position the explosion where the missile landed
    const missileRect = missile.getBoundingClientRect();
    const headerContainer = document.querySelector('.header_container') as HTMLElement;
    const headerRect = headerContainer.getBoundingClientRect();

    explosion.style.position = 'absolute';
    explosion.style.width = '20px';
    explosion.style.height = '20px';
    explosion.style.backgroundColor = 'white';
    explosion.style.left = `${missileRect.left - headerRect.left}px`;
    explosion.style.top = `${missileRect.top - headerRect.top}px`;
    explosion.style.opacity = '1';

    // Add the explosion to the container
    headerContainer.appendChild(explosion);

    // Fade out the explosion after a certain duration
    setTimeout(() => {
      explosion.style.opacity = '0';
      setTimeout(() => {
        explosion.remove(); // Clean up the explosion after it disappears
      }, 1000); // Wait for the fade-out animation to complete
    }, this.explosionDuration);
  }
}
