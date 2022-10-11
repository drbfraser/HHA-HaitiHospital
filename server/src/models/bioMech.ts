import Departments from '../utils/departments';
import * as mongoose from 'mongoose';
import { IllegalState } from '../exceptions/systemException';
import { formatDateString } from '../utils/utils';
import UserCollection from './user';
import { BiomechApiOut } from 'routes/api/jsons/biomech';

const { Schema } = mongoose;

export enum BiomechPriority {
  URGENT = 'urgent',
  IMPORTANT = 'important',
  NONURGENT = 'non-urgent'
}

export interface BioMech {
  userId: string;
  departmentId: string;
  equipmentName: string;
  equipmentFault: string;
  equipmentPriority: BiomechPriority;
  createdAt: Date;
  updatedAt: Date;
  imgPath: string;
}

type BiomechJson = BiomechApiOut.BiomechGet;
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
    imgPath: { type: String, required: true }
  },
  { timestamps: true }
);
bioMechSchema.methods.toJson = async function (): Promise<BiomechJson> {
  const userDoc = await UserCollection.findOne({ _id: this.userId }).exec();
  if (!userDoc) {
    throw new IllegalState(`Biomech references to non-existing user with id ${this.userId}`);
  }
  const userJson = await userDoc.toJson();

  const json: BiomechJson = {
    id: this._id,
    user: userJson,
    department: {
      id: this.departmentId,
      name: await Departments.Database.getDeptNameById(this.departmentId)
    },
    equipmentName: this.equipmentName,
    equipmentPriority: this.equipmentPriority,
    equipmentFault: this.equipmentFault,
    createdAt: formatDateString(this.createdAt),
    updatedAt: formatDateString(this.createdAt),
    imgPath: this.imgPath
  };
  return json;
};

const BioMechCollection = mongoose.model<BioMechWithInstanceMethods>('BioMech', bioMechSchema, 'BioMechReports');
export default BioMechCollection;
