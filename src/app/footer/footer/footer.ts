import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  // Developer information
  developerName = 'Tofik Maniyar';
  developerTitle = 'Full Stack Developer';
  
  // Trademark/Brand name with symbol
  tradeMark = 'TM';
  
  // Current year for copyright
  currentYear = new Date().getFullYear();
  
  // Social media links
  socialLinks = {
    linkedin: {
      url: 'https://www.linkedin.com/in/tofik-maniyar-141270ab/',
      icon: '🔗',
      label: 'LinkedIn'
    },
    github: {
      url: 'https://github.com/TOFIK0143',
      icon: '🐙',
      label: 'GitHub'
    }
  };
}
