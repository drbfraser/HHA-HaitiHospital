import Departments from 'utils/departments';
import * as mongoose from 'mongoose';
import { formatDateString } from 'utils/utils';
import { EmployeeOfTheMonth, EmployeeOfTheMonthJson } from '@hha/common';

const { Schema } = mongoose;

export interface EmployeeOfTheMonthWithInstanceMethods extends EmployeeOfTheMonth {
  toJson: () => Promise<EmployeeOfTheMonthJson>;
}

const employeeOfTheMonthSchema = new Schema<EmployeeOfTheMonthWithInstanceMethods>(
  {
    name: { type: String, required: true },
    departmentId: { type: String, required: true },
    description: { type: String, required: true },
    awardedMonth: { type: Number },
    awardedYear: { type: Number },
    updatedAt: { type: Date },
    createdAt: { type: Date },
    imgPath: { type: String },
  },
  {
    timestamps: true,
  },
);
employeeOfTheMonthSchema.methods.toJson = async function (): Promise<EmployeeOfTheMonthJson> {
  let json: EmployeeOfTheMonthJson = {
    id: this._id,
    name: this.name,
    department: {
      id: this.departmentId,
      name: await Departments.Database.getDeptNameById(this.departmentId),
    },
    description: this.description,
    imgPath: this.imgPath,
    awardedMonth: this.awardedMonth,
    awardedYear: this.awardedYear,
    updatedAt: formatDateString(this.updatedAt!),
    createdAt: formatDateString(this.createdAt!),
  };
  return json;
};

const EmployeeOfTheMonthCollection = mongoose.model<EmployeeOfTheMonthWithInstanceMethods>(
  'EmployeeOfTheMonth',
  employeeOfTheMonthSchema,
  'EmployeeOfTheMonth',
);

export default EmployeeOfTheMonthCollection;
