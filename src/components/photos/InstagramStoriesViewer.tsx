import { useState, useEffect, useRef } from 'react';

export interface PhotoStoryItem {
  slug: string;
  title: string;
  description: string;
  date: string;
  image: string;
  photographerName: string;
  location?: string;
}

export interface YearStoryGroup {
  year: number;
  photos: PhotoStoryItem[];
}

interface Props {
  yearGroups: YearStoryGroup[];
}

export function InstagramStoriesViewer({ yearGroups }: Props) {
  const [activeGroupIndex, setActiveGroupIndex] = useState<number | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  const activeGroup = activeGroupIndex !== null ? yearGroups[activeGroupIndex] : null;
  const currentPhoto = activeGroup ? activeGroup.photos[activePhotoIndex] : null;

  // Auto-advance timer (5 seconds per story slide)
  useEffect(() => {
    if (activeGroupIndex === null || !activeGroup || isPaused) return;

    const timer = setTimeout(() => {
      if (activePhotoIndex < activeGroup.photos.length - 1) {
        setActivePhotoIndex((prev) => prev + 1);
        setImageLoaded(false);
      } else if (activeGroupIndex < yearGroups.length - 1) {
        // Move to next year story
        setActiveGroupIndex((prev) => (prev !== null ? prev + 1 : null));
        setActivePhotoIndex(0);
        setImageLoaded(false);
      } else {
        // End of all stories
        setActiveGroupIndex(null);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [activeGroupIndex, activePhotoIndex, isPaused, activeGroup, yearGroups.length]);

  // Lock body scroll when story viewer is open
  useEffect(() => {
    if (activeGroupIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeGroupIndex]);

  const openStory = (groupIndex: number) => {
    setActiveGroupIndex(groupIndex);
    setActivePhotoIndex(0);
    setIsPaused(false);
    setImageLoaded(false);
  };

  const closeStory = () => {
    setActiveGroupIndex(null);
    setIsPaused(false);
  };

  const handleNext = () => {
    if (!activeGroup) return;
    if (activePhotoIndex < activeGroup.photos.length - 1) {
      setActivePhotoIndex((prev) => prev + 1);
      setImageLoaded(false);
    } else if (activeGroupIndex !== null && activeGroupIndex < yearGroups.length - 1) {
      setActiveGroupIndex(activeGroupIndex + 1);
      setActivePhotoIndex(0);
      setImageLoaded(false);
    } else {
      closeStory();
    }
  };

  const handlePrev = () => {
    if (!activeGroup) return;
    if (activePhotoIndex > 0) {
      setActivePhotoIndex((prev) => prev - 1);
      setImageLoaded(false);
    } else if (activeGroupIndex !== null && activeGroupIndex > 0) {
      const prevGroup = yearGroups[activeGroupIndex - 1];
      setActiveGroupIndex(activeGroupIndex - 1);
      setActivePhotoIndex(prevGroup.photos.length - 1);
      setImageLoaded(false);
    }
  };

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 40;

    if (distance > minSwipeDistance) {
      // Swiped Left -> Next Story
      handleNext();
    } else if (distance < -minSwipeDistance) {
      // Swiped Right -> Previous Story
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="w-full my-4">
      {/* INSTAGRAM-STYLE HIGHLIGHTS CAROUSEL BAR */}
      <div className="flex items-center justify-center gap-5 sm:gap-6 overflow-x-auto no-scrollbar py-3 px-1 scroll-smooth">
        {yearGroups.map((group, idx) => {
          const coverPhoto = group.photos[0];
          return (
            <button
              key={group.year}
              onClick={() => openStory(idx)}
              className="flex flex-col items-center gap-2 shrink-0 group focus:outline-none cursor-pointer"
              title={`View ${group.year} Story Highlights (${group.photos.length} photos)`}
            >
              {/* INSTAGRAM / BRAND GRADIENT RING WITH HOVER LIFT */}
              <div className="relative p-[2.5px] rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-pink-600 shadow-xs group-hover:-translate-y-1 group-hover:shadow-md transition-all duration-200 ease-out">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white bg-slate-900 overflow-hidden relative">
                  <img
                    src={coverPhoto?.image || '/images/dzaleka-hero.jpeg'}
                    alt={`Year ${group.year} photo highlight`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
              </div>

              {/* YEAR & PHOTO COUNT LABELS */}
              <div className="flex flex-col items-center leading-tight">
                <span className="text-xs font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                  {group.year}
                </span>
                <span className="text-[10px] font-medium text-slate-500 mt-0.5">
                  {group.photos.length} {group.photos.length === 1 ? 'photo' : 'photos'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* FULL SCREEN INSTAGRAM STORY MODAL */}
      {activeGroup && currentPhoto && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-0 sm:p-4">
          
          {/* MAIN STORY CONTAINER FRAME WITH TOUCH SWIPE GESTURES */}
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative w-full max-w-md h-full sm:h-[840px] sm:max-h-[92vh] sm:rounded-2xl bg-slate-950 overflow-hidden flex flex-col justify-between shadow-2xl border border-slate-800"
          >
            
            {/* TOP PROGRESS BARS */}
            <div className="absolute top-0 left-0 right-0 z-30 p-3 pt-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex flex-col gap-2">
              <div className="flex items-center gap-1.5 w-full">
                {activeGroup.photos.map((_, pIdx) => {
                  let widthClass = 'w-0';
                  if (pIdx < activePhotoIndex) widthClass = 'w-full';
                  if (pIdx === activePhotoIndex) widthClass = isPaused ? 'w-1/2' : 'w-full transition-all duration-5000 linear';

                  return (
                    <div key={pIdx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-white rounded-full ${widthClass}`}
                      />
                    </div>
                  );
                })}
              </div>

              {/* STORY HEADER (USER / YEAR / CONTROLS) */}
              <div className="flex items-center justify-between text-white mt-1">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full border border-white/60 overflow-hidden bg-slate-800 shrink-0">
                    <img
                      src={currentPhoto.image}
                      alt={currentPhoto.photographerName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-white truncate">
                        {currentPhoto.photographerName}
                      </h4>
                      <span className="text-[10px] font-bold bg-sky-600 text-white px-2 py-0.5 rounded-full">
                        {activeGroup.year}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-300 truncate">
                      {currentPhoto.date ? new Date(currentPhoto.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : `${activeGroup.year}`}
                      {currentPhoto.location ? ` • ${currentPhoto.location}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors"
                    title={isPaused ? 'Resume' : 'Pause'}
                  >
                    {isPaused ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={closeStory}
                    className="p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors text-xs font-bold w-7 h-7 flex items-center justify-center"
                    title="Close Story"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            {/* CENTER PHOTO DISPLAY & TAP ZONES */}
            <div className="relative w-full flex-1 bg-black flex items-center justify-center overflow-hidden">
              <img
                src={currentPhoto.image}
                alt={currentPhoto.title}
                onLoad={() => setImageLoaded(true)}
                className={`w-full h-full object-contain transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-20'
                }`}
              />

              {/* TAP LEFT ZONE (PREVIOUS STORY) */}
              <div
                onClick={handlePrev}
                className="absolute left-0 top-16 bottom-24 w-1/3 z-20 cursor-pointer flex items-center justify-start pl-3 opacity-0 hover:opacity-100 transition-opacity"
              >
                <div className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center text-sm font-bold">
                  ‹
                </div>
              </div>

              {/* TAP RIGHT ZONE (NEXT STORY) */}
              <div
                onClick={handleNext}
                className="absolute right-0 top-16 bottom-24 w-1/3 z-20 cursor-pointer flex items-center justify-end pr-3 opacity-0 hover:opacity-100 transition-opacity"
              >
                <div className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center text-sm font-bold">
                  ›
                </div>
              </div>
            </div>

            {/* BOTTOM CAPTION DRAWER */}
            <div className="z-30 p-4 bg-gradient-to-t from-black via-black/90 to-transparent text-white space-y-2">
              <h3 className="text-sm font-bold text-white line-clamp-1">
                {currentPhoto.title}
              </h3>
              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {currentPhoto.description}
              </p>
              <div className="pt-1 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">
                  Slide {activePhotoIndex + 1} of {activeGroup.photos.length}
                </span>
                <a
                  href={`/photos/${currentPhoto.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-sky-400 hover:text-sky-300 hover:underline"
                >
                  <span>View Full Photo & Story</span>
                  <span>→</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
