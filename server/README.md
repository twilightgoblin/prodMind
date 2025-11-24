# Productive Content Backend

Node.js + Express + MongoDB backend for the productive content consumption app.

## Setup

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Set up MongoDB:**
   - Install MongoDB locally or use MongoDB Atlas
   - Update `MONGODB_URI` in `.env` file

3. **Configure environment:**
   - Copy API keys from frontend `.env` to `server/.env`
   - Update other environment variables as needed

4. **Start the server:**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Content Management
- `GET /api/content` - Get all content
- `POST /api/content/youtube/search` - Search YouTube
- `POST /api/content/analyze` - Analyze content with AI
- `POST /api/content` - Save content
- `PUT /api/content/:id` - Update content
- `DELETE /api/content/:id` - Delete content

### Summarizer
- `POST /api/summarizer/generate` - Generate summary
- `GET /api/summarizer` - Get all summaries
- `GET /api/summarizer/:id` - Get specific summary
- `PUT /api/summarizer/:id` - Update summary
- `DELETE /api/summarizer/:id` - Delete summary

### Mind Maps
- `POST /api/mindmap/generate` - Generate mind map
- `POST /api/mindmap` - Save mind map
- `GET /api/mindmap` - Get all mind maps
- `GET /api/mindmap/:id` - Get specific mind map
- `PUT /api/mindmap/:id` - Update mind map
- `DELETE /api/mindmap/:id` - Delete mind map

### Quiz System
- `POST /api/quiz/generate` - Generate quiz (10 questions) for a topic
- `POST /api/quiz/submit` - Submit quiz answers and get results
- `GET /api/quiz/history/:userId` - Get user's quiz history
- `DELETE /api/quiz/history/:userId/:quizId` - Delete specific quiz
- `DELETE /api/quiz/history/:userId` - Clear all quiz history

**Available Quiz Topics (27 topics, 445+ questions):**
- **Programming Languages**: Java, C++, JavaScript, Node.js, Python, TypeScript, Go, Rust, PHP, Ruby, Swift, Kotlin, C#
- **Frameworks & Libraries**: Express, React, Next.js, Angular, Vue
- **Data Science**: Pandas (25 questions), NumPy (25 questions)
- **Productivity**: Time Management, GTD, Pomodoro, Habits, Focus (25 questions)
- **Databases**: SQL, MongoDB, PostgreSQL
- **DevOps & Cloud**: Docker, Kubernetes, AWS

**Smart Topic Matching**: The system uses keyword matching to find topics. For example:
- "pomodoro" or "time management" → Productivity quiz
- "dataframe" or "pd" → Pandas quiz
- "array" or "np" → NumPy quiz

**Random Quiz Fallback**: If no matching topic is found, the system automatically generates a "Mixed Topics" quiz with 10 random questions from all 445+ available questions across all topics.

### Health Check
- `GET /api/health` - Server health status

## Database Models

- **Content**: YouTube videos, articles, custom topics
- **Summary**: AI-generated summaries with insights
- **MindMap**: Knowledge graphs and visualizations

## Security Features

- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- API key protection (server-side only)

## Development

The server runs on port 5000 by default. Frontend should connect to `http://localhost:5000/api`.

Make sure MongoDB is running before starting the server.