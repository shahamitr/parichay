import { NextRequest, NextResponse } from 'next/server';

// Mock AI-generated content templates
const contentTemplates = {
  headline: [
    "Transform Your Business with Professional Digital Solutions",
    "Elevate Your Brand to New Heights",
    "Where Innovation Meets Excellence",
    "Your Success Story Starts Here",
    "Redefining Industry Standards",
    "Experience the Future of Business",
    "Unleash Your Business Potential",
    "Creating Tomorrow's Solutions Today"
  ],
  about: [
    "We are a forward-thinking company dedicated to delivering exceptional results for our clients. With years of experience and a passion for innovation, we transform challenges into opportunities and help businesses thrive in today's competitive landscape.",
    "Our mission is to provide world-class services that exceed expectations. We combine cutting-edge technology with personalized attention to create solutions that drive growth and success for every client we serve.",
    "Founded on principles of excellence and integrity, we have built a reputation for delivering outstanding results. Our team of experts brings together diverse skills and experience to tackle complex challenges and create lasting value.",
    "We believe in the power of collaboration and innovation to transform businesses. Our comprehensive approach ensures that every project receives the attention and expertise it deserves, resulting in solutions that make a real difference."
  ],
  service: [
    "Our comprehensive service offering is designed to meet your unique needs and exceed your expectations. We combine industry expertise with innovative approaches and methodologies and commitment to excellence ensure that every project is completed to the highest standards."
  ],
  product: [
    "Introducing our flagship product - a game-changing solution designed to revolutionize your workflow. Built with cutting-edge technology and user-centric design, it delivers unparalleled performance and reliability.",
    "Experience innovation at its finest with our premium product line. Each item is carefully crafted to meet the highest quality standards while providing exceptional value and functionality.",
    "Our latest product represents years of research and development, resulting in a solution that perfectly balances performance, durability, and user experience. Discover what sets us apart.",
    "Engineered for excellence, our products combine advanced features with intuitive design. Whether you're a professional or enthusiast, you'll appreciate the attention to detail and superior craftsmanship."
  ],
  tagline: [
    "Excellence in Every Detail",
    "Innovation That Inspires",
    "Where Quality Meets Performance",
    "Crafting Tomorrow's Solutions",
    "Beyond Expectations",
    "Precision. Performance. Perfection.",
    "Elevating Standards",
    "Your Vision, Our Expertise"
  ],
  cta: [
    "Get Started Today - Transform Your Business Now",
    "Contact Us for a Free Consultation",
    "Discover What We Can Do for You",
    "Take the Next Step Towards Success",
    "Schedule Your Personalized Demo",
    "Join professionals and businesses",
    "Unlock Your Business Potential",
    "Experience the Difference Today"
  ]
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, context, tone = 'professional', count = 3 } = body;

    if (!type || !contentTemplates[type as keyof typeof contentTemplates]) {
      return NextResponse.json(
        { success: false, error: 'Invalid content type. Supported types: headline, about, service, product, tagline, cta' },
        { status: 400 }
      );
    }

    const templates = contentTemplates[type as keyof typeof contentTemplates];

    // In a real app, you would use an AI service like OpenAI
    // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    // const prompt = `Generate ${count} ${tone} ${type} content pieces for a business. Context: ${context}`;
    // const response = await openai.chat.completions.create({
    //   model: "gpt-3.5-turbo",
    //   messages: [{ role: "user", content: prompt }],
    //   max_tokens: 500,
    //   temperature: 0.7
    // });

    // For demo, customize templates based on context and tone
    let selectedTemplates = [...templates];

    // Shuffle and select requested count
    selectedTemplates = selectedTemplates
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(count, templates.length));

    // Customize based on tone
    if (tone === 'friendly') {
      selectedTemplates = selectedTemplates.map(template =>
        template.replace(/We are/g, "We're")
               .replace(/professional/g, "friendly")
               .replace(/excellence/g, "amazing results")
      );
    } else if (tone === 'witty') {
      selectedTemplates = selectedTemplates.map(template =>
        template.replace(/Transform/g, "Revolutionize")
               .replace(/professional/g, "game-changing")
               .replace(/solutions/g, "magic")
      );
    }

    // Add context if provided
    if (context && context.trim()) {
      selectedTemplates = selectedTemplates.map(template => {
        if (type === 'about' || type === 'service') {
          return template.replace(/business/g, context.toLowerCase());
        }
        return template;
      });
    }

    return NextResponse.json({
      success: true,
      content: selectedTemplates,
      metadata: {
        type,
        tone,
        context,
        count: selectedTemplates.length,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Failed to generate content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}