export class Invader {
    id: number;
    x: number; // Position in pixels
    y: number; // Position in pixels
    direction: 'top' | 'bottom'; // Direction of movement
    speed: number; // Speed of the invader
    isDancing: boolean; // Indicates if the invader is dancing
    angle: number; // Angle for dancing movement
    target: number = 0; // Current target state (0 = moving, 1 = moving to target, 2 = dancing)
    targetX: number = 0; // Target X position
    targetY: number = 0; // Target Y position
    width: number = 50; // Width of the invader
    height: number = 50; // Height of the invader
  
    /**
     * Initializes a new instance of the Invader class.
     * @param id - Unique identifier for the invader.
     * @param x - Initial X position in pixels.
     * @param y - Initial Y position in pixels.
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
    }
  
    /**
     * Moves the invader in its designated direction.
     * If the invader goes beyond the screen, it wraps around to the opposite side.
     */
    move() {
      if (this.direction === 'top') {
        this.y -= this.speed; // Move upwards
        if (this.y <= -10) {
          this.y = 100; // Reset to bottom
        }
      } else {
        this.y += this.speed; // Move downwards
        if (this.y >= 100) {
          this.y = -10; // Reset to top
        }
      }
    }
  
    /**
     * Moves the invader towards its target position.
     * Updates the invader's position based on the distance to the target.
     */
    moveToTarget() {
      const invaderXPixels = (this.x * window.innerWidth) / 100; // Convert percentage to pixels
      const invaderYPixels = (this.y * window.innerHeight) / 100; // Convert percentage to pixels
  
      const deltaX = this.targetX - invaderXPixels; // Calculate horizontal distance to target
      const deltaY = this.targetY - invaderYPixels; // Calculate vertical distance to target
      const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2); // Calculate the distance to the target
  
      if (distance > 10) {
        const normalizedX = deltaX / distance; // Normalize the x distance
        const normalizedY = deltaY / distance; // Normalize the y distance
  
        this.x += normalizedX; // Update the x position
        this.y += normalizedY; // Update the y position
      } else {
        this.target = 2; // Change status to 2 when the invader reaches its target
      }
    }
  
    /**
     * Executes the dancing movement of the invader.
     * Updates the invader's position in a circular pattern based on its angle.
     */
    dance() {
      const danceRadius = 0.06; // Radius for dancing movement
      const angleInRadians = this.angle * (Math.PI / 180); // Convert angle to radians
  
      // Calculate the new position based on the angle and radius
      this.x += danceRadius * Math.cos(angleInRadians);
      this.y += danceRadius * Math.sin(angleInRadians);
  
      // Increment the angle for circular movement
      this.angle += 10; // Adjust the rotation speed as needed
      if (this.angle >= 360) {
        this.angle = 0; // Reset if angle exceeds 360 degrees
      }
    }
}
