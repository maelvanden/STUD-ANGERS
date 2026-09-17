import { useEffect, useState } from 'react';

import { ThemedText, type ThemedTextProps } from '@/components/themed-text';

type Props = Omit<ThemedTextProps, 'children'> & {
  text: string;
  speed?: number;
};

export function TypewriterText({ text, speed = 18, ...rest }: Props) {
  const [renderedText, setRenderedText] = useState(text);
  const [visibleChars, setVisibleChars] = useState(0);

  if (renderedText !== text) {
    setRenderedText(text);
    setVisibleChars(0);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleChars((current) => {
        if (current >= text.length) {
          clearInterval(interval);
          return current;
        }
        return current + 1;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <ThemedText {...rest}>{text.slice(0, visibleChars)}</ThemedText>;
}
