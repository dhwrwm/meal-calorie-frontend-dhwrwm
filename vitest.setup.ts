import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("next/font/google", () => ({
  Playfair_Display: () => ({ className: "playfairDisplay" }),
  DM_Sans: () => ({ className: "dmSans" }),
  Poppins: () => ({ className: "poppins" }),
}));

// Prevent real fetch calls in all tests
global.fetch = vi.fn();
