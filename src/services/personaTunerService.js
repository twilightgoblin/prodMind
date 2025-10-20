// PersonaTuner Service - Adaptive AI personality
class PersonaTunerService {
  constructor() {
    this.openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    this.baseUrl = 'https://api.openai.com/v1';
  }

  async analyzePersonality(responses, preferences = {}) {
    try {
      // Check if API key is available
      if (!this.openaiApiKey || this.openaiApiKey.includes('your_openai_api_key')) {
        throw new Error('OpenAI API key not configured - cannot analyze personality');
      }

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{
            role: 'system',
            content: 'You are a personality analysis expert. Analyze the user responses and preferences to create a detailed personality profile with communication style recommendations.'
          }, {
            role: 'user',
            content: `Analyze these user responses and preferences: ${JSON.stringify({ responses, preferences })}. Provide a personality profile with communication style, tone, formality level, and interaction preferences.`
          }],
          temperature: 0.3,
          max_tokens: 1500
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const analysis = this.parsePersonalityAnalysis(data.choices[0].message.content);
      
      return {
        success: true,
        data: analysis,
        metadata: {
          analyzedAt: new Date().toISOString(),
          responseCount: responses.length
        }
      };
    } catch (error) {
      console.error('Personality analysis error:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  parsePersonalityAnalysis(content) {
    try {
      // Try to extract structured data from the response
      const lines = content.split('\n').filter(line => line.trim());
      const personality = {
        traits: [],
        communicationStyle: 'balanced',
        tonePreference: 'friendly',
        formalityLevel: 'moderate',
        interactionStyle: 'collaborative',
        strengths: [],
        preferences: {},
        recommendations: []
      };

      lines.forEach(line => {
        const lower = line.toLowerCase();
        if (lower.includes('trait') || lower.includes('characteristic')) {
          personality.traits.push(line.replace(/^[-*]\s*/, '').trim());
        } else if (lower.includes('strength')) {
          personality.strengths.push(line.replace(/^[-*]\s*/, '').trim());
        } else if (lower.includes('recommend')) {
          personality.recommendations.push(line.replace(/^[-*]\s*/, '').trim());
        }
      });

      return personality;
    } catch {
      return this.getDefaultPersonality();
    }
  }

  async generatePersonalizedResponse(message, personalityProfile, context = {}) {
    try {
      // Check if API key is available
      if (!this.openaiApiKey || this.openaiApiKey.includes('your_openai_api_key')) {
        throw new Error('OpenAI API key not configured - cannot generate personalized response');
      }

      const systemPrompt = this.buildSystemPrompt(personalityProfile);
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{
            role: 'system',
            content: systemPrompt
          }, {
            role: 'user',
            content: message
          }],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        response: data.choices[0].message.content,
        metadata: {
          personalityUsed: personalityProfile.communicationStyle,
          generatedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Personalized response error:', error);
      return {
        success: false,
        error: error.message,
        response: null
      };
    }
  }

  buildSystemPrompt(personality) {
    return `You are an AI assistant with the following personality profile:
    
Communication Style: ${personality.communicationStyle}
Tone Preference: ${personality.tonePreference}
Formality Level: ${personality.formalityLevel}
Interaction Style: ${personality.interactionStyle}

Key Traits: ${personality.traits.join(', ')}
Strengths: ${personality.strengths.join(', ')}

Please respond in a way that matches this personality profile. Be consistent with the communication style and tone preferences.`;
  }

  getDefaultPersonality() {
    return {
      traits: ['Analytical', 'Curious', 'Helpful', 'Patient'],
      communicationStyle: 'balanced',
      tonePreference: 'friendly',
      formalityLevel: 'moderate',
      interactionStyle: 'collaborative',
      strengths: ['Problem-solving', 'Clear communication', 'Adaptability'],
      preferences: {
        detailLevel: 'moderate',
        exampleUsage: 'preferred',
        stepByStep: true
      },
      recommendations: [
        'Use clear, structured explanations',
        'Provide practical examples',
        'Ask clarifying questions when needed'
      ]
    };
  }

  async savePersonalityProfile(profile, name) {
    try {
      const savedProfiles = this.getSavedProfiles();
      const newProfile = {
        id: Date.now(),
        name,
        profile,
        createdAt: new Date().toISOString(),
        isActive: false
      };
      
      savedProfiles.push(newProfile);
      localStorage.setItem('prodmind_personalities', JSON.stringify(savedProfiles));
      
      return { success: true, id: newProfile.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  getSavedProfiles() {
    try {
      const saved = localStorage.getItem('prodmind_personalities');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  setActiveProfile(id) {
    try {
      const profiles = this.getSavedProfiles();
      const updated = profiles.map(profile => ({
        ...profile,
        isActive: profile.id === id
      }));
      
      localStorage.setItem('prodmind_personalities', JSON.stringify(updated));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  getActiveProfile() {
    try {
      const profiles = this.getSavedProfiles();
      return profiles.find(profile => profile.isActive) || null;
    } catch {
      return null;
    }
  }

  deleteProfile(id) {
    try {
      const profiles = this.getSavedProfiles();
      const filtered = profiles.filter(profile => profile.id !== id);
      localStorage.setItem('prodmind_personalities', JSON.stringify(filtered));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Personality assessment questions
  getAssessmentQuestions() {
    return [
      {
        id: 1,
        question: "How do you prefer to receive information?",
        options: [
          { value: "detailed", label: "Detailed explanations with examples" },
          { value: "concise", label: "Brief, to-the-point answers" },
          { value: "visual", label: "Visual aids and diagrams" },
          { value: "step-by-step", label: "Step-by-step instructions" }
        ],
        category: "communication"
      },
      {
        id: 2,
        question: "What tone do you prefer in conversations?",
        options: [
          { value: "formal", label: "Professional and formal" },
          { value: "friendly", label: "Warm and friendly" },
          { value: "casual", label: "Casual and relaxed" },
          { value: "enthusiastic", label: "Energetic and enthusiastic" }
        ],
        category: "tone"
      },
      {
        id: 3,
        question: "How do you like to approach problem-solving?",
        options: [
          { value: "analytical", label: "Break down into logical steps" },
          { value: "creative", label: "Explore creative alternatives" },
          { value: "collaborative", label: "Discuss and brainstorm together" },
          { value: "independent", label: "Work through it independently" }
        ],
        category: "approach"
      },
      {
        id: 4,
        question: "What level of detail do you prefer?",
        options: [
          { value: "high", label: "Comprehensive with all details" },
          { value: "moderate", label: "Balanced overview with key points" },
          { value: "minimal", label: "Just the essentials" },
          { value: "contextual", label: "Depends on the situation" }
        ],
        category: "detail"
      },
      {
        id: 5,
        question: "How do you prefer feedback and suggestions?",
        options: [
          { value: "direct", label: "Direct and straightforward" },
          { value: "gentle", label: "Gentle and encouraging" },
          { value: "constructive", label: "Constructive with alternatives" },
          { value: "supportive", label: "Supportive and understanding" }
        ],
        category: "feedback"
      }
    ];
  }


}

export default new PersonaTunerService();