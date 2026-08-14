import { pdf } from "@react-pdf/renderer";
import { CvDocument } from "@/features/cv-builder/pdf/CvDocument";
import type { CvSections } from "@/features/cv-builder/types";
import type { RegionProfile } from "@/features/region-profiles/types";

export async function downloadCvPdf(cvName: string, sections: CvSections, profile: RegionProfile) {
  const blob = await pdf(
    <CvDocument cvName={cvName} sections={sections} profile={profile} />,
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${cvName || "cv"}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
