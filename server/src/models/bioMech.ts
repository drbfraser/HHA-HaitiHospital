import Departments from '../utils/departments';
import * as mongoose from 'mongoose';
import { IllegalState } from '../exceptions/systemException';
import { formatDateString } from '../utils/utils';
import UserCollection, { UserJson } from './user';

const { Schema } = mongoose;

export enum bioMechEnum {
  Urgent = 'Urgent',
  Important = 'Important',
  NonUrgent = 'Non-Urgent'
}

export interface BioMech {
  userId: string;
  departmentId: string;
  equipmentName: string;
  equipmentFault: string;
  equipmentPriority: bioMechEnum;
  createdAt: Date;
  updatedAt: Date;
  imgPath: string;
}

export interface BioMechJson {
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

interface BioMechWithInstanceMethods extends BioMech {
  toJson(): () => Promise<BioMechJson>;
}

const bioMechSchema = new Schema<BioMechWithInstanceMethods>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    departmentId: { type: String, required: true },
    equipmentName: { type: String, required: true },
    equipmentFault: { type: String, required: true },
    equipmentPriority: { type: bioMechEnum, required: true },
    imgPath: { type: String, required: true }
  },
  { timestamps: true }
);
bioMechSchema.methods.toJson = async function (): Promise<BioMechJson> {
  const userDoc = await UserCollection.findOne({ _id: this.userId }).exec();
  if (!userDoc) {
    throw new IllegalState(`Biomech references to non-existing user with id ${this.userId}`);
  }
  const userJson = await userDoc.toJson();

  const json: BioMechJson = {
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
