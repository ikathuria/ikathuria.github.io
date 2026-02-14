/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Activity, Brain, Database, Mic, MessageSquare, Cloud, Sun, Moon, CheckCircle, Lock, ShieldCheck } from 'lucide-react';

// --- PAPER 1: PM2.5 PREDICTION (Bar Chart) ---
export const FeatureSelectionChart: React.FC<{ color: string }> = ({ color }) => {
  const data = [
    { name: 'Pearson', value: 0.525, best: false },
    { name: 'Fisher', value: 0.525, best: false },
    { name: 'Chi-Squared', value: 0.533, best: false },
    { name: 'Count-Based', value: 0.508, best: true }, // Lower RMSE is better
  ];

  const maxVal = 0.6;

  return (
    <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-sm border border-stone-200 my-8 w-full max-w-2xl">
      <h3 className="font-serif text-xl mb-4 text-stone-800">RMSE Performance (Lower is Better)</h3>
      <p className="text-sm text-stone-500 mb-8 text-center max-w-md">
        Comparing Neural Network Regression error rates across different feature selection methods.
      </p>

      <div className="flex items-end justify-center gap-4 h-64 w-full px-4">
        {data.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2 flex-1 h-full justify-end group">
            <div className="text-xs font-mono font-bold text-stone-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {item.value}
            </div>
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: `${(item.value / maxVal) * 100}%` }}
              transition={{ duration: 1, delay: idx * 0.1 }}
              className={`w-full max-w-[60px] rounded-t-lg relative ${item.best ? 'opacity-100' : 'opacity-40 hover:opacity-60'}`}
              style={{ backgroundColor: color }}
            >
              {item.best && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap">
                  Best Result
                </div>
              )}
            </motion.div>
            <div className="text-[10px] md:text-xs font-bold text-stone-600 uppercase tracking-tight text-center h-8 flex items-center">
              {item.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- PAPER 2: AUTISM AI (Flow Chart) ---
export const DualStreamPipeline: React.FC<{ color: string }> = ({ color }) => {
  return (
    <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-sm border border-stone-200 my-8 w-full max-w-3xl">
      <h3 className="font-serif text-xl mb-6 text-stone-800">Dual-Stream Emotion Recognition</h3>

      <div className="relative w-full flex flex-col md:flex-row items-center justify-between gap-8 py-8">
        {/* Left Inputs */}
        <div className="flex flex-col gap-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center border border-stone-200 text-stone-600">
              <Mic size={20} />
            </div>
            <div className="text-sm text-right">
              <div className="font-bold text-stone-700">User Speech</div>
              <div className="text-xs text-stone-400">Audio Signal</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center border border-stone-200 text-stone-600">
              <MessageSquare size={20} />
            </div>
            <div className="text-sm text-right">
              <div className="font-bold text-stone-700">User Text</div>
              <div className="text-xs text-stone-400">Natural Language</div>
            </div>
          </div>
        </div>

        {/* Middle Processing */}
        <div className="flex flex-col gap-4 flex-1 relative min-h-[200px] justify-center">
          {/* Connecting Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ color: color }}>
            <path d="M0 40 C 50 40, 50 100, 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
            <path d="M0 160 C 50 160, 50 100, 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
            <path d="M220 100 L 280 100" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>

          {/* Core Node */}
          <div className="w-32 h-32 mx-auto rounded-full border-4 bg-white z-10 flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden" style={{ borderColor: color }}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundColor: color }}></div>
            <Brain size={32} style={{ color: color }} className="mb-2" />
            <div className="text-xs font-bold text-stone-800">Virtual Agent</div>
            <div className="text-[9px] text-stone-500">Deep Learning<br />Integration</div>
          </div>
        </div>

        {/* Right Output */}
        <div className="flex items-center gap-4">
          <div className="text-sm text-left">
            <div className="font-bold text-stone-700">Emotional Feedback</div>
            <div className="text-xs text-stone-400">Adaptive Response</div>
          </div>
          <div className="w-12 h-12 rounded-full text-white flex items-center justify-center shadow-md" style={{ backgroundColor: color }}>
            <Activity size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- PAPER 3: FOOD RECOMMENDATION (Fuzzy Curves) ---
export const FuzzyLogicCurves: React.FC<{ color: string }> = ({ color }) => {
  const [time, setTime] = useState(10); // 0-24 hours

  // Helper to determine active label
  const getFuzzyLabel = (t: number) => {
    if (t < 5) return "Late Night";
    if (t >= 5 && t < 11) return "Morning";
    if (t >= 11 && t < 16) return "Afternoon";
    if (t >= 16 && t < 19) return "Evening";
    if (t >= 19) return "Night";
    return "";
  }

  const activeLabel = getFuzzyLabel(time);

  // Gaussian function: f(x) = exp(-((x - mu)^2) / (2 * sigma^2))
  const gaussian = (x: number, mu: number, sigma: number) => {
    return Math.exp(-Math.pow(x - mu, 2) / (2 * Math.pow(sigma, 2)));
  };

  // Generate SVG Path for a Gaussian curve
  const generateCurve = (mu: number, sigma: number, color: string, label: string) => {
    const points: string[] = [];
    for (let i = 0; i <= 240; i++) {
      const x = i / 10; // 0.0 to 24.0
      const y = gaussian(x, mu, sigma);
      // Map to SVG coordinates:
      // x: 0-24 -> 0-1000 => x * (1000/24)
      // y: 0-1 -> 200-20 => (1 - y) * 180 + 20 (inverted because SVG y is down)
      const svgX = x * (1000 / 24);
      const svgY = 200 - (y * 180);
      points.push(`${svgX.toFixed(1)},${svgY.toFixed(1)}`);
    }

    // Close the path for fill
    const d = `M ${points[0]} L ${points.join(' L ')} L ${points[points.length - 1].split(',')[0]},200 L ${points[0].split(',')[0]},200 Z`;

    return (
      <g key={label}>
        <path d={d} fill="none" stroke={color} strokeWidth="2.5" className="opacity-80" />
        <path d={d} fill={color} fillOpacity="0.1" stroke="none" />
        <text
          x={mu * (1000 / 24)}
          y={200 - (1 * 180) - 10}
          textAnchor="middle"
          fontSize="14"
          fill={color}
          fontWeight="bold"
          className="pointer-events-none select-none"
        >
          {label}
        </text>
      </g>
    )
  };

  return (
    <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-sm border border-stone-200 my-8 w-full max-w-3xl overflow-hidden">
      <h3 className="font-serif text-xl mb-2 text-stone-800">Fuzzy Logic Meal-Time</h3>
      <p className="text-sm text-stone-500 mb-6 text-center">
        Gaussian membership functions for time-of-day categories.
      </p>

      <div className="relative w-full h-56 border-b border-stone-300 mb-6">
        {/* Curves */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1000 200"
          preserveAspectRatio="none"
        >
          {generateCurve(3.5, 2.2, "#0ea5e9", "Late Night")}
          {generateCurve(9.5, 2.0, "#f59e0b", "Morning")}
          {generateCurve(14.5, 1.5, "#22c55e", "Afternoon")}
          {generateCurve(18, 1.2, "#ef4444", "Evening")}
          {generateCurve(22, 1.5, "#8b5cf6", "Night")}
        </svg>

        {/* Time Indicator */}
        <motion.div
          className="absolute top-0 bottom-0 w-0.5 bg-stone-800 z-10"
          style={{ left: `${(time / 24) * 100}%` }}
        >
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-xs py-1 px-2 rounded font-mono whitespace-nowrap shadow-md flex flex-col items-center">
            <span>{Math.floor(time).toString().padStart(2, '0')}:{Math.floor((time % 1) * 60).toString().padStart(2, '0')}</span>
            {activeLabel && <span className="text-[9px] text-stone-300 uppercase tracking-wider">{activeLabel}</span>}
          </div>
        </motion.div>
      </div>

      <input
        type="range"
        min="0"
        max="24"
        step="0.1"
        value={time}
        onChange={(e) => setTime(parseFloat(e.target.value))}
        className="w-full accent-stone-800 cursor-pointer"
        style={{ accentColor: color }}
      />
      <div className="flex justify-between w-full mt-2 text-xs text-stone-400 font-mono">
        <div className="flex items-center gap-1"><Sun size={12} /> 00:00</div>
        <div className="flex items-center gap-1"><Sun size={12} /> 12:00</div>
        <div className="flex items-center gap-1"><Moon size={12} /> 24:00</div>
      </div>
    </div>
  );
};

// --- PAPER 4: HEALTHCARE DL (Venn Diagram) ---
export const AIHierarchyVenn: React.FC<{ color: string }> = ({ color }) => {
  return (
    <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-sm border border-stone-200 my-8 w-full max-w-2xl">
      <h3 className="font-serif text-xl mb-4 text-stone-800">The AI Healthcare Hierarchy</h3>

      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* Outer Circle: AI */}
        <div className="absolute w-80 h-80 rounded-full border-2 border-stone-200 bg-stone-50 flex items-start justify-center pt-4">
          <span className="text-stone-400 font-bold text-xs tracking-widest">ARTIFICIAL INTELLIGENCE</span>
        </div>

        {/* Middle Circle: ML */}
        <div className="absolute w-60 h-60 rounded-full border-2 border-stone-300 bg-stone-100 flex items-start justify-center pt-4 shadow-sm">
          <span className="text-stone-500 font-bold text-xs tracking-widest">MACHINE LEARNING</span>
        </div>

        {/* Inner Circle: Deep Learning (Target) */}
        <div className="absolute w-32 h-32 rounded-full shadow-lg flex items-center justify-center relative animate-pulse-slow" style={{ backgroundColor: color }}>
          <span className="text-white font-bold text-center text-sm leading-tight">DEEP<br />LEARNING</span>

          {/* Floating Icons */}
          <div className="absolute -top-6 -right-6 bg-white p-2 rounded-full shadow-md border border-stone-100 text-stone-700 hover:scale-110 transition-transform">
            <Database size={16} />
            <span className="sr-only">EHR</span>
          </div>
          <div className="absolute -bottom-4 -right-4 bg-white p-2 rounded-full shadow-md border border-stone-100 text-stone-700 hover:scale-110 transition-transform">
            <Activity size={16} />
            <span className="sr-only">Drug Discovery</span>
          </div>
          <div className="absolute -bottom-4 -left-4 bg-white p-2 rounded-full shadow-md border border-stone-100 text-stone-700 hover:scale-110 transition-transform">
            <Brain size={16} />
            <span className="sr-only">Medical Imaging</span>
          </div>
        </div>
      </div>
      <p className="mt-8 text-xs text-stone-500 max-w-xs text-center">
        Deep Learning is a specialized subset of ML, capable of processing unstructured healthcare data like images and clinical notes.
      </p>
    </div>
  );
};


// --- PROJECT 1: AUTBOT (Audio Waveform) ---
export const AudioWaveform: React.FC<{ color: string }> = ({ color }) => {
  return (
    <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-sm border border-stone-200 my-8 w-full max-w-2xl">
      <h3 className="font-serif text-xl mb-6 text-stone-800">Multi-Modal Signal Processing</h3>
      <div className="flex items-center gap-2 h-32 w-full justify-center">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="w-3 rounded-full"
            style={{ backgroundColor: color }}
            animate={{
              height: [20, Math.random() * 100 + 20, 20],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.05,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      <div className="flex justify-between w-full mt-6 px-12">
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Speech</span>
          <span className="text-lg font-bold" style={{ color: color }}>90% Acc</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Text</span>
          <span className="text-lg font-bold" style={{ color: color }}>73% Acc</span>
        </div>
      </div>
    </div>
  )
}

// --- PROJECT 2: SELFMED (Network Graph) ---
export const NetworkGraph: React.FC<{ color: string }> = ({ color }) => {
  const nodes = [
    { x: 50, y: 50, label: "Symptom" },
    { x: 150, y: 20, label: "BERT" },
    { x: 150, y: 80, label: "Flask" },
    { x: 250, y: 50, label: "Diagnosis" },
  ];

  return (
    <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-sm border border-stone-200 my-8 w-full max-w-2xl">
      <h3 className="font-serif text-xl mb-6 text-stone-800">Symptom-to-Condition Mapping</h3>
      <div className="relative w-full h-48 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full">
          <line x1="20%" y1="50%" x2="50%" y2="20%" stroke={color} strokeWidth="2" strokeOpacity="0.3" />
          <line x1="20%" y1="50%" x2="50%" y2="80%" stroke={color} strokeWidth="2" strokeOpacity="0.3" />
          <line x1="50%" y1="20%" x2="80%" y2="50%" stroke={color} strokeWidth="2" strokeOpacity="0.3" />
          <line x1="50%" y1="80%" x2="80%" y2="50%" stroke={color} strokeWidth="2" strokeOpacity="0.3" />
        </svg>

        <div className="flex w-full justify-between px-10 relative z-10">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-white border-2 flex items-center justify-center shadow-sm" style={{ borderColor: color }}>
              <Activity size={20} color={color} />
            </div>
            <span className="text-xs font-bold text-stone-500">Input</span>
          </div>

          <div className="flex flex-col gap-8 justify-center">
            <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center border border-stone-200">
              <span className="text-[10px] font-bold">BERT</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center border border-stone-200">
              <span className="text-[10px] font-bold">API</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full text-white flex items-center justify-center shadow-md" style={{ backgroundColor: color }}>
              <CheckCircle size={20} />
            </div>
            <span className="text-xs font-bold text-stone-500">Result</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- PROJECT 3: SIGNATURE (Confidence Meter) ---
export const ConfidenceMeter: React.FC<{ color: string }> = ({ color }) => {
  return (
    <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-sm border border-stone-200 my-8 w-full max-w-2xl">
      <h3 className="font-serif text-xl mb-6 text-stone-800">Siamese Network Similarity</h3>

      <div className="flex gap-8 items-center w-full justify-center mb-8">
        <div className="w-24 h-12 border-2 border-dashed border-stone-300 rounded flex items-center justify-center bg-stone-50">
          <span className="font-serif italic text-stone-400">Sign A</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center">
          <span className="text-xs font-bold text-stone-500">VS</span>
        </div>
        <div className="w-24 h-12 border-2 border-dashed border-stone-300 rounded flex items-center justify-center bg-stone-50">
          <span className="font-serif italic text-stone-400">Sign B</span>
        </div>
      </div>

      <div className="w-full max-w-sm bg-stone-100 rounded-full h-4 relative overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: "0%" }}
          whileInView={{ width: "90%" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>
      <div className="mt-2 text-sm font-bold" style={{ color: color }}>
        90% Match Confidence
      </div>
      <div className="flex gap-2 items-center mt-4 text-xs text-stone-500 bg-stone-50 px-3 py-1 rounded-full border border-stone-200">
        <ShieldCheck size={12} />
        <span>Forgery Detected</span>
      </div>
    </div>
  )
}

// --- PROJECT 4: GESTURE (Depth Grid) ---
export const DepthGrid: React.FC<{ color: string }> = ({ color }) => {
  return (
    <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-sm border border-stone-200 my-8 w-full max-w-2xl">
      <h3 className="font-serif text-xl mb-6 text-stone-800">3D CNN Depth Estimation</h3>

      <div className="grid grid-cols-6 gap-2 p-4 bg-stone-900 rounded-lg shadow-inner">
        {[...Array(36)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: color }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 2,
              delay: (i % 6) * 0.1 + Math.floor(i / 6) * 0.1,
              repeat: Infinity
            }}
          />
        ))}
      </div>
      <p className="mt-6 text-sm text-stone-500 text-center max-w-xs">
        Processing RGB + Depth channels simultaneously to capture Z-axis movement.
      </p>
    </div>
  )
}
