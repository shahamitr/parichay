// Festival-based theming system for microsites

export interface Festival {
  id: string;
  name: string;
  emoji: string; // Main emoji for the festival
  greeting: string; // Greeting message
  dateRange: string; // Human-readable date range
  startDate: string; // MM-DD format
  endDate: string; // MM-DD format
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  banner: {
    text: string;
    emoji: string;
    gradient: string;
  };
  effects: {
    confetti?: boolean;
    fireworks?: boolean;
    snow?: boolean;
    sparkles?: boolean;
  };
}

export const festivals: Festival[] = [
  {
    id: 'new-year',
    name: 'New Year',
    emoji: '🎉',
    greeting: 'Happy New Year! Wishing you a prosperous year ahead!',
    dateRange: 'Dec 25 - Jan 7',
    startDate: '12-25',
    endDate: '01-07',
    colors: {
      primary: '#FFD700',
      secondary: '#FF6B6B',
      accent: '#4ECDC4',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    banner: {
      text: '🎊 Happy New Year! Special offers inside 🎊',
      emoji: '🎉',
      gradient: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    },
    effects: {
      confetti: true,
      fireworks: true,
    },
  },
  {
    id: 'diwali',
    name: 'Diwali',
    emoji: '🪔',
    greeting: 'Happy Diwali! May this festival of lights bring you joy and prosperity!',
    dateRange: 'Oct 20 - Nov 5',
    startDate: '10-20',
    endDate: '11-05',
    colors: {
      primary: '#FF6B35',
      secondary: '#F7931E',
      accent: '#FDC830',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    banner: {
      text: '🪔 Happy Diwali! Wishing you prosperity 🪔',
      emoji: '🪔',
      gradient: 'linear-gradient(90deg, #FF6B35 0%, #F7931E 50%, #FDC830 100%)',
    },
    effects: {
      sparkles: true,
      fireworks: true,
    },
  },
  {
    id: 'christmas',
    name: 'Christmas',
    emoji: '🎄',
    greeting: 'Merry Christmas! Wishing you joy and happiness!',
    dateRange: 'Dec 15 - Dec 26',
    startDate: '12-15',
    endDate: '12-26',
    colors: {
      primary: '#C41E3A',
      secondary: '#165B33',
      accent: '#FFD700',
      background: 'linear-gradient(135deg, #C41E3A 0%, #165B33 100%)',
    },
    banner: {
      text: '🎄 Merry Christmas! Season\'s Greetings 🎄',
      emoji: '🎅',
      gradient: 'linear-gradient(90deg, #C41E3A 0%, #165B33 100%)',
    },
    effects: {
      snow: true,
    },
  },
  {
    id: 'holi',
    name: 'Holi',
    emoji: '🎨',
    greeting: 'Happy Holi! May your life be filled with colors of joy!',
    dateRange: 'Mar 1 - Mar 15',
    startDate: '03-01',
    endDate: '03-15',
    colors: {
      primary: '#FF1493',
      secondary: '#00CED1',
      accent: '#FFD700',
      background: 'linear-gradient(135deg, #FF1493 0%, #00CED1 50%, #FFD700 100%)',
    },
    banner: {
      text: '🎨 Happy Holi! Colors of joy 🎨',
      emoji: '🎨',
      gradient: 'linear-gradient(90deg, #FF1493 0%, #00CED1 50%, #FFD700 100%)',
    },
    effects: {
      confetti: true,
      sparkles: true,
    },
  },
  {
    id: 'independence-day',
    name: 'Independence Day',
    emoji: '🇮🇳',
    greeting: 'Happy Independence Day! Jai Hind!',
    dateRange: 'Aug 10 - Aug 16',
    startDate: '08-10',
    endDate: '08-16',
    colors: {
      primary: '#FF9933',
      secondary: '#FFFFFF',
      accent: '#138808',
      background: 'linear-gradient(135deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)',
    },
    banner: {
      text: '🇮🇳 Happy Independence Day! Jai Hind 🇮🇳',
      emoji: '🇮🇳',
      gradient: 'linear-gradient(90deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)',
    },
    effects: {
      confetti: true,
    },
  },
  {
    id: 'valentines',
    name: "Valentine's Day",
    emoji: '❤️',
    greeting: 'Happy Valentine\'s Day! Spread the love!',
    dateRange: 'Feb 10 - Feb 15',
    startDate: '02-10',
    endDate: '02-15',
    colors: {
      primary: '#FF1493',
      secondary: '#FF69B4',
      accent: '#FFB6C1',
      background: 'linear-gradient(135deg, #FF1493 0%, #FF69B4 100%)',
    },
    banner: {
      text: '💝 Happy Valentine\'s Day! Spread the love 💝',
      emoji: '❤️',
      gradient: 'linear-gradient(90deg, #FF1493 0%, #FF69B4 100%)',
    },
    effects: {
      sparkles: true,
    },
  },
  {
    id: 'eid',
    name: 'Eid',
    emoji: '🌙',
    greeting: 'Eid Mubarak! May this day bring blessings and joy!',
    dateRange: 'Varies (Lunar)',
    startDate: '04-01',
    endDate: '04-10',
    colors: {
      primary: '#00A86B',
      secondary: '#FFD700',
      accent: '#FFFFFF',
      background: 'linear-gradient(135deg, #00A86B 0%, #FFD700 100%)',
    },
    banner: {
      text: '🌙 Eid Mubarak! Blessings and joy 🌙',
      emoji: '🌙',
      gradient: 'linear-gradient(90deg, #00A86B 0%, #FFD700 100%)',
    },
    effects: {
      sparkles: true,
    },
  },
  {
    id: 'raksha-bandhan',
    name: 'Raksha Bandhan',
    emoji: '🎀',
    greeting: 'Happy Raksha Bandhan! Celebrate the bond of love!',
    dateRange: 'Aug 1 - Aug 10',
    startDate: '08-01',
    endDate: '08-10',
    colors: {
      primary: '#FF6B9D',
      secondary: '#C44569',
      accent: '#FFD700',
      background: 'linear-gradient(135deg, #FF6B9D 0%, #C44569 100%)',
    },
    banner: {
      text: '🎀 Happy Raksha Bandhan! Bond of love 🎀',
      emoji: '🎀',
      gradient: 'linear-gradient(90deg, #FF6B9D 0%, #C44569 100%)',
    },
    effects: {
      sparkles: true,
    },
  },
  {
    id: 'republic-day',
    name: 'Republic Day',
    emoji: '🇮🇳',
    greeting: 'Happy Republic Day! Jai Hind!',
    dateRange: 'Jan 23 - Jan 27',
    startDate: '01-23',
    endDate: '01-27',
    colors: {
      primary: '#FF9933',
      secondary: '#FFFFFF',
      accent: '#138808',
      background: 'linear-gradient(135deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)',
    },
    banner: {
      text: '🇮🇳 Happy Republic Day! Jai Hind 🇮🇳',
      emoji: '🇮🇳',
      gradient: 'linear-gradient(90deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)',
    },
    effects: {
      confetti: true,
    },
  },
  {
    id: 'womens-day',
    name: "Women's Day",
    emoji: '👩',
    greeting: 'Happy Women\'s Day! Celebrating women everywhere!',
    dateRange: 'Mar 6 - Mar 9',
    startDate: '03-06',
    endDate: '03-09',
    colors: {
      primary: '#FF69B4',
      secondary: '#9932CC',
      accent: '#FFD700',
      background: 'linear-gradient(135deg, #FF69B4 0%, #9932CC 100%)',
    },
    banner: {
      text: '👩 Happy Women\'s Day! Celebrating women everywhere 👩',
      emoji: '👩',
      gradient: 'linear-gradient(90deg, #FF69B4 0%, #9932CC 100%)',
    },
    effects: {
      sparkles: true,
    },
  },
  {
    id: 'mens-day',
    name: "Men's Day",
    emoji: '👨',
    greeting: 'Happy Men\'s Day! Celebrating men everywhere!',
    dateRange: 'Nov 17 - Nov 20',
    startDate: '11-17',
    endDate: '11-20',
    colors: {
      primary: '#1E90FF',
      secondary: '#4169E1',
      accent: '#FFD700',
      background: 'linear-gradient(135deg, #1E90FF 0%, #4169E1 100%)',
    },
    banner: {
      text: '👨 Happy Men\'s Day! Celebrating men everywhere 👨',
      emoji: '👨',
      gradient: 'linear-gradient(90deg, #1E90FF 0%, #4169E1 100%)',
    },
    effects: {
      confetti: true,
    },
  },
  {
    id: 'mothers-day',
    name: "Mother's Day",
    emoji: '💐',
    greeting: 'Happy Mother\'s Day! Thank you Mom!',
    dateRange: 'May 10 - May 14',
    startDate: '05-10',
    endDate: '05-14',
    colors: {
      primary: '#FF69B4',
      secondary: '#FFB6C1',
      accent: '#FFD700',
      background: 'linear-gradient(135deg, #FF69B4 0%, #FFB6C1 100%)',
    },
    banner: {
      text: '👩‍👧 Happy Mother\'s Day! Thank you Mom 💐',
      emoji: '💐',
      gradient: 'linear-gradient(90deg, #FF69B4 0%, #FFB6C1 100%)',
    },
    effects: {
      sparkles: true,
    },
  },
  {
    id: 'fathers-day',
    name: "Father's Day",
    emoji: '👔',
    greeting: 'Happy Father\'s Day! Thank you Dad!',
    dateRange: 'Jun 14 - Jun 18',
    startDate: '06-14',
    endDate: '06-18',
    colors: {
      primary: '#4169E1',
      secondary: '#6495ED',
      accent: '#FFD700',
      background: 'linear-gradient(135deg, #4169E1 0%, #6495ED 100%)',
    },
    banner: {
      text: '👨‍👧 Happy Father\'s Day! Thank you Dad 🎩',
      emoji: '👔',
      gradient: 'linear-gradient(90deg, #4169E1 0%, #6495ED 100%)',
    },
    effects: {
      confetti: true,
    },
  },
  {
    id: 'ganesh-chaturthi',
    name: 'Ganesh Chaturthi',
    emoji: '🙏',
    greeting: 'Ganpati Bappa Morya! Happy Ganesh Chaturthi!',
    dateRange: 'Sep 1 - Sep 12',
    startDate: '09-01',
    endDate: '09-12',
    colors: {
      primary: '#FF6B35',
      secondary: '#FFD700',
      accent: '#8B0000',
      background: 'linear-gradient(135deg, #FF6B35 0%, #FFD700 100%)',
    },
    banner: {
      text: '🙏 Ganpati Bappa Morya! Happy Ganesh Chaturthi 🙏',
      emoji: '🙏',
      gradient: 'linear-gradient(90deg, #FF6B35 0%, #FFD700 100%)',
    },
    effects: {
      sparkles: true,
    },
  },
  {
    id: 'navratri',
    name: 'Navratri',
    emoji: '🕉️',
    greeting: 'Happy Navratri! Jai Mata Di!',
    dateRange: 'Sep 25 - Oct 5',
    startDate: '09-25',
    endDate: '10-05',
    colors: {
      primary: '#FF1493',
      secondary: '#FFD700',
      accent: '#9932CC',
      background: 'linear-gradient(135deg, #FF1493 0%, #9932CC 100%)',
    },
    banner: {
      text: '🕉️ Happy Navratri! Jai Mata Di 🕉️',
      emoji: '🕉️',
      gradient: 'linear-gradient(90deg, #FF1493 0%, #FFD700 50%, #9932CC 100%)',
    },
    effects: {
      sparkles: true,
    },
  },
  {
    id: 'onam',
    name: 'Onam',
    emoji: '🌸',
    greeting: 'Happy Onam! Onashamsakal!',
    dateRange: 'Aug 20 - Aug 31',
    startDate: '08-20',
    endDate: '08-31',
    colors: {
      primary: '#FFD700',
      secondary: '#FF6B00',
      accent: '#228B22',
      background: 'linear-gradient(135deg, #FFD700 0%, #FF6B00 100%)',
    },
    banner: {
      text: '🌸 Happy Onam! Onashamsakal 🌸',
      emoji: '🌸',
      gradient: 'linear-gradient(90deg, #FFD700 0%, #FF6B00 100%)',
    },
    effects: {
      sparkles: true,
    },
  },
  {
    id: 'pongal',
    name: 'Pongal',
    emoji: '🌾',
    greeting: 'Happy Pongal! Pongalo Pongal!',
    dateRange: 'Jan 13 - Jan 16',
    startDate: '01-13',
    endDate: '01-16',
    colors: {
      primary: '#FF6B00',
      secondary: '#FFD700',
      accent: '#228B22',
      background: 'linear-gradient(135deg, #FF6B00 0%, #FFD700 100%)',
    },
    banner: {
      text: '🌾 Happy Pongal! Pongalo Pongal 🌾',
      emoji: '🌾',
      gradient: 'linear-gradient(90deg, #FF6B00 0%, #FFD700 100%)',
    },
    effects: {
      sparkles: true,
    },
  },
];

export function getCurrentFestival(): Festival | null {
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1-12
  const currentDay = now.getDate();
  const currentDate = `${currentMonth.toString().padStart(2, '0')}-${currentDay.toString().padStart(2, '0')}`;

  for (const festival of festivals) {
    const [startMonth, startDay] = festival.startDate.split('-').map(Number);
    const [endMonth, endDay] = festival.endDate.split('-').map(Number);

    // Handle year-crossing festivals (e.g., New Year)
    if (startMonth > endMonth) {
      // Festival crosses year boundary
      if (
        (currentMonth === startMonth && currentDay >= startDay) ||
        (currentMonth > startMonth) ||
        (currentMonth < endMonth) ||
        (currentMonth === endMonth && currentDay <= endDay)
      ) {
        return festival;
      }
    } else {
      // Normal festival within same year
      if (
        (currentMonth > startMonth || (currentMonth === startMonth && currentDay >= startDay)) &&
        (currentMonth < endMonth || (currentMonth === endMonth && currentDay <= endDay))
      ) {
        return festival;
      }
    }
  }

  return null;
}

export function getFestivalByDate(date: Date): Festival | null {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dateStr = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

  for (const festival of festivals) {
    const [startMonth, startDay] = festival.startDate.split('-').map(Number);
    const [endMonth, endDay] = festival.endDate.split('-').map(Number);

    if (startMonth > endMonth) {
      if (
        (month === startMonth && day >= startDay) ||
        (month > startMonth) ||
        (month < endMonth) ||
        (month === endMonth && day <= endDay)
      ) {
        return festival;
      }
    } else {
      if (
        (month > startMonth || (month === startMonth && day >= startDay)) &&
        (month < endMonth || (month === endMonth && day <= endDay))
      ) {
        return festival;
      }
    }
  }

  return null;
}

export function isFestivalActive(festivalId: string): boolean {
  const current = getCurrentFestival();
  return current?.id === festivalId;
}

/**
 * Festival settings for brand-level configuration
 */
export interface FestivalSettings {
  enabled: boolean;
  festivalId: string;
  customMessage?: string;
  customBannerUrl?: string;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  position: 'header' | 'floating' | 'overlay' | 'border';
  showEffects: boolean;
}

/**
 * Get festival by ID
 */
export function getFestivalById(festivalId: string): Festival | null {
  return festivals.find((f) => f.id === festivalId) || null;
}

/**
 * Check if brand festival settings are currently active
 */
export function isBrandFestivalActive(settings: FestivalSettings | null | undefined): boolean {
  if (!settings?.enabled) return false;

  const now = new Date();

  // If custom dates are set, use those
  if (settings.startDate && settings.endDate) {
    // Create date objects and set time to midnight for accurate date comparison
    const start = new Date(settings.startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(settings.endDate);
    end.setHours(23, 59, 59, 999); // End of the end date

    return now >= start && now <= end;
  }

  // Otherwise, check if the selected festival is currently active by its global definition
  return isFestivalActive(settings.festivalId);
}

/**
 * Get all festival options for dropdown selection
 */
export function getFestivalOptions(): { value: string; label: string; emoji: string }[] {
  return festivals.map((f) => ({
    value: f.id,
    label: f.name,
    emoji: f.banner.emoji,
  }));
}
