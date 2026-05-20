import { useEffect, useState } from 'react';

/**
 * Custom Hook: useProctoring
 * SECURITY CHECK: Tab Switch Detection
 * Listens to document visibility state to detect if a student switches tabs.
 */
const useProctoring = (onViolation) => {
  const [violations, setViolations] = useState(0);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setViolations((prev) => prev + 1);
        if (onViolation) {
          onViolation('TAB_SWITCH_DETECTED');
        }
        console.warn('Security Alert: Tab switch detected!');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [onViolation]);

  return { violations };
};

export default useProctoring;
