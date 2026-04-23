'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Phone, Mail, Send, Clock, MapPin } from 'lucide-react';
import { MessagingSection as MessagingConfig } from '@/types/microsite';

interface MessagingSectionProps {
  config: MessagingConfig;
  branchData: any;
}

export default function MessagingSection({ config, branchData }: MessagingSectionProps) {
  const [isBusinessOpen, setIsBusinessOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (config.businessHours.enabled) {
      checkBusinessHours();
    }
  }, [currentTime, config.businessHours]);

  const checkBusinessHours = () => {
    const now = new Date();
    const dayName = now.toLocaleLowerCase().substring(0, 3); // mon, tue, etc.
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeMinutes = currentHour * 60 + currentMinute;

    const todaySchedule = config.businessHours.schedule[dayName];

    if (!todaySchedule || todaySchedule.closed) {
      setIsBusinessOpen(false);
      return;
    }

    const [openHour, openMinute] = todaySchedule.open.split(':').map(Number);
    const [closeHour, closeMinute] = todaySchedule.close.split(':').map(Number);

    const openTimeMinutes = openHour * 60 + openMinute;
    const closeTimeMinutes = closeHour * 60 + closeMinute;

    setIsBusinessOpen(currentTimeMinutes >= openTimeMinutes && currentTimeMinutes <= closeTimeMinutes);
  };

  const handleWhatsAppClick = () => {
    if (config.channels.whatsapp.enabled && config.channels.whatsapp.number) {
      const message = encodeURIComponent(config.channels.whatsapp.welcomeMessage);
      const whatsappUrl = `https://wa.me/${config.channels.whatsapp.number.replace(/[^0-9]/g, '')}?text=${message}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handlePhoneClick = () => {
    if (config.channels.phone.enabled && config.channels.phone.number) {
      window.location.href = `tel:${config.channels.phone.number}`;
    }
  };

  const handleEmailClick = () => {
    if (config.channels.email.enabled && config.channels.email.address) {
      window.location.href = `mailto:${config.channels.email.address}`;
    }
  };

  if (!config.enabled) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Get in Touch
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Choose your preferred way to connect with us
          </p>

          {config.businessHours.enabled && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 shadow-sm">
              <Clock className="w-4 h-4" />
              <span className={`text-sm font-medium ${isBusinessOpen ? 'text-green-600' : 'text-red-600'}`}>
                {isBusinessOpen ? 'Open Now' : 'Closed'}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {/* WhatsApp */}
          {config.channels.whatsapp.enabled && (
            <button
              onClick={handleWhatsAppClick}
              className="group p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-500 group-hover:text-white transition-colors">
                  <MessageCircle className="w-6 h-6 text-green-600 group-hover:text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">WhatsApp</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {config.channels.whatsapp.number}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Quick response
                </p>
              </div>
            </button>
          )}

          {/* Phone */}
          {config.channels.phone.enabled && (
            <button
              onClick={handlePhoneClick}
              className="group p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Phone className="w-6 h-6 text-blue-600 group-hover:text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Call Us</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {config.channels.phone.number}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Direct line
                </p>
              </div>
            </button>
          )}

          {/* Email */}
          {config.channels.email.enabled && (
            <button
              onClick={handleEmailClick}
              className="group p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-400"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                  <Mail className="w-6 h-6 text-purple-600 group-hover:text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Email</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {config.channels.email.address}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Detailed inquiries
                </p>
              </div>
            </button>
          )}

          {/* Live Chat */}
          {config.channels.livechat.enabled && (
            <button
              className="group p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-400"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <Send className="w-6 h-6 text-orange-600 group-hover:text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Live Chat</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {isBusinessOpen ? 'Online now' : 'Leave a message'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Instant support
                </p>
              </div>
            </button>
          )}
        </div>

        {/* Business Hours */}
        {config.businessHours.enabled && (
          <div className="mt-12 max-w-md mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Business Hours
              </h3>
              <div className="space-y-2">
                {Object.entries(config.businessHours.schedule).map(([day, schedule]) => (
                  <div key={day} className="flex justify-between items-center text-sm">
                    <span className="capitalize text-gray-600 dark:text-gray-300">{day}</span>
                    <span className="text-gray-900 dark:text-white">
                      {schedule.closed ? 'Closed' : `${schedule.open} - ${schedule.close}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Auto Responses Info */}
        {config.autoResponses.enabled && config.autoResponses.responses.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              💡 Try asking about: {config.autoResponses.responses.slice(0, 3).map(r => r.trigger).join(', ')}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}