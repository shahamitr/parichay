
interface AIContentGenerationParams {
    businessName: string;
    businessType: string;
    highlights: string[];
    tone: 'professional' | 'friendly' | 'luxury' | 'minimalist';
}

interface GeneratedContent {
    hero: {
        title: string;
        subtitle: string;
    };
    about: {
        content: string;
    };
    services: Array<{
        name: string;
        description: string;
        price?: number;
    }>;
}

export class AIService {
    static async generateContent(params: AIContentGenerationParams): Promise<GeneratedContent> {
        // In a real implementation, this would call OpenAI or Gemini API
        // For now, we'll use a sophisticated template-based generator

        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API latency

        const { businessName, businessType, tone } = params;
        const type = businessType.toLowerCase();

        // Tone modifiers
        const tonePrefix = tone === 'professional' ? 'Trusted' :
            tone === 'luxury' ? 'Premium' :
                tone === 'friendly' ? 'Your Neighborhood' : 'Simple';

        let content: GeneratedContent = {
            hero: {
                title: `Welcome to ${businessName}`,
                subtitle: `${tonePrefix} ${businessType} Solutions`,
            },
            about: {
                content: `At ${businessName}, we are dedicated to providing top-tier ${businessType} services. Our mission is to deliver excellence and value to our customers.`,
            },
            services: [],
        };

        // Industry-specific templates
        if (type.includes('coffee') || type.includes('cafe')) {
            content.hero.title = `Experience the Best Coffee at ${businessName}`;
            content.hero.subtitle = "Brewing moments of joy, one cup at a time.";
            content.about.content = `Welcome to ${businessName}, where passion meets the bean. We source the finest grains from around the world to bring you an unforgettable coffee experience. Whether you're here for a quick espresso or a relaxing afternoon, we promise perfection in every sip.`;
            content.services = [
                { name: "Signature Espresso", description: "Rich, bold, and perfectly extracted.", price: 150 },
                { name: "Cappuccino", description: "Creamy, frothy, and delightful.", price: 180 },
                { name: "Artisan Pastries", description: "Freshly baked goods to pair with your brew.", price: 120 },
            ];
        } else if (type.includes('tech') || type.includes('software') || type.includes('it')) {
            content.hero.title = `Innovating the Future with ${businessName}`;
            content.hero.subtitle = "Cutting-edge technology solutions for modern businesses.";
            content.about.content = `${businessName} is at the forefront of digital transformation. We help businesses scale, optimize, and succeed through custom software solutions and strategic IT consulting.`;
            content.services = [
                { name: "Custom Software Development", description: "Tailored solutions to meet your unique business needs.", price: 50000 },
                { name: "Cloud Migration", description: "Seamless transition to secure cloud infrastructure.", price: 30000 },
                { name: "IT Consulting", description: "Strategic advice to optimize your technology stack.", price: 15000 },
            ];
        } else if (type.includes('consulting') || type.includes('finance') || type.includes('legal')) {
            content.hero.title = `Expert Guidance from ${businessName}`;
            content.hero.subtitle = "Empowering your decisions with professional expertise.";
            content.about.content = `At ${businessName}, we believe in building long-term partnerships. Our team of seasoned experts provides the insights and strategies you need to navigate complex challenges and achieve your goals.`;
            content.services = [
                { name: "Strategic Planning", description: "Comprehensive roadmaps for sustainable growth.", price: 25000 },
                { name: "Risk Management", description: "Identify and mitigate potential business risks.", price: 20000 },
                { name: "Financial Advisory", description: "Expert advice on optimizing your financial health.", price: 18000 },
            ];
        } else if (type.includes('gym') || type.includes('fitness') || type.includes('yoga')) {
            content.hero.title = `Transform Your Life at ${businessName}`;
            content.hero.subtitle = "Your journey to a healthier, stronger you starts here.";
            content.about.content = `${businessName} is more than just a gym; it's a community. We provide state-of-the-art equipment, expert trainers, and a supportive environment to help you crush your fitness goals.`;
            content.services = [
                { name: "Personal Training", description: "One-on-one coaching tailored to your goals.", price: 1500 },
                { name: "Group Classes", description: "High-energy classes to keep you motivated.", price: 500 },
                { name: "Nutrition Planning", description: "Customized meal plans for optimal performance.", price: 1000 },
            ];
        } else if (type.includes('restaurant') || type.includes('food')) {
            content.hero.title = `Taste the Difference at ${businessName}`;
            content.hero.subtitle = "Culinary excellence in every bite.";
            content.about.content = `Welcome to ${businessName}. Our chefs use only the freshest, locally sourced ingredients to create dishes that delight the senses. Join us for an unforgettable dining experience.`;
            content.services = [
                { name: "Chef's Special", description: "A curated selection of our finest dishes.", price: 800 },
                { name: "Catering Services", description: "Bring our delicious food to your next event.", price: 5000 },
                { name: "Private Dining", description: "Exclusive space for intimate gatherings.", price: 2000 },
            ];
        }

        // Apply tone adjustments
        if (tone === 'friendly') {
            content.hero.subtitle = content.hero.subtitle.replace('Cutting-edge', 'Awesome').replace('Expert', 'Helpful');
        } else if (tone === 'luxury') {
            content.hero.subtitle = `Exclusive. Elegant. ${businessName}.`;
        }

        return content;
    }
}
