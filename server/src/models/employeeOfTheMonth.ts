import Departments from 'utils/departments';
import * as mongoose from 'mongoose';
import { formatDateString } from 'utils/utils';

const { Schema } = mongoose;

export interface EmployeeOfTheMonth {
  name: string;
  departmentId: string;
  description: string;
  imgPath: string;
  updatedAt?: Date;
  createdAt?: Date;
}

export interface EmployeeOfTheMonthJson {
  id: string;
  name: string;
  department: {
    id: string;
    name: string;
  };
  description: string;
  imgPath: string;
  updatedAt: string;
  createdAt: string;
}

export interface EmployeeOfTheMonthWithInstanceMethods extends EmployeeOfTheMonth {
  toJson: () => Promise<EmployeeOfTheMonthJson>;
}

const employeeOfTheMonthSchema = new Schema<EmployeeOfTheMonthWithInstanceMethods>(
  {
    name: { type: String, required: true },
    departmentId: { type: String, required: true },
    description: { type: String, required: true },
    imgPath: { type: String, required: true },
    updatedAt: { type: Date },
    createdAt: { type: Date }
  },
  {
    timestamps: true
  }
);
employeeOfTheMonthSchema.methods.toJson = async function (): Promise<EmployeeOfTheMonthJson> {
  let json: EmployeeOfTheMonthJson = {
    id: this._id,
    name: this.name,
    department: {
      id: this.departmentId,
      name: await Departments.Database.getDeptNameById(this.departmentId)
    },
    description: this.description,
    imgPath: this.imgPath,
    updatedAt: formatDateString(this.updatedAt!),
    createdAt: formatDateString(this.createdAt!)
  };
  return json;
};

const EmployeeOfTheMonthCollection = mongoose.model<EmployeeOfTheMonthWithInstanceMethods>('EmployeeOfTheMonth', employeeOfTheMonthSchema, 'EmployeeOfTheMonth');

export default EmployeeOfTheMonthCollection;
