export interface User {
    id: number;
    email: string;
  }
  
  export interface Session {
    id: number;
    userId: number;
    startTime: Date;
    duration: number; // In seconds
  }
  
  export interface Lyrics {
    id: number;
    sessionId: number;
    content: string;
  }