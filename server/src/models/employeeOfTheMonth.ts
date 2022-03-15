import * as mongoose from 'mongoose';
import { DepartmentName } from '../common/definitions/departments';

const { Schema } = mongoose;

const employeeOfTheMonthSchema = new Schema(
  {
    name: { type: String, required: true },
    department: { type: DepartmentName, required: true },
    description: { type: String, required: true },
    imgPath: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

const EmployeeOfTheMonth = mongoose.model('EmployeeOfTheMonth', employeeOfTheMonthSchema, 'EmployeeOfTheMonth');
export default EmployeeOfTheMonth;
