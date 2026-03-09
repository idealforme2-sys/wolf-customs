import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Volume2, VolumeX, ExternalLink } from 'lucide-react';

const imagesGlob = import.meta.glob<{ default: string }>('../assets/Instagram reels and posts/**/*.jpg', { eager: true });
const videosGlob = import.meta.glob<{ default: string }>('../assets/Instagram reels and posts/**/*.mp4', { eager: true });
const urlsGlob = import.meta.glob<{ default: string }>('../assets/Instagram reels and posts/**/url.txt', { eager: true, query: '?raw' });

interface MediaItem {
  id: string; // e.g., 'Post 1'
  type: 'post' | 'reel';
  media: string[];
  link: string;
}

const folderMap = new Map<string, MediaItem>();

const getFolder = (path: string) => {
  const parts = path.split('/');
  return parts[parts.length - 2]; 
};

const getOrCreateItem = (folder: string): MediaItem => {
  if (!folderMap.has(folder)) {
    folderMap.set(folder, {
      id: folder,
      type: folder.startsWith('Reel') ? 'reel' : 'post',
      media: [],
      link: ''
    });
  }
  return folderMap.get(folder)!;
};

Object.entries(imagesGlob).forEach(([path, module]) => {
  getOrCreateItem(getFolder(path)).media.push(module.default);
});

Object.entries(videosGlob).forEach(([path, module]) => {
  getOrCreateItem(getFolder(path)).media.push(module.default);
});

Object.entries(urlsGlob).forEach(([path, module]) => {
  getOrCreateItem(getFolder(path)).link = module.default.trim();
});

const sortedItems = Array.from(folderMap.values()).sort((a, b) => {
  if (a.type !== b.type) return a.type === 'post' ? -1 : 1;
  const numA = parseInt(a.id.replace(/\D/g, '')) || 0;
  const numB = parseInt(b.id.replace(/\D/g, '')) || 0;
  return numA - numB;
});

const PostCard = ({ item }: { item: MediaItem }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === item.media.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? item.media.length - 1 : prev - 1));
  };

  const handleOpenLink = () => {
    if (item.link) window.open(item.link, '_blank');
  };

  return (
    <div 
      className="group relative w-full aspect-[4/5] bg-wolf-black border border-wolf-gunmetal overflow-hidden cursor-pointer rounded-lg hover:border-wolf-red/50 transition-colors duration-500"
      onClick={handleOpenLink}
    >
      <div className="absolute inset-0 transition-transform duration-700 ease-in-out group-hover:scale-105 z-0">
        <img 
          src={item.media[currentIndex]} 
          alt={item.id} 
          className="w-full h-full object-cover" 
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-wolf-black via-transparent to-transparent opacity-60 pointer-events-none z-10" />

      {item.media.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/50 backdrop-blur-sm text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-wolf-red z-20"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/50 backdrop-blur-sm text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-wolf-red z-20"
          >
            <ChevronRight size={18} />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {item.media.map((_, i) => (
              <div 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === currentIndex ? 'bg-wolf-red' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}

      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity scale-75 group-hover:scale-100 duration-300 z-20">
        <div className="w-10 h-10 bg-wolf-red rounded border border-white/20 flex items-center justify-center text-white shadow-lg">
          <ExternalLink size={18} />
        </div>
      </div>
    </div>
  );
};

const ReelCard = ({ item }: { item: MediaItem }) => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => {});
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const handleOpenLink = () => {
    if (item.link) window.open(item.link, '_blank');
  };

  return (
    <div 
      className="group relative w-full aspect-[9/16] bg-wolf-black border border-wolf-gunmetal overflow-hidden cursor-pointer rounded-lg hover:border-wolf-red/50 transition-colors duration-500"
      onClick={handleOpenLink}
    >
      <video
        ref={videoRef}
        src={item.media[0]}
        loop
        playsInline
        muted={isMuted}
        className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105 z-0"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-wolf-black via-transparent to-transparent opacity-60 pointer-events-none z-10" />

      <button 
        onClick={toggleMute}
        className="absolute bottom-4 right-4 w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-sm text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-wolf-red z-20"
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity scale-75 group-hover:scale-100 duration-300 z-20">
        <div className="w-10 h-10 bg-wolf-red rounded border border-white/20 flex items-center justify-center text-white shadow-lg">
          <ExternalLink size={18} />
        </div>
      </div>
    </div>
  );
};

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-32 bg-wolf-black relative">
       <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-wolf-red/30 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] w-8 bg-wolf-red" />
              <span className="text-wolf-red font-heading tracking-[0.2em] uppercase text-sm font-bold">
                Portfolio
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-heading font-black uppercase tracking-tighter mb-6 leading-none text-white">
              Latest <span className="text-wolf-red">Work</span>
            </h2>
            <p className="text-gray-400 text-lg font-light leading-relaxed max-w-2xl">
              Take a closer look at our recent projects. From flawless custom paint jobs to complete vehicle restorations, our attention to detail shines through in every showcase.
            </p>
          </motion.div>
        </div>

        {/* Masonry Layout for heterogeneous items */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {sortedItems.map((item, index) => {
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
                className="break-inside-avoid relative"
              >
                {item.type === 'post' ? (
                  <PostCard item={item} />
                ) : (
                  <ReelCard item={item} />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
