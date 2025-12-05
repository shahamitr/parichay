'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Crop,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  ZoomIn,
  ZoomOut,
  Check,
  X,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';

interface ImageCropperProps {
  image: string | null;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
  aspectRatio?: number; // width/height, e.g., 16/9, 1, 4/3
  maxWidth?: number;
  maxHeight?: number;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const aspectRatioPresets = [
  { label: 'Free', value: 0 },
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '16:9', value: 16 / 9 },
  { label: '3:2', value: 3 / 2 },
  { label: '2:3', value: 2 / 3 },
];

export default function ImageCropper({
  image,
  onCropComplete,
  onCancel,
  aspectRatio: initialAspectRatio = 0,
  maxWidth = 1200,
  maxHeight = 1200,
}: ImageCropperProps) {
  const [cropArea, setCropArea] = useState<CropArea>({ x: 10, y: 10, width: 80, height: 80 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(initialAspectRatio);
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<'move' | 'resize' | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleMouseDown = (e: React.MouseEvent, type: 'move' | 'resize') => {
    e.preventDefault();
    setIsDragging(true);
    setDragType(type);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const deltaX = ((e.clientX - dragStart.x) / rect.width) * 100;
      const deltaY = ((e.clientY - dragStart.y) / rect.height) * 100;

      if (dragType === 'move') {
        setCropArea((prev) => ({
          ...prev,
          x: Math.max(0, Math.min(100 - prev.width, prev.x + deltaX)),
          y: Math.max(0, Math.min(100 - prev.height, prev.y + deltaY)),
        }));
      } else if (dragType === 'resize') {
        setCropArea((prev) => {
          let newWidth = Math.max(10, Math.min(100 - prev.x, prev.width + deltaX));
          let newHeight = Math.max(10, Math.min(100 - prev.y, prev.height + deltaY));

          if (aspectRatio > 0) {
            // Maintain aspect ratio
            newHeight = newWidth / aspectRatio;
            if (prev.y + newHeight > 100) {
              newHeight = 100 - prev.y;
              newWidth = newHeight * aspectRatio;
            }
          }

          return { ...prev, width: newWidth, height: newHeight };
        });
      }

      setDragStart({ x: e.clientX, y: e.clientY });
    },
    [isDragging, dragType, dragStart, aspectRatio]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragType(null);
  };

  const handleRotate = (direction: 'cw' | 'ccw') => {
    setRotation((prev) => (direction === 'cw' ? prev + 90 : prev - 90) % 360);
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoom((prev) => {
      const newZoom = direction === 'in' ? prev + 0.1 : prev - 0.1;
      return Math.max(0.5, Math.min(3, newZoom));
    });
  };

  const handleCrop = async () => {
    if (!imageRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageRef.current;
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;

    // Calculate crop dimensions in pixels
    const cropX = (cropArea.x / 100) * naturalWidth;
    const cropY = (cropArea.y / 100) * naturalHeight;
    const cropWidth = (cropArea.width / 100) * naturalWidth;
    const cropHeight = (cropArea.height / 100) * naturalHeight;

    // Set canvas size (respect max dimensions)
    const outputWidth = Math.min(cropWidth, maxWidth);
    const outputHeight = Math.min(cropHeight, maxHeight);
    const scale = Math.min(outputWidth / cropWidth, outputHeight / cropHeight);

    canvas.width = cropWidth * scale;
    canvas.height = cropHeight * scale;

    // Apply transformations
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.scale(zoom, zoom);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Draw cropped image
    ctx.drawImage(
      img,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      canvas.width,
      canvas.height
    );

    ctx.restore();

    // Convert to base64
    const croppedImage = canvas.toDataURL('image/jpeg', 0.9);
    onCropComplete(croppedImage);
  };

  if (!image) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-8 text-center">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Image Selected</h3>
          <p className="text-gray-500 mb-4">Please select an image to crop.</p>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <Crop className="w-5 h-5" />
          <span className="font-medium">Crop Image</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-300 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleCrop}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Apply
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Image Area */}
        <div
          ref={containerRef}
          className="flex-1 relative overflow-hidden flex items-center justify-center p-8"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Image */}
          <div className="relative max-w-full max-h-full">
            <img
              ref={imageRef}
              src={image}
              alt="Crop preview"
              className="max-w-full max-h-[70vh] object-contain"
              style={{
                transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1}) scale(${zoom})`,
              }}
              draggable={false}
            />

            {/* Crop Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Dark overlay outside crop area */}
              <div
                className="absolute inset-0 bg-black/50"
                style={{
                  clipPath: `polygon(
                    0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%,
                    ${cropArea.x}% ${cropArea.y}%,
                    ${cropArea.x}% ${cropArea.y + cropArea.height}%,
                    ${cropArea.x + cropArea.width}% ${cropArea.y + cropArea.height}%,
                    ${cropArea.x + cropArea.width}% ${cropArea.y}%,
                    ${cropArea.x}% ${cropArea.y}%
                  )`,
                }}
              />

              {/* Crop area border */}
              <div
                className="absolute border-2 border-white pointer-events-auto cursor-move"
                style={{
                  left: `${cropArea.x}%`,
                  top: `${cropArea.y}%`,
                  width: `${cropArea.width}%`,
                  height: `${cropArea.height}%`,
                }}
                onMouseDown={(e) => handleMouseDown(e, 'move')}
              >
                {/* Grid lines */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="border border-white/30" />
                  ))}
                </div>

                {/* Resize handle */}
                <div
                  className="absolute -right-2 -bottom-2 w-4 h-4 bg-white rounded-full cursor-se-resize"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleMouseDown(e, 'resize');
                  }}
                />

                {/* Corner handles */}
                <div className="absolute -left-1 -top-1 w-3 h-3 border-l-2 border-t-2 border-white" />
                <div className="absolute -right-1 -top-1 w-3 h-3 border-r-2 border-t-2 border-white" />
                <div className="absolute -left-1 -bottom-1 w-3 h-3 border-l-2 border-b-2 border-white" />
                <div className="absolute -right-1 -bottom-1 w-3 h-3 border-r-2 border-b-2 border-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Tools */}
        <div className="w-64 bg-gray-900 p-4 space-y-6">
          {/* Aspect Ratio */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Aspect Ratio</label>
            <div className="grid grid-cols-3 gap-2">
              {aspectRatioPresets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setAspectRatio(preset.value)}
                  className={`px-2 py-1.5 text-sm rounded ${
                    aspectRatio === preset.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rotation */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Rotation</label>
            <div className="flex gap-2">
              <button
                onClick={() => handleRotate('ccw')}
                className="flex-1 p-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 flex items-center justify-center"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleRotate('cw')}
                className="flex-1 p-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 flex items-center justify-center"
              >
                <RotateCw className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">{rotation}°</p>
          </div>

          {/* Flip */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Flip</label>
            <div className="flex gap-2">
              <button
                onClick={() => setFlipH(!flipH)}
                className={`flex-1 p-2 rounded flex items-center justify-center ${
                  flipH ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <FlipHorizontal className="w-5 h-5" />
              </button>
              <button
                onClick={() => setFlipV(!flipV)}
                className={`flex-1 p-2 rounded flex items-center justify-center ${
                  flipV ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <FlipVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Zoom */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Zoom</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleZoom('out')}
                className="p-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1"
              />
              <button
                onClick={() => handleZoom('in')}
                className="p-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">{Math.round(zoom * 100)}%</p>
          </div>

          {/* Reset */}
          <button
            onClick={() => {
              setZoom(1);
              setRotation(0);
              setFlipH(false);
              setFlipV(false);
              setCropArea({ x: 10, y: 10, width: 80, height: 80 });
            }}
            className="w-full px-4 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700"
          >
            Reset All
          </button>
        </div>
      </div>
    </div>
  );
}

