import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { ChatbotWidget } from '../widgets/ChatbotWidget';
import { motion, AnimatePresence } from 'framer-motion';
import { GridScan } from '../GridScan';

export function AppLayout() {
  const location = useLocation();

  return (
    <div className="h-screen w-full flex flex-col font-sans transition-colors duration-300 overflow-hidden relative text-slate-900 dark:text-white">
      
      {/* Background layer */}
      <div className="fixed inset-0 -z-10 bg-slate-50 dark:bg-[#06080F] transition-colors duration-300">
        <div className="absolute inset-0">
          <GridScan
            sensitivity={0.55}
            lineThickness={1}
            linesColor="#2F293A"
            scanColor="#5597e6"
            scanOpacity={0.4}
            gridScale={0.1}
            lineStyle="solid"
            lineJitter={0.1}
            scanDirection="pingpong"
            noiseIntensity={0.01}
            scanGlow={0.5}
            scanSoftness={2}
            scanDuration={2}
            scanDelay={2}
            scanOnClick={false}
          />
        </div>
      </div>

      {/* Navbar flush at the top */}
      <div className="shrink-0 w-full relative z-10">
        <Navbar />
      </div>

      {/* Main App Area with gaps */}
      <div className="flex flex-1 gap-6 p-6 overflow-hidden relative">
        <main className="flex-1 overflow-y-auto w-full relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="max-w-7xl mx-auto w-full h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <ChatbotWidget />
    </div>
  );
}
