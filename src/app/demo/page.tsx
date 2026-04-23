'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Phone, 
    MessageCircle, 
    MapPin, 
    Image as ImageIcon, 
    Share2, 
    ChevronRight, 
    ArrowLeft,
    ShieldCheck,
    Star,
    UserPlus,
    Zap,
    Briefcase,
    Building2,
    CalendarCheck,
    UserCheck,
    GraduationCap,
    Palette,
    Home,
    Stethoscope,
    Utensils,
    Dumbbell,
    Scale,
    CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import ParichayLogo from '@/components/ui/ParichayLogo';

const INDUSTRY_DATA = {
    'business-owners': {
        name: "Sharma General Store",
        category: "Retail & Daily Needs",
        description: "Your one-stop shop for all household essentials, groceries, and fresh dairy products. Serving the community with trust for 20 years.",
        location: "Main Market, Sector 15, Noida",
        phoneNumber: "+91 97241 53883",
        email: "sharma.store@gmail.com",
        services: [
            { name: "Home Delivery", desc: "Free delivery within 3km" },
            { name: "Monthly Khata", desc: "Convenient billing for regulars" },
            { name: "Fresh Produce", desc: "Sourced directly from farmers" }
        ],
        gallery: [
            "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&q=80&w=400"
        ],
        color: "bg-blue-600",
        banner: "https://images.unsplash.com/photo-1534723452862-4c874e70d6f2?auto=format&fit=crop&q=80&w=800"
    },
    'freelancers-consultants': {
        name: "Aryan Sharma",
        category: "Growth Strategist",
        description: "Helping small businesses and entrepreneurs scale their digital presence through data-driven strategies and brand transformation.",
        location: "Cyber Hub, Gurugram, HR",
        phoneNumber: "+91 97241 53883",
        email: "aryan@growthstrategist.in",
        services: [
            { name: "Digital Strategy", desc: "End-to-end roadmap for online scaling" },
            { name: "Brand Positioning", desc: "Defining your unique value in the market" },
            { name: "Lead Generation", desc: "Automated systems to capture high-value clients" }
        ],
        gallery: [
            "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&q=80&w=400"
        ],
        color: "bg-purple-600",
        banner: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
    },
    'restaurants-cafes': {
        name: "The Chai Adda",
        category: "Cafe & Restaurant",
        description: "Authentic Irani Chai, hand-crafted bun maska, and the best street food in town. A place where stories brew and friendships grow.",
        location: "Colaba Causeway, Mumbai, MH",
        phoneNumber: "+91 97241 53883",
        email: "hello@chaiadda.com",
        services: [
            { name: "Dine-in Experience", desc: "Cozy atmosphere with great music" },
            { name: "Party Bookings", desc: "We host birthdays and small events" },
            { name: "Specialty Tea Bags", desc: "Take our signature blend home" }
        ],
        gallery: [
            "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1559925393-8be0ec418cd9?auto=format&fit=crop&q=80&w=400"
        ],
        color: "bg-orange-600",
        banner: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800"
    },
    'real-estate-agents': {
        name: "Prime Realty Group",
        category: "Real Estate",
        description: "Your trusted partner in finding the perfect home or investment property. Specialist in luxury residential and commercial spaces.",
        location: "Banjara Hills, Hyderabad, TS",
        phoneNumber: "+91 97241 53883",
        email: "invest@primerealty.com",
        services: [
            { name: "Property Valuation", desc: "Get accurate market price for your asset" },
            { name: "Home Loans", desc: "Tied up with major banks for fast processing" },
            { name: "Legal Documentation", desc: "Hassle-free registry and documentation" }
        ],
        gallery: [
            "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1600585154340-be6191da95b8?auto=format&fit=crop&q=80&w=400"
        ],
        color: "bg-cyan-600",
        banner: "https://images.unsplash.com/photo-1582408921715-18e7806365c1?auto=format&fit=crop&q=80&w=800"
    },
    'healthcare-professionals': {
        name: "Dr. Aditi Verma",
        category: "Healthcare / Dental",
        description: "Specializing in cosmetic dentistry and pediatric dental care. Smile with confidence and pain-free treatments.",
        location: "Koramangala 4th Block, Bengaluru",
        phoneNumber: "+91 97241 53883",
        email: "drverma@dentalcare.in",
        services: [
            { name: "Teeth Whitening", desc: "Advanced laser whitening in 30 mins" },
            { name: "Root Canal", desc: "Pain-free microscopic RCT" },
            { name: "Dental Implants", desc: "US-FDA approved materials only" }
        ],
        gallery: [
            "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=400"
        ],
        color: "bg-red-600",
        banner: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"
    },
    'fitness-wellness': {
        name: "Zen Yoga Studio",
        category: "Fitness & Wellness",
        description: "Rejuvenate your body and mind with our expert-led yoga and meditation classes. Holistic wellness for a stressful city life.",
        location: "Vasant Vihar, New Delhi, DL",
        phoneNumber: "+91 97241 53883",
        email: "namaste@zenyoga.in",
        services: [
            { name: "Hatha Yoga", desc: "Traditional yoga for all levels" },
            { name: "Corporate Wellness", desc: "Stress-relief workshops for offices" },
            { name: "Pranayama", desc: "Breathing techniques for energy" }
        ],
        gallery: [
            "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&q=80&w=400"
        ],
        color: "bg-emerald-600",
        banner: "https://images.unsplash.com/photo-1545208393-2160291ba66e?auto=format&fit=crop&q=80&w=800"
    }
};

