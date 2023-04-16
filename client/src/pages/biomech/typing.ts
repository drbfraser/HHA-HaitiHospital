import { Path } from 'react-hook-form';

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

export interface BiomechForm {
  equipmentName: string;
  equipmentFault: string;
  equipmentPriority: BiomechPriority;
  equipmentStatus: BiomechStatus;
  file: File;
}

export const BIOMECH_REPORT_FIELDS: {
  equipmentName: Path<BiomechForm>;
  equipmentFault: Path<BiomechForm>;
  equipmentPriority: Path<BiomechForm>;
  equipmentStatus: Path<BiomechForm>;
  file: Path<BiomechForm>;
} = {
  equipmentName: 'equipmentName',
  equipmentFault: 'equipmentFault',
  equipmentPriority: 'equipmentPriority',
  equipmentStatus: 'equipmentStatus',
  file: 'file',
};
