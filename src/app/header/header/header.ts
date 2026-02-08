import { Component } from '@angular/core';

/**
 * Header Component
 * Displays application title, branding, and introductory information
 * 
 * Features:
 * - Responsive header with gradient background
 * - Application title and subtitle
 * - Professional styling with hover effects
 * 
 * Note: This is a presentational component with no logic
 * All content is defined in the template (header.html)
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  // Presentational component - no logic required
  // All UI elements defined in header.html
}
