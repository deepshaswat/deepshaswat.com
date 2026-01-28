import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { VertexAI } from "@google-cloud/vertexai";

interface TopicSuggestionRequest {
  category?: string;
  existingTopics?: string[];
  count?: number;
}

interface TopicSuggestion {
  topic: string;
  description: string;
  relevanceScore: number;
  relatedKeywords: string[];
}

const projectId = process.env.GCP_PROJECT_ID;
const location = process.env.GCP_LOCATION || "us-central1";

let vertexAI: VertexAI | null = null;

function getVertexAI(): VertexAI | null {
  if (!vertexAI && projectId) {
    vertexAI = new VertexAI({
      project: projectId,
      location,
    });
  }
  return vertexAI;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let requestData: TopicSuggestionRequest = {};

  try {
    requestData = (await request.json()) as TopicSuggestionRequest;
    const { category, existingTopics = [], count = 10 } = requestData;

    const ai = getVertexAI();

    if (!ai) {
      const fallbackTopics = generateFallbackTopics(category, count);
      return NextResponse.json({ topics: fallbackTopics });
    }

    const model = ai.getGenerativeModel({ model: "gemini-pro" });

    const existingTopicsStr =
      existingTopics.length > 0
        ? `\n\nExclude these topics as they already exist: ${existingTopics.join(", ")}`
        : "";

    const categoryStr = category
      ? `in the "${category}" category`
      : "across various tech and lifestyle categories";

    const prompt = `You are an expert content strategist and trend analyst. Suggest ${String(count)} trending and engaging blog topics ${categoryStr} that would be valuable for a personal blog/newsletter.
${existingTopicsStr}

For each topic suggestion, provide:
1. topic: A concise topic name (2-5 words)
2. description: Brief explanation of why this topic is relevant (1 sentence)
3. relevanceScore: A score from 1-10 indicating how trending/relevant this topic is
4. relatedKeywords: 3-5 related keywords for SEO

Format your response as a JSON array:
[
  {
    "topic": "AI Code Assistants",
    "description": "Explore how AI is transforming software development workflows",
    "relevanceScore": 9,
    "relatedKeywords": ["GitHub Copilot", "ChatGPT", "coding", "automation"]
  }
]

Focus on:
- Current trends in 2024-2025
- Topics with good search volume
- Evergreen topics with lasting value
- Mix of technical and accessible topics

Generate ${String(count)} topic suggestions now (respond ONLY with the JSON array, no additional text):`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const firstCandidate = response.candidates?.[0];
    const content = firstCandidate?.content;
    const parts = content?.parts;
    const firstPart = parts?.[0];
    const text = firstPart?.text ?? "";

    const jsonMatch = /\[[\s\S]*\]/.exec(text);
    if (!jsonMatch) {
      throw new Error("Could not parse topics from response");
    }

    const topics = JSON.parse(jsonMatch[0]) as TopicSuggestion[];

    return NextResponse.json({ topics });
  } catch {
    const fallbackTopics = generateFallbackTopics(
      requestData.category,
      requestData.count || 10,
    );
    return NextResponse.json({ topics: fallbackTopics });
  }
}

function generateFallbackTopics(
  category?: string,
  count = 10,
): TopicSuggestion[] {
  const defaultTopics: TopicSuggestion[] = [
    {
      topic: "AI in Daily Life",
      description:
        "How artificial intelligence is quietly transforming everyday tasks",
      relevanceScore: 9,
      relatedKeywords: ["AI", "automation", "productivity", "technology"],
    },
    {
      topic: "Remote Work Evolution",
      description:
        "The changing landscape of distributed work and team collaboration",
      relevanceScore: 8,
      relatedKeywords: [
        "remote work",
        "hybrid",
        "productivity",
        "work-life balance",
      ],
    },
    {
      topic: "Web Development Trends",
      description: "Latest frameworks and tools shaping modern web development",
      relevanceScore: 8,
      relatedKeywords: ["React", "Next.js", "frontend", "full-stack"],
    },
    {
      topic: "Personal Productivity",
      description: "Systems and habits for getting more done with less stress",
      relevanceScore: 7,
      relatedKeywords: ["productivity", "habits", "time management", "focus"],
    },
    {
      topic: "Cloud Computing",
      description: "Understanding cloud services and their business impact",
      relevanceScore: 7,
      relatedKeywords: ["AWS", "cloud", "infrastructure", "DevOps"],
    },
    {
      topic: "Cybersecurity Basics",
      description:
        "Essential security practices for individuals and businesses",
      relevanceScore: 8,
      relatedKeywords: ["security", "privacy", "hacking", "protection"],
    },
    {
      topic: "Sustainable Tech",
      description: "How technology is driving environmental sustainability",
      relevanceScore: 7,
      relatedKeywords: [
        "green tech",
        "sustainability",
        "environment",
        "carbon footprint",
      ],
    },
    {
      topic: "Developer Experience",
      description: "Tools and practices that make developers more effective",
      relevanceScore: 8,
      relatedKeywords: ["DX", "tooling", "IDE", "workflow"],
    },
    {
      topic: "API Design",
      description: "Best practices for building robust and user-friendly APIs",
      relevanceScore: 7,
      relatedKeywords: ["REST", "GraphQL", "API", "backend"],
    },
    {
      topic: "Mental Health in Tech",
      description: "Addressing burnout and wellness in the technology industry",
      relevanceScore: 8,
      relatedKeywords: ["burnout", "wellness", "work-life", "mental health"],
    },
  ];

  return defaultTopics.slice(0, count);
}
