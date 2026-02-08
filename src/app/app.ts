import { Component, signal } from '@angular/core';
import { Header } from './header/header/header';
import { Userinput } from './userinput/userinput/userinput';
import { Investmentresult } from './investmentresult/investmentresult/investmentresult';
import { Footer } from './footer/footer/footer';

@Component({
  selector: 'app-root',
  imports: [Header,Userinput, Investmentresult, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('wealth_calculator');

  // No component logic needed - all state managed by service and child components
  // This component serves purely as a structural container

}
