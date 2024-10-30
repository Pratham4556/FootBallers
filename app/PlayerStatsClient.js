// app/PlayerStatsClient.js
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/players.module.css';

const PlayerStatsClient = () => {
  const router = useRouter();
  const [players, setPlayers] = useState([]);
  const [selectedClub, setSelectedClub] = useState('');
  const [selectedRange, setSelectedRange] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize values from URL on component mount
  useEffect(() => {
    const initializeFromUrl = () => {
      const path = window.location.pathname.split('/').filter(Boolean);
      if (path.length >= 2) {
        const clubFromPath = decodeURIComponent(path[0]);
        const formattedClub = clubFromPath
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase())
          .trim();
        
        const rangeFromPath = path[2];
        
        setSelectedClub(formattedClub);
        setSelectedRange(rangeFromPath);
        setIsInitialized(true);
      } else {
        setSelectedClub('');
        setSelectedRange('');
        setIsInitialized(true);
      }
    };

    initializeFromUrl();
  }, []);

  useEffect(() => {
    if (isInitialized && selectedClub && selectedRange) {
      fetchPlayers();
    }
  }, [selectedClub, selectedRange, isInitialized]);

  const handleClubChange = (e) => {
    const newClub = e.target.value;
    setSelectedClub(newClub);
    if (newClub && selectedRange) {
      const formattedClub = newClub.replace(/\s+/g, '');
      router.push(`/${formattedClub}/Top/${selectedRange}`);
    }
  };

  const handleRangeChange = (e) => {
    const newRange = e.target.value;
    setSelectedRange(newRange);
    if (selectedClub && newRange) {
      const formattedClub = selectedClub.replace(/\s+/g, '');
      router.push(`/${formattedClub}/Top/${newRange}`);
    }
  };

  const fetchPlayers = async () => {
    try {
      const formattedClub = selectedClub.replace(/\s+/g, '');
      const response = await fetch(`/api/Players/${formattedClub}/Top/${selectedRange}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data?.data) {
        setPlayers(data.data);
      }
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const clubs = [
    "Manchester United",
    "Manchester City",
    "Arsenal",
    "Barcelona",
    "Real Madrid",
    "Bayern Munich",
    "Liverpool"
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {selectedClub && selectedRange
          ? `Top ${selectedRange} Scorers from ${selectedClub}`
          : 'Player Statistics'}
      </h1>

      <div className={styles.filters}>
        <select
          value={selectedClub}
          onChange={handleClubChange}
          className={styles.select}
        >
          <option value="">Select Club</option>
          {clubs.map((club) => (
            <option key={club} value={club}>{club}</option>
          ))}
        </select>

        <select
          value={selectedRange}
          onChange={handleRangeChange}
          className={styles.select}
        >
          <option value="">Select Range</option>
          {[5, 10, 15, 20, 25].map((num) => (
            <option key={num} value={num}>Top {num} Scorers</option>
          ))}
        </select>
      </div>

      <div className={styles.cardGrid}>
        {players.map((player) => (
          <div key={player._id} className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>{player.name}</h2>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.stat}>
                <span>Club:</span>
                <span>{player.club}</span>
              </div>
              <div className={styles.stat}>
                <span>Goals:</span>
                <span className={styles.goals}>{player.goals}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {players.length === 0 && selectedClub && selectedRange && (
        <div className={styles.noResults}>
          No players found for the selected criteria
        </div>
      )}
    </div>
  );
};

export default PlayerStatsClient;