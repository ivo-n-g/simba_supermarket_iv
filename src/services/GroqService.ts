const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export interface GroqResponse {
  answer: string;
  productIds: number[];
}

export const conversationalSearch = async (query: string, products: any[], language: string): Promise<GroqResponse> => {
  if (!GROQ_API_KEY) {
    console.error('Groq API Key missing');
    return { answer: 'AI Search is currently unavailable.', productIds: [] };
  }

  // Simplify product data to save tokens
  const contextProducts = products.map(p => ({
    id: p.id,
    name: p[`name_${language}`] || p.name,
    category: p[`category_${language}`] || p.category,
    price: p.price
  })).slice(0, 100); // Limit to first 100 products for demo context efficiency

  const prompt = `
    You are a helpful assistant for Simba Supermarket in Rwanda.
    User Query: "${query}"
    Language: ${language}
    
    Here is a list of some products we have:
    ${JSON.stringify(contextProducts)}

    Tasks:
    1. Respond to the user in ${language === 'rw' ? 'Kinyarwanda' : language === 'fr' ? 'French' : 'English'}.
    2. If they ask for specific products, identify them from the list.
    3. Return a JSON object with two fields:
       - "answer": A short, friendly natural language response.
       - "productIds": An array of product IDs that match the query.

    IMPORTANT: Return ONLY the JSON object. Do not include markdown formatting or extra text.
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
    const content = data.choices[0].message.content;
    
    // Robust JSON extraction
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
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
