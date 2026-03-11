import { describe, it, expect, vi, beforeEach } from "vitest";
import { useGreeting } from "../useGreeting";

// ─── Mocks ───────────────────────────────────────────────────────────────────

vi.mock("@/lib/dayjs", () => {
  const mockDayjs: any = () => mockDayjs;
  mockDayjs.hour = vi.fn();
  mockDayjs.format = vi.fn(() => "Wednesday, Mar 11");
  return { default: mockDayjs };
});

import dayjs from "@/lib/dayjs";
const mockDayjs = dayjs as any;

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("useGreeting", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDayjs.format.mockReturnValue("Wednesday, Mar 11");
  });

  it("returns morning greeting before noon", () => {
    mockDayjs.hour.mockReturnValue(8);

    const result = useGreeting();

    expect(result.greeting).toBe("morning");
    expect(result.icon).toBe("🌤️");
    expect(result.sub).toBe("Hope your day is off to a great start.");
  });

  it("returns afternoon greeting between 12 and 17", () => {
    mockDayjs.hour.mockReturnValue(14);

    const result = useGreeting();

    expect(result.greeting).toBe("afternoon");
    expect(result.icon).toBe("☀️");
    expect(result.sub).toBe("Keep the momentum going.");
  });

  it("returns evening greeting at 17 or later", () => {
    mockDayjs.hour.mockReturnValue(19);

    const result = useGreeting();

    expect(result.greeting).toBe("evening");
    expect(result.icon).toBe("🌙");
    expect(result.sub).toBe("Time to wind down and reflect.");
  });

  it("returns morning at hour 0 (midnight)", () => {
    mockDayjs.hour.mockReturnValue(0);

    expect(useGreeting().greeting).toBe("morning");
  });

  it("returns morning at hour 11", () => {
    mockDayjs.hour.mockReturnValue(11);

    expect(useGreeting().greeting).toBe("morning");
  });

  it("returns afternoon at hour 12", () => {
    mockDayjs.hour.mockReturnValue(12);

    expect(useGreeting().greeting).toBe("afternoon");
  });

  it("returns afternoon at hour 16", () => {
    mockDayjs.hour.mockReturnValue(16);

    expect(useGreeting().greeting).toBe("afternoon");
  });

  it("returns evening at hour 17", () => {
    mockDayjs.hour.mockReturnValue(17);

    expect(useGreeting().greeting).toBe("evening");
  });

  it("includes formatted date string", () => {
    mockDayjs.hour.mockReturnValue(9);
    mockDayjs.format.mockReturnValue("Wednesday, Mar 11");

    const result = useGreeting();

    expect(result.dateDayString).toBe("Wednesday, Mar 11");
  });
});
