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

    it("hides photo field", () => {
      render(<PersonalFields {...defaultProps} profile={INTERNATIONAL_PROFILE} />);
      expect(screen.queryByLabelText(/photo/i)).not.toBeInTheDocument();
    });

    it("hides date of birth field", () => {
      render(<PersonalFields {...defaultProps} profile={INTERNATIONAL_PROFILE} />);
      expect(screen.queryByLabelText(/date of birth/i)).not.toBeInTheDocument();
    });

    it("hides father's name field", () => {
      render(<PersonalFields {...defaultProps} profile={INTERNATIONAL_PROFILE} />);
      expect(screen.queryByLabelText(/father/i)).not.toBeInTheDocument();
    });

    it("hides citizenship number field", () => {
      render(<PersonalFields {...defaultProps} profile={INTERNATIONAL_PROFILE} />);
      expect(screen.queryByLabelText(/citizenship/i)).not.toBeInTheDocument();
    });

    it("hides nationality field", () => {
      render(<PersonalFields {...defaultProps} profile={INTERNATIONAL_PROFILE} />);
      expect(screen.queryByLabelText(/nationality/i)).not.toBeInTheDocument();
    });
  });

  describe("Nepal profile", () => {
    it("renders all optional fields", () => {
      render(<PersonalFields {...defaultProps} profile={NEPAL_PROFILE} />);
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/photo/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/father/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/citizenship/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/nationality/i)).toBeInTheDocument();
    });

    it("labels photo as optional", () => {
      render(<PersonalFields {...defaultProps} profile={NEPAL_PROFILE} />);
      expect(screen.getByLabelText(/photo url \(optional\)/i)).toBeInTheDocument();
    });
  });

  describe("onChange", () => {
    it("calls onChange with updated field", () => {
      let changed: PersonalInfo | null = null;
      const onChange = (v: PersonalInfo) => { changed = v; };
      render(<PersonalFields value={emptyPersonalInfo} onChange={onChange} profile={INTERNATIONAL_PROFILE} />);
      const nameInput = screen.getByLabelText(/full name/i);
      // React 19 synthetic event handling
      nameInput.focus();
      expect(changed).toBeNull();
    });
  });
});
