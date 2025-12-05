/**
 * Translations for Parichay (परिचय)
 * Multi-language support with Hindi as primary Indian language
 */

export type Language = 'en' | 'hi';

export const translations = {
  en: {
    // Common
    common: {
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      search: 'Search',
      filter: 'Filter',
      submit: 'Submit',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      close: 'Close',
      yes: 'Yes',
      no: 'No',
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Info',
    },

    // Navigation
    nav: {
      home: 'Home',
      dashboard: 'Dashboard',
      brands: 'Brands',
      branches: 'Branches',
      leads: 'Leads',
      analytics: 'Analytics',
      settings: 'Settings',
      profile: 'Profile',
      logout: 'Logout',
      login: 'Login',
      register: 'Register',
    },

    // Landing Page
    landing: {
      hero: {
        title: 'Your Digital Introduction',
        subtitle: 'Create stunning digital business cards and microsites in minutes',
        cta: 'Get Started Free',
        watchDemo: 'Watch Demo',
      },
      features: {
        title: 'Why Choose Parichay?',
        subtitle: 'Everything you need to make a lasting first impression',
        qrCode: 'QR Code Generation',
        qrCodeDesc: 'Generate beautiful QR codes for instant sharing',
        analytics: 'Real-time Analytics',
        analyticsDesc: 'Track views, leads, and engagement',
        customization: 'Full Customization',
        customizationDesc: 'Match your brand colors and style',
        leads: 'Lead Capture',
        leadsDesc: 'Collect and manage leads effortlessly',
      },
      pricing: {
        title: 'Simple, Transparent Pricing',
        subtitle: 'Choose the plan that fits your needs',
        monthly: 'Monthly',
        yearly: 'Yearly',
        savePercent: 'Save 17%',
        getStarted: 'Get Started',
        currentPlan: 'Current Plan',
        popular: 'Most Popular',
      },
    },

    // Dashboard
    dashboard: {
      welcome: 'Welcome back',
      overview: 'Overview',
      recentActivity: 'Recent Activity',
      quickActions: 'Quick Actions',
      stats: {
        pageViews: 'Page Views',
        qrScans: 'QR Scans',
        leads: 'New Leads',
        conversionRate: 'Conversion Rate',
      },
    },

    // Microsite
    microsite: {
      sections: {
        about: 'About Us',
        services: 'Our Services',
        gallery: 'Gallery',
        contact: 'Contact Us',
        reviews: 'Customer Reviews',
        payment: 'Payment Options',
      },
      contact: {
        sendMessage: 'Send us a Message',
        name: 'Your Name',
        email: 'Email Address',
        phone: 'Phone Number',
        message: 'Your Message',
        submit: 'Send Message',
        thankYou: 'Thank you for your message!',
      },
      reviews: {
        title: 'Customer Reviews',
        writeReview: 'Write a Review',
        rating: 'Rating',
        yourReview: 'Your Review',
        submitReview: 'Submit Review',
        thankYou: 'Thank you for your feedback!',
      },
    },

    // Payment
    payment: {
      title: 'Complete Payment',
      selectMethod: 'Select Payment Method',
      cardUpiNetbanking: 'Card / UPI / Netbanking',
      directUpi: 'Direct UPI',
      enterUpiId: 'Enter Your UPI ID',
      total: 'Total',
      pay: 'Pay',
      processing: 'Processing...',
      success: 'Payment Successful!',
      failed: 'Payment Failed',
      tryAgain: 'Try Again',
      scanQr: 'Scan this QR code with any UPI app',
      enterUtr: 'Enter UTR/Transaction ID',
      verify: 'Verify Payment',
    },

    // Auth
    auth: {
      login: {
        title: 'Welcome Back',
        subtitle: 'Sign in to your account',
        email: 'Email Address',
        password: 'Password',
        rememberMe: 'Remember me',
        forgotPassword: 'Forgot password?',
        signIn: 'Sign In',
        noAccount: "Don't have an account?",
        signUp: 'Sign up',
      },
      register: {
        title: 'Create Account',
        subtitle: 'Start your digital journey',
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email Address',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        agreeTerms: 'I agree to the Terms of Service',
        signUp: 'Create Account',
        haveAccount: 'Already have an account?',
        signIn: 'Sign in',
      },
    },
  },

  hi: {
    // Common - Hindi
    common: {
      loading: 'लोड हो रहा है...',
      save: 'सहेजें',
      cancel: 'रद्द करें',
      delete: 'हटाएं',
      edit: 'संपादित करें',
      create: 'बनाएं',
      search: 'खोजें',
      filter: 'फ़िल्टर',
      submit: 'जमा करें',
      back: 'वापस',
      next: 'अगला',
      previous: 'पिछला',
      close: 'बंद करें',
      yes: 'हाँ',
      no: 'नहीं',
      success: 'सफल',
      error: 'त्रुटि',
      warning: 'चेतावनी',
      info: 'जानकारी',
    },

    // Navigation - Hindi
    nav: {
      home: 'होम',
      dashboard: 'डैशबोर्ड',
      brands: 'ब्रांड',
      branches: 'शाखाएं',
      leads: 'लीड्स',
      analytics: 'एनालिटिक्स',
      settings: 'सेटिंग्स',
      profile: 'प्रोफ़ाइल',
      logout: 'लॉग आउट',
      login: 'लॉग इन',
      register: 'रजिस्टर',
    },

    // Landing Page - Hindi
    landing: {
      hero: {
        title: 'आपका डिजिटल परिचय',
        subtitle: 'मिनटों में शानदार डिजिटल बिज़नेस कार्ड और माइक्रोसाइट बनाएं',
        cta: 'मुफ्त शुरू करें',
        watchDemo: 'डेमो देखें',
      },
      features: {
        title: 'परिचय क्यों चुनें?',
        subtitle: 'पहली छाप को यादगार बनाने के लिए सब कुछ',
        qrCode: 'QR कोड जनरेशन',
        qrCodeDesc: 'तुरंत शेयरिंग के लिए सुंदर QR कोड बनाएं',
        analytics: 'रियल-टाइम एनालिटिक्स',
        analyticsDesc: 'व्यूज, लीड्स और एंगेजमेंट ट्रैक करें',
        customization: 'पूर्ण कस्टमाइज़ेशन',
        customizationDesc: 'अपने ब्रांड के रंग और स्टाइल से मैच करें',
        leads: 'लीड कैप्चर',
        leadsDesc: 'आसानी से लीड्स इकट्ठा और मैनेज करें',
      },
      pricing: {
        title: 'सरल, पारदर्शी मूल्य निर्धारण',
        subtitle: 'अपनी ज़रूरत के अनुसार प्लान चुनें',
        monthly: 'मासिक',
        yearly: 'वार्षिक',
        savePercent: '17% बचाएं',
        getStarted: 'शुरू करें',
        currentPlan: 'वर्तमान प्लान',
        popular: 'सबसे लोकप्रिय',
      },
    },

    // Dashboard - Hindi
    dashboard: {
      welcome: 'वापस स्वागत है',
      overview: 'अवलोकन',
      recentActivity: 'हाल की गतिविधि',
      quickActions: 'त्वरित कार्य',
      stats: {
        pageViews: 'पेज व्यूज',
        qrScans: 'QR स्कैन',
        leads: 'नई लीड्स',
        conversionRate: 'कन्वर्जन रेट',
      },
    },

    // Microsite - Hindi
    microsite: {
      sections: {
        about: 'हमारे बारे में',
        services: 'हमारी सेवाएं',
        gallery: 'गैलरी',
        contact: 'संपर्क करें',
        reviews: 'ग्राहक समीक्षाएं',
        payment: 'भुगतान विकल्प',
      },
      contact: {
        sendMessage: 'हमें संदेश भेजें',
        name: 'आपका नाम',
        email: 'ईमेल पता',
        phone: 'फ़ोन नंबर',
        message: 'आपका संदेश',
        submit: 'संदेश भेजें',
        thankYou: 'आपके संदेश के लिए धन्यवाद!',
      },
      reviews: {
        title: 'ग्राहक समीक्षाएं',
        writeReview: 'समीक्षा लिखें',
        rating: 'रेटिंग',
        yourReview: 'आपकी समीक्षा',
        submitReview: 'समीक्षा जमा करें',
        thankYou: 'आपकी प्रतिक्रिया के लिए धन्यवाद!',
      },
    },

    // Payment - Hindi
    payment: {
      title: 'भुगतान पूरा करें',
      selectMethod: 'भुगतान विधि चुनें',
      cardUpiNetbanking: 'कार्ड / UPI / नेटबैंकिंग',
      directUpi: 'डायरेक्ट UPI',
      enterUpiId: 'अपना UPI ID दर्ज करें',
      total: 'कुल',
      pay: 'भुगतान करें',
      processing: 'प्रोसेसिंग...',
      success: 'भुगतान सफल!',
      failed: 'भुगतान विफल',
      tryAgain: 'पुनः प्रयास करें',
      scanQr: 'किसी भी UPI ऐप से इस QR कोड को स्कैन करें',
      enterUtr: 'UTR/ट्रांजैक्शन ID दर्ज करें',
      verify: 'भुगतान सत्यापित करें',
    },

    // Auth - Hindi
    auth: {
      login: {
        title: 'वापस स्वागत है',
        subtitle: 'अपने खाते में साइन इन करें',
        email: 'ईमेल पता',
        password: 'पासवर्ड',
        rememberMe: 'मुझे याद रखें',
        forgotPassword: 'पासवर्ड भूल गए?',
        signIn: 'साइन इन',
        noAccount: 'खाता नहीं है?',
        signUp: 'साइन अप करें',
      },
      register: {
        title: 'खाता बनाएं',
        subtitle: 'अपनी डिजिटल यात्रा शुरू करें',
        firstName: 'पहला नाम',
        lastName: 'अंतिम नाम',
        email: 'ईमेल पता',
        password: 'पासवर्ड',
        confirmPassword: 'पासवर्ड की पुष्टि करें',
        agreeTerms: 'मैं सेवा की शर्तों से सहमत हूं',
        signUp: 'खाता बनाएं',
        haveAccount: 'पहले से खाता है?',
        signIn: 'साइन इन करें',
      },
    },
  },
};

export type TranslationKeys = typeof translations.en;
