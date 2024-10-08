import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-code-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './code-box.component.html',
  styleUrl: './code-box.component.css'
})
export class CodeBoxComponent {
  
  IsTypingStarted: boolean = false;

}
