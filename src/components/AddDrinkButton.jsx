import React, { useState } from 'react';
import { DRINKS_DB, calculateAlcohol, calculateBeerLiters } from '../utils/drinks';
import { useApp } from '../context/AppContext';
import { AddDrinkModal } from './AddDrinkModal';

export const AddDrinkButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { addDrink } = useApp();

  const handleAddDrink = (drinkData) => {
    const alcohol = calculateAlcohol(drinkData.volume, drinkData.abv);
    const beerFactor = drinkData.beerFactor !== undefined ? drinkData.beerFactor : 0;
    const beerLiters = calculateBeerLiters(drinkData.volume, beerFactor);
    addDrink({
      name: drinkData.name,
      icon: drinkData.icon,
      volume: drinkData.volume,
      abv: drinkData.abv,
      alcohol,
      beerLiters,
    });
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 w-16 h-16 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 animate-fadeIn"
        aria-label="Add drink"
      >
        <span className="text-3xl">➕</span>
      </button>

      {isOpen && (
        <AddDrinkModal
          onClose={() => setIsOpen(false)}
          onAdd={handleAddDrink}
        />
      )}
    </>
  );
};

