'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

const SYMBOLS = ['🍒', '🍋', '🍊', '⭐', '🔔', '7'];
const STARTING_MONEY = 100;
const SPIN_COST = 10;
const WIN_REWARD = 50;

export default function SlotMachine() {
  const [reels, setReels] = useState(['❔', '❔', '❔']);
  const [money, setMoney] = useState(STARTING_MONEY);
  const [score, setScore] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [started, setStarted] = useState(false);
  const [spinCounter, setSpinCounter] = useState(0);

  const getRandomSymbol = () =>
    SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

  const startGame = () => setStarted(true);

  const handleSpin = useCallback(() => {
    if (spinning || money < SPIN_COST) return;

    setSpinning(true);
    setMoney(prev => prev - SPIN_COST);
    let spinInterval: NodeJS.Timeout;

    spinInterval = setInterval(() => {
      setReels([getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]);
      setSpinCounter(prev => prev + 1);
    }, 100);

    setTimeout(() => {
      clearInterval(spinInterval);
      const result = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
      setReels(result);
      setSpinCounter(prev => prev + 1);
      setSpinning(false);

      if (result.every(val => val === result[0])) {
        setMoney(prev => prev + WIN_REWARD);
        setScore(prev => prev + 1);
      }
    }, 2000);
  }, [spinning, money]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        !started ? startGame() : handleSpin();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [started, handleSpin]);

  if (!started) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-black to-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-7xl font-bold mb-6">🎰 Slot Machine</h1>
          <p className="text-2xl mb-6">Press <strong>Enter</strong> or click below to start</p>
          <button
            onClick={startGame}
            className="px-10 py-4 bg-green-500 text-white text-2xl font-bold rounded-lg hover:bg-green-400"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black to-gray-900 text-white flex flex-col items-center pt-12 px-8">
      <div className="w-full max-w-[1600px] flex flex-col items-center">
        <h1 className="text-6xl font-bold mb-10">🎰 Patricks Slot Machine</h1>

        <div className="text-2xl mb-8 flex gap-16">
          <div>💰 Money: <span className="font-mono">${money}</span></div>
          <div>🏆 Score: <span className="font-mono">{score}</span></div>
        </div>

        <div className="flex justify-center gap-20 mb-12 w-full px-20">
          {reels.map((symbol, index) => (
            <motion.div
              key={`${spinCounter}-${index}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="w-56 h-56 bg-white text-black rounded-3xl flex items-center justify-center border-8 border-yellow-400 text-8xl shadow-2xl"
            >
              {symbol}
            </motion.div>
          ))}
        </div>

        <button
          onClick={handleSpin}
          disabled={spinning || money < SPIN_COST}
          className="px-14 py-6 bg-yellow-400 text-black text-2xl font-bold rounded-xl hover:bg-yellow-300 disabled:opacity-50"
        >
          {spinning ? 'Spinning...' : 'Spin 🎲'}
        </button>
      </div>
    </div>
  );
}
