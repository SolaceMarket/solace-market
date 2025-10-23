import { beforeEach, describe, expect, it } from "vitest";
import { TestDataGenerator } from "@/tests/utils/test-helpers";

describe("Dummy Group Test", () => {
  beforeEach(() => {
    TestDataGenerator.resetCounter();
  });

  describe("Dummy Test case", () => {
    it("should create a new crypto asset", async () => {
      const expectation = true;
      expect(expectation).toBe(true);
    });
  });
});
