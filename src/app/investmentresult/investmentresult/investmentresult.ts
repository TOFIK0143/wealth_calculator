import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvestmentResultService, InvestmentResult } from '../../services/investmentresult.service';
import { Observable } from 'rxjs';

/**
 * Investment Result Display Component
 * Displays detailed investment calculation results in table and summary formats
 * 
 * Features:
 * - Year-by-year breakdown of investment growth
 * - Summary statistics (final value, total interest, total invested)
 * - Loading states and error handling
 * - Currency formatting for Indian Rupees (₹)
 */
@Component({
  selector: 'app-investmentresult',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './investmentresult.html',
  styleUrl: './investmentresult.css',
})
export class Investmentresult implements OnInit {
  // === Dependency Injection ===
  // Inject the investment service to access calculation results
  private readonly investmentService = inject(InvestmentResultService);

  // === Observable Streams for Template Binding ===
  // These observables are subscribed to in the template using the async pipe
  
  /** Stream of investment calculation results (array of yearly data) */
  results$!: Observable<InvestmentResult[]>;
  
  /** Stream indicating if calculation is in progress (for loading state) */
  isCalculating$!: Observable<boolean>;
  
  /** Stream of error messages (for validation and error display) */
  errorMessage$!: Observable<string>;

  /**
   * Angular lifecycle hook - runs after component initialization
   * Sets up observable streams from the service for template binding
   */
  ngOnInit(): void {
    // Subscribe to investment results from service
    // The async pipe in the template will handle unsubscription
    this.results$ = this.investmentService.getInvestmentResults();
    
    // Subscribe to loading state - shows/hides loading spinner
    this.isCalculating$ = this.investmentService.getIsCalculatingAsObservable();
    
    // Subscribe to error messages - displays validation errors
    this.errorMessage$ = this.investmentService.getErrorMessageAsObservable();
  }

  /**
   * Format numeric values as Indian Rupee currency
   * Uses Intl.NumberFormat with en-IN locale for proper INR formatting
   * 
   * Example:
   * formatCurrency(100000) => "₹1,00,000"
   * formatCurrency(1234567.89) => "₹12,34,567.89"
   * 
   * @param value - The numeric value to format
   * @returns Formatted currency string with ₹ symbol and proper grouping
   */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,      // No decimal places for whole amounts
      maximumFractionDigits: 2       // Maximum 2 decimal places if needed
    }).format(value);
  }
}
