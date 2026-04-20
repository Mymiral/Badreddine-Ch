import React, { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/contexts/AppContext';

export const MortgageCalculator = ({ propertyPrice }: { propertyPrice: number }) => {
  const { t } = useTranslation();
  const { formatPrice } = useApp();
  
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [interestRate, setInterestRate] = useState(5.5);
  const [loanTerm, setLoanTerm] = useState(20); // in years
  
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  useEffect(() => {
    // Principal loan amount
    const principal = propertyPrice - (propertyPrice * (downPaymentPct / 100));
    
    // Monthly interest rate
    const r = (interestRate / 100) / 12;
    // Total number of payments
    const n = loanTerm * 12;
    
    // Mortgage formula: M = P[r(1+r)^n]/[(1+r)^n-1]
    if (r === 0) {
      setMonthlyPayment(principal / n);
    } else {
      const payment = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setMonthlyPayment(isNaN(payment) ? 0 : payment);
    }
  }, [propertyPrice, downPaymentPct, interestRate, loanTerm]);

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mt-8">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Calculator className="w-5 h-5 text-brand-accent" />
        Simulateur de crédit
      </h3>
      
      <div className="space-y-6">
        {/* Down Payment */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-muted-foreground">Apport initial ({downPaymentPct}%)</span>
            <span className="font-bold">{formatPrice(propertyPrice * (downPaymentPct / 100))}</span>
          </div>
          <input 
            type="range" 
            min="0" max="90" step="5"
            value={downPaymentPct} 
            onChange={(e) => setDownPaymentPct(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-brand-accent" 
          />
        </div>

        {/* Interest Rate */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-muted-foreground">Taux d'intérêt</span>
            <span className="font-bold">{interestRate}%</span>
          </div>
          <input 
            type="range" 
            min="1" max="15" step="0.1"
            value={interestRate} 
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-brand-accent" 
          />
        </div>

        {/* Loan Term */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-muted-foreground">Durée du prêt</span>
            <span className="font-bold">{loanTerm} ans</span>
          </div>
          <input 
            type="range" 
            min="5" max="35" step="5"
            value={loanTerm} 
            onChange={(e) => setLoanTerm(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-brand-accent" 
          />
        </div>

        <div className="pt-6 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="font-medium">Mensualité estimée</span>
            <span className="text-2xl font-bold text-brand-accent">{formatPrice(monthlyPayment)}<span className="text-sm text-muted-foreground font-normal">/mo</span></span>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            *Les montants sont estimatifs et n'incluent pas les assurances ni les frais annexes.
          </p>
        </div>
      </div>
    </div>
  );
};
