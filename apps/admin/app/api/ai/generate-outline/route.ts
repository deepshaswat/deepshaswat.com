import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { VertexAI } from "@google-cloud/vertexai";

interface OutlineRequest {
  title: string;
  description?: string;
  topics?: string[];
  additionalContext?: string;
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
  let requestData: OutlineRequest = { title: "" };

  try {
    requestData = (await request.json()) as OutlineRequest;
    const { title, description, topics, additionalContext } = requestData;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const ai = getVertexAI();

    if (!ai) {
      const fallbackOutline = generateFallbackOutline(
        title,
        description,
        topics,
      );
      return NextResponse.json({ outline: fallbackOutline });
    }

    const model = ai.getGenerativeModel({ model: "gemini-pro" });

    const topicsStr =
      topics && topics.length > 0
        ? `Topics/Keywords: ${topics.join(", ")}`
        : "";

    const prompt = `You are an expert blog writer and content strategist. Generate a detailed, well-structured blog post outline for the following idea:

Title: ${title}
${description ? `Description: ${description}` : ""}
${topicsStr}
${additionalContext ? `Additional Context: ${additionalContext}` : ""}

Create a comprehensive blog post outline that includes:
1. An engaging introduction that hooks the reader
2. 3-5 main sections with clear headings
3. Key points to cover under each section
4. A compelling conclusion with a call-to-action

Format the outline in markdown with proper heading hierarchy (## for main sections, ### for subsections).

Important:
- Make the outline actionable and specific
- Include suggestions for examples or data points where relevant
- Consider SEO best practices in the structure
- Keep the tone professional but engaging

Generate the outline now:`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const firstCandidate = response.candidates?.[0];
    const content = firstCandidate?.content;
    const parts = content?.parts;
    const firstPart = parts?.[0];
    const outline = firstPart?.text ?? "";

    if (!outline) {
      throw new Error("No outline generated");
    }

    return NextResponse.json({ outline });
  } catch {
    const fallbackOutline = generateFallbackOutline(
      requestData.title || "Blog Post",
      requestData.description,
      requestData.topics,
    );

    return NextResponse.json({ outline: fallbackOutline });
  }
}

function generateFallbackOutline(
  title: string,
  description?: string,
  topics?: string[],
): string {
  return `# ${title}

## Introduction
- Hook the reader with an interesting opening
- Briefly introduce the topic
${description ? `- ${description}` : "- State the main premise of the article"}
- Preview what readers will learn

## Background/Context
- Provide necessary background information
- Define key terms if needed
- Set the stage for the main content

## Main Section 1
${topics?.[0] ? `### ${topics[0]}` : "### Key Point 1"}
- Discuss the first major point
- Include relevant examples
- Provide supporting evidence or data

## Main Section 2
${topics?.[1] ? `### ${topics[1]}` : "### Key Point 2"}
- Explore the second major aspect
- Connect to the previous section
- Add practical insights

## Main Section 3
${topics?.[2] ? `### ${topics[2]}` : "### Key Point 3"}
- Cover the third important element
- Include actionable tips
- Reference real-world applications

## Practical Tips/How-To
- List actionable steps readers can take
- Provide specific recommendations
- Include tools or resources if relevant

## Conclusion
- Summarize the key takeaways
- Reinforce the main message
- Include a call-to-action for readers

---

*Note: This is a template outline. Configure Vertex AI for AI-generated outlines.*`;
}
