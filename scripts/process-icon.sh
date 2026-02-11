#!/bin/bash

# macOS App Icon Processing Script
# Processes an icon image to meet macOS app icon specifications:
# - Canvas: 1024x1024
# - Art area: 832x832 (13/16 of canvas)
# - Corner radius: ~183px (22% of art area)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
CANVAS_SIZE=1024
ART_SIZE=832
CORNER_RADIUS=183

# Parse arguments
INPUT_FILE=""
OUTPUT_FILE=""

while [[ $# -gt 0 ]]; do
  case $1 in
    -i|--input)
      INPUT_FILE="$2"
      shift 2
      ;;
    -o|--output)
      OUTPUT_FILE="$2"
      shift 2
      ;;
    -h|--help)
      echo "Usage: $0 -i INPUT_FILE -o OUTPUT_FILE"
      echo ""
      echo "Processes an icon image to meet macOS app icon specifications."
      echo ""
      echo "Options:"
      echo "  -i, --input    Input image file path"
      echo "  -o, --output   Output image file path"
      echo "  -h, --help     Show this help message"
      echo ""
      echo "Example:"
      echo "  $0 -i icon.png -o app-icon.png"
      exit 0
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      exit 1
      ;;
  esac
done

# Validate arguments
if [[ -z "$INPUT_FILE" ]]; then
  echo -e "${RED}Error: Input file is required. Use -i to specify.${NC}"
  echo "Use -h or --help for usage information."
  exit 1
fi

if [[ -z "$OUTPUT_FILE" ]]; then
  echo -e "${RED}Error: Output file is required. Use -o to specify.${NC}"
  echo "Use -h or --help for usage information."
  exit 1
fi

# Check if input file exists
if [[ ! -f "$INPUT_FILE" ]]; then
  echo -e "${RED}Error: Input file '$INPUT_FILE' not found.${NC}"
  exit 1
fi

# Check if ImageMagick is installed
if ! command -v magick &> /dev/null; then
  echo -e "${RED}Error: ImageMagick is not installed.${NC}"
  echo ""
  echo "Install ImageMagick:"
  echo "  macOS:   brew install imagemagick"
  echo "  Ubuntu:  sudo apt-get install imagemagick"
  echo "  Fedora:  sudo dnf install imagemagick"
  exit 1
fi

echo -e "${YELLOW}Processing icon...${NC}"
echo "Input:  $INPUT_FILE"
echo "Output: $OUTPUT_FILE"
echo ""

# Get input image dimensions
INPUT_DIMS=$(magick identify -format "%wx%h" "$INPUT_FILE" 2>/dev/null) || true
echo "Input dimensions: $INPUT_DIMS"

# Step 1: Resize to 832x832
echo -e "${GREEN}Step 1: Resizing to ${ART_SIZE}x${ART_SIZE}...${NC}"
magick "$INPUT_FILE" -resize ${ART_SIZE}x${ART_SIZE} /tmp/icon_step1.png

# Step 2: Create rounded corners using mask
echo -e "${GREEN}Step 2: Applying rounded corners (${CORNER_RADIUS}px radius)...${NC}"

# Create a mask with rounded corners
magick -size ${ART_SIZE}x${ART_SIZE} xc:none \
  -fill white \
  -draw "roundRectangle 0,0 ${ART_SIZE},${ART_SIZE} ${CORNER_RADIUS},${CORNER_RADIUS}" \
  /tmp/mask.png

# Apply mask to image
magick /tmp/icon_step1.png \
  /tmp/mask.png \
  -alpha set \
  -compose DstIn \
  -composite \
  /tmp/icon_step2.png

# Step 3: Place on 1024x1024 canvas (transparent background)
echo -e "${GREEN}Step 3: Placing on ${CANVAS_SIZE}x${CANVAS_SIZE} canvas...${NC}"
OFFSET=$(( (CANVAS_SIZE - ART_SIZE) / 2 ))
magick -size ${CANVAS_SIZE}x${CANVAS_SIZE} xc:none \
  /tmp/icon_step2.png \
  -geometry +${OFFSET}+${OFFSET} \
  -composite \
  "$OUTPUT_FILE"

# Clean up temp files
rm -f /tmp/icon_step1.png /tmp/icon_step2.png /tmp/mask.png

# Verify output
OUTPUT_DIMS=$(magick identify -format "%wx%h" "$OUTPUT_FILE" 2>/dev/null) || true
echo ""
echo -e "${GREEN}Done!${NC}"
echo "Output dimensions: $OUTPUT_DIMS"
echo "Saved to: $OUTPUT_FILE"
echo ""
echo "Icon now meets macOS specifications:"
echo "  - Canvas: ${CANVAS_SIZE}x${CANVAS_SIZE}"
echo "  - Art area: ${ART_SIZE}x${ART_SIZE}"
echo "  - Corner radius: ${CORNER_RADIUS}px"
