export interface DatabaseProfile {
  id: string;
  name: string;
  type: "local" | "remote";
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  isActive: boolean;
  lastConnected?: Date;
  totalRows?: number;
}

export interface DatabaseProfilesState {
  profiles: DatabaseProfile[];
  activeProfileId: string | null;
}

export interface DatabaseProfileUpdate {
  id?: string;
  name: string;
  type: "local" | "remote";
  host?: string;
  port?: number;
  database?: string;
  username?: string;
}