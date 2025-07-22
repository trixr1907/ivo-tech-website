import React, { useEffect, useState } from 'react';
import { useCryptoData } from '../../hooks/useCryptoData';
import { CryptoPrice } from '../../types/crypto';

export const CryptoDashboard: React.FC = () => {
  const { prices, loading, error } = useCryptoData();

  if (loading) return <div>Laden...</div>;
  if (error) return <div>Fehler beim Laden der Daten: {error}</div>;

  return (
    <div className="crypto-dashboard">
      <h2>Kryptowährungen Live-Dashboard</h2>
      <div className="crypto-grid">
        {prices.map((crypto: CryptoPrice) => (
          <div key={crypto.symbol} className="crypto-card">
            <h3>{crypto.name}</h3>
            <p>Preis: {crypto.price} USD</p>
            <p>24h Änderung: {crypto.change24h}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};
