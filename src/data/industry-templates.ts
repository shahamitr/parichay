import { MicrositeTemplate } from '@/types/template';
import { MicrositeConfig } from '@/types/microsite';

// Industry-specific templates with comprehensive sample content
export const industryTemplates: MicrositeTemplate[] = [
  // SALON & BEAUTY TEMPLATES
  {
    id: 'salon-luxury',
    name: 'Luxury Salon',
    description: 'Elegant template for high-end salons and beauty parlors',
    category: 'beauty',
    previewImage: '/templates/salon-luxury-preview.jpg',
    thumbnailImage: '/templates/salon-luxury-thumb.jpg',
    isPremium: false,
    features: ['Online Booking', 'Service Gallery', 'Staff Profiles', 'Price List', 'Customer Reviews'],
    defaultConfig: {
      templateId: 'salon-luxury',
      seoSettings: {
        title: 'Glamour Beauty Salon - Premium Hair & Beauty Services',
        description: 'Transform your look at Glamour Beauty Salon. Expert stylists, premium treatments, and luxury experience. Book your appointment today!',
        keywords: ['beauty salon', 'hair styling', 'facial treatments', 'manicure', 'pedicure', 'bridal makeup']
      },
      sections: {
        hero: {
          enabled: true,
          title: 'Glamour Beauty Salon',
          subtitle: 'Where Beauty Meets Excellence',
          backgroundType: 'image',
          backgroundImage: '/templates/salon-hero-bg.jpg'
        },
        about: {
          enabled: true,
          content: 'Welcome to Glamour Beauty Salon, where we believe every client deserves to look and feel their absolute best. With over 10 years of experience, our team of certified stylists and beauty experts are dedicated to providing you with personalized, luxury treatments in a relaxing and welcoming environment.'
        },
        services: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'Hair Cut & Styling',
              description: 'Professional haircuts and styling for all hair types',
              price: 1500,
              image: '/services/haircut.jpg',
              features: ['Consultation', 'Wash & Condition', 'Cut & Style', 'Finishing'],
              category: 'Hair Services'
            },
            {
              id: '2',
              name: 'Facial Treatment',
              description: 'Rejuvenating facial treatments for glowing skin',
              price: 2000,
              image: '/services/facial.jpg',
              features: ['Deep Cleansing', 'Exfoliation', 'Mask Treatment', 'Moisturizing'],
              category: 'Skin Care'
            },
            {
              id: '4',
              name: 'Bridal Package',
              description: 'Complete bridal makeover package',
              price: 15000,
              image: '/services/bridal.jpg',
              features: ['Hair Styling', 'Makeup', 'Manicure', 'Pedicure', 'Facial'],
              category: 'Special Packages'
            },
            {
              id: '5',
              name: 'Manicure & Pedicure',
              description: 'Professional nail care and styling',
              price: 1200,
              image: '/services/nails.jpg',
              features: ['Nail Shaping', 'Cuticle Care', 'Polish Application', 'Hand Massage'],
              category: 'Nail Care'
            }
          ]
        },
        gallery: {
          enabled: true,
          images: [
            '/gallery/salon-interior-1.jpg',
            '/gallery/salon-work-1.jpg',
            '/gallery/salon-work-2.jpg',
            '/gallery/salon-work-3.jpg',
            '/gallery/salon-interior-2.jpg',
            '/gallery/salon-work-4.jpg'
          ]
        },
        team: {
          enabled: true,
          title: 'Our Expert Team',
          subtitle: 'Meet our certified stylists and beauty experts',
          members: [
            {
              id: '1',
              name: 'Priya Sharma',
              role: 'Senior Hair Stylist',
              bio: '8+ years experience in hair cutting and styling',
              photo: '/team/stylist-1.jpg',
              social: {
                linkedin: 'https://linkedin.com/in/priya-sharma'
              }
            },
            {
              id: '2',
              name: 'Anjali Patel',
              role: 'Makeup Artist',
              bio: 'Certified makeup artist specializing in bridal makeup',
              photo: '/team/makeup-artist-1.jpg'
            }
          ]
        },
        testimonials: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'Sneha Gupta',
              role: 'Regular Customer',
              content: 'Amazing service! The staff is so professional and the salon has such a relaxing atmosphere. My hair has never looked better!',
              rating: 5,
              photo: '/testimonials/customer-1.jpg'
            },
            {
              id: '2',
              name: 'Ritu Mehta',
              role: 'Bride',
              content: 'They made my wedding day perfect! The bridal package was worth every penny. Highly recommend for special occasions.',
              rating: 5,
              photo: '/testimonials/customer-2.jpg'
            }
          ]
        },
        booking: {
          enabled: true,
          title: 'Book Your Appointment',
          subtitle: 'Schedule your beauty session with us'
        },
        contact: {
          enabled: true,
          showMap: true,
          leadForm: {
            enabled: true,
            fields: ['name', 'phone', 'email', 'service', 'preferred_date']
          }
        }
      }
    }
  },

  // DOCTOR/CLINIC TEMPLATES
  {
    id: 'doctor-professional',
    name: 'Medical Professional',
    description: 'Professional template for doctors and medical practitioners',
    category: 'healthcare',
    previewImage: '/templates/doctor-professional-preview.jpg',
    thumbnailImage: '/templates/doctor-professional-thumb.jpg',
    isPremium: false,
    features: ['Appointment Booking', 'Medical Services', 'Doctor Profile', 'Patient Reviews', 'Health Tips'],
    defaultConfig: {
      templateId: 'doctor-professional',
      seoSettings: {
        title: 'Dr. Rajesh Kumar - General Physician & Family Doctor',
        description: 'Experienced family doctor providing comprehensive healthcare services. Book consultation for general medicine, preventive care, and health checkups.',
        keywords: ['family doctor', 'general physician', 'medical consultation', 'health checkup', 'preventive care']
      },
      sections: {
        hero: {
          enabled: true,
          title: 'Dr. Rajesh Kumar',
          subtitle: 'MD General Medicine - Your Trusted Family Doctor',
          backgroundType: 'gradient'
        },
        about: {
          enabled: true,
          content: 'Dr. Rajesh Kumar is a highly experienced General Physician with over many years of practice in family medicine. He is committed to providing comprehensive, compassionate healthcare to patients of all ages. Dr. Kumar believes in preventive care and building long-term relationships with his patients to ensure their optimal health and well-being.'
        },
        services: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'General Consultation',
              description: 'Comprehensive medical consultation for all health concerns',
              price: 500,
              image: '/services/consultation.jpg',
              features: ['Physical Examination', 'Medical History Review', 'Diagnosis', 'Treatment Plan'],
              category: 'Primary Care'
            },
            {
              id: '2',
              name: 'Health Checkup',
              description: 'Complete health screening and preventive care',
              price: 1500,
              image: '/services/health-checkup.jpg',
              features: ['Blood Tests', 'ECG', 'Blood Pressure Check', 'Health Report'],
              category: 'Preventive Care'
            },
            {
              id: '3',
              name: 'Diabetes Management',
              description: 'Specialized care for diabetes patients',
              price: 800,
              image: '/services/diabetes.jpg',
              features: ['Blood Sugar Monitoring', 'Diet Planning', 'Medication Review', 'Lifestyle Counseling'],
              category: 'Chronic Care'
            },
            {
              id: '4',
              name: 'Hypertension Care',
              description: 'Management and monitoring of high blood pressure',
              price: 700,
              image: '/services/hypertension.jpg',
              features: ['BP Monitoring', 'Medication Adjustment', 'Lifestyle Modification', 'Regular Follow-up'],
              category: 'Chronic Care'
            }
          ]
        },
        aboutFounder: {
          enabled: true,
          name: 'Dr. Rajesh Kumar',
          title: 'MD General Medicine',
          bio: 'Dr. Rajesh Kumar completed his MBBS from AIIMS Delhi and MD in General Medicine from PGI Chandigarh. He has been practicing for over many years and has treated thousands of patients with various medical conditions.',
          education: 'MBBS - AIIMS Delhi, MD General Medicine - PGI Chandigarh',
          experience: '15+ years in General Medicine and Family Practice',
          achievements: [
            'Best Doctor Award - City Medical Association 2020',
            'Excellence in Patient Care - State Medical Council 2019',
            'Published 10+ research papers in medical journals'
          ],
          photo: '/doctors/dr-rajesh-kumar.jpg'
        },
        testimonials: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'Sunita Sharma',
              role: 'Patient',
              content: 'Dr. Kumar is an excellent doctor. He listens carefully and explains everything clearly. My diabetes is well controlled under his care.',
              rating: 5,
              photo: '/testimonials/patient-1.jpg'
            },
            {
              id: '2',
              name: 'Amit Patel',
              role: 'Patient',
              content: 'Very professional and caring doctor. The clinic is clean and well-maintained. Highly recommend for family healthcare.',
              rating: 5,
              photo: '/testimonials/patient-2.jpg'
            }
          ]
        },
        booking: {
          enabled: true,
          title: 'Book Appointment',
          subtitle: 'Schedule your consultation with Dr. Kumar'
        },
        contact: {
          enabled: true,
          showMap: true,
          leadForm: {
            enabled: true,
            fields: ['name', 'phone', 'email', 'age', 'symptoms', 'preferred_date']
          }
        }
      }
    }
  },

  // HOSPITAL TEMPLATE
  {
    id: 'hospital-comprehensive',
    name: 'Multi-Specialty Hospital',
    description: 'Comprehensive template for hospitals and medical centers',
    category: 'healthcare',
    previewImage: '/templates/hospital-comprehensive-preview.jpg',
    thumbnailImage: '/templates/hospital-comprehensive-thumb.jpg',
    isPremium: true,
    features: ['Department Listings', 'Doctor Profiles', 'Emergency Services', 'Facilities', 'Patient Portal'],
    defaultConfig: {
      templateId: 'hospital-comprehensive',
      seoSettings: {
        title: 'City Care Hospital - Multi-Specialty Healthcare Center',
        description: 'Leading multi-specialty hospital providing comprehensive healthcare services. 24/7 emergency care, advanced treatments, and experienced doctors.',
        keywords: ['hospital', 'multi-specialty', 'emergency care', 'healthcare', 'medical center', 'surgery']
      },
      sections: {
        hero: {
          enabled: true,
          title: 'City Care Hospital',
          subtitle: 'Excellence in Healthcare - Caring for Life',
          backgroundType: 'image',
          backgroundImage: '/templates/hospital-hero-bg.jpg'
        },
        about: {
          enabled: true,
          content: 'City Care Hospital is a leading multi-specialty healthcare institution committed to providing world-class medical care. With state-of-the-art facilities, advanced medical technology, and a team of highly qualified doctors, we offer comprehensive healthcare services across various specialties. Our mission is to deliver compassionate, patient-centered care while maintaining the highest standards of medical excellence.'
        },
        services: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'Emergency Services',
              description: '24/7 emergency medical care with advanced life support',
              image: '/services/emergency.jpg',
              features: ['24/7 Availability', 'Trauma Care', 'Critical Care', 'Ambulance Service'],
              category: 'Emergency'
            },
            {
              id: '2',
              name: 'Cardiology',
              description: 'Comprehensive heart care and cardiac procedures',
              image: '/services/cardiology.jpg',
              features: ['ECG', 'Echocardiography', 'Angiography', 'Cardiac Surgery'],
              category: 'Specialty'
            },
            {
              id: '3',
              name: 'Orthopedics',
              description: 'Bone and joint care with advanced surgical procedures',
              image: '/services/orthopedics.jpg',
              features: ['Joint Replacement', 'Fracture Treatment', 'Sports Medicine', 'Arthroscopy'],
              category: 'Specialty'
            },
            {
              id: '4',
              name: 'Maternity Care',
              description: 'Complete maternal and child healthcare services',
              image: '/services/maternity.jpg',
              features: ['Prenatal Care', 'Delivery Services', 'NICU', 'Postnatal Care'],
              category: 'Specialty'
            }
          ]
        },
        team: {
          enabled: true,
          title: 'Our Medical Team',
          subtitle: 'Experienced doctors and healthcare professionals',
          members: [
            {
              id: '1',
              name: 'Dr. Anil Gupta',
              role: 'Chief Cardiologist',
              bio: 'MD Cardiology, 20+ years experience in interventional cardiology',
              photo: '/team/cardiologist.jpg'
            },
            {
              id: '2',
              name: 'Dr. Meera Singh',
              role: 'Head of Emergency',
              bio: 'MD Emergency Medicine, expert in trauma and critical care',
              photo: '/team/emergency-doctor.jpg'
            }
          ]
        },
        trustIndicators: {
          enabled: true,
          certifications: [
            {
              id: '1',
              name: 'NABH Accredited',
              logo: '/certifications/nabh.jpg',
              description: 'National Accreditation Board for Hospitals'
            },
            {
              id: '2',
              name: 'ISO 9001:2015',
              logo: '/certifications/iso.jpg',
              description: 'Quality Management System Certified'
            }
          ]
        },
        contact: {
          enabled: true,
          showMap: true,
          leadForm: {
            enabled: true,
            fields: ['name', 'phone', 'email', 'department', 'message']
          }
        }
      }
    }
  },

  // AUTO GARAGE TEMPLATE
  {
    id: 'garage-professional',
    name: 'Auto Service Center',
    description: 'Professional template for auto repair shops and service centers',
    category: 'automotive',
    previewImage: '/templates/garage-professional-preview.jpg',
    thumbnailImage: '/templates/garage-professional-thumb.jpg',
    isPremium: false,
    features: ['Service Booking', 'Repair Services', 'Parts Catalog', 'Maintenance Tips', 'Customer Reviews'],
    defaultConfig: {
      templateId: 'garage-professional',
      seoSettings: {
        title: 'AutoCare Service Center - Professional Car Repair & Maintenance',
        description: 'Trusted auto service center for all car repair and maintenance needs. Expert mechanics, genuine parts, and reliable service.',
        keywords: ['auto repair', 'car service', 'vehicle maintenance', 'brake repair', 'engine service', 'oil change']
      },
      sections: {
        hero: {
          enabled: true,
          title: 'AutoCare Service Center',
          subtitle: 'Your Trusted Partner for Vehicle Care',
          backgroundType: 'image',
          backgroundImage: '/templates/garage-hero-bg.jpg'
        },
        about: {
          enabled: true,
          content: 'AutoCare Service Center has been serving the community for over 12 years with reliable and professional automotive services. Our certified mechanics use the latest diagnostic equipment and genuine parts to ensure your vehicle runs smoothly and safely. We pride ourselves on honest pricing, quality workmanship, and exceptional customer service.'
        },
        services: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'General Service',
              description: 'Complete vehicle inspection and maintenance',
              price: 2500,
              image: '/services/general-service.jpg',
              features: ['Oil Change', 'Filter Replacement', 'Brake Check', 'Battery Test'],
              category: 'Maintenance'
            },
            {
              id: '2',
              name: 'Engine Repair',
              description: 'Expert engine diagnostics and repair services',
              price: 8000,
              image: '/services/engine-repair.jpg',
              features: ['Engine Diagnostics', 'Repair Work', 'Parts Replacement', 'Performance Testing'],
              category: 'Repair'
            },
            {
              id: '3',
              name: 'Brake Service',
              description: 'Complete brake system inspection and repair',
              price: 3500,
              image: '/services/brake-service.jpg',
              features: ['Brake Pad Replacement', 'Brake Fluid Change', 'Rotor Inspection', 'Safety Check'],
              category: 'Safety'
            },
            {
              id: '4',
              name: 'AC Service',
              description: 'Air conditioning system service and repair',
              price: 2000,
              image: '/services/ac-service.jpg',
              features: ['AC Gas Refill', 'Filter Cleaning', 'Compressor Check', 'Cooling Test'],
              category: 'Comfort'
            }
          ]
        },
        gallery: {
          enabled: true,
          images: [
            '/gallery/garage-workshop.jpg',
            '/gallery/mechanic-work-1.jpg',
            '/gallery/diagnostic-equipment.jpg',
            '/gallery/parts-inventory.jpg',
            '/gallery/customer-area.jpg',
            '/gallery/mechanic-work-2.jpg'
          ]
        },
        testimonials: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'Rohit Sharma',
              role: 'Car Owner',
              content: 'Excellent service! They diagnosed the problem quickly and fixed it at a fair price. My car is running like new again.',
              rating: 5,
              photo: '/testimonials/customer-auto-1.jpg'
            },
            {
              id: '2',
              name: 'Priya Patel',
              role: 'Regular Customer',
              content: 'I trust AutoCare with all my vehicle maintenance. They are honest, reliable, and always do quality work.',
              rating: 5,
              photo: '/testimonials/customer-auto-2.jpg'
            }
          ]
        },
        contact: {
          enabled: true,
          showMap: true,
          leadForm: {
            enabled: true,
            fields: ['name', 'phone', 'email', 'vehicle_model', 'service_needed', 'preferred_date']
          }
        }
      }
    }
  },

  // GROCERY STORE TEMPLATE
  {
    id: 'grocery-modern',
    name: 'Modern Grocery Store',
    description: 'Fresh and modern template for grocery stores and supermarkets',
    category: 'retail',
    previewImage: '/templates/grocery-modern-preview.jpg',
    thumbnailImage: '/templates/grocery-modern-thumb.jpg',
    isPremium: false,
    features: ['Product Catalog', 'Online Ordering', 'Delivery Info', 'Fresh Deals', 'Store Locations'],
    defaultConfig: {
      templateId: 'grocery-modern',
      seoSettings: {
        title: 'Fresh Mart Grocery - Quality Groceries & Fresh Produce',
        description: 'Your neighborhood grocery store offering fresh produce, quality groceries, and everyday essentials. Home delivery available.',
        keywords: ['grocery store', 'fresh produce', 'vegetables', 'fruits', 'home delivery', 'supermarket']
      },
      sections: {
        hero: {
          enabled: true,
          title: 'Fresh Mart Grocery',
          subtitle: 'Fresh. Quality. Convenience.',
          backgroundType: 'image',
          backgroundImage: '/templates/grocery-hero-bg.jpg'
        },
        about: {
          enabled: true,
          content: 'Fresh Mart Grocery has been serving the community for over 8 years with the freshest produce and quality groceries. We source directly from local farmers and trusted suppliers to bring you the best products at competitive prices. Our commitment to freshness, quality, and customer satisfaction makes us your preferred neighborhood grocery store.'
        },
        services: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'Fresh Vegetables',
              description: 'Farm-fresh vegetables delivered daily',
              image: '/products/vegetables.jpg',
              features: ['Daily Fresh Stock', 'Organic Options', 'Local Sourcing', 'Quality Guarantee'],
              category: 'Fresh Produce'
            },
            {
              id: '2',
              name: 'Fresh Fruits',
              description: 'Seasonal fruits and exotic varieties',
              image: '/products/fruits.jpg',
              features: ['Seasonal Selection', 'Imported Fruits', 'Ripeness Guarantee', 'Bulk Orders'],
              category: 'Fresh Produce'
            },
            {
              id: '3',
              name: 'Dairy Products',
              description: 'Fresh milk, cheese, and dairy essentials',
              image: '/products/dairy.jpg',
              features: ['Daily Fresh Milk', 'Branded Products', 'Organic Options', 'Home Delivery'],
              category: 'Dairy'
            },
            {
              id: '4',
              name: 'Home Delivery',
              description: 'Convenient home delivery service',
              image: '/services/delivery.jpg',
              features: ['Same Day Delivery', 'Free Delivery Above ₹500', 'Scheduled Delivery', 'Fresh Guarantee'],
              category: 'Services'
            }
          ]
        },
        offers: {
          enabled: true,
          offers: [
            {
              id: '1',
              title: 'Fresh Produce Special',
              description: '20% off on all fresh vegetables and fruits',
              discountType: 'percentage',
              discountValue: 20,
              validFrom: '2024-01-01',
              validUntil: '2024-12-31',
              isActive: true,
              featured: true,
              imageUrl: '/offers/fresh-produce.jpg'
            },
            {
              id: '2',
              title: 'Free Home Delivery',
              description: 'Free delivery on orders above ₹500',
              discountType: 'free_shipping',
              validFrom: '2024-01-01',
              validUntil: '2024-12-31',
              isActive: true,
              featured: true,
              imageUrl: '/offers/free-delivery.jpg'
            }
          ]
        },
        contact: {
          enabled: true,
          showMap: true,
          leadForm: {
            enabled: true,
            fields: ['name', 'phone', 'email', 'address', 'delivery_preference']
          }
        }
      }
    }
  },

  // EV SHOWROOM TEMPLATE
  {
    id: 'ev-showroom-modern',
    name: 'Electric Vehicle Showroom',
    description: 'Cutting-edge template for electric vehicle dealerships',
    category: 'automotive',
    previewImage: '/templates/ev-showroom-preview.jpg',
    thumbnailImage: '/templates/ev-showroom-thumb.jpg',
    isPremium: true,
    features: ['Vehicle Catalog', 'Test Drive Booking', 'Charging Solutions', 'Finance Options', 'Service Support'],
    defaultConfig: {
      templateId: 'ev-showroom-modern',
      seoSettings: {
        title: 'EcoMotors - Premium Electric Vehicle Showroom',
        description: 'Discover the future of mobility with our premium electric vehicles. Test drives, financing, and charging solutions available.',
        keywords: ['electric vehicles', 'EV showroom', 'electric cars', 'sustainable mobility', 'test drive', 'EV charging']
      },
      sections: {
        hero: {
          enabled: true,
          title: 'EcoMotors',
          subtitle: 'Drive the Future - Go Electric',
          backgroundType: 'image',
          backgroundImage: '/templates/ev-showroom-hero-bg.jpg'
        },
        about: {
          enabled: true,
          content: 'EcoMotors is your premier destination for electric vehicles, representing the future of sustainable transportation. We offer a comprehensive range of electric cars, bikes, and commercial vehicles from leading manufacturers. Our expert team provides personalized consultation, test drives, financing solutions, and complete after-sales support to make your transition to electric mobility seamless and rewarding.'
        },
        services: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'Electric Cars',
              description: 'Premium electric cars with latest technology',
              image: '/vehicles/electric-cars.jpg',
              features: ['Long Range Battery', 'Fast Charging', 'Smart Features', 'Warranty Support'],
              category: 'Vehicles'
            },
            {
              id: '2',
              name: 'Electric Bikes',
              description: 'Eco-friendly electric two-wheelers',
              image: '/vehicles/electric-bikes.jpg',
              features: ['Lightweight Design', 'Quick Charging', 'Smart Connectivity', 'Low Maintenance'],
              category: 'Vehicles'
            },
            {
              id: '3',
              name: 'Charging Solutions',
              description: 'Home and commercial charging installations',
              image: '/services/charging-station.jpg',
              features: ['Home Charger Installation', 'Fast Charging Stations', 'Smart Charging', '24/7 Support'],
              category: 'Services'
            },
            {
              id: '4',
              name: 'Finance & Insurance',
              description: 'Easy financing and comprehensive insurance',
              image: '/services/finance.jpg',
              features: ['Low Interest Rates', 'Quick Approval', 'Comprehensive Insurance', 'Extended Warranty'],
              category: 'Services'
            }
          ]
        },
        portfolio: {
          enabled: true,
          layout: 'grid',
          items: [
            {
              id: '1',
              title: 'Tesla Model 3',
              description: 'Premium electric sedan with autopilot',
              category: 'Electric Cars',
              images: ['/portfolio/tesla-model-3.jpg'],
              featured: true,
              tags: ['Tesla', 'Sedan', 'Autopilot', 'Long Range']
            },
            {
              id: '2',
              title: 'Ather 450X',
              description: 'Smart electric scooter with connected features',
              category: 'Electric Bikes',
              images: ['/portfolio/ather-450x.jpg'],
              featured: true,
              tags: ['Ather', 'Scooter', 'Smart', 'Connected']
            }
          ],
          categories: ['Electric Cars', 'Electric Bikes', 'Commercial Vehicles']
        },
        testimonials: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'Arjun Mehta',
              role: 'Tesla Owner',
              content: 'Amazing experience at EcoMotors! The team was knowledgeable and helped me choose the perfect electric car. Love my Tesla!',
              rating: 5,
              photo: '/testimonials/ev-customer-1.jpg'
            },
            {
              id: '2',
              name: 'Kavya Singh',
              role: 'Ather Customer',
              content: 'Great service and support. My electric scooter is fantastic and the charging network is very convenient.',
              rating: 5,
              photo: '/testimonials/ev-customer-2.jpg'
            }
          ]
        },
        booking: {
          enabled: true,
          title: 'Book Test Drive',
          subtitle: 'Experience the future of mobility'
        },
        contact: {
          enabled: true,
          showMap: true,
          leadForm: {
            enabled: true,
            fields: ['name', 'phone', 'email', 'vehicle_interest', 'budget_range', 'preferred_date']
          }
        }
      }
    }
  },

  // FITNESS GYM TEMPLATE
  {
    id: 'gym-fitness-pro',
    name: 'Fitness Pro Gym',
    description: 'Dynamic template for gyms and fitness centers',
    category: 'fitness',
    previewImage: '/templates/gym-fitness-preview.jpg',
    thumbnailImage: '/templates/gym-fitness-thumb.jpg',
    isPremium: false,
    features: ['Membership Plans', 'Class Schedules', 'Trainer Profiles', 'Equipment Gallery', 'Progress Tracking'],
    defaultConfig: {
      templateId: 'gym-fitness-pro',
      seoSettings: {
        title: 'PowerFit Gym - Premium Fitness Center & Personal Training',
        description: 'Transform your body at PowerFit Gym. Modern equipment, expert trainers, group classes, and personalized fitness programs.',
        keywords: ['gym', 'fitness center', 'personal training', 'weight loss', 'muscle building', 'group classes']
      },
      sections: {
        hero: {
          enabled: true,
          title: 'PowerFit Gym',
          subtitle: 'Transform Your Body, Transform Your Life',
          backgroundType: 'image',
          backgroundImage: '/templates/gym-hero-bg.jpg'
        },
        about: {
          enabled: true,
          content: 'PowerFit Gym is a state-of-the-art fitness center dedicated to helping you achieve your health and fitness goals. With modern equipment, experienced trainers, and a variety of programs, we provide everything you need for a complete fitness transformation. Whether you\'re a beginner or an advanced athlete, our supportive community and expert guidance will help you reach your potential.'
        },
        services: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'Personal Training',
              description: 'One-on-one training with certified fitness experts',
              price: 2000,
              image: '/services/personal-training.jpg',
              features: ['Customized Workout Plan', 'Nutrition Guidance', 'Progress Tracking', 'Flexible Scheduling'],
              category: 'Training'
            },
            {
              id: '2',
              name: 'Group Classes',
              description: 'High-energy group fitness classes',
              price: 1200,
              image: '/services/group-classes.jpg',
              features: ['Zumba', 'Yoga', 'CrossFit', 'Aerobics'],
              category: 'Classes'
            },
            {
              id: '3',
              name: 'Weight Training',
              description: 'Complete weight training with modern equipment',
              price: 1500,
              image: '/services/weight-training.jpg',
              features: ['Free Weights', 'Machines', 'Functional Training', 'Strength Building'],
              category: 'Training'
            },
            {
              id: '4',
              name: 'Cardio Workouts',
              description: 'Cardiovascular training for endurance and fat loss',
              price: 1000,
              image: '/services/cardio.jpg',
              features: ['Treadmills', 'Ellipticals', 'Cycling', 'HIIT Training'],
              category: 'Cardio'
            }
          ]
        },
        team: {
          enabled: true,
          title: 'Our Expert Trainers',
          subtitle: 'Certified fitness professionals to guide your journey',
          members: [
            {
              id: '1',
              name: 'Vikram Singh',
              role: 'Head Trainer',
              bio: 'Certified personal trainer with 8+ years experience in strength training',
              photo: '/team/trainer-1.jpg'
            },
            {
              id: '2',
              name: 'Neha Sharma',
              role: 'Yoga Instructor',
              bio: 'Certified yoga instructor specializing in Hatha and Vinyasa yoga',
              photo: '/team/trainer-2.jpg'
            }
          ]
        },
        offers: {
          enabled: true,
          offers: [
            {
              id: '1',
              title: 'New Member Special',
              description: '50% off on first month membership',
              discountType: 'percentage',
              discountValue: 50,
              validFrom: '2024-01-01',
              validUntil: '2024-12-31',
              isActive: true,
              featured: true,
              imageUrl: '/offers/new-member.jpg'
            }
          ]
        },
        contact: {
          enabled: true,
          showMap: true,
          leadForm: {
            enabled: true,
            fields: ['name', 'phone', 'email', 'fitness_goal', 'experience_level', 'preferred_time']
          }
        }
      }
    }
  },

  // RESTAURANT TEMPLATE
  {
    id: 'restaurant-deluxe',
    name: 'Deluxe Restaurant',
    description: 'Elegant template for restaurants and dining establishments',
    category: 'restaurant',
    previewImage: '/templates/restaurant-deluxe-preview.jpg',
    thumbnailImage: '/templates/restaurant-deluxe-thumb.jpg',
    isPremium: false,
    features: ['Menu Display', 'Online Reservations', 'Food Gallery', 'Chef Profiles', 'Customer Reviews'],
    defaultConfig: {
      templateId: 'restaurant-deluxe',
      seoSettings: {
        title: 'Spice Garden Restaurant - Authentic Indian Cuisine & Fine Dining',
        description: 'Experience authentic Indian flavors at Spice Garden Restaurant. Fresh ingredients, traditional recipes, and exceptional dining experience.',
        keywords: ['restaurant', 'Indian cuisine', 'fine dining', 'authentic food', 'table reservation', 'food delivery']
      },
      sections: {
        hero: {
          enabled: true,
          title: 'Spice Garden Restaurant',
          subtitle: 'Authentic Flavors, Memorable Experiences',
          backgroundType: 'image',
          backgroundImage: '/templates/restaurant-hero-bg.jpg'
        },
        about: {
          enabled: true,
          content: 'Spice Garden Restaurant brings you the authentic taste of India with a modern dining experience. Our master chefs use traditional recipes passed down through generations, combined with the freshest ingredients to create culinary masterpieces. From aromatic biryanis to rich curries, every dish tells a story of India\'s rich culinary heritage.'
        },
        services: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'North Indian Cuisine',
              description: 'Rich and flavorful dishes from North India',
              image: '/menu/north-indian.jpg',
              features: ['Butter Chicken', 'Dal Makhani', 'Naan Varieties', 'Tandoori Items'],
              category: 'Main Course'
            },
            {
              id: '2',
              name: 'South Indian Delicacies',
              description: 'Authentic South Indian flavors and specialties',
              image: '/menu/south-indian.jpg',
              features: ['Dosa Varieties', 'Sambar', 'Coconut Chutney', 'Filter Coffee'],
              category: 'Regional'
            },
            {
              id: '3',
              name: 'Biryani Special',
              description: 'Aromatic basmati rice with tender meat and spices',
              price: 350,
              image: '/menu/biryani.jpg',
              features: ['Hyderabadi Biryani', 'Lucknowi Biryani', 'Vegetable Biryani', 'Raita & Shorba'],
              category: 'Signature'
            },
            {
              id: '4',
              name: 'Desserts',
              description: 'Traditional Indian sweets and desserts',
              image: '/menu/desserts.jpg',
              features: ['Gulab Jamun', 'Ras Malai', 'Kulfi', 'Gajar Halwa'],
              category: 'Desserts'
            }
          ]
        },
        gallery: {
          enabled: true,
          images: [
            '/gallery/restaurant-interior.jpg',
            '/gallery/food-1.jpg',
            '/gallery/food-2.jpg',
            '/gallery/chef-cooking.jpg',
            '/gallery/dining-area.jpg',
            '/gallery/food-3.jpg'
          ]
        },
        testimonials: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'Rajesh Gupta',
              role: 'Food Lover',
              content: 'Absolutely amazing food! The biryani was perfectly cooked and the service was excellent. Will definitely come back!',
              rating: 5,
              photo: '/testimonials/restaurant-customer-1.jpg'
            },
            {
              id: '2',
              name: 'Priya Sharma',
              role: 'Regular Customer',
              content: 'My family\'s favorite restaurant. The authentic flavors and warm hospitality make every visit special.',
              rating: 5,
              photo: '/testimonials/restaurant-customer-2.jpg'
            }
          ]
        },
        booking: {
          enabled: true,
          title: 'Reserve Your Table',
          subtitle: 'Book a table for an unforgettable dining experience'
        },
        contact: {
          enabled: true,
          showMap: true,
          leadForm: {
            enabled: true,
            fields: ['name', 'phone', 'email', 'party_size', 'preferred_date', 'special_requests']
          }
        }
      }
    }
  }
];

