import type { CvSections } from "@/features/cv-builder/types";
import type { RegionProfile } from "@/features/region-profiles/types";
import { PersonalFields } from "@/features/cv-builder/components/PersonalFields";
import { ExperienceSection } from "@/features/cv-builder/components/ExperienceSection";
import { EducationSection } from "@/features/cv-builder/components/EducationSection";
import { ProjectsSection } from "@/features/cv-builder/components/ProjectsSection";
import { SkillsField } from "@/features/cv-builder/components/SkillsField";
import { Textarea } from "@/components/ui/textarea";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 text-xl">{children}</h2>;
}

interface Props {
  sections: CvSections;
  onChange: (sections: CvSections) => void;
  profile: RegionProfile;
}

export function CvSectionsForm({ sections, onChange, profile }: Props) {
  return (
    <>
      <section className="mb-10">
        <SectionHeading>Personal details</SectionHeading>
        <PersonalFields
          value={sections.personal}
          profile={profile}
          onChange={(personal) => onChange({ ...sections, personal })}
        />
      </section>

      <section className="mb-10">
        <SectionHeading>Summary</SectionHeading>
        <Textarea
          rows={4}
          value={sections.summary}
          onChange={(e) => onChange({ ...sections, summary: e.target.value })}
          placeholder="A short professional summary…"
        />
      </section>

      <section className="mb-10">
        <SectionHeading>Experience</SectionHeading>
        <ExperienceSection
          entries={sections.experience}
          onChange={(experience) => onChange({ ...sections, experience })}
        />
      </section>

      <section className="mb-10">
        <SectionHeading>Education</SectionHeading>
        <EducationSection
          entries={sections.education}
          onChange={(education) => onChange({ ...sections, education })}
        />
      </section>

      <section className="mb-10">
        <SectionHeading>Skills</SectionHeading>
        <SkillsField skills={sections.skills} onChange={(skills) => onChange({ ...sections, skills })} />
      </section>

      <section className="mb-10">
        <SectionHeading>Projects</SectionHeading>
        <ProjectsSection
          entries={sections.projects}
          onChange={(projects) => onChange({ ...sections, projects })}
        />
      </section>

      {profile.fields.declaration && (
        <section className="mb-10">
          <SectionHeading>Declaration</SectionHeading>
          <Textarea
            rows={3}
            value={sections.declaration}
            onChange={(e) => onChange({ ...sections, declaration: e.target.value })}
            placeholder="I hereby declare that the above information is true to the best of my knowledge."
          />
        </section>
      )}
    </>
  );
}
