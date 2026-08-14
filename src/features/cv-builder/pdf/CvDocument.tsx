import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import type { CvSections } from "@/features/cv-builder/types";
import type { RegionProfile } from "@/features/region-profiles/types";

// ATS-safe: single column, linear reading order, standard fonts (real
// selectable text — never rasterized). See docs/decisions/0001-pdf-renderer.md.
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10.5,
    fontFamily: "Helvetica",
    color: "#141413",
  },
  name: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  contactLine: {
    fontSize: 9.5,
    color: "#3a3a38",
    marginBottom: 2,
  },
  photo: {
    width: 64,
    height: 64,
    marginBottom: 8,
    objectFit: "cover",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  headerText: {
    flexGrow: 1,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    borderBottom: "1 solid #d9d8d3",
    paddingBottom: 2,
    marginTop: 14,
    marginBottom: 6,
  },
  entry: {
    marginBottom: 8,
  },
  entryHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  entryTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10.5,
  },
  entrySubtitle: {
    fontSize: 10,
    color: "#3a3a38",
    marginBottom: 3,
  },
  dateRange: {
    fontSize: 9.5,
    color: "#3a3a38",
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 1.5,
  },
  bulletDot: {
    width: 10,
  },
  bulletText: {
    flex: 1,
  },
  skillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  skillChip: {
    fontSize: 9.5,
  },
});

function formatDateRange(start: string, end: string, current: boolean) {
  const fmt = (v: string) => v || "—";
  return `${fmt(start)} – ${current ? "Present" : fmt(end)}`;
}

interface Props {
  cvName: string;
  sections: CvSections;
  profile: RegionProfile;
}

export function CvDocument({ sections, profile }: Props) {
  const { personal, fields } = { personal: sections.personal, fields: profile.fields };
  const contactParts = [personal.email, personal.phone, personal.location].filter(Boolean);

  const extraLine = [
    fields.dateOfBirth !== "hidden" && personal.dateOfBirth ? `DOB: ${personal.dateOfBirth}` : null,
    fields.nationality !== "hidden" && personal.nationality ? `Nationality: ${personal.nationality}` : null,
    fields.fatherName !== "hidden" && personal.fatherName ? `Father's name: ${personal.fatherName}` : null,
    fields.citizenshipNumber !== "hidden" && personal.citizenshipNumber
      ? `Citizenship no.: ${personal.citizenshipNumber}`
      : null,
  ]
    .filter(Boolean)
    .join("  •  ");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text style={styles.name}>{personal.fullName || "Your Name"}</Text>
            {contactParts.length > 0 && <Text style={styles.contactLine}>{contactParts.join("  •  ")}</Text>}
            {extraLine && <Text style={styles.contactLine}>{extraLine}</Text>}
          </View>
          {fields.photo !== "hidden" && personal.photoUrl && (
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image src={personal.photoUrl} style={styles.photo} />
          )}
        </View>

        {sections.summary && (
          <View>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text>{sections.summary}</Text>
          </View>
        )}

        {sections.experience.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Experience</Text>
            {sections.experience.map((entry) => (
              <View key={entry.id} style={styles.entry} wrap={false}>
                <View style={styles.entryHeaderRow}>
                  <Text style={styles.entryTitle}>
                    {entry.role}
                    {entry.company ? ` — ${entry.company}` : ""}
                  </Text>
                  <Text style={styles.dateRange}>
                    {formatDateRange(entry.startDate, entry.endDate, entry.current)}
                  </Text>
                </View>
                {entry.location && <Text style={styles.entrySubtitle}>{entry.location}</Text>}
                {entry.bullets.filter(Boolean).map((bullet, i) => (
                  <View key={i} style={styles.bullet}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {sections.education.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Education</Text>
            {sections.education.map((entry) => (
              <View key={entry.id} style={styles.entry} wrap={false}>
                <View style={styles.entryHeaderRow}>
                  <Text style={styles.entryTitle}>
                    {entry.degree}
                    {entry.field ? `, ${entry.field}` : ""}
                  </Text>
                  <Text style={styles.dateRange}>{formatDateRange(entry.startDate, entry.endDate, false)}</Text>
                </View>
                {entry.institution && <Text style={styles.entrySubtitle}>{entry.institution}</Text>}
              </View>
            ))}
          </View>
        )}

        {sections.skills.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text style={styles.skillsRow}>{sections.skills.join("  •  ")}</Text>
          </View>
        )}

        {sections.projects.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Projects</Text>
            {sections.projects.map((entry) => (
              <View key={entry.id} style={styles.entry} wrap={false}>
                <Text style={styles.entryTitle}>
                  {entry.name}
                  {entry.link ? ` — ${entry.link}` : ""}
                </Text>
                {entry.description && <Text style={styles.entrySubtitle}>{entry.description}</Text>}
                {entry.bullets.filter(Boolean).map((bullet, i) => (
                  <View key={i} style={styles.bullet}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {profile.fields.declaration && sections.declaration && (
          <View>
            <Text style={styles.sectionTitle}>Declaration</Text>
            <Text>{sections.declaration}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
