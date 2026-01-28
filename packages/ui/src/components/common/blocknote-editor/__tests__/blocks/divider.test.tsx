import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// Mock the BlockNote createReactBlockSpec
vi.mock("@blocknote/react", () => ({
  createReactBlockSpec: vi.fn((config, { render: renderFn }) => {
    // Return a component that calls the render function
    const MockBlock = (props: any) => {
      return renderFn(props);
    };
    MockBlock.config = config;
    MockBlock.render = renderFn;
    return MockBlock;
  }),
}));

import { Divider } from "../../blocks/divider";

describe("Divider Block", () => {
  describe("block configuration", () => {
    it("should have correct type", () => {
      expect(Divider.config.type).toBe("divider");
    });

    it("should have empty propSchema", () => {
      expect(Divider.config.propSchema).toEqual({});
    });

    it("should have content set to none", () => {
      expect(Divider.config.content).toBe("none");
    });
  });

  describe("render function", () => {
    it("should render a horizontal rule", () => {
      const { container } = render(<Divider />);
      const hr = container.querySelector("hr");
      expect(hr).toBeInTheDocument();
    });

    it("should have correct wrapper classes", () => {
      const { container } = render(<Divider />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("p-2", "w-full");
    });

    it("should have correct hr classes", () => {
      const { container } = render(<Divider />);
      const hr = container.querySelector("hr");
      expect(hr).toHaveClass("border-t", "mx-0", "my-0");
    });
  });
});
