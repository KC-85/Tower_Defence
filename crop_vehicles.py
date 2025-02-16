import os
import cv2
import numpy as np
from PIL import Image

# Paths for input and output folders
INPUT_FOLDER = "input_images"
OUTPUT_FOLDER = "output_cropped"

# Ensure output directory exists
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

def auto_crop_image(image_path, output_path):
    """ Automatically crops an image by detecting non-transparent areas. """
    # Load image
    img = cv2.imread(image_path, cv2.IMREAD_UNCHANGED)

    if img is None:
        print(f"⚠ Error loading image: {image_path}")
        return

    # Convert to grayscale & create mask for non-transparent areas
    if img.shape[-1] == 4:  # If image has transparency (RGBA)
        alpha_channel = img[:, :, 3]
        mask = alpha_channel > 0  # Keep non-transparent parts
    else:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        _, mask = cv2.threshold(gray, 1, 255, cv2.THRESH_BINARY)

    # Find contours of the object
    contours, _ = cv2.findContours(mask.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    if contours:
        # Get bounding box for the largest contour
        x, y, w, h = cv2.boundingRect(contours[0])
        cropped = img[y:y+h, x:x+w]  # Crop image to bounding box

        # Convert back to PIL Image & save
        pil_image = Image.fromarray(cv2.cvtColor(cropped, cv2.COLOR_BGRA2RGBA))
        pil_image.save(output_path)
        print(f"✅ Cropped & saved: {output_path}")
    else:
        print(f"⚠ No object detected in {image_path}")

# Process all images in the folder
for filename in os.listdir(INPUT_FOLDER):
    if filename.endswith(".png"):  # Process only PNG images
        input_path = os.path.join(INPUT_FOLDER, filename)
        output_path = os.path.join(OUTPUT_FOLDER, filename)
        auto_crop_image(input_path, output_path)

print("\n🎯 All images have been cropped and saved successfully!")
