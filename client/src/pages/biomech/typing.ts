import { Path } from 'react-hook-form';

export enum BiomechPriority {
  URGENT = 'urgent',
  IMPORTANT = 'important',
  NONURGENT = 'non-urgent',
}

export interface BiomechForm {
  equipmentName: string;
  equipmentFault: string;
  equipmentPriority: BiomechPriority;
  file: File;
}

export const BIOMECH_REPORT_FIELDS: {
  equipmentName: Path<BiomechForm>;
  equipmentFault: Path<BiomechForm>;
  equipmentPriority: Path<BiomechForm>;
  file: Path<BiomechForm>;
} = {
  equipmentName: 'equipmentName',
  equipmentFault: 'equipmentFault',
  equipmentPriority: 'equipmentPriority',
  file: 'file',
};
