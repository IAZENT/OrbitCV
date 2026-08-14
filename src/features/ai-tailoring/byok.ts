import { decryptApiKey } from "@/features/settings/crypto";
import { TAILOR_SYSTEM_PROMPT, buildTailorPrompt } from "@/features/ai-tailoring/prompts";
import type { AiSuggestion } from "@/features/ai-tailoring/types";
import type { CvSections } from "@/features/cv-builder/types";

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

export async function tailorWithBYOK(
  encryptedKey: string,
  iv: string,
  jdText: string,
  sections: CvSections,
): Promise<AiSuggestion[]> {
  const apiKey = await decryptApiKey(encryptedKey, iv);

  // Only send tailorable sections, not personal info.
  const tailorable = {
    summary: sections.summary,
    experience: sections.experience,
    education: sections.education,
    skills: sections.skills,
    projects: sections.projects,
  };

  const prompt = buildTailorPrompt(jdText, tailorable);

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: TAILOR_SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3 },
      }),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error: ${res.status} ${err}`);
  }

  const data: GeminiResponse = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  // Extract JSON from response (may be wrapped in markdown code fences).
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error("No valid JSON array in AI response");

  const raw: Array<Omit<AiSuggestion, "accepted">> = JSON.parse(jsonMatch[0]);
  return raw.map((s) => ({ ...s, accepted: null }));
}