const CATEGORIES = [
    { id: 'business-owners', name: 'Retail', icon: Briefcase },
    { id: 'freelancers-consultants', name: 'Consulting', icon: UserCheck },
    { id: 'restaurants-cafes', name: 'Dining', icon: Utensils },
    { id: 'real-estate-agents', name: 'Realty', icon: Home },
    { id: 'healthcare-professionals', name: 'Health', icon: Stethoscope },
    { id: 'fitness-wellness', name: 'Wellness', icon: Dumbbell }
];

export default function DemoPage() {
    const [selectedId, setSelectedId] = useState('freelancers-consultants');
    const data = INDUSTRY_DATA[selectedId];

    const downloadVCard = () => {
        const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${data.name}
ORG:${data.category}
TITLE:${data.category}
TEL;TYPE=CELL:${data.phoneNumber}
EMAIL:${data.email}
ADR;TYPE=WORK:;;${data.location}
URL:https://parichay.io/demo
END:VCARD`;

        const blob = new Blob([vCardData], { type: 'text/vcard' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${data.name.replace(/\s+/g, '_')}.vcf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-neutral-100 dark:bg-[#020617] flex flex-col">
            {/* Top Demo Hero Banner */}
            <div className="w-full bg-primary-600 py-12 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                <div className="relative z-10 max-w-4xl mx-auto space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
                        Experience Your <span className="italic">Digital Future</span>
                    </h1>
                    <p className="text-primary-100 text-lg font-medium max-w-2xl mx-auto">
                        Explore how different industries use Parichay to transform their customer interactions. Save a contact to see the magic.
                    </p>
                </div>
                
                {/* Floating Elements */}
                <motion.div 
                    animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className="absolute top-10 right-[10%] opacity-20 hidden md:block"
                >
                    <Smartphone className="w-32 h-32 text-white" />
                </motion.div>
            </div>

            <div className="flex flex-col lg:flex-row justify-center py-10 gap-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            {/* Desktop Navigation Sidebar (Left) */}
            <div className="hidden lg:flex flex-col gap-4 self-center w-64">
                <div className="p-6 bg-white dark:bg-neutral-900 rounded-[2rem] shadow-xl border border-neutral-200 dark:border-neutral-800">
                    <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400 mb-6 pl-2">Select Industry</h3>
                    <div className="space-y-2">
                        {CATEGORIES.map((cat) => {
                            const CatIcon = cat.icon;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedId(cat.id)}
                                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold text-sm ${selectedId === cat.id ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' : 'text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800'}`}
                                >
                                    <CatIcon className="w-5 h-5" />
                                    {cat.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
                
                <div className="p-6 bg-primary-600 rounded-[2rem] text-white space-y-4 shadow-xl shadow-primary-600/30">
                    <p className="text-xs font-black italic">Tip: Tap "SAVE TO CONTACTS" to see the vCard magic in action!</p>
                </div>
            </div>

            {/* Mobile Category Switcher (Horizontal) */}
            <div className="flex lg:hidden overflow-x-auto no-scrollbar p-6 bg-white dark:bg-[#0A0A1F] sticky top-0 z-50 border-b dark:border-neutral-800 gap-4">
                {CATEGORIES.map((cat) => {
                    const CatIconMobile = cat.icon;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedId(cat.id)}
                            className={`flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-full font-black text-xs uppercase tracking-tighter transition-all ${selectedId === cat.id ? 'bg-primary-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'}`}
                        >
                            <CatIconMobile className="w-4 h-4" />
                            {cat.name}
                        </button>
                    );
                })}
            </div>

            {/* Mobile Mockup Wrapper */}
            <div className="w-full max-w-md bg-white dark:bg-[#0A0A1F] shadow-2xl overflow-hidden relative md:rounded-[3rem] border-x-0 md:border-x-[12px] md:border-y-[12px] border-neutral-900 flex flex-col transition-all duration-500">
                
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedId}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex-1 flex flex-col"
                    >
                        {/* Header / Banner */}
                        <div className="relative h-48 sm:h-56 overflow-hidden">
                            <img 
                                src={data.banner} 
                                className="w-full h-full object-cover grayscale-[20%]" 
                                alt="Banner"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A1F] via-[#0A0A1F]/40 to-transparent"></div>
                            
                            <Link href="/" className="absolute top-6 left-6 p-2 bg-white/20 backdrop-blur-md rounded-full text-white">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-white font-black text-[10px] tracking-widest uppercase ${data.color} px-2 py-0.5 rounded-full`}>
                                        {data.category}
                                    </span>
                                    <div className="flex items-center gap-1 text-yellow-500 text-[10px] font-bold bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
                                        <Star className="w-3 h-3 fill-current" /> 4.9 VERIFIED
                                    </div>
                                </div>
                                <h1 className="text-2xl font-black text-white leading-none">{data.name}</h1>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
                            <div className="p-6 space-y-8">
                                <p className="text-neutral-500 dark:text-neutral-400 text-sm italic leading-relaxed">
                                    "{data.description}"
                                </p>

                                {/* Action Buttons */}
                                <div className="space-y-4">
                                    <motion.button 
                                        whileTap={{ scale: 0.95 }}
                                        onClick={downloadVCard}
                                        className="w-full py-5 bg-primary-600 text-white rounded-2xl font-black shadow-xl shadow-primary-500/30 flex items-center justify-center gap-3"
                                    >
                                        <UserPlus className="w-6 h-6" />
                                        SAVE CONTACT
                                    </motion.button>

                                    <div className="grid grid-cols-2 gap-4">
                                        <a href={`https://wa.me/${data.phoneNumber.replace(/\D/g, '')}`} className="flex items-center justify-center gap-2 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/20 text-xs">
                                            <MessageCircle className="w-5 h-5 fill-current" /> WHATSAPP
                                        </a>
                                        <a href={`tel:${data.phoneNumber}`} className="flex items-center justify-center gap-2 py-4 bg-slate-100 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-2xl font-bold text-xs">
                                            <Phone className="w-5 h-5" /> CALL NOW
                                        </a>
                                    </div>
                                </div>

                                {/* Identity Badge */}
                                <div className="flex items-center justify-between p-4 bg-primary-500/5 border border-primary-500/10 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-xl flex items-center justify-center text-primary-600">
                                            <ShieldCheck className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black dark:text-white leading-none">Smart Identity</h4>
                                            <p className="text-[10px] text-neutral-500 uppercase mt-1">Verified Professional</p>
                                        </div>
                                    </div>
                                    <CheckCircle2 className="w-5 h-5 text-primary-500" />
                                </div>

                                {/* Services */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black uppercase text-neutral-400 tracking-widest">Our Offerings</h4>
                                    <div className="space-y-3">
                                        {data.services.map((s, i) => (
                                            <div key={i} className="p-4 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-primary-500 transition-colors">
                                                <div>
                                                    <p className="text-sm font-bold dark:text-white">{s.name}</p>
                                                    <p className="text-[10px] text-neutral-500 mt-1">{s.desc}</p>
                                                </div>
                                                <Zap className="w-4 h-4 text-primary-500" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="p-5 bg-neutral-50 dark:bg-neutral-800/50 rounded-[2rem] flex items-start gap-4">
                                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center text-red-500">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold dark:text-white mb-1">Our Base</p>
                                        <p className="text-xs text-neutral-500">{data.location}</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-neutral-300" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Footer Branding */}
                <div className="p-6 bg-white/80 dark:bg-[#0A0A1F]/80 backdrop-blur-xl border-t dark:border-neutral-800 flex items-center justify-between z-20">
                    <div className="flex items-center gap-2">
                        <ParichayLogo size="sm" variant="icon" />
                        <div>
                            <p className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest leading-none">Powered By</p>
                            <p className="text-xs font-black text-primary-600">PARICHAY</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl text-[10px] font-black uppercase tracking-widest">
                        <Share2 className="w-3 h-3" /> SHARE
                    </button>
                </div>
            </div>

            {/* Desktop CTA Sidebar (Right) */}
            <div className="hidden xl:flex flex-col self-center max-w-sm gap-8">
                <div className="space-y-4">
                    <h2 className="text-4xl font-black dark:text-white leading-[1.1]">The smart way <br/>to <span className="text-primary-600 italic">Get Discovered.</span></h2>
                    <p className="text-neutral-500 font-medium">
                        Try different industries on the left. See how Parichay adapts to your brand colors, services, and business goals instantly.
                    </p>
                </div>
                
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 rounded-[3rem] shadow-2xl">
                    <h3 className="text-xl font-bold mb-6 dark:text-white">Why Professionals Choose Parichay</h3>
                    <div className="space-y-4">
                        {[
                            "Zero complexity setup",
                            "WhatsApp integrated leads",
                            "Universal vCard compatibility",
                            "Verified trust badge"
                        ].map((f, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm font-bold text-neutral-600 dark:text-neutral-400">
                                <CheckCircle2 className="w-5 h-5 text-primary-500" />
                                {f}
                            </div>
                        ))}
                    </div>
                    <Link href="/register" className="mt-10 block w-full py-5 bg-primary-600 text-white font-black rounded-2xl text-center shadow-xl shadow-primary-500/20 hover:scale-105 transition-transform uppercase tracking-widest">
                        CREATE YOUR CARD
                    </Link>
                </div>
            </div>
        </div>
    </div>
);
}
