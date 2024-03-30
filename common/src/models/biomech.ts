import { UserJson } from './user';

export enum BiomechPriority {
  URGENT = 'urgent',
  IMPORTANT = 'important',
  NONURGENT = 'non-urgent',
}

export enum BiomechStatus {
  FIXED = 'fixed',
  INPROGRESS = 'in-progress',
  BACKLOG = 'backlog',
}

export interface BioMech {
  userId: string;
  departmentId: string;
  equipmentName: string;
  equipmentFault: string;
  equipmentPriority: BiomechPriority;
  equipmentStatus: BiomechStatus;
  createdAt: Date;
  updatedAt: Date;
  imgPath: string;
}

export interface BiomechJson {
  id: string;
  user: UserJson;
  department: {
    id: string;
    name: string;
  };
  equipmentName: string;
  equipmentFault: string;
  equipmentPriority: string;
  equipmentStatus: string;
  createdAt: string;
  updatedAt: string;
  imgPath: string;
}
