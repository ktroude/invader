import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'] // Assurez-vous que l'URL est correcte
})
export class ContactComponent {
  
  // Function to trigger the mailto link
  onContactClick() {
    // Trigger the mailto link
    window.open('https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&to=troude.kev@gmail.com&su=Let\'s%20work%20together&body=Hi%20Kevin,');
  }
}
