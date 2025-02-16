import os
from PIL import Image

INPUT_FOLDER = "input_images"
OUTPUT_FOLDER = "fixed_images"

# Ensure output directory exists
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

for filename in os.listdir(INPUT_FOLDER):
    if filename.endswith(".png"):
        img = Image.open(os.path.join(INPUT_FOLDER, filename))
        img = img.convert("RGBA")  # Ensure it's RGBA format

        # Convert white background to transparent
        data = img.getdata()
        new_data = []
        for item in data:
            # If pixel is close to white, make it transparent
            if item[0] > 230 and item[1] > 230 and item[2] > 230:
                new_data.append((255, 255, 255, 0))  # Fully transparent
            else:
                new_data.append(item)  # Keep original pixel

        img.putdata(new_data)
        img.save(os.path.join(OUTPUT_FOLDER, filename))
        print(f"✅ Fixed transparency: {filename}")

print("\n🎯 All images are now transparent and ready for cropping!")
