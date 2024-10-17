export class Invader {
  id: number;
  x: number; // Current X position in pixels or percentage
  y: number; // Current Y position in pixels or percentage
  originalX: number; // Original X position (used for resetting)
  originalY: number; // Original Y position (used for resetting)
  direction: 'top' | 'bottom'; // Direction of movement
  speed: number; // Speed at which the invader moves
  isDancing: boolean; // Indicates whether the invader is in a dancing state
  angle: number; // Current angle used for dancing movement
  target: number = 0; // Current target state (0 = moving, 1 = moving to target, 2 = dancing, etc.)
  targetX: number = 0; // Target X position for movement
  targetY: number = 0; // Target Y position for movement
  width: number = 50; // Width of the invader element (for collision detection or positioning)
  height: number = 50; // Height of the invader element (for collision detection or positioning)

  /**
   * Initializes a new instance of the Invader class.
   * @param id - Unique identifier for the invader.
   * @param x - Initial X position in pixels or percentage.
   * @param y - Initial Y position in pixels or percentage.
   * @param direction - Direction of movement ('top' or 'bottom').
   * @param speed - Speed at which the invader moves.
   * @param angle - Initial angle for dancing movement.
   */
  constructor(id: number, x: number, y: number, direction: 'top' | 'bottom', speed: number, angle: number) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.speed = speed;
    this.isDancing = false;
    this.angle = angle;
    this.originalX = x - 1;
    this.originalY = y;
  }

  /**
   * Moves the invader in the specified direction ('top' or 'bottom').
   * If the invader goes beyond the screen, it wraps around to the opposite side.
   */
  move() {
    if (this.direction === 'top') {
      this.y -= this.speed; // Move upwards
      if (this.y <= -10) {
        this.y = 100; // Wrap to the bottom
      }
    } else {
      this.y += this.speed; // Move downwards
      if (this.y >= 100) {
        this.y = -10; // Wrap to the top
      }
    }
  }

  /**
   * Moves the invader towards its target position.
   * Updates the invader's position based on the distance to the target, normalized to ensure smooth movement.
   * @param target - Target state to set once the invader reaches its destination.
   * @param shouldTranslate - Whether to translate percentage values to pixels (default is true).
   */
  moveToTarget(target: number, shouldTranslate: boolean = true) {
    let invaderXPixels: number; // X position in pixels
    let invaderYPixels: number; // Y position in pixels

    if (shouldTranslate) {
      invaderXPixels = (this.x * window.innerWidth) / 100; // Convert percentage to pixels
      invaderYPixels = (this.y * window.innerHeight) / 100; // Convert percentage to pixels
    } else {
      invaderXPixels = this.x;
      invaderYPixels = this.y;
    }
    
    // Calculate the distance to the target
    const deltaX = this.targetX - invaderXPixels;
    const deltaY = this.targetY - invaderYPixels;
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2); // Total distance to the target

    // Move towards the target if still far away
    if (distance > 10) {
      const normalizedX = deltaX / distance; // Normalize X distance
      const normalizedY = deltaY / distance; // Normalize Y distance

      this.x += normalizedX; // Update X position
      this.y += normalizedY; // Update Y position
    } else {
      this.target = target; // Set target state when the invader reaches its destination
    }
  }

  /**
   * Executes a circular dancing movement around a given point.
   * The invader's position is updated in a circular pattern based on its angle.
   */
  dance() {
    const danceRadius = 0.06; // Radius of the circular movement (controls size of the dance)
    const angleInRadians = this.angle * (Math.PI / 180); // Convert the angle from degrees to radians

    // Calculate the new position based on the current angle and radius
    this.x += danceRadius * Math.cos(angleInRadians);
    this.y += danceRadius * Math.sin(angleInRadians);

    // Increment the angle to continue the circular movement
    this.angle += 10; // Adjust speed of rotation as necessary
    if (this.angle >= 360) {
      this.angle = 0; // Reset angle if it exceeds 360 degrees
    }
  }

  /**
   * Resets the invader's position back to its initial X and Y coordinates.
   * Updates the target state to indicate that the invader is returning to its starting position.
   */
  comebackInitialPos() {
    this.targetX = this.originalX; // Reset target X to the original position
    this.targetY = this.originalY; // Reset target Y to the original position
    this.target = 7; // Set the target state to indicate that the invader is returning
  }
}
