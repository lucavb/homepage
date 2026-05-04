declare global {
    interface Window {
        umami?: {
            track: (eventName: string, data?: Record<string, string | number | boolean>) => void;
            identify: (sessionId: string | Record<string, unknown>) => void;
        };
    }
}

export {};
