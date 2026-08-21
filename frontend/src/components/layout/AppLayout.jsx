import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { ChatbotWidget } from '../widgets/ChatbotWidget';
import { motion, AnimatePresence } from 'framer-motion';

export function AppLayout() {
  const location = useLocation();

  return (
    <div className="h-screen w-full flex flex-col font-sans transition-colors duration-300 overflow-hidden bg-slate-50 dark:bg-slate-800 dark:bg-slate-950">
      
      {/* Navbar flush at the top */}
      <div className="shrink-0 w-full">
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
