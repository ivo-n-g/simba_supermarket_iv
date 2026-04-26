const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export interface GroqResponse {
  answer: string;
  productIds: number[];
}

export const conversationalSearch = async (query: string, products: any[], language: string): Promise<GroqResponse> => {
  if (!GROQ_API_KEY) {
    console.error('Groq API Key missing in environment variables');
    return { 
      answer: 'AI Search is currently unavailable. Please ensure VITE_GROQ_API_KEY is set.', 
      productIds: [] 
    };
  }

  // Simplify product data to save tokens and provide better context
  const contextProducts = products.map(p => ({
    id: p.id,
    name: p[`name_${language}`] || p.name,
    category: p[`category_${language}`] || p.category,
    price: p.price
  })).slice(0, 150); 

  const prompt = `
    You are the Simba Supermarket AI Assistant. 
    Current Language: ${language}
    User Query: "${query}"
    
    Catalog (JSON): ${JSON.stringify(contextProducts)}

    Instructions:
    1. Analyze if any products in the catalog match the user's intent.
    2. Create a friendly response in ${language === 'rw' ? 'Kinyarwanda' : language === 'fr' ? 'French' : 'English'}.
    3. Return a valid JSON object ONLY.
    
    Required JSON Structure:
    {
      "answer": "Your natural language response here",
      "productIds": [123, 456] 
    }

    Note: If no products match, provide a helpful response and return an empty array for productIds.
  `;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are a supermarket assistant. Output only JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2
      })
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message || 'API Error');
    }
    const content = data.choices[0].message.content;
    console.log('Groq Raw Response:', content);
    
    // Robust JSON extraction
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      // Ensure productIds are always numbers
      if (parsed.productIds) {
        parsed.productIds = parsed.productIds.map((id: any) => Number(id)).filter((id: number) => !isNaN(id));
      }
      return parsed;
    }
    
    throw new Error('No JSON found in response');
  } catch (error) {
    console.error('Groq API Error:', error);
    return { 
      answer: language === 'rw' ? 'Ntabwo nshoboye gushaka ibyo mwasabye ubu.' : 
              language === 'fr' ? 'Je ne peux pas traiter votre demande pour le moment.' : 
              'I couldn\'t process your search right now. Please try again.', 
      productIds: [] 
    };
  }
};
