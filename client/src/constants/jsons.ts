// JSONS responed by the server

import { UserDetails } from './interfaces';

export interface BiomechGet {
  id: string;
  user: UserDetails;
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
