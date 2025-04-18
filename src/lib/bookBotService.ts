import axios from 'axios';

// Define interface for Gemini API response
interface GeminiAPIResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

// Configure the Gemini API settings
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const DEFAULT_API_KEY = 'AIzaSyDRjcMAyOJbYCm2QxvJAyRXuy1ftfp7Dxs'; // Replace with your actual API key or load from environment

export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  status: 'reading' | 'completed' | 'want-to-read' | 'dnf';
  readingProgress?: number;
  lastOpened?: string;
  dateAdded: string;
  genre: string[];
  format: 'physical' | 'ebook' | 'audiobook';
  review?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class BookBotService {
  private apiKey: string;
  private userLibrary: Book[] = [];
  private chatHistory: ChatMessage[] = [];

  constructor(apiKey: string = DEFAULT_API_KEY) {
    this.apiKey = apiKey;
  }

  // Set the user's library for context-aware recommendations
  public setUserLibrary(books: Book[]) {
    this.userLibrary = books;
  }

  // Clear chat history
  public clearChatHistory() {
    this.chatHistory = [];
  }

  // Get the current chat history
  public getChatHistory(): ChatMessage[] {
    return [...this.chatHistory];
  }

  // Get book recommendations based on user query
  public async getRecommendation(userQuery: string): Promise<string> {
    try {
      // Add user message to chat history
      this.chatHistory.push({ role: 'user', content: userQuery });

      // Create library context from user's books
      const libraryContext = this.createLibraryContext();
      
      // Construct prompt for Gemini
      const prompt = this.constructPrompt(userQuery, libraryContext);
      
      // Call Gemini API
      const response = await this.callGeminiAPI(prompt);
      
      // Add assistant response to chat history
      this.chatHistory.push({ role: 'assistant', content: response });
      
      return response;
    } catch (error) {
      console.error('Error getting book recommendation:', error);
      const errorMessage = 'Sorry, I encountered an error while processing your request. Please try again later.';
      this.chatHistory.push({ role: 'assistant', content: errorMessage });
      return errorMessage;
    }
  }

  // Create context about user's library for more relevant recommendations
  private createLibraryContext(): string {
    if (!this.userLibrary.length) {
      return 'The user has no books in their library yet.';
    }

    const readingBooks = this.userLibrary.filter(book => book.status === 'reading');
    const completedBooks = this.userLibrary.filter(book => book.status === 'completed');
    const wantToReadBooks = this.userLibrary.filter(book => book.status === 'want-to-read');
    
    const completedWithReviews = completedBooks.filter(book => book.review && book.review.trim() !== '');

    let context = `User Library Information:\n`;
    context += `- Total books: ${this.userLibrary.length}\n`;
    context += `- Currently reading: ${readingBooks.length} books\n`;
    context += `- Completed: ${completedBooks.length} books\n`;
    context += `- Want to read: ${wantToReadBooks.length} books\n\n`;

    // Add genres the user enjoys
    const allGenres = this.userLibrary.flatMap(book => book.genre);
    const genreCounts = allGenres.reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([genre]) => genre);
    
    context += `Top Genres: ${topGenres.join(', ')}\n\n`;

    // Add some books the user has read with reviews for better context
    if (completedWithReviews.length) {
      context += 'Sample books user has read and reviewed:\n';
      const sampleBooks = completedWithReviews.slice(0, 3);
      
      sampleBooks.forEach(book => {
        context += `- "${book.title}" by ${book.author}\n`;
        context += `  User's review: "${book.review}"\n\n`;
      });
    }

    return context;
  }

  // Construct the prompt for Gemini API
  private constructPrompt(userQuery: string, libraryContext: string): string {
    const chatContext = this.chatHistory
      .slice(-6) // Include up to 3 pairs of messages for context
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n\n');

    return `
You are an AI book recommendation chatbot with expertise in literature and books of all genres. 
You help users discover new books based on their preferences, reading history, and specific requests.

Here is information about the user's library:
${libraryContext}

Recent conversation:
${chatContext}

User's latest query: ${userQuery}

Provide a helpful, informative, and conversational response. If recommending books, include the title, author, 
and a brief explanation of why you're recommending it. If you don't know specific information, be honest about it.
Keep your response concise but informative. Make sure to tailor recommendations based on the user's library information when possible.
`;
  }

  // Call the Gemini API
  private async callGeminiAPI(prompt: string): Promise<string> {
    try {
      const response = await axios.post<GeminiAPIResponse>(
        `${GEMINI_API_URL}?key=${this.apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Extract the response text from Gemini
      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw new Error('Failed to get response from Gemini API');
    }
  }
} 