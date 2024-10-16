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
    const email = 'troude.kev@gmail.com';
    const subject = encodeURIComponent("Let's work together"); // Encode le sujet pour le format URL
    const body = encodeURIComponent('Hi Kevin,'); // Encode le corps pour le format URL

    // Create the mailto URL
    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;

    // Trigger the mailto link
    window.location.href = mailtoLink; // Ouvre l'éditeur d'email par défaut
  }
}
