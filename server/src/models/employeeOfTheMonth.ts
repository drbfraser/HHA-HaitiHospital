import * as mongoose from 'mongoose';

const { Schema } = mongoose;

const employeeOfTheMonthSchema = new Schema(
  {
    name: { type: String, required: true },
    department: { type: String, required: true },
    description: { type: String, required: true },
    imgPath: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

const EmployeeOfTheMonth = mongoose.model('EmployeeOfTheMonth', employeeOfTheMonthSchema, 'EmployeeOfTheMonth');
export default EmployeeOfTheMonth;
