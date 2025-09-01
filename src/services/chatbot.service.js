// Chatbot service for AI interactions
class ChatbotService {
  constructor() {
    // Vite uses import.meta.env instead of process.env
    this.apiKey = import.meta.env.VITE_GROQ_API_KEY;
    this.baseUrl = 'https://api.groq.com/openai/v1/chat/completions';
    this.model = 'llama-3.1-8b-instant'; // Current fast model
  }

  // Generate system prompt based on context
  generateSystemPrompt(context, semesterResources = null) {
    const basePrompt = "You are a helpful AI assistant for students. Provide clear, concise, and educational responses.";
    
    const contextPrompts = {
      'general': basePrompt + " Answer general academic questions and provide study guidance.",
      'semester-1': basePrompt + " Focus on foundational courses: Mathematics, Physics, Chemistry, Programming.",
      'semester-2': basePrompt + " Focus on: Mathematics, Physics, Chemistry, Programming, Computer Science.",
      'semester-3': basePrompt + " Focus on: Data Structures, Mathematics, Computer Networks, Database Systems.",
      'semester-4': basePrompt + " Focus on: Algorithms, Software Engineering, Operating Systems, Web Development.",
      'semester-5': basePrompt + " Focus on: Machine Learning, Mobile Development, Database Systems, Software Engineering.",
      'semester-6': basePrompt + " Focus on: Computer Networks, Artificial Intelligence, Web Development, Software Engineering.",
      'semester-7': basePrompt + " Focus on: Machine Learning, Artificial Intelligence, Mobile Development, Software Engineering.",
      'semester-8': basePrompt + " Focus on: Machine Learning, Artificial Intelligence, Software Engineering, Web Development."
    };

    let prompt = contextPrompts[context] || contextPrompts['general'];

    // Add available resources context if provided
    if (semesterResources && semesterResources.length > 0) {
      prompt += "\n\nAvailable resources for this semester:\n";
      
      const resourcesBySubject = {};
      semesterResources.forEach(resource => {
        if (!resourcesBySubject[resource.subject]) {
          resourcesBySubject[resource.subject] = [];
        }
        resourcesBySubject[resource.subject].push(resource);
      });

      Object.entries(resourcesBySubject).forEach(([subject, resources]) => {
        prompt += `\n${subject}:\n`;
        resources.forEach(resource => {
          const author = resource.createdBy || resource.contributorName || 'Unknown';
          const title = resource.title || resource.name || 'Untitled';
          const description = resource.description || '';
          const summary = resource.summary || '';
          
          prompt += `- ${resource.type}: "${title}" by ${author}\n`;
          if (summary) {
            prompt += `  Summary: ${summary}\n`;
          }
          if (description && description !== summary) {
            prompt += `  Description: ${description}\n`;
          }
          
          // Add keywords/topics for better matching
          const topics = [];
          if (resource.tags && Array.isArray(resource.tags)) {
            topics.push(...resource.tags);
          }
          if (topics.length > 0) {
            prompt += `  Topics: ${topics.join(', ')}\n`;
          }
          
          console.log(`📝 Added resource to prompt: ${title} (${resource.type}) - Summary: ${summary ? 'Yes' : 'No'}`);
        });
      });

      prompt += `\nIMPORTANT: When students ask questions, you MUST follow this exact structure:

1. FIRST: Provide a comprehensive explanation of the topic/concept they asked about. Give educational content, examples, and context to help them understand the subject matter.

2. SECOND: After your explanation, add a section titled "📚 **Related Resources from Your Course:**" and list ALL relevant resources that match their question topic using this EXACT format:
   📚 **Resource:** '[Resource Title]' ([Type]) by [Author] - [brief description of what it covers]

3. RULES:
   - Always explain the topic BEFORE listing resources
   - Include ALL resources that are even remotely related to their question
   - Use the exact format with 📚 emoji and **Resource:** prefix
   - Each resource must be on its own line
   - If no resources match, still provide the explanation but mention "No specific course resources found for this topic"
   - Never mix resource references within your explanation - keep them separate at the end
   - Consider a resource relevant if it relates to the same subject area, contains similar keywords, or could help with the student's question
   - When in doubt, include the resource - it's better to show more resources than to miss helpful ones`;
    }

    return prompt;
  }

  // Send message to AI and get response
  async sendMessage(message, context = 'general', conversationHistory = [], semesterResources = null) {
    if (!this.apiKey) {
      throw new Error('Groq API key not configured. Please set VITE_GROQ_API_KEY in your environment variables.');
    }

    try {
      const systemPrompt = this.generateSystemPrompt(context, semesterResources);
      
      // Debug logging
      console.log('🤖 Chatbot Debug Info:');
      console.log('Context:', context);
      console.log('Resources found:', semesterResources ? semesterResources.length : 0);
      if (semesterResources && semesterResources.length > 0) {
        console.log('Resources:', semesterResources.map(r => ({ title: r.title || r.name, subject: r.subject, summary: r.summary })));
      }
      console.log('System prompt length:', systemPrompt.length);
      
      // Build messages array with system prompt and conversation history
      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: message }
      ];

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages,
          max_tokens: 1000,
          temperature: 0.7,
          stream: false
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API request failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from API');
      }

      return {
        success: true,
        message: data.choices[0].message.content.trim(),
        usage: data.usage
      };

    } catch (error) {
      console.error('Chatbot service error:', error);
      return {
        success: false,
        error: error.message,
        message: "I'm sorry, I'm having trouble responding right now. Please try again later."
      };
    }
  }

  // Alternative: Mock responses for testing without API key
  async sendMockMessage(message, context = 'general') {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const mockResponses = {
      'general': [
        "That's a great question! Let me help you with that.",
        "I understand what you're asking. Here's what I think...",
        "Based on your question, I'd suggest considering these points..."
      ],
      'semester-1': [
        "As a first semester student, it's important to focus on building strong foundations.",
        "Welcome to college! First semester can be challenging but exciting.",
        "For first semester courses, I recommend starting with good study habits."
      ],
      'semester-8': [
        "As you're in your final semester, you should be thinking about career preparation.",
        "Congratulations on reaching your final semester! Here's some advice...",
        "For your capstone project, consider these approaches..."
      ]
    };

    const responses = mockResponses[context] || mockResponses['general'];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    return {
      success: true,
      message: `${randomResponse} You asked: "${message}". This is a mock response for ${context} context.`,
      usage: null
    };
  }
}

export default new ChatbotService();