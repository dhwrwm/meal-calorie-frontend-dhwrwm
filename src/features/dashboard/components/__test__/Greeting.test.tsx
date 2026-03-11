import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Greeting from "../Greeting";
import { useGreeting } from "../../hooks/useGreeting";
import { useAuthStore } from "@/store/auth.store";

vi.mock("@/store/auth.store", () => ({
  useAuthStore: vi.fn(),
}));

vi.mock("../../hooks/useGreeting", () => ({
  useGreeting: vi.fn(),
}));

vi.mock("@/lib/fonts", () => ({
  dmSans: { className: "dmSans" },
  playfairDisplay: { className: "playfairDisplay" },
}));

const mockUseAuthStore = useAuthStore as unknown as ReturnType<typeof vi.fn>;
const mockUseGreeting = useGreeting as unknown as ReturnType<typeof vi.fn>;

describe("Greeting", () => {
  const mockUser = { first_name: "Dhwrwm" };
  const mockGreeting = {
    greeting: "Morning",
    icon: "☀️",
    sub: "Hope you have a productive day!",
    dateDayString: "Saturday, March 11",
  };

  beforeEach(() => {
    mockUseAuthStore.mockReturnValue(mockUser);
    mockUseGreeting.mockReturnValue(mockGreeting);
  });

  it("renders the greeting text with user's name and icon", () => {
    render(<Greeting />);
    expect(screen.getByText("Good Morning ☀️")).toBeInTheDocument();
    expect(screen.getByText(/Dhwrwm 👋/)).toBeInTheDocument();
  });

  it("renders the date string", () => {
    render(<Greeting />);
    expect(screen.getByText("Saturday, March 11")).toBeInTheDocument();
  });

  it("renders the subtext", () => {
    render(<Greeting />);
    expect(
      screen.getByText("Hope you have a productive day!"),
    ).toBeInTheDocument();
  });

  it("applies the font classes", () => {
    const { container } = render(<Greeting />);
    expect(container.querySelector(".playfairDisplay")).toBeInTheDocument();
    expect(container.querySelector(".dmSans")).toBeInTheDocument();
  });
});
