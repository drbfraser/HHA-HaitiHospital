// JSONS responed by the server

import { UserJson } from './interfaces';

export interface BiomechGet {
  id: string;
  user: UserJson;
  department: {
    id: string;
    name: string;
  };
  equipmentName: string;
  equipmentFault: string;
  equipmentPriority: string;
  createdAt: string;
  updatedAt: string;
  imgPath: string;
}
