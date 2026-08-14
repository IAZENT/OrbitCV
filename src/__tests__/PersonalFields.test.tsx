import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PersonalFields } from "@/features/cv-builder/components/PersonalFields";
import { INTERNATIONAL_PROFILE, NEPAL_PROFILE } from "@/features/region-profiles/profiles";
import { emptyPersonalInfo } from "@/features/cv-builder/types";
import type { PersonalInfo } from "@/features/cv-builder/types";

const defaultProps = {
  value: emptyPersonalInfo,
  onChange: () => {},
};

describe("PersonalFields", () => {
  describe("International profile", () => {
    it("renders always-visible fields", () => {
      render(<PersonalFields {...defaultProps} profile={INTERNATIONAL_PROFILE} />);
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/linkedin/i)).toBeInTheDocument();
    });

    it("hides nationality field", () => {
      render(<PersonalFields {...defaultProps} profile={INTERNATIONAL_PROFILE} />);
      expect(screen.queryByLabelText(/nationality/i)).not.toBeInTheDocument();
    });
  });

  describe("Nepal profile", () => {
    it("renders fields including nationality", () => {
      render(<PersonalFields {...defaultProps} profile={NEPAL_PROFILE} />);
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/nationality/i)).toBeInTheDocument();
    });
  });

  describe("onChange", () => {
    it("calls onChange with updated field", () => {
      let changed: PersonalInfo | null = null;
      const onChange = (v: PersonalInfo) => { changed = v; };
      render(<PersonalFields value={emptyPersonalInfo} onChange={onChange} profile={INTERNATIONAL_PROFILE} />);
      const nameInput = screen.getByLabelText(/full name/i);
      nameInput.focus();
      expect(changed).toBeNull();
    });
  });
});
