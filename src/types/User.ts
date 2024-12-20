export interface User {
  photoURL?: string | null;
  displayName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  metadata?: {
    creationTime?: string;
  };
}