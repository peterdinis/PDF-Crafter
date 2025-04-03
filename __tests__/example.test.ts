import { describe, it, expect } from "vitest";

describe("Math functions", () => {
  it("adds numbers correctly", () => {
    expect(2 + 3).toBe(5);
  });

  it("multiplies numbers correctly", () => {
    expect(4 * 5).toBe(20);
  });

  it("checks if number is even", () => {
    const isEven = (num: number) => num % 2 === 0;
    expect(isEven(4)).toBe(true);
    expect(isEven(7)).toBe(false);
  });
});