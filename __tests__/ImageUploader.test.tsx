import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";
import { ImageUploader } from "@/components/ImageUploader";
import "@testing-library/jest-dom";

global.FileReader = class {
  readAsDataURL = vi.fn();
  onload = vi.fn();
};

describe("ImageUploader Component", () => {
  it("renders the dialog and upload button", () => {
    render(<ImageUploader onUpload={vi.fn()} />);

    expect(screen.getByText("Upload Image or SVG")).toBeInTheDocument();
    expect(screen.getByText("Click to upload or drag and drop")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /upload image or svg/i })).toBeInTheDocument();
  });

  it("calls onUpload when a valid file is uploaded", async () => {
    const onUploadMock = vi.fn();
    render(<ImageUploader onUpload={onUploadMock} />);

    const input = document.querySelector("input[type='file']") as HTMLInputElement;
    const file = new File(["dummy-content"], "test-image.png", { type: "image/png" });

    await userEvent.upload(input, file);

    expect(onUploadMock).toHaveBeenCalledTimes(1);
    expect(onUploadMock).toHaveBeenCalledWith(expect.stringContaining("data:image/png;base64"));
  });

  it("shows an error message when an invalid file is uploaded", async () => {
    render(<ImageUploader onUpload={vi.fn()} />);

    const input = document.querySelector("input[type='file']") as HTMLInputElement;
    const invalidFile = new File(["invalid"], "test.txt", { type: "text/plain" });

    await userEvent.upload(input, invalidFile);

    expect(screen.getByText("Please select a valid image or SVG file")).toBeInTheDocument();
  });

  it("calls onUpload when a file is dropped", async () => {
    const onUploadMock = vi.fn();
    render(<ImageUploader onUpload={onUploadMock} />);

    const dropzone = screen.getByText("Click to upload or drag and drop");

    const file = new File(["dummy-content"], "test-image.jpg", { type: "image/jpeg" });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    fireEvent.drop(dropzone, { dataTransfer });

    expect(onUploadMock).toHaveBeenCalledTimes(1);
    expect(onUploadMock).toHaveBeenCalledWith(expect.stringContaining("data:image/jpeg;base64"));
  });
});
