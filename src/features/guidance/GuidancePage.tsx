import {
  bulletExamples,
  bulletFormula,
  linksGuidance,
  regionSensitiveFields,
  summaryExamples,
  summaryFormula,
  universallyAvoid,
} from "@/features/guidance/content";
import { GoodCvExample } from "@/features/guidance/GoodCvExample";
import { BadCvExample } from "@/features/guidance/BadCvExample";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 text-2xl">{children}</h2>;
}

export function GuidancePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <h1 className="mb-2 font-display text-3xl font-bold tracking-tight text-foreground">How to write a CV that gets read</h1>
        <p className="mb-10 max-w-3xl text-muted-foreground">
          What actually moves a CV forward, based on what hiring managers and ATS systems respond to,
          not guesswork.
        </p>

        <section className="mb-14">
          <SectionHeading>See it in practice</SectionHeading>
          <p className="mb-4 max-w-3xl text-muted-foreground">
            Same person, same experience, two very different CVs. The callouts explain why each choice
            helps or hurts.
          </p>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <div className="mb-2 text-sm font-medium text-primary">Good example</div>
              <GoodCvExample />
            </div>
            <div>
              <div className="mb-2 text-sm font-medium text-destructive">What to avoid</div>
              <BadCvExample />
            </div>
          </div>
        </section>

        <div className="max-w-3xl">
          <section className="mb-12">
            <SectionHeading>Experience bullets</SectionHeading>
            <p className="mb-4 text-muted-foreground">
              Formula: <span className="text-foreground">{bulletFormula}</span> If you cannot measure the
              result directly, use volume, frequency, or scale instead of a raw percentage.
            </p>
            <div className="flex flex-col gap-4">
              {bulletExamples.map((example, i) => (
                <Card key={i}>
                  <CardContent className="flex flex-col gap-2 pt-6 text-sm">
                    <div>
                      <span className="text-destructive">Weak: </span>
                      {example.weak}
                    </div>
                    <div>
                      <span className="text-primary">Strong: </span>
                      {example.strong}
                    </div>
                    <div className="text-muted-foreground">{example.why}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
  
          <section className="mb-12">
            <SectionHeading>Summary</SectionHeading>
            <p className="mb-4 text-muted-foreground">
              Formula: <span className="text-foreground">{summaryFormula}</span>
            </p>
            <div className="flex flex-col gap-4">
              {summaryExamples.map((example) => (
                <Card key={example.label}>
                  <CardHeader>
                    <CardTitle className="text-base font-normal text-muted-foreground">
                      {example.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2 pt-0 text-sm">
                    <div>
                      <span className="text-destructive">Weak: </span>
                      {example.weak}
                    </div>
                    <div>
                      <span className="text-primary">Strong: </span>
                      {example.strong}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
  
          <section className="mb-12">
            <SectionHeading>LinkedIn, GitHub, and other profiles</SectionHeading>
            <div className="flex flex-col gap-3">
              {linksGuidance.map((entry) => (
                <div key={entry.item} className="rounded-md border border-border p-4">
                  <div className="mb-1 text-sm">{entry.item}</div>
                  <div className="text-sm text-muted-foreground">{entry.guidance}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <SectionHeading>Avoid, regardless of region</SectionHeading>
            <div className="flex flex-col gap-3">
              {universallyAvoid.map((entry) => (
                <div key={entry.item} className="rounded-md border border-border p-4">
                  <div className="mb-1 text-sm">{entry.item}</div>
                  <div className="text-sm text-muted-foreground">{entry.guidance}</div>
                </div>
              ))}
            </div>
          </section>
  
          <section>
            <SectionHeading>Personal details: photo, date of birth, and similar fields</SectionHeading>
            <p className="mb-4 text-muted-foreground">
              OrbitCV shows or hides these per CV format for a reason, not by default convention:
            </p>
            <div className="flex flex-col gap-3">
              {regionSensitiveFields.map((entry) => (
                <div key={entry.item} className="rounded-md border border-border p-4">
                  <div className="mb-1 text-sm">{entry.item}</div>
                  <div className="text-sm text-muted-foreground">{entry.guidance}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
  );
}
