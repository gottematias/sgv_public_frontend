import { Injectable } from '@angular/core';

export interface RoundingOption {
  label: string; // "Redondear a $X.XX ↓" or "↑"
  increment: number; // 0.05, 0.10, 0.50, 1.00
  direction: 'down' | 'up';
  adjustment: number; // The montoAjusteRedondeo value to apply
  resultingTotal: number; // What total would become
}

@Injectable({
  providedIn: 'root',
})
export class RoundingService {
  /**
   * Determines the appropriate rounding increment based on the decimal portion of the subtotal.
   * Rules:
   * - Centavos 0.00-0.04: Round to nearest 0.05
   * - Centavos 0.05-0.09: Round to nearest 0.10
   * - Centavos 0.10-0.49: Round to nearest 0.50
   * - Centavos 0.50-0.99: Round to nearest 1.00
   */
  determineIncrement(subtotal: number): number {
    const decimalPortion = subtotal - Math.floor(subtotal);

    if (decimalPortion < 0.05) {
      return 0.05;
    } else if (decimalPortion < 0.1) {
      return 0.1;
    } else if (decimalPortion < 0.5) {
      return 0.5;
    } else {
      return 1.0;
    }
  }

  /**
   * Calculates rounding options (down and up) for a given subtotal.
   * Returns an array with two options: one for rounding down and one for rounding up.
   */
  calculateRoundingOptions(subtotal: number): RoundingOption[] {
    if (subtotal <= 0) {
      return [];
    }

    const increment = this.determineIncrement(subtotal);
    const options: RoundingOption[] = [];

    // Calculate rounded down value
    const roundedDown = Math.floor(subtotal / increment) * increment;
    const adjustmentDown = roundedDown - subtotal;

    // Calculate rounded up value
    const roundedUp = Math.ceil(subtotal / increment) * increment;
    const adjustmentUp = roundedUp - subtotal;

    // Only add "round down" option if it would actually change the value
    if (Math.abs(adjustmentDown) > 0.001) {
      options.push({
        label: `Redondear a $${roundedDown.toFixed(2)} ↓`,
        increment,
        direction: 'down',
        adjustment: adjustmentDown,
        resultingTotal: roundedDown,
      });
    }

    // Only add "round up" option if it would actually change the value
    if (Math.abs(adjustmentUp) > 0.001) {
      options.push({
        label: `Redondear a $${roundedUp.toFixed(2)} ↑`,
        increment,
        direction: 'up',
        adjustment: adjustmentUp,
        resultingTotal: roundedUp,
      });
    }

    return options;
  }
}
