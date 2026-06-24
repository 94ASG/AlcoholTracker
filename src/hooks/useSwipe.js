import { useState, useEffect, useRef } from 'react';

export const useSwipe = (onSwipeLeft, onSwipeRight) => {
  const touchStart = useRef(null);
  const touchEnd = useRef(null);

  useEffect(() => {
    const handleTouchStart = (e) => {
      touchStart.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = (e) => {
      touchEnd.current = e.changedTouches[0].clientX;
      handleSwipe();
    };

    const handleSwipe = () => {
      if (!touchStart.current || !touchEnd.current) return;
      const distance = touchStart.current - touchEnd.current;
      const isLeftSwipe = distance > 50;
      const isRightSwipe = distance < -50;

      if (isLeftSwipe) {
        onSwipeLeft?.();
      }
      if (isRightSwipe) {
        onSwipeRight?.();
      }

      touchStart.current = null;
      touchEnd.current = null;
    };

    const element = document.getElementById('root');
    if (element) {
      element.addEventListener('touchstart', handleTouchStart, false);
      element.addEventListener('touchend', handleTouchEnd, false);

      return () => {
        element.removeEventListener('touchstart', handleTouchStart, false);
        element.removeEventListener('touchend', handleTouchEnd, false);
      };
    }
  }, [onSwipeLeft, onSwipeRight]);
};
