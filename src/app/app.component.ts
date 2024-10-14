import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { IntroComponent } from './components/intro/intro.component';
import { CodeBoxComponent } from './components/code-box/code-box.component';
import { ChoiceBoxComponent } from './components/choice-box/choice-box.component';
import { AbilitiesComponent } from './components/abilities/abilities.component';
import { CommonModule } from '@angular/common';
import { ContactComponent } from "./components/contact/contact.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    IntroComponent,
    CodeBoxComponent,
    AbilitiesComponent,
    ChoiceBoxComponent,
    ContactComponent
],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'site_web_invader';
}