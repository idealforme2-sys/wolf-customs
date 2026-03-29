import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const ringX = useSpring(cursorX, { stiffness: 520, damping: 34, mass: 0.18 });
  const ringY = useSpring(cursorY, { stiffness: 520, damping: 34, mass: 0.18 });
  const dotX = useSpring(cursorX, { stiffness: 900, damping: 42, mass: 0.08 });
  const dotY = useSpring(cursorY, { stiffness: 900, damping: 42, mass: 0.08 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isNativeCursorZone, setIsNativeCursorZone] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine) and (min-width: 768px)');

    const updateEnabledState = () => {
      const nextEnabled = mediaQuery.matches;
      setIsEnabled(nextEnabled);
      document.body.classList.toggle('custom-cursor-enabled', nextEnabled);

      if (!nextEnabled) {
        setIsVisible(false);
        setIsHovering(false);
        setIsNativeCursorZone(false);
      }
    };

    updateEnabledState();

    const updateMousePosition = (e: MouseEvent) => {
      if (!mediaQuery.matches) {
        return;
      }

      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      if (!mediaQuery.matches) {
        setIsHovering(false);
        setIsNativeCursorZone(false);
        return;
      }

      const target = e.target as HTMLElement;
      const usesNativeCursor =
        target.closest('[data-native-cursor-zone="true"]') !== null ||
        target.closest('.eapps-instagram-feed-popup') !== null ||
        target.closest('.eapps-instagram-feed-posts-item-link') !== null ||
        target.closest('.eapps-instagram-feed-posts-slider-nav') !== null ||
        target.closest('.eapps-instagram-feed-popup-close') !== null ||
        target.closest('.eapps-instagram-feed-popup-item-media-carousel') !== null;

      setIsNativeCursorZone(usesNativeCursor);

      if (usesNativeCursor) {
        setIsHovering(false);
        return;
      }

      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-hover')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeaveWindow = (event: MouseEvent) => {
      if (!(event.relatedTarget as Node | null)) {
        setIsVisible(false);
      }
    };

    const handleWindowBlur = () => {
      setIsVisible(false);
    };

    const handleWindowFocus = () => {
      if (mediaQuery.matches) {
        setIsVisible(true);
      }
    };

    mediaQuery.addEventListener('change', updateEnabledState);
    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseLeaveWindow);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      document.body.classList.remove('custom-cursor-enabled');
      mediaQuery.removeEventListener('change', updateEnabledState);
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseLeaveWindow);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [cursorX, cursorY]);

  if (!isEnabled || !isVisible || isNativeCursorZone) return null;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-wolf-red shadow-[0_0_18px_rgba(199,161,74,0.8)] md:block"
        style={{ x: dotX, y: dotY }}
        animate={{
          scale: isHovering ? 0 : 1,
          opacity: isHovering ? 0 : 1,
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.1 }}
      />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-wolf-red/60 bg-[radial-gradient(circle_at_center,rgba(255,226,162,0.12),rgba(0,0,0,0.02)_68%)] shadow-[0_0_20px_rgba(199,161,74,0.16)] md:flex"
        style={{ x: ringX, y: ringY }}
        animate={{
          scale: isHovering ? 1.2 : 1,
          backgroundColor: isHovering ? 'rgba(199,161,74,0.88)' : 'rgba(0,0,0,0.04)',
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.2 }}
      >
        {isHovering && (
          <span className="text-[8px] font-heading font-bold text-wolf-black tracking-widest uppercase">
            Click
          </span>
        )}
      </motion.div>
    </>
  );
}
