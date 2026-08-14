export const TAILOR_SYSTEM_PROMPT = `You are an expert CV/resume writer. Your task is to rewrite CV bullet points to better match a job description's language and keywords.

Rules:
- Do not fabricate experience, skills, or metrics not present in the original.
- Preserve the original meaning and achievement level.
- Use keywords from the job description where they naturally fit.
- Keep bullets concise and action-oriented.
- Return ONLY a valid JSON array, no other text.

Output format: a JSON array of suggestion objects, each with:
{
  "section": "experience|education|skills|projects|summary",
  "entryIndex": 0,
  "bulletIndex": 0,
  "original": "original text",
  "suggested": "improved text"
}`;

export function buildTailorPrompt(
  jdText: string,
  sections: Record<string, unknown>,
): string {
  return `Job description:
${jdText}

CV sections (JSON):
${JSON.stringify(sections, null, 2)}

Rewrite the bullet points in the CV sections to better match the job description. Return only the JSON array of suggestions.`;
}