// Image Upload with Cropper
interface ImageUploadWithCropperProps {
  value: string;
  onChange: (value: string) => void;
  aspectRatio?: number;
  label?: string;
}

export function ImageUploadWithCropper({
  value,
  onChange,
  aspectRatio,
  label = 'Upload Image',
}: ImageUploadWithCropperProps) {
  const [showCropper, setShowCropper] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file != null) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTempImage(event.target?.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    onChange(croppedImage);
    setShowCropper(false);
    setTempImage(null);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

      {value ? (
        <div className="relative group">
          <img
            src={value}
            alt="Uploaded"
            className="w-full h-40 object-cover rounded-lg border"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <button
              onClick={() => {
                setTempImage(value);
                setShowCropper(true);
              }}
              className="px-3 py-1.5 bg-white text-gray-900 rounded text-sm font-medium"
            >
              <Crop className="w-4 h-4 inline mr-1" />
              Crop
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-gray-900 rounded text-sm font-medium"
            >
              <Upload className="w-4 h-4 inline mr-1" />
              Replace
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
        >
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">Click to upload</span>
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {showCropper && (
        <ImageCropper
          image={tempImage}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setShowCropper(false);
            setTempImage(null);
          }}
          aspectRatio={aspectRatio}
        />
      )}
    </div>
  );
}
