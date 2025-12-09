import type React from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

type Category = {
  label: string;
  images: string[];
};

type Slide = {
  categoryIndex: number;
  image: string;
};

interface ImagePreviewModalProps {
  isOpen: boolean;
  carName: string;
  categories: Category[];
  slides: Slide[];
  currentCategoryIndex: number;
  currentImage: string;
  modalSlideIndex: number;
  thumbnailRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onCategoryChange: (index: number) => void;
  onThumbnailClick: (index: number) => void;
  onTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void;
  onTouchMove: (e: React.TouchEvent<HTMLDivElement>) => void;
  onTouchEnd: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  isOpen,
  carName,
  categories,
  slides,
  currentCategoryIndex,
  currentImage,
  modalSlideIndex,
  thumbnailRefs,
  onClose,
  onNext,
  onPrevious,
  onCategoryChange,
  onThumbnailClick,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-black/95 backdrop-blur-sm !m-0"
      onClick={onClose}
    >
      {/* Header with Category Tabs and Close Button */}
      <div className="relative w-full px-4 py-3 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto scrollbar-hide">
            {categories.map((category, index) => {
              const isActive = index === currentCategoryIndex;
              const Icon = category.label.toLowerCase() === 'highlights' ? Sparkles : undefined;

              return (
                <button
                  key={category.label}
                  onClick={(e) => {
                    e.stopPropagation();
                    onCategoryChange(index);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-primary/90 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className=" ml-4 p-2 rounded-full bg-primary/90 hover:bg-primary/60 text-white transition-colors flex-shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {/* Previous Button */}
        {slides.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrevious();
            }}
            className="hidden md:flex absolute left-4 md:left-8 z-20 p-1 rounded-full bg-white/60 hover:bg-gray-100 text-gray-900 shadow-lg transition-all hover:scale-105"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Next Button */}
        {slides.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="hidden md:flex absolute right-4 md:right-8 z-20 p-1 rounded-full bg-white/60 hover:bg-gray-100 text-gray-900 shadow-lg transition-all hover:scale-105"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Image Container */}
        <div
          className="relative w-full h-full flex items-center justify-center p-4 sm:p-8"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="relative w-full h-full max-w-7xl">
            <Image
              src={currentImage}
              alt={`${carName} - ${categories[currentCategoryIndex]?.label || 'Image'} ${
                modalSlideIndex + 1
              }`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1280px"
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Image Counter */}
        {slides.length > 1 && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 px-2 py-0.5 rounded-full bg-white/60 backdrop-blur-sm text-white text-sm font-medium">
            {modalSlideIndex + 1} / {slides.length}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {slides.length > 1 && (
        <div className="w-full px-4 py-4 bg-black/80 backdrop-blur-md border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-2 scroll-smooth">
              {slides.map((slide, index) => (
                <button
                  key={index}
                  ref={(el) => {
                    thumbnailRefs.current[index] = el;
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onThumbnailClick(index);
                  }}
                  className={`relative flex-shrink-0 w-16 h-16 sm:w-24 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === modalSlideIndex
                      ? 'border-primary'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <Image
                    src={slide.image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePreviewModal;


