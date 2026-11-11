import React, { useState, useEffect } from 'react';
import { 
  UtensilsCrossed, Clock, Users, ThumbsUp, ThumbsDown, 
  MapPin, Sparkles, Filter, AlertCircle, ChefHat, CheckCircle2 
} from 'lucide-react';
import confetti from 'canvas-confetti';

const HOSTEL_MESSES = [
  {
    id: 'hostel-h',
    name: 'Hostel H Dining Hall',
    rushLevel: 'Low (No Line)',
    rushScore: 1, // 1: Low, 2: Moderate, 3: High
    avgRating: 4.2,
    totalReviews: 84,
    menu: {
      Breakfast: ['Aloo Paratha', 'Curd & Pickle', 'Boiled Eggs / Sprouts', 'Tea & Coffee'],
      Lunch: ['Rajma Masala', 'Jeera Rice', 'Seasonal Mix Veg', 'Tawa Roti', 'Boondi Raita'],
      Snacks: ['Veg Cutlets & Green Chutney', 'Masala Chai'],
      Dinner: ['Paneer Butter Masala', 'Dal Makhani', 'Butter Roti', 'Gulab Jamun']
    }
  },
  {
    id: 'hostel-b',
    name: 'Hostel B Main Mess',
    rushLevel: 'High Rush (15m wait)',
    rushScore: 3,
    avgRating: 3.8,
    totalReviews: 112,
    menu: {
      Breakfast: ['Poha with Peanuts', 'Upma', 'Boiled Eggs', 'Tea / Milk'],
      Lunch: ['Kadhi Pakora', 'Steamed Rice', 'Aloo Gobi', 'Roti', 'Salad'],
      Snacks: ['Samosa', 'Ginger Tea'],
      Dinner: ['Egg Curry / Kadai Paneer', 'Yellow Dal Tadka', 'Jeera Rice', 'Roti', 'Kheer']
    }
  },
  {
    id: 'hostel-j',
    name: 'Hostel J Central Dining',
    rushLevel: 'Moderate (5m wait)',
    rushScore: 2,
    avgRating: 4.4,
    totalReviews: 96,
    menu: {
      Breakfast: ['Masala Dosa', 'Sambar & Coconut Chutney', 'Boiled Eggs', 'Filter Coffee'],
      Lunch: ['Chole Bhature / Rice', 'Lauki Chana Dal', 'Cucumber Raita', 'Salad'],
      Snacks: ['Bread Pakora', 'Cutting Chai'],
      Dinner: ['Mushroom Matar', 'Dal Fry', 'Plain Rice', 'Tandoori Roti', 'Ice Cream']
    }
  }
];

