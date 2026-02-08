import { Injectable, signal } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

/**
 * Investment input parameters interface
 * Defines the structure for user-provided investment data
 */
export interface InvestmentInput {
    initialInvestment: number;      // Starting capital amount in INR
    monthlyContribution: number;    // Monthly investment amount in INR
    annualInterestRate: number;     // Annual interest rate as percentage (0-100)
    duration: number;               // Investment duration in years (1-100)
}

/**
 * Annual investment result interface
 * Contains year-by-year breakdown of investment growth
 */
export interface InvestmentResult {
    year: number;                   // Year number (1 to duration)
    interestEarnedInYear: number;   // Interest earned in this specific year
    valueEndOfYear: number;         // Total investment value at year end
    totalInterestEarned: number;    // Cumulative interest earned up to this year
    totalInvestedAmount: number;    // Total amount invested (capital + contributions) up to this year
}

/**
 * Investment calculation service
 * Handles investment calculations, state management, and reactive updates
 * Uses both Observables and Signals for backward compatibility and modern patterns
 */
@Injectable({
    providedIn: 'root'
})
export class InvestmentResultService {
    // === Observable Streams ===
    // BehaviorSubject streams for reactive component binding
    private readonly investmentResults$ = new BehaviorSubject<InvestmentResult[]>([]);
    private readonly isCalculating$ = new BehaviorSubject<boolean>(false);
    private readonly errorMessage$ = new BehaviorSubject<string>('');
    
    // === Signal-based State ===
    // Signals for modern Angular state management (optional alternative to Observables)
    private readonly isCalculating = signal(false);
    private readonly errorMessage = signal('');


    /**
     * Get investment results as Observable
     * Components subscribe to this stream to reactively display results
     * @returns Observable stream of investment calculation results
     */
    getInvestmentResults(): Observable<InvestmentResult[]> {
        return this.investmentResults$.asObservable();
    }

    /**
     * Get calculation loading state as Observable
     * Used to show/hide loading spinner during calculations
     * @returns Observable stream of boolean loading state
     */
    getIsCalculatingAsObservable(): Observable<boolean> {
        return this.isCalculating$.asObservable();
    }

    /**
     * Get error messages as Observable
     * Used to display validation errors to the user
     * @returns Observable stream of error message strings
     */
    getErrorMessageAsObservable(): Observable<string> {
        return this.errorMessage$.asObservable();
    }

    /**
     * Get calculation loading state as Signal (read-only)
     * Modern Angular alternative for state management
     * @returns Read-only signal of loading state
     */
    getIsCalculating() {
        return this.isCalculating.asReadonly();
    }

    /**
     * Get error message as Signal (read-only)
     * Modern Angular alternative for state management
     * @returns Read-only signal of error message
     */
    getErrorMessage() {
        return this.errorMessage.asReadonly();
    }

    /**
     * Validates investment input parameters
     * Ensures all values are within acceptable ranges
     * 
     * @param input - Investment parameters to validate
     * @returns Error message if validation fails, empty string if valid
     */
    private validateInput(input: InvestmentInput): string {
        // Initial investment cannot be negative
        if (input.initialInvestment < 0) 
            return 'Initial investment cannot be negative';
        
        // Monthly contributions cannot be negative
        if (input.monthlyContribution < 0) 
            return 'Monthly contribution cannot be negative';
        
        // Interest rate cannot be negative
        if (input.annualInterestRate < 0) 
            return 'Annual interest rate cannot be negative';
        
        // Duration must be at least 1 year
        if (input.duration <= 0) 
            return 'Duration must be at least 1 year';
        
        // Duration cannot exceed 100 years
        if (input.duration > 100) 
            return 'Duration cannot exceed 100 years';
        
        // All validations passed
        return '';
    }

    /**
     * Calculates investment growth over specified duration
     * Applies compound interest formula with annual interest calculation
     * and monthly contributions throughout the investment period
     * 
     * Formula: For each year:
     * - Annual interest = current_value × (annual_rate / 100)
     * - New value = current_value + annual_interest + (monthly_contribution × 12)
     * 
     * @param input - Investment parameters (initial amount, monthly contribution, rate, duration)
     */
    calculateInvestmentResults(input: InvestmentInput): void {
        // Validate input parameters before calculation
        const error = this.validateInput(input);
        if (error) {
            // Set error state and clear results
            this.errorMessage.set(error);
            this.errorMessage$.next(error);
            this.investmentResults$.next([]);
            return;
        }

        // Update loading state to true
        this.isCalculating.set(true);
        this.isCalculating$.next(true);
        
        // Clear any previous error messages
        this.errorMessage.set('');
        this.errorMessage$.next('');

        try {
            // Array to store year-by-year results
            const results: InvestmentResult[] = [];
            
            // Initialize variables for tracking investment growth
            let investmentValue = input.initialInvestment;
            let totalInterestEarned = 0;

            // Perform calculation for each year
            for (let year = 1; year <= input.duration; year++) {
                // Calculate interest earned in this year based on current investment value
                // Formula: interest = principal × (rate / 100)
                const interestEarnedThisYear = investmentValue * (input.annualInterestRate / 100);
                
                // Add interest to cumulative total
                totalInterestEarned += interestEarnedThisYear;

                // Calculate total contributions from monthly amounts (12 months per year)
                const annualContribution = input.monthlyContribution * 12;
                
                // Update investment value: add interest and new contributions
                investmentValue += interestEarnedThisYear + annualContribution;

                // Calculate total amount invested (initial capital + all contributions to date)
                // Note: This does NOT include earned interest, only actual money invested
                const totalInvestedAmount = input.initialInvestment + (annualContribution * year);

                // Store the calculated result for this year
                results.push({
                    year,
                    interestEarnedInYear: interestEarnedThisYear,
                    valueEndOfYear: investmentValue,
                    totalInterestEarned,
                    totalInvestedAmount
                });
            }

            // Emit results to all subscribers
            this.investmentResults$.next(results);
        } finally {
            // Always reset loading state, even if error occurs
            this.isCalculating.set(false);
            this.isCalculating$.next(false);
        }
    }

    /**
     * Resets the service to initial state
     * Clears all previous calculations, results, and error messages
     * Useful for form reset functionality
     */
    resetResults(): void {
        this.investmentResults$.next([]);
        this.errorMessage.set('');
        this.errorMessage$.next('');
    }
}