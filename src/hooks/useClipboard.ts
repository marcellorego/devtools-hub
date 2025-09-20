import { useCallback } from 'react';
import { useAppStore } from '../store/appStore';

export const useClipboard = () => {
  const setCopiedText = useAppStore((state) => state.setCopiedText);
  const copiedText = useAppStore((state) => state.copiedText);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers or non-HTTPS
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          document.execCommand('copy');
        } finally {
          document.body.removeChild(textArea);
        }
      }

      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
      return true;
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setCopiedText(null);
      return false;
    }
  }, [setCopiedText]);

  return { copyToClipboard, copied: copiedText !== null };
};
