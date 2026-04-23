/**
 * Translations for Parichay (परिचय)
 * Multi-language support with Hindi as primary Indian language
 */

export type Language = 'en' | 'hi' | 'gu';

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
        title: 'Put Your Business on the Digital Map',
        subtitle: 'Turn every interaction into a lasting customer connection. No website. No complexity.',
        cta: 'Get Your Digital Presence',
        watchDemo: 'See How It Works',
      },
      problem: {
        title: 'Before vs After',
        before: {
          lostCards: 'Lost paper cards',
          noFollowups: 'No follow-ups',
          forgotten: 'Customers forget you',
          invisible: 'No online visibility',
        },
        after: {
          instantShare: 'Instant digital sharing',
          leadCapture: 'Leads captured automatically',
          reachable: 'Always reachable',
          repeatBusiness: 'Repeat business',
        }
      },
      transformation: {
        title: 'From Invisible to Discoverable in Minutes',
        step1: 'Create profile',
        step2: 'Share link / QR',
        step3: 'Capture & convert leads',
      },
      outcomes: {
        neverLose: 'Never lose a customer after meeting them',
        turnConvo: 'Turn conversations into repeat business',
        reachable: 'Be reachable anytime, anywhere',
        identity: 'Build your digital identity instantly',
      },
      loss: {
        title: 'See What You’re Losing Without Digital Presence',
        droppingLeads: 'Dropping leads',
        brokenConnections: 'Broken connections',
        fadingNodes: 'Fading nodes',
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
      finalCta: {
        title: 'Ready to Be Seen by More Customers?',
        startFree: 'Start Free',
        bookDemo: 'Book Demo',
      }
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
        title: 'अपने व्यवसाय को डिजिटल परिचय दें',
        subtitle: 'हर मीटिंग को लीड में बदलें। बिना वेबसाइट, बिना किसी जटिलता के।',
        cta: 'अपनी डिजिटल उपस्थिति प्राप्त करें',
        watchDemo: 'डेमो देखें',
      },
      problem: {
        title: 'पहले और बाद में',
        before: {
          invisible: 'कोई डिजिटल उपस्थिति नहीं',
          lostCards: 'खोए हुए कागज़ के कार्ड',
          noFollowups: 'कोई फॉलो-अप नहीं',
          forgotten: 'ग्राहक आपको भूल जाते हैं',
        },
        after: {
          instantShare: 'त्वरित डिजिटल शेयरिंग',
          leadCapture: 'लीड अपने आप कैप्चर होती है',
          reachable: 'हमेशा संपर्क योग्य',
          repeatBusiness: 'बार-बार व्यापार',
        }
      },
      transformation: {
        title: 'मिनटों में अदृश्य से दृश्यमान तक',
        step1: 'प्रोफ़ाइल बनाएं',
        step2: 'लिંક / QR साझा करें',
        step3: 'लीड कैप्चर और कन्वर्ट करें',
      },
      outcomes: {
        neverLose: 'मिलने के बाद कभी ग्राहक न खोएं',
        turnConvo: 'बातचीत को व्यापार में बदलें',
        reachable: 'कहीं भी, कभी भी संपर्क योग्य रहें',
        identity: 'अपनी डिजिटल पहचान तुरंत बनाएं',
      },
      loss: {
        title: 'देखें कि डिजिटल उपस्थिति के बिना आप क्या खो रहे हैं',
        droppingLeads: 'लीड्स खोना',
        brokenConnections: 'टूटे हुए कनेक्शन',
        fadingNodes: 'धुंधली पड़ती पहचान',
      },
      pricing: {
        title: 'सरल, पारदर्शी मूल्य निर्धारण',
        subtitle: 'वह प्लान चुनें जो आपकी आवश्यकताओं के अनुरूप हो',
        monthly: 'मासिक',
        yearly: 'वार्षिक',
        savePercent: '17% बचाएं',
        getStarted: 'शुरू करें',
        currentPlan: 'वर्तमान प्लान',
        popular: 'सबसे लोकप्रिय',
      },
      finalCta: {
        title: 'क्या आप और अधिक ग्राहकों तक पहुँचने के लिए तैयार हैं?',
        startFree: 'मुफ्त शुरू करें',
        bookDemo: 'डेमो बुक करें',
      }
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
        rating: 'रेटિંગ',
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

  gu: {
    // Common - Gujarati
    common: {
      loading: 'લોડ થઈ રહ્યું છે...',
      save: 'સાચવો',
      cancel: 'રદ કરો',
      delete: 'ડિલીટ કરો',
      edit: 'ફેરફાર કરો',
      create: 'બનાવો',
      search: 'શોધો',
      filter: 'ફિલ્ટર',
      submit: 'સબમિટ કરો',
      back: 'પાછા',
      next: 'આગળ',
      previous: 'પાછળ',
      close: 'બંધ કરો',
      yes: 'હા',
      no: 'ના',
      success: 'સફળ',
      error: 'ભૂલ',
      warning: 'ચેતવણી',
      info: 'માહિતી',
    },

    // Navigation - Gujarati
    nav: {
      home: 'હોમ',
      dashboard: 'ડેશબોર્ડ',
      brands: 'બ્રાન્ડ્સ',
      branches: 'શાખાઓ',
      leads: 'લીડ્સ',
      analytics: 'એનાલિટિક્સ',
      settings: 'સેટિંગ્સ',
      profile: 'પ્રોફાઇલ',
      logout: 'લોગ આઉટ',
      login: 'લોગ ઇન',
      register: 'રજિસ્ટર',
    },

    // Landing Page - Gujarati
    landing: {
      hero: {
        title: 'તમારા વ્યાપારને ડિજિટલ નકશા પર મૂકો',
        subtitle: 'દરેક વાતચીતને કાયમી ગ્રાહક જોડાણમાં બદલો. કોઈ વેબસાઇટ નહીં. કોઈ જટિલતા નહીં.',
        cta: 'તમારી ડિજિટલ હાજરી મેળવો',
        watchDemo: 'તે કેવી રીતે કાર્ય કરે છે તે જુઓ',
      },
      problem: {
        title: 'પહેલા અને પછી',
        before: {
          lostCards: 'ખોવાયેલા કાગળના કાર્ડ્સ',
          noFollowups: 'કોઈ ફોલો-અપ્સ નહીં',
          forgotten: 'ગ્રાહકો તમને ભૂલી જાય છે',
          invisible: 'કોઈ ઓનલાઇન વિઝિબિલિટી નથી',
        },
        after: {
          instantShare: 'ત્વરિત ડિજિટલ શેરિંગ',
          leadCapture: 'લીડ્સ આપમેળે કેપ્ચર',
          reachable: 'હંમેશા સંપર્ક કરી શકાય તેવું',
          repeatBusiness: 'વારંવાર વ્યવસાય',
        }
      },
      transformation: {
        title: 'મિનિટોમાં અદ્રશ્યથી શોધવા યોગ્ય સુધી',
        step1: 'પ્રોફાઇલ બનાવો',
        step2: 'લિંક / QR શેર કરો',
        step3: 'લીડ્સ કેપ્ચર અને કન્વર્ટ કરો',
      },
      outcomes: {
        neverLose: 'મળ્યા પછી ક્યારેય ગ્રાહક ગુમાવશો નહીં',
        turnConvo: 'વાતચીતને વારંવાર વ્યવસાયમાં ફેરવો',
        reachable: 'ગમે ત્યારે, ગમે ત્યાં સંપર્ક કરી શકાય તેવું રહો',
        identity: 'તમારી ડિજિટલ ઓળખ તરત જ બનાવો',
      },
      loss: {
        title: 'જુઓ કે ડિજિટલ હાજરી વિના તમે શું ગુમાવી રહ્યા છો',
        droppingLeads: 'લીડ્સ ગુમાવવી',
        brokenConnections: 'તૂટેલા જોડાણો',
        fadingNodes: 'ઝાંખા પડતા નોડ્સ',
      },
      pricing: {
        title: 'સરલ, પારદર્શક કિંમત',
        subtitle: 'તમારી જરૂરિયાતોને અનુરૂપ પ્લાન પસંદ કરો',
        monthly: 'માસિક',
        yearly: 'વાર્ષિક',
        savePercent: '17% બચાવો',
        getStarted: 'શરૂ કરો',
        currentPlan: 'વર્તમાન પ્લાન',
        popular: 'સૌથી લોકપ્રિય',
      },
      finalCta: {
        title: 'શું તમે વધુ ગ્રાહકો દ્વારા જોવામાં આવવા માટે તૈયાર છો?',
        startFree: 'મફત શરૂ કરો',
        bookDemo: 'ડેમો બુક કરો',
      }
    },

    // Dashboard - Gujarati
    dashboard: {
      welcome: 'પાછા સ્વાગત છે',
      overview: 'ઝાંખી',
      recentActivity: 'તાજેતરની પ્રવૃત્તિ',
      quickActions: 'ઝડપી કાર્યો',
      stats: {
        pageViews: 'પેજ વ્યુઝ',
        qrScans: 'QR સ્કેન',
        leads: 'નવી લીડ્સ',
        conversionRate: 'કન્વર્ઝન રેટ',
      },
    },

    // Microsite - Gujarati
    microsite: {
      sections: {
        about: 'અમારા વિશે',
        services: 'અમારી સેવાઓ',
        gallery: 'ગેલેરી',
        contact: 'અમારો સંપર્ક કરો',
        reviews: 'ગ્રાહક સમીક્ષાઓ',
        payment: 'ચુકવણી વિકલ્પો',
      },
      contact: {
        sendMessage: 'અમને સંદેશ મોકલો',
        name: 'તમારું નામ',
        email: 'ઈમેલ સરનામું',
        phone: 'ફોન નંબર',
        message: 'તમારો સંદેશ',
        submit: 'સંદેશ મોકલો',
        thankYou: 'તમારા સંદેશ બદલ આભાર!',
      },
      reviews: {
        title: 'ગ્રાહક સમીક્ષાઓ',
        writeReview: 'સમીક્ષા લખો',
        rating: 'રેટિંગ',
        yourReview: 'તમારી સમીક્ષા',
        submitReview: 'સમીક્ષા સબમિટ કરો',
        thankYou: 'તમારા પ્રતિસાદ બદલ આભાર!',
      },
    },

    // Auth - Gujarati
    auth: {
      login: {
        title: 'પાછા સ્વાગત છે',
        subtitle: 'તમારા ખાતામાં સાઇન ઇન કરો',
        email: 'ઈમેલ સરનામું',
        password: 'પાસવર્ડ',
        rememberMe: 'મને યાદ રાખો',
        forgotPassword: 'પાસવર્ડ ભૂલી ગયા છો?',
        signIn: 'સાઇન ઇન',
        noAccount: 'ખાતું નથી?',
        signUp: 'સાઇન અપ કરો',
      },
      register: {
        title: 'ખાતું બનાવો',
        subtitle: 'તમારી ડિજિટલ મુસાફરી શરૂ કરો',
        firstName: 'પ્રથમ નામ',
        lastName: 'અટક',
        email: 'ઈમેલ સરનામું',
        password: 'પાસવર્ડ',
        confirmPassword: 'પાસવર્ડની પુષ્ટિ કરો',
        agreeTerms: 'હું સેવાની શરતો સાથે સંમત છું',
        signUp: 'ખાતું બનાવો',
        haveAccount: 'પહેલેથી ખાતું છે?',
        signIn: 'સાઇન ઇન કરો',
      },
    },
  },
};

export type TranslationKeys = typeof translations.en;
