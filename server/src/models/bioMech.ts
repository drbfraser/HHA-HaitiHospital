import * as mongoose from 'mongoose';

import Departments from 'utils/departments';
import UserCollection from './user';
import { formatDateString } from 'utils/utils';
import { BiomechPriority, BiomechStatus, BioMech, BiomechJson, unknownUserJson } from '@hha/common';

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

const { Schema } = mongoose;

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
  export interface BiomechGet extends BiomechJson {}
}

interface BioMechWithInstanceMethods extends BioMech {
  toJson: () => Promise<BiomechJson>;
}

const bioMechSchema = new Schema<BioMechWithInstanceMethods>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    departmentId: { type: String, required: true },
    equipmentName: { type: String, required: true },
    equipmentFault: { type: String, required: true },
    equipmentPriority: { type: BiomechPriority, required: true },
    equipmentStatus: { type: BiomechStatus, required: true },
    imgPath: { type: String, required: true },
  },
  { timestamps: true },
);
bioMechSchema.methods.toJson = async function (): Promise<BiomechJson> {
  const userDoc = await UserCollection.findOne({ _id: this.userId }).exec();
  const userJson = (await userDoc?.toJson()) || unknownUserJson;

  const json: BiomechJson = {
    id: this._id,
    user: userJson,
    department: {
      id: this.departmentId,
      name: await Departments.Database.getDeptNameById(this.departmentId),
    },
    equipmentName: this.equipmentName,
    equipmentPriority: this.equipmentPriority,
    equipmentFault: this.equipmentFault,
    equipmentStatus: this.equipmentStatus,
    createdAt: formatDateString(this.createdAt),
    updatedAt: formatDateString(this.createdAt),
    imgPath: this.imgPath,
  };
  return json;
};

const BioMechCollection = mongoose.model<BioMechWithInstanceMethods>(
  'BioMech',
  bioMechSchema,
  'BioMechReports',
);
export default BioMechCollection;
