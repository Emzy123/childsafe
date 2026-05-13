import React, { useState } from 'react';
import { MapPin, TrendingUp, Users, Clock, AlertTriangle } from 'lucide-react';

const ImpactMap = () => {
  const [selectedState, setSelectedState] = useState(null);
  const [hoveredState, setHoveredState] = useState(null);

  // Nigeria states with mock data
  const statesData = [
    { id: 'lagos', name: 'Lagos', cases: 2341, responseRate: 92, hotspots: 15, coords: { x: 65, y: 75 } },
    { id: 'abuja', name: 'Abuja', cases: 1247, responseRate: 88, hotspots: 8, coords: { x: 50, y: 45 } },
    { id: 'kano', name: 'Kano', cases: 1876, responseRate: 85, hotspots: 12, coords: { x: 55, y: 25 } },
    { id: 'rivers', name: 'Rivers', cases: 987, responseRate: 90, hotspots: 6, coords: { x: 70, y: 65 } },
    { id: 'oyo', name: 'Oyo', cases: 756, responseRate: 87, hotspots: 5, coords: { x: 45, y: 70 } },
    { id: 'kaduna', name: 'Kaduna', cases: 1123, responseRate: 83, hotspots: 7, coords: { x: 48, y: 35 } },
    { id: 'delta', name: 'Delta', cases: 645, responseRate: 89, hotspots: 4, coords: { x: 60, y: 60 } },
    { id: 'enugu', name: 'Enugu', cases: 534, responseRate: 91, hotspots: 3, coords: { x: 72, y: 55 } },
  ];

  const getHeatColor = (cases) => {
    if (cases > 1500) return 'bg-critical/60';
    if (cases > 1000) return 'bg-warning/60';
    if (cases > 500) return 'bg-primary-500/60';
    return 'bg-success/60';
  };

  const getStateColor = (stateId) => {
    const state = statesData.find(s => s.id === stateId);
    if (!state) return 'bg-gray-200';
    
    if (hoveredState === stateId || selectedState === stateId) {
      return getHeatColor(state.cases);
    }
    return 'bg-gray-300/50 hover:bg-gray-400/50';
  };

  return (
    <div className="space-y-6">
      {/* Map Container */}
      <div className="relative bg-surface-secondary rounded-xl p-8">
        {/* Simplified Nigeria Map SVG */}
        <svg viewBox="0 0 100 100" className="w-full h-96 md:h-[500px]">
          {/* Map Background */}
          <rect width="100" height="100" fill="#f3f4f6" rx="4" />
          
          {/* State Shapes (simplified rectangles for demo) */}
          {statesData.map((state) => (
            <g key={state.id}>
              <rect
                x={state.coords.x - 8}
                y={state.coords.y - 6}
                width="16"
                height="12"
                className={getStateColor(state.id)}
                stroke="#374151"
                strokeWidth="0.5"
                rx="2"
                style={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={() => setHoveredState(state.id)}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => setSelectedState(state)}
              />
              
              {/* State Label */}
              <text
                x={state.coords.x}
                y={state.coords.y + 1}
                textAnchor="middle"
                className="text-xs font-medium fill-gray-700 pointer-events-none"
              >
                {state.name.substring(0, 3).toUpperCase()}
              </text>
              
              {/* Case Count Badge */}
              <circle
                cx={state.coords.x + 6}
                cy={state.coords.y - 4}
                r="3"
                className="fill-critical stroke-white"
                strokeWidth="0.5"
              />
              <text
                x={state.coords.x + 6}
                y={state.coords.y - 2}
                textAnchor="middle"
                className="text-[8px] font-bold fill-white pointer-events-none"
              >
                {state.cases > 999 ? '1k+' : state.cases}
              </text>
            </g>
          ))}
        </svg>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="text-xs font-semibold text-gray-700 mb-2">Case Volume</div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-critical/60 rounded"></div>
              <span className="text-xs text-gray-600">High (&gt;1500)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-warning/60 rounded"></div>
              <span className="text-xs text-gray-600">Medium (1000-1500)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary-500/60 rounded"></div>
              <span className="text-xs text-gray-600">Low (500-1000)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success/60 rounded"></div>
              <span className="text-xs text-gray-600">Very Low (&lt;500)</span>
            </div>
          </div>
        </div>
      </div>

      {/* State Details Panel */}
      {selectedState && (
        <div className="bg-surface-elevated rounded-xl p-6 border border-border-light">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">{selectedState.name} State</h3>
            <button
              onClick={() => setSelectedState(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ×
            </button>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-3">
                <AlertTriangle className="h-6 w-6 text-primary-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {selectedState.cases.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Cases</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-success/10 rounded-lg mx-auto mb-3">
                <Clock className="h-6 w-6 text-success" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {selectedState.responseRate}%
              </div>
              <div className="text-sm text-gray-600">Response Rate</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-warning/10 rounded-lg mx-auto mb-3">
                <MapPin className="h-6 w-6 text-warning" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {selectedState.hotspots}
              </div>
              <div className="text-sm text-gray-600">Active Hotspots</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-secondary-100 rounded-lg mx-auto mb-3">
                <Users className="h-6 w-6 text-secondary-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {Math.floor(selectedState.cases * 0.67).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Children Protected</div>
            </div>
          </div>

          {/* Top 3 Hotspots */}
          <div className="mt-6 pt-6 border-t border-border-light">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Top 3 Hotspots</h4>
            <div className="space-y-3">
              {['Urban Center A', 'Rural Area B', 'Suburban Zone C'].map((hotspot, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-critical/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-critical">{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{hotspot}</div>
                      <div className="text-sm text-gray-600">High priority area</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {Math.floor(Math.random() * 50 + 20)} cases
                    </div>
                    <div className="text-sm text-gray-600">This month</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Time Slider */}
      <div className="bg-surface-elevated rounded-xl p-6 border border-border-light">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Timeline View</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>2020</span>
            <span>2021</span>
            <span>2022</span>
            <span>2023</span>
            <span>2024</span>
            <span>2025</span>
            <span>2026</span>
          </div>
          <input
            type="range"
            min="2020"
            max="2026"
            defaultValue="2026"
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-secondary-600"
          />
          <div className="text-center text-sm text-gray-600">
            Viewing data for: <span className="font-semibold text-gray-900">2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactMap;
