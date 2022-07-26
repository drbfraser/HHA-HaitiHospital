import { BiomechPriority } from 'models/bioMech';
import { UserApiOut } from 'routes/api/jsons/user';

export namespace BiomechApiIn {
  export interface BiomechPost {
    equipmentName: string;
    equipmentFault: string;
    equipmentPriority: BiomechPriority;
    file: Express.Multer.File;
  }

  export const FILE_FIELD = 'file';
}

export namespace BiomechApiOut {
  export interface BiomechGet {
    id: string;
    user: UserApiOut.UserJson;
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
}
