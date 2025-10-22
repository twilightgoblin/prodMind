# ProdMind - AI-Powered Productivity Suite

ProdMind is a comprehensive AI-powered productivity platform that helps you optimize your learning, content consumption, and task management through intelligent automation and personalized insights.

## 🚀 Features

### Core Modules

1. **Content Intelligence** - AI-powered content curation and prioritization
2. **Smart Scheduler** - Intelligent task scheduling and time management  
3. **Content Summarizer** - Extract key insights from any content format
4. **MindMap Generator** - Knowledge graph visualization and mapping

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **AI Integration**: OpenAI GPT-4, AssemblyAI
- **APIs**: YouTube Data API, Google Custom Search, News API

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd prodmind
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Fill in your API keys in the `.env` file:
   - OpenAI API Key (required)
   - YouTube Data API Key (optional)
   - AssemblyAI API Key (optional)
   - Google Search API Key (optional)
   - News API Key (optional)

5. Start the development server:
```bash
npm run dev
```

## 🔧 Configuration

### Required API Keys

- **OpenAI API Key**: Get from [OpenAI Platform](https://platform.openai.com/api-keys)
  - Used for: Content analysis, summarization, mind mapping, personality analysis

### Optional API Keys

- **YouTube Data API**: Get from [Google Cloud Console](https://console.developers.google.com/)
- **AssemblyAI API**: Get from [AssemblyAI](https://www.assemblyai.com/)
- **Google Custom Search API**: Get from [Google Developers](https://developers.google.com/custom-search/v1/introduction)
- **News API**: Get from [NewsAPI.org](https://newsapi.org/)

## 🎯 Module Overview

### Content Intelligence
- Smart content curation from multiple sources
- AI-powered priority scoring
- Topic-based filtering and organization
- Progress tracking and consumption analytics

### Smart Scheduler  
- Intelligent task scheduling with AI optimization
- Priority-based time allocation
- Calendar integration and conflict resolution
- Productivity pattern analysis

### Content Summarizer
- **Custom Topic Learning**: Generate educational summaries for any topic you want to learn
- **Multi-format content processing**: Text, video, audio, PDFs from your library
- **Three summary modes**: TL;DR (quick), Insight (balanced), Detailed (comprehensive)
- **Educational Focus**: AI explanations designed for learning and understanding
- **Popular Topics**: Quick access to common learning subjects
- **Search & Filter**: Find summaries by topic, difficulty, or content type

### MindMap Generator
- AI-powered knowledge graph creation
- Interactive visualization
- Multiple layout styles (hierarchical, radial, network)
- Export and sharing capabilities



## 🚀 Usage

1. **Dashboard**: Access all modules from the main dashboard
2. **Module Navigation**: Each module operates independently with its own interface
3. **Data Persistence**: User data is stored locally with export options
4. **AI Integration**: Most features require OpenAI API key for full functionality

## 🔄 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API and business logic
├── styles/             # Global styles
└── lib/                # Utility functions
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in each module
- Review the API integration guides

## 🔮 Roadmap

- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Team collaboration features
- [ ] Integration with popular productivity tools
- [ ] Offline mode capabilities
- [ ] Advanced AI model fine-tuning
