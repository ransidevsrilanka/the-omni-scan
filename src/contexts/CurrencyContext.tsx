import React, { createContext, useContext, useState, ReactNode } from 'react';

type Currency = 'LKR' | 'USD';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (priceLKR: number, priceUSD?: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>('LKR');

  const formatPrice = (priceLKR: number, priceUSD?: number) => {
    if (currency === 'USD' && priceUSD !== undefined) {
      return `$${priceUSD.toFixed(2)}`;
    }
    return `LKR ${priceLKR.toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
};
