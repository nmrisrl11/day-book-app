import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { compressImageToWebP } from "../image-utils";

describe("compressImageToWebP", () => {
	// Mock File class
	class MockFile {
		name: string;
		type: string;
		size: number;
		constructor(bits: BlobPart[], name: string, options?: FilePropertyBag) {
			this.name = name;
			this.type = options?.type || "";
			this.size = bits.reduce((acc, bit) => acc + (typeof bit === "string" ? bit.length : 0), 0);
		}
	}

	beforeEach(() => {
		// Replace global File if it doesn't exist
		if (typeof globalThis.File === "undefined") {
			(globalThis as any).File = MockFile;
		}

		// Mock FileReader
		class MockFileReader {
			onload: any = null;
			onerror: any = null;
			readAsDataURL(_file: any) {
				setTimeout(() => {
					if (this.onload) {
						this.onload({ target: { result: "data:image/jpeg;base64,mockdata" } });
					}
				}, 0);
			}
		}
		(globalThis as any).FileReader = MockFileReader;

		// Mock Image
		class MockImage {
			width = 800;
			height = 600;
			onload: any = null;
			onerror: any = null;

			set src(_val: string) {
				setTimeout(() => {
					if (this.onload) this.onload();
				}, 0);
			}
		}
		(globalThis as any).Image = MockImage;

		// Mock document.createElement for canvas
		const mockContext = {
			drawImage: vi.fn(),
		};
		const mockCanvas = {
			width: 0,
			height: 0,
			getContext: vi.fn(() => mockContext),
			toDataURL: vi.fn(() => "data:image/webp;base64,mockwebp"),
		};

		if (typeof globalThis.document === "undefined") {
			(globalThis as any).document = {
				createElement: vi.fn(),
			};
		}

		vi.spyOn(globalThis.document, "createElement").mockImplementation((tag) => {
			if (tag === "canvas") return mockCanvas as any;
			return {} as any;
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("rejects invalid file types", async () => {
		const file = new File(["mock content"], "test.txt", { type: "text/plain" });

		await expect(compressImageToWebP(file)).rejects.toThrow(
			"Only JPEG, PNG, and WebP images are allowed.",
		);
	});

	it("rejects files larger than 2MB", async () => {
		// Create a mock file with size > 2MB (2 * 1024 * 1024 = 2097152)
		const largeContent = "a".repeat(3000000);
		const file = new File([largeContent], "large.jpg", { type: "image/jpeg" });

		await expect(compressImageToWebP(file)).rejects.toThrow("Image size must be less than 2MB.");
	});

	it("successfully compresses a valid image", async () => {
		const file = new File(["mock content"], "test.jpg", { type: "image/jpeg" });

		const result = await compressImageToWebP(file);
		expect(result).toBe("data:image/webp;base64,mockwebp");
	});

	it("resizes image dimensions if they exceed maxSize", async () => {
		// The mock Image defaults to 800x600.
		// If maxSize is 400, it should resize to 400x300.
		const file = new File(["mock content"], "test.jpg", { type: "image/jpeg" });

		const mockCanvas = document.createElement("canvas");

		await compressImageToWebP(file, 400);

		// Canvas dimensions should be set to the resized dimensions
		expect(mockCanvas.width).toBe(400);
		expect(mockCanvas.height).toBe(300);
	});

	it("handles FileReader errors", async () => {
		class ErrorFileReader {
			onload: any = null;
			onerror: any = null;
			readAsDataURL() {
				setTimeout(() => {
					if (this.onerror) this.onerror();
				}, 0);
			}
		}
		(globalThis as any).FileReader = ErrorFileReader;

		const file = new File(["mock content"], "test.jpg", { type: "image/jpeg" });
		await expect(compressImageToWebP(file)).rejects.toThrow("Failed to read the file.");
	});

	it("handles Image load errors", async () => {
		class ErrorImage {
			onload: any = null;
			onerror: any = null;
			set src(_val: string) {
				setTimeout(() => {
					if (this.onerror) this.onerror();
				}, 0);
			}
		}
		(globalThis as any).Image = ErrorImage;

		const file = new File(["mock content"], "test.jpg", { type: "image/jpeg" });
		await expect(compressImageToWebP(file)).rejects.toThrow(
			"Failed to load image for compression.",
		);
	});
});
