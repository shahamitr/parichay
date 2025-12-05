// Festival-based theming system for microsites

export interface Festival {
  id: string;
  name: string;
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
    startDate: '12-25', // Start from Christmas
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
    startDate: '10-20', // Approximate - adjust yearly
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
    startDate: '03-01', // Approximate - adjust yearly
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
    startDate: '04-01', // Approximate - adjust yearly based on lunar calendar
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
    startDate: '08-01', // Approximate - adjust yearly
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
