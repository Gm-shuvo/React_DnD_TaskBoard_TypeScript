export type Id = string | number;

export type Column = {
  id: Id;
  title: string;
};

export type Task = {
  id: Id;
  columnId: Id;
  content: string;
  tags: string[];
  active: boolean;
  activityLog: string[];
  lastStatusChange?: string | null;
  createdAt: number;
  updatedAt: number;
};


export type Tag = string[];

