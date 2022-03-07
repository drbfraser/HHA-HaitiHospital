import * as mongoose from 'mongoose';
import { DepartmentName } from '../common/definitions/departments';

const { Schema } = mongoose;

export enum bioMechEnum {
  Urgent = 'Urgent',
  Important = 'Important',
  NonUrgent = 'Non-Urgent'
}

const bioMechSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    department: { type: DepartmentName },
    equipmentName: { type: String, required: true },
    equipmentFault: { type: String, required: true },
    equipmentPriority: { type: bioMechEnum, required: true },
    imgPath: { type: String, required: true }
  },
  { timestamps: true }
);

const BioMech = mongoose.model('BioMech', bioMechSchema, 'BioMechReports');
export default BioMech;
