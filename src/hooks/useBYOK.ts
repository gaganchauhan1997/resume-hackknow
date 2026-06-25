import { useState, useCallback, useEffect } from 'react';
import { loadKeys, saveKeys, loadPrefs, savePrefs } from '@/providers/byok';

export function useBYOK() {
  const [keys, setKeysState] = useState<Record<string, string>>(loadKeys);
  const [prefs, setPrefsState] = useState(loadPrefs);

  useEffect(() => {
    saveKeys(keys);
  }, [keys]);

  useEffect(() => {
    savePrefs(prefs);
  }, [prefs]);

  const setKey = useCallback((provider: string, key: string) => {
    setKeysState(prev => {
      const next = { ...prev };
      if (key.trim()) next[provider] = key.trim();
      else delete next[provider];
      return next;
    });
  }, []);

  const deleteKey = useCallback((provider: string) => {
    setKeysState(prev => {
      const next = { ...prev };
      delete next[provider];
      return next;
    });
  }, []);

  const activeKeyCount = Object.values(keys).filter(Boolean).length;

  return {
    keys,
    prefs,
    setKey,
    deleteKey,
    setPrefs: setPrefsState,
    activeKeyCount
  };
}
