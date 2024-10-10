/**
 * Represents a missile in the space invader game.
 * The missile moves towards a target cell and marks it as destroyed upon impact.
 */
export class Missile {
    private x: number; // Horizontal position of the missile
    private y: number; // Vertical position of the missile
    private targetCell: HTMLElement; // The cell that the missile targets
    private speed: number = 300; // Speed in pixels per second

    /**
     * Creates a new missile instance and initializes its position and target cell.
     * 
     * @param x - The initial horizontal position of the missile.
     * @param y - The initial vertical position of the missile.
     * @param targetCell - The target cell where the missile will impact.
     */
    constructor(x: number, y: number, targetCell: HTMLElement) {
        this.x = x;
        this.y = y;
        this.targetCell = targetCell;
        this.createMissile(); // Create the missile visual element
        this.animateMissile(); // Start the missile animation
    }

    /**
     * Creates the visual representation of the missile and appends it to the header container.
     */
    private createMissile() {
        const missile = document.createElement('div');
        missile.classList.add('missile');
        missile.style.position = 'absolute';
        missile.style.width = '5px';
        missile.style.height = '20px';
        missile.style.backgroundColor = 'black';
        missile.style.left = `${this.x}px`; // Horizontal position
        missile.style.top = `${this.y}px`;  // Vertical position
        document.querySelector('.header_container')?.appendChild(missile);
    }

    /**
     * Animates the missile movement towards the target cell.
     * The missile moves linearly over a calculated duration based on the distance to the target.
     */
    private animateMissile() {
        const targetRect = this.targetCell.getBoundingClientRect();
        const distanceToTarget = targetRect.bottom - this.y;

        const duration = distanceToTarget / this.speed; // Animation duration
        const missile = document.querySelector('.missile:last-child') as HTMLElement;

        missile.style.transition = `transform ${duration}s linear`;
        missile.style.transform = `translateY(${distanceToTarget}px)`;

        // Check for collision after the animation duration
        setTimeout(() => {
            this.checkCollisionWithCell(missile); // Check collision after animation
        }, duration * 1000);
    }

    /**
     * Checks if the missile has collided with the target cell.
     * Marks the target cell as destroyed and removes the missile from the DOM.
     * 
     * @param missile - The missile element that is being checked for collision.
     */
    private checkCollisionWithCell(missile: HTMLElement) {
        this.targetCell.dataset['destroyed'] = 'true'; // Mark the target cell as destroyed
        this.targetCell.style.backgroundColor = 'white'; // Change the color of the cell to indicate destruction
        missile.remove(); // Clean up the missile after the explosion
    }
}
