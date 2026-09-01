/**
 * Compresses and resizes an image file, converting it to WebP format.
 * Includes validation for file type and size.
 *
 * @param file The image file to compress
 * @param maxSize The maximum width or height of the output image (default: 400px)
 * @param quality The WebP compression quality from 0 to 1 (default: 0.6)
 * @returns A Promise that resolves to the compressed image Data URL
 */
export async function compressImageToWebP(
	file: File,
	maxSize: number = 400,
	quality: number = 0.6,
): Promise<string> {
	return new Promise((resolve, reject) => {
		const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
		if (!validTypes.includes(file.type)) {
			reject(new Error("Only JPEG, PNG, and WebP images are allowed."));
			return;
		}

		const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
		if (file.size > maxSizeInBytes) {
			reject(new Error("Image size must be less than 2MB."));
			return;
		}

		const reader = new FileReader();
		reader.onload = (event) => {
			if (event.target?.result) {
				const img = new Image();
				img.onload = () => {
					const canvas = document.createElement("canvas");
					let width = img.width;
					let height = img.height;

					if (width > height && width > maxSize) {
						height *= maxSize / width;
						width = maxSize;
					} else if (height > maxSize) {
						width *= maxSize / height;
						height = maxSize;
					}

					canvas.width = width;
					canvas.height = height;
					const ctx = canvas.getContext("2d");
					ctx?.drawImage(img, 0, 0, width, height);

					const dataUrl = canvas.toDataURL("image/webp", quality);
					resolve(dataUrl);
				};
				img.onerror = () => reject(new Error("Failed to load image for compression."));
				img.src = event.target.result as string;
			} else {
				reject(new Error("Failed to read the file."));
			}
		};
		reader.onerror = () => {
			reject(new Error("Failed to read the file."));
		};
		reader.readAsDataURL(file);
	});
}
