import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InvestmentResultService } from '../../services/investmentresult.service';

/**
 * User Input Form Component
 * Allows users to enter investment parameters and trigger calculations
 * 
 * Features:
 * - Reactive form using Angular Signals
 * - Default values for Indian investors (₹100,000 initial, ₹5,000 monthly, 8% rate, 10 years)
 * - Form submission and reset functionality
 * - Signals-based state management for modern Angular patterns
 */
@Component({
  selector: 'app-userinput',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './userinput.html',
  styleUrl: './userinput.css',
})
export class Userinput {
  // === Dependency Injection ===
  // Inject the investment service to trigger calculations
  private readonly investmentService = inject(InvestmentResultService);

  // === Form Input Signals ===
  // Using Angular Signals for reactive form state management
  // These track user input in real-time with two-way binding
  
  /**
   * Initial investment amount in Indian Rupees
   * Default: ₹100,000 (typical starting amount for Indian investors)
   */
  readonly initialInvestment = signal<number>(100000);
  
  /**
   * Monthly contribution amount in Indian Rupees
   * Default: ₹5,000 (reasonable monthly investment amount)
   */
  readonly monthlyContribution = signal<number>(5000);
  
  /**
   * Annual interest rate as a percentage
   * Default: 8% (typical average market return for Indian investors)
   */
  readonly annualInterestRate = signal<number>(8);
  
  /**
   * Investment duration in years
   * Default: 10 years (standard investment horizon)
   */
  readonly duration = signal<number>(10);

  /**
   * Track if form has been submitted
   * Used to show/hide validation messages
   */
  readonly isSubmitted = signal(false);

  /**
   * Handle form submission
   * Collects all form input values and calls the service to calculate results
   * Sets submitted flag to trigger validation messages display
   */
  onSubmit(): void {
    // Mark form as submitted (for validation message display)
    this.isSubmitted.set(true);

    // Call the service with current form values to trigger calculation
    this.investmentService.calculateInvestmentResults({
      initialInvestment: this.initialInvestment(),      // Get current signal value
      monthlyContribution: this.monthlyContribution(),  // Get current signal value
      annualInterestRate: this.annualInterestRate(),    // Get current signal value
      duration: this.duration()                         // Get current signal value
    });
  }

  /**
   * Handle form reset
   * Resets all input fields to default values and clears calculation results
   * Useful for allowing users to start fresh calculations
   */
  onReset(): void {
    // Reset all signals to default values
    this.initialInvestment.set(100000);      // Reset to default ₹100,000
    this.monthlyContribution.set(5000);      // Reset to default ₹5,000
    this.annualInterestRate.set(8);          // Reset to default 8%
    this.duration.set(10);                   // Reset to default 10 years
    
    // Clear submitted flag to hide validation messages
    this.isSubmitted.set(false);
    
    // Clear results and error messages in the service
    this.investmentService.resetResults();
  }
}
