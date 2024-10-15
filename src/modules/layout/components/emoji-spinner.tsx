import { useState, useEffect } from 'react';

const AnimateSpinner = () => {
  const [dots, setDots] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev === 3 ? 1 : prev + 1));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-row items-center space-x-2 justify-center">
      <span className="animate-spin">🙂</span>
      <span>Loading{'.'.repeat(dots)}</span>
    </div>
  );
};

export default AnimateSpinner;
