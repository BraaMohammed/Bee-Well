# AI Agent Implementation Plan for Bee-Well

## Overview

This document outlines the implementation plan for adding an AI agent to the Bee-Well application. The agent will have access to user notes, habits, and journals to provide personalized guidance and support.

## Core Features

1. **Comprehensive Data Access**
   - Access to user notes (read/create/edit)
   - Access to habit records and tracking data (ability to edit habits and journaling template)
   - Access to journal entries and templates
   - Web Search Ability

2. **Personalized Assistance**
   - Analyze patterns across all user data
   - Provide tailored advice based on historical context
   - Suggest improvements to habits & journaling and ability to edit their templates 

3. **AI Settings & Customization**
   - **Model Selection**: Dynamic switching between OpenAI, Anthropic, and Ollama models
   - **Data Access Controls**: Toggle permissions for accessing notes, habits, and journal entries
   - **Custom Context Prompts**: User-defined instructions that modify AI behavior (e.g., "be brutally honest", "focus on productivity")
   - **Focus Areas**: Adjustable emphasis on specific aspects (mental health, coding skills, productivity)
   - **Settings Persistence**: Save user preferences across sessions

4. **Intelligent Tool Selection**
   - Dynamic selection of which data sources to query
   - Contextual understanding of user requests
   - Ability to search web for supplementary information

5. **Change Management**
   - Preview of suggested changes
   - Accept/reject UI for modifications on notes, habits, journaling template
   - Change history tracking

6. **Navigation & Chat Management**
   - AI Agent integration in main sidebar navigation
   - Recent chats dropdown with quick access
   - Chat history persistence and management
   - Consistent UI styling with app theme (gradients, glassmorphism)

7. **Dynamic Model Selection**
   - Allow users to choose from different LLM providers (OpenAI, OpenRouter, Ollama)
   - No-code-change approach to adding new models
   - UI for selecting the model and providing credentials/endpoints if needed

## Technical Architecture

**Single Next.js App Architecture (Deployed to Railway/Render)**

```
┌────────────────────────────────────────────┐
│           Next.js App (Railway/Render)     │
│                                            │
│  ┌─────────────────────────────────────┐   │
│  │         Chat Interface              │   │
│  │      (Vercel AI UI)                 │   │
│  └─────────────────────────────────────┘   │
│                                            │
│  ┌─────────────────────────────────────┐   │
│  │      Change Preview UI              │   │
│  │      Accept/Reject                  │   │
│  └─────────────────────────────────────┘   │
│                                            │
│  ┌─────────────────────────────────────┐   │
│  │      API Routes (Notes/Habits/Journal)  │
│  └─────────────────────────────────────┘   │
│                                            │
│  ┌─────────────────────────────────────┐   │
│  │      AI Agent Logic (Vercel AI SDK) │   │
│  └─────────────────────────────────────┘   │
└────────────────────────────────────────────┘
```

**Communication Flow:**
1. User interacts with Next.js chat interface
2. Frontend sends requests to Next.js API routes (no microservice)
3. API routes handle AI agent logic, data access, and streaming responses

## Implementation Approach

### 1. Single App Architecture (Next.js on Railway/Render)
All AI agent logic, data access, and UI are handled within a single Next.js app deployed to Railway or Render. This allows for:
- Unlimited execution time for complex AI processing
- Simple deployment and maintenance (one app, one repo)
- No need for a separate microservice or inter-service communication
- Full use of Vercel AI SDK and streaming in API routes

### 2. App Structure
- **Chat Interface**: Built with Vercel AI UI components for optimal UX
- **Navigation Integration**: AI Agent link added to main sidebar (`newSidebar.tsx`) with recent chats dropdown
- **AI Settings Panel**: Dedicated settings interface for model selection, data permissions, and custom prompts
- **Data Access APIs**: API routes for notes, habits, and journals with permission controls
- **Change Management UI**: Accept/reject interfaces for AI suggestions
- **Authentication**: Handles user sessions and permissions
- **AI Agent Logic**: Implemented in API routes or server actions using Vercel AI SDK
- **Chat Persistence**: Database storage for chat history and user preferences

