
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useChatSession = () => {
  const [sessionId, setSessionId] = useState<string>('');

  // Initialize or get existing session ID
  useEffect(() => {
    const storedSessionId = localStorage.getItem('chat_session_id');
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = uuidv4();
      localStorage.setItem('chat_session_id', newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  const resetSession = useCallback(() => {
    const newSessionId = uuidv4();
    localStorage.setItem('chat_session_id', newSessionId);
    setSessionId(newSessionId);
    return newSessionId;
  }, []);

  return { sessionId, resetSession };
};
