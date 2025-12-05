'use client';

import { useState } from 'react';
import { Menu, X, Home, Info, Briefcase, Image, Phone } from 'lucide-react';

export default function QuickSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element != null) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 right-4 z-50 bg-brand-primary text-white p-3 rounded-full shadow-lg hover:bg-brand-secondary transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-40 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 pt-20">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Navigation</h3>

          <nav className="space-y-2">
            <button
              onClick={() => scrollToSection('hero')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>

            <button
              onClick={() => scrollToSection('about')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Info className="w-5 h-5" />
              <span>About</span>
            </button>

            <button
              onClick={() => scrollToSection('services')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Briefcase className="w-5 h-5" />
              <span>Services</span>
            </button>

            <button
              onClick={() => scrollToSection('gallery')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Image className="w-5 h-5" />
              <span>Gallery</span>
            </button>

            <button
              onClick={() => scrollToSection('contact')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span>Contact</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
        />
      )}
    </>
  );
}
