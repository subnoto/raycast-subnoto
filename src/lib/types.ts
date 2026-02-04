export interface Preferences {
  apiAccessKey: string;
  apiSecretKey: string;
}

export interface Workspace {
  uuid: string;
  name: string;
  creationDate: number;
  updateDate: number;
  membersCount: number;
}