### 3. Multi-Step Progressive Data Access Flow

The AI agent uses a multi-step reasoning pattern to intelligently gather only relevant data:

**Multi-Step Reasoning Pattern:**

**Step 1: Overview/Metadata**
- AI calls lightweight overview functions
- Gets titles, labels, dates, names (no content)
- Minimal data transfer (~1-5KB)

**Step 2: Intelligent Selection**
- AI analyzes metadata against user query
- Decides which specific items are relevant
- Narrows down from all items to targeted subset

**Step 3: Targeted Content Fetch**
- AI calls specific data functions with IDs/parameters
- Fetches only relevant full content
- Focused data transfer (only what's needed)

**Example Flow: "Why am I not improving my coding skills?"**

1. **User Query** → Next.js API route

2. **Step 1 - Overview Calls:**
   ```
   AI calls:
   - getNotesOverview() → ["Project Plan", "Study Notes", "Daily Tasks", ...]
   - getHabitsOverview() → ["Morning Exercise", "Code Practice", "Reading", ...]
   - getJournalOverview(2025) → ["2025-01-15", "2025-02-03", ...]
   ```

3. **Step 2 - AI Reasoning:**
   ```
   AI thinks:
   - Notes: "Study Notes" and "Project Plan" seem coding-related
   - Habits: "Code Practice" is directly relevant
   - Journals: Need last 2 months to see recent patterns
   ```

4. **Step 3 - Targeted Fetches:**
   ```
   AI calls:
   - getNotesByIds(["note-123", "note-456"]) → Full content of 2 notes
   - getHabitRecords(["habit-789"], "2024-12-01", "2025-02-01") → 2 months data
   - getJournalEntriesByDateRange("2024-12-01", "2025-02-01") → Recent entries
   ```

5. **Step 4 - Analysis & Response:**
   - AI processes targeted data
   - Identifies patterns and issues
   - Provides personalized advice
   - Streams response to frontend

**Data Volume Comparison:**
- ❌ Old way: Fetch ALL notes/habits/journals → 1-5MB+ payload
- ✅ New way: Metadata (5KB) → Targeted fetch (50-200KB) → 95%+ reduction

### 4. UI Library Recommendations for AI Agents

**Primary Recommendation: Vercel AI UI Components**
- Pre-built chat components optimized for AI interactions
- Streaming message support
- Built-in typing indicators and loading states
- Seamless integration with Vercel AI SDK

**Alternative Options:**
- **Chatbot UI Kit**: Open source chat components with customizable styling
- **React Chat Elements**: Lightweight chat components library
- **AI Chat Components**: Specialized components for AI conversations
- **Custom Components**: Build on top of shadcn/ui with chat-specific modifications

**For Change Preview UI:**
- **React Diff Viewer**: For showing before/after comparisons
- **Monaco Diff Editor**: If you need syntax highlighting for code changes
- **Custom Diff Components**: Built with shadcn/ui for consistency

## Implementation Phases

### Phase 1: Core Framework & UI Setup (Completed)
- **Status:** ✅ Complete
- **Details:**
  - ✅ Set up Next.js app
  - ✅ Implemented API route `/api/chat` with Anthropic Claude integration
  - ✅ Integrated Vercel AI SDK with streaming responses via `streamText`
  - ✅ Built comprehensive chat interface in `app/ai-chat/page.tsx` with modern UI components
  - ✅ Implemented dynamic model selection UI supporting OpenAI, Anthropic, and Ollama
  - ✅ Created server action `getOllamaModels` to fetch local Ollama models
  - ✅ Built sophisticated ModelSelector component with provider-specific icons and descriptions
  - ✅ Implemented Zustand store (`aiChatStore`) for state management
  - ✅ Created custom hook `useChatServerActions` for chat functionality

### Phase 2: Data Integration (In Progress - Multi-Step Reasoning)
- **Status:** 🔄 In Progress - Implementing Progressive Data Fetching
- **Completed:**
  - ✅ Implemented comprehensive data access via AI tools in `chatWithAI.ts`
  - ✅ Added multi-provider support (Google Gemini, Ollama)
  - ✅ Integrated authentication with session checking
  - ✅ Implemented smart error handling and response cleaning
  - ✅ Function calling with rate limit protection
  - ✅ Body size optimization (10MB limit + smart truncation)
- **Current Work - Progressive Multi-Step Data Fetching:**
  - 🔄 **Notes Access Flow:**
    1. `getNotesOverview()` - Returns note titles + labels only
    2. AI decides which notes are relevant
    3. `getNotesByIds([ids])` - Fetch specific note contents
  - 🔄 **Journal Access Flow:**
    1. `getJournalOverview(year)` - Returns dates + titles only
    2. AI decides relevant time period
    3. `getJournalEntriesByDateRange(startDate, endDate)` - Fetch specific entries
  - 🔄 **Habit Tracking Access Flow:**
    1. `getHabitsOverview()` - Returns habit names + types
    2. AI decides time period of interest
    3. `getHabitRecords(habitIds, startDate, endDate)` - Fetch records for analysis
    4. `getCurrentHabitTemplates()` - Get current habit configurations for comparison
- **Design Pattern:**
  - **Step 1:** AI calls overview/metadata functions (lightweight)
  - **Step 2:** AI reasons about what's relevant to user query
  - **Step 3:** AI calls specific data functions with targeted parameters
  - **Step 4:** AI processes and returns personalized response
- **Benefits:**
  - Minimal initial data transfer (titles/metadata only)
  - AI-driven intelligent data selection
  - Precise context gathering based on user query
  - Scalable to hundreds of notes/entries without payload issues

### Phase 3: Advanced Features
- **Status:** ✅ Complete
- **Completed:**
  - ✅ AI Settings Interface with model selection, data permissions, and custom prompts
  - ✅ Settings integration with chat logic and conditional tool access
  - ✅ Visual feedback for data access permissions in UI
  - ✅ AI Agent link added to sidebar navigation
  - ✅ **Local Chat History Storage**:
    - ✅ Implemented localStorage-based chat management system
    - ✅ Created comprehensive chat store with save/load/delete functionality
    - ✅ Added recent chats dropdown in sidebar with search capabilities
    - ✅ Implemented URL-based chat routing and session management
    - ✅ Automatic chat title generation from first user message
    - ✅ New Chat button and full chat management UI
    - **Note**: Remove local storage system when database integration is complete
  - **Data Tools Expansion**:
    - Add tools for creating/editing notes and journal entries
    - Add habit tracking data access tools
    - Add web search capability
  - **Change Management**:
    - Implement change preview UI for AI suggestions
    - Add accept/reject workflows for user approval
    - Implement block-based note editing logic

### Phase 4: Database Chat Persistence & Final Polish (Planned)
- **Status:** 📋 Planned (Final Step)
- **Database Chat Integration**:
  - Design chat schema for database storage (Supabase/MongoDB)
  - **IMPORTANT**: Remove local chat storage system when implementing database
  - Migrate existing local chats to database (if any)
  - Implement server-side chat saving/loading functionality
  - Add chat synchronization across devices
  - Implement chat sharing and collaboration features
- **Final Optimizations**:
  - Optimize API call patterns and response times
  - Comprehensive testing of all features before database migration
  - Improve error handling and security
  - Performance monitoring and optimization
  - User experience testing and refinements

**Migration Note**: Local chat storage is a temporary solution. When Phase 4 begins, the local storage system will be completely removed and replaced with database persistence for better scalability, cross-device sync, and data integrity.

## Considerations and Challenges

### Context Window Management
- **Progressive Loading**: AI fetches metadata first, then selectively retrieves full content
- **Smart Selection**: AI chooses which specific notes/habits/journal entries to fetch
- **API Optimization**: Batch API calls where possible to reduce round trips

### Development Experience
- **Single Deployment**: Only one app to deploy and maintain
- **Local Development**: Easier setup and debugging
- **Error Handling**: Robust error handling for long-running requests

### Deployment Considerations
- **Cost Management**: Hosting costs for a single app (~$5-10/month)
- **Monitoring**: Monitor app for uptime and performance

## Key Technical Decisions

### Single App Architecture
- **Next.js App**: All logic and UI in one app, deployed to Railway/Render
- **Vercel AI SDK**: Used in API routes for LLM interactions and streaming
- **TypeScript First**: Consistent codebase
- **Progressive Enhancement**: Start simple, add complexity as needed

### Security and Privacy
- **Authentication**: Use existing session/auth logic for user data access
- **Data Access**: All user data accessible to AI for personalization
- **External APIs**: Data sent to LLM providers for processing

### Provider-Agnostic LLM Integration
- **Provider-Agnostic Architecture**: Abstract the LLM provider to allow for dynamic selection (OpenAI, OpenRouter, Ollama) without code changes.
- **UI for Model Selection**: A dropdown or settings panel in the chat interface to allow users to choose their preferred model provider (e.g., OpenAI, OpenRouter, a local Ollama instance).
- **Configuration Management**: A secure way to manage API keys and endpoints for different providers, which can be updated without deploying new code.

## Next Steps

### 1. App Setup
- Deploy Next.js app to Railway/Render
- Install and configure Vercel AI SDK
- Set up API routes for chat and data access

### 2. Data Access Integration
- Implement progressive data fetching in API routes (metadata first, then content)
- Add context management logic for smart data selection
- Test AI's ability to access and process user data

### 3. Frontend Integration
- Build chat interface using Vercel AI UI components
- Implement streaming responses from API routes
- Create change preview and accept/reject UI

### 4. Testing and Deployment
- Test full end-to-end user interactions
- Monitor performance and optimize API calls
- Document deployment and maintenance procedures

## Summary

This plan provides a robust, simplified approach to implementing an AI agent that:

### Architecture Benefits
- **Overcomes Vercel Limits**: Deploying to Railway/Render allows long-running AI processes
- **Simplicity**: All logic and UI in a single Next.js app
- **Scalable Design**: Can handle complex AI workflows without timeout constraints
- **Cost Effective**: Simple deployment to Railway/Render (~$5-10/month)

### Development Benefits
- **Great Developer Experience**: Next.js with TypeScript and hot reload
- **Single Codebase**: Easier to maintain and develop
- **Progressive Implementation**: Can build and test incrementally

### User Experience
- **Unlimited Processing Time**: Complex analysis and reasoning without timeouts
- **Streaming Responses**: Real-time feedback during AI processing
- **Personalized Results**: Access to complete user context for tailored advice
- **Change Management**: Clear preview and approval workflows for AI suggestions

### Technical Features
- **Progressive Data Fetching**: Optimizes context window usage through smart data selection
- **Intelligent Tool Selection**: AI determines which data sources to query dynamically
- **Block-Level Editing**: Precise note modifications without overwhelming context
- **Secure Communication**: Proper authentication for user data

### Dynamic Model Selection
- **Provider-Agnostic Architecture**: Use abstractions (like the Vercel AI SDK) that support multiple LLM providers.
- **UI for Model Selection**: A dropdown or settings panel in the chat interface to allow users to choose their preferred model provider (e.g., OpenAI, OpenRouter, a local Ollama instance).
- **Configuration Management**: A secure way to manage API keys and endpoints for different providers, which can be updated without deploying new code.