export default function App() {
  const [selectedHostel, setSelectedHostel] = useState(HOSTEL_MESSES[0]);
  const [activeMeal, setActiveMeal] = useState('Dinner');
  const [ratings, setRatings] = useState(() => {
    const saved = localStorage.getItem('messbite_ratings');
    return saved ? JSON.parse(saved) : {};
  });
  const [rushVotes, setRushVotes] = useState(() => {
    const saved = localStorage.getItem('messbite_rush_votes');
    return saved ? JSON.parse(saved) : {};
  });

  // Auto-detect current meal slot from system time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 7 && hour < 10) setActiveMeal('Breakfast');
    else if (hour >= 12 && hour < 15) setActiveMeal('Lunch');
    else if (hour >= 17 && hour < 19) setActiveMeal('Snacks');
    else setActiveMeal('Dinner');
  }, []);

  useEffect(() => {
    localStorage.setItem('messbite_ratings', JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    localStorage.setItem('messbite_rush_votes', JSON.stringify(rushVotes));
  }, [rushVotes]);

  const handleRate = (type) => {
    const key = `${selectedHostel.id}-${activeMeal}`;
    const current = ratings[key] || { up: 18, down: 3 };
    const updated = {
      ...ratings,
      [key]: {
        up: type === 'up' ? current.up + 1 : current.up,
        down: type === 'down' ? current.down + 1 : current.down
      }
    };
    setRatings(updated);
    confetti({ particleCount: 45, spread: 55, origin: { y: 0.7 } });
  };

  const handleReportRush = (level) => {
    setRushVotes(prev => ({
      ...prev,
      [selectedHostel.id]: level
    }));
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
  };

  const currentMealKey = `${selectedHostel.id}-${activeMeal}`;
  const mealFeedback = ratings[currentMealKey] || { up: 24, down: 4 };
  const reportedRush = rushVotes[selectedHostel.id] || selectedHostel.rushLevel;

  return (
    <div style={{ minHeight: '100vh', background: '#090d16', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Navbar */}
      <header style={{ background: '#0f172a', borderBottom: '1px solid #1e293b', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '38px', height: '38px', background: '#f97316', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UtensilsCrossed size={22} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>MessBite</h1>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Campus Daily Mess Menu & Crowd Meter</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1e293b', padding: '6px 14px', borderRadius: '999px', fontSize: '12px', border: '1px solid #334155' }}>
          <Clock size={14} color="#fb923c" />
          <span>Active Window: <strong style={{ color: '#fb923c' }}>{activeMeal} Slot</strong></span>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1160px', margin: '0 auto', padding: '24px 16px', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
        
        {/* Left Column: Menu Ledger & Meal Selectors */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Hostel Selector Tabs */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
            {HOSTEL_MESSES.map(h => (
              <button
                key={h.id}
                onClick={() => setSelectedHostel(h)}
                style={{
                  background: selectedHostel.id === h.id ? '#ea580c' : '#0f172a',
                  border: selectedHostel.id === h.id ? '1px solid #f97316' : '1px solid #1e293b',
                  color: selectedHostel.id === h.id ? '#ffffff' : '#94a3b8',
                  borderRadius: '10px',
                  padding: '10px 16px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {h.name}
              </button>
            ))}
          </div>

          {/* Meal Slot Filter (Breakfast, Lunch, Snacks, Dinner) */}
          <div style={{ display: 'flex', gap: '6px', background: '#0f172a', padding: '6px', borderRadius: '10px', border: '1px solid #1e293b' }}>
            {['Breakfast', 'Lunch', 'Snacks', 'Dinner'].map(slot => (
              <button
                key={slot}
                onClick={() => setActiveMeal(slot)}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  background: activeMeal === slot ? '#1e293b' : 'transparent',
                  color: activeMeal === slot ? '#fb923c' : '#94a3b8',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {slot}
              </button>
            ))}
          </div>

          {/* Today's Dish Board */}
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#fb923c', fontWeight: '800', textTransform: 'uppercase' }}>
                  {selectedHostel.name}
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '4px 0 0 0' }}>
                  Today's {activeMeal} Menu
                </h3>
              </div>
              <span style={{ fontSize: '11px', background: '#1e293b', color: '#93c5fd', padding: '4px 10px', borderRadius: '6px', border: '1px solid #334155' }}>
                4-Week Cycle
              </span>
            </div>

            {/* Menu Items Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', marginBottom: '20px' }}>
              {selectedHostel.menu[activeMeal].map((dish, i) => (
                <div key={i} style={{ background: '#030712', border: '1px solid #1e293b', borderRadius: '10px', padding: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ChefHat size={16} color="#fb923c" />
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#f8fafc' }}>{dish}</span>
                </div>
              ))}
            </div>

            {/* Peer Meal Reaction */}
            <div style={{ borderTop: '1px solid #1e293b', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>How was this meal today?</span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleRate('up')}
                  style={{
                    background: '#064e3b',
                    border: '1px solid #059669',
                    color: '#6ee7b7',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <ThumbsUp size={14} /> Good ({mealFeedback.up})
                </button>
                <button
                  onClick={() => handleRate('down')}
                  style={{
                    background: '#7f1d1d',
                    border: '1px solid #b91c1c',
                    color: '#fca5a5',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <ThumbsDown size={14} /> Disappointing ({mealFeedback.down})
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Live Crowd Meter & Quick Reporting */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Live Rush Telemetry */}
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '22px' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Live Dining Hall Crowd Meter
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: '900', margin: '4px 0 12px 0' }}>{selectedHostel.name}</h2>

            {/* Current Rush Indicator */}
            <div style={{
              background: reportedRush.includes('Low') ? 'rgba(16,185,129,0.1)' : reportedRush.includes('Moderate') ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
              border: reportedRush.includes('Low') ? '1px solid #10b981' : reportedRush.includes('Moderate') ? '1px solid #f59e0b' : '1px solid #ef4444',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '18px'
            }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '800',
                color: reportedRush.includes('Low') ? '#34d399' : reportedRush.includes('Moderate') ? '#fbbf24' : '#f87171'
              }}>
                {reportedRush}
              </div>
              <p style={{ fontSize: '12px', color: '#cbd5e1', margin: '4px 0 0 0' }}>
                {reportedRush.includes('Low')
                  ? 'Plentiful free tables and zero counter delay right now.'
                  : reportedRush.includes('Moderate')
                  ? 'Tables filling quickly; moderate 5-minute counter queue.'
                  : 'Long queue spilling past the washing area; expect 15m delay.'
                }
              </p>
            </div>

            {/* 1-Tap Crowd Report */}
            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
                Eating in the mess right now? Update peers:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                <button
                  onClick={() => handleReportRush('Low (No Line)')}
                  style={{ background: '#1e293b', border: '1px solid #334155', color: '#34d399', padding: '10px 4px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                >
                  🟢 No Line
                </button>
                <button
                  onClick={() => handleReportRush('Moderate (5m wait)')}
                  style={{ background: '#1e293b', border: '1px solid #334155', color: '#fbbf24', padding: '10px 4px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                >
                  🟡 5m Line
                </button>
                <button
                  onClick={() => handleReportRush('High Rush (15m wait)')}
                  style={{ background: '#1e293b', border: '1px solid #334155', color: '#f87171', padding: '10px 4px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                >
                  🔴 Jammed
                </button>
              </div>
            </div>
          </div>

          {/* Dining Timings Reference */}
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '18px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: '700', margin: '0 0 10px 0', color: '#cbd5e1' }}>Standard Hostel Mess Timings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#94a3b8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Breakfast</span>
                <strong style={{ color: '#f8fafc' }}>07:30 AM – 09:30 AM</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Lunch</span>
                <strong style={{ color: '#f8fafc' }}>12:15 PM – 02:15 PM</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Evening Snacks</span>
                <strong style={{ color: '#f8fafc' }}>05:00 PM – 06:15 PM</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Dinner</span>
                <strong style={{ color: '#f8fafc' }}>07:45 PM – 09:45 PM</strong>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}