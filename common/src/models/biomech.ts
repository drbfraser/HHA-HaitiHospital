import { UserApiOut } from './user';

// To extract a TS type's properties to string
// Ref: https://stackoverflow.com/a/42516869
const proxiedPropertyOf = <IObj>() =>
  new Proxy(
    {},
    {
      get: (_, prop) => prop,
      set: () => {
        throw new Error(`Setter not supported`);
      },
    },
  ) as {
    [P in keyof IObj]: P;
  };
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

export type BiomechJson = BiomechApiOut.BiomechGet;

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
    user: UserApiOut.UserGet;
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
