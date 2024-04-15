import { BiomechPriority, BiomechStatus } from 'models/bioMech';
import { UserApiOut } from 'routes/api/jsons/user';
import { proxiedPropertyOf } from 'utils/utils';

export namespace BiomechApiIn {
  export interface BiomechPost {
    equipmentName: string;
    equipmentFault: string;
    equipmentPriority: BiomechPriority;
    equipmentStatus: BiomechStatus;
    file: Express.Multer.File;
  }

  export const BIOMECH_POST_PROPERTIES = proxiedPropertyOf<BiomechPost>();
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
    equipmentStatus: string;
    createdAt: string;
    updatedAt: string;
    imgPath: string;
  }
}