// Helper functions for template management
export function getTemplatesByCategory(category: string) {
  return industryTemplates.filter(template => template.category === category);
}

export function getTemplateById(id: string) {
  return industryTemplates.find(template => template.id === id);
}

export function getFreeTemplates() {
  return industryTemplates.filter(template => !template.isPremium);
}

export function getPremiumTemplates() {
  return industryTemplates.filter(template => template.isPremium);
}

// Template categories with descriptions
export const templateCategories = [
  {
    id: 'beauty',
    name: 'Beauty & Salon',
    description: 'Templates for salons, spas, and beauty services',
    icon: '💄',
    count: industryTemplates.filter(t => t.category === 'beauty').length
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Templates for doctors, clinics, and hospitals',
    icon: '🏥',
    count: industryTemplates.filter(t => t.category === 'healthcare').length
  },
  {
    id: 'automotive',
    name: 'Automotive',
    description: 'Templates for auto services and vehicle showrooms',
    icon: '🚗',
    count: industryTemplates.filter(t => t.category === 'automotive').length
  },
  {
    id: 'retail',
    name: 'Retail & Grocery',
    description: 'Templates for stores and retail businesses',
    icon: '🛒',
    count: industryTemplates.filter(t => t.category === 'retail').length
  },
  {
    id: 'fitness',
    name: 'Fitness & Gym',
    description: 'Templates for gyms and fitness centers',
    icon: '💪',
    count: industryTemplates.filter(t => t.category === 'fitness').length
  },
  {
    id: 'restaurant',
    name: 'Restaurant & Food',
    description: 'Templates for restaurants and food services',
    icon: '🍽️',
    count: industryTemplates.filter(t => t.category === 'restaurant').length
  }
];