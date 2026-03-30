import useScrollHandling from '@/hooks/useScrollHandling';
import { useEffect, useState } from 'react';

const useTranslateXImage = () => {
    const { scrollPosition, scrollDirection } = useScrollHandling(80);
    const [translateXPosition, setTranslateXPosition] = useState(80);

    const handleTranslateX = () => {
        if (scrollDirection === 'down' && scrollPosition >= 1500) {
            setTranslateXPosition(
                translateXPosition <= 0 ? 0 : translateXPosition - 1
            );
        } else if (scrollDirection === 'up' && scrollPosition >= 1500) {
            setTranslateXPosition(
                translateXPosition >= 80 ? 80 : translateXPosition + 1
            );
        }
    };

    useEffect(() => {
        handleTranslateX();
    }, [scrollPosition]);

    return { translateXPosition };
};

export default useTranslateXImage;
