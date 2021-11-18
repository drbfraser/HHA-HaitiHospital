import mongoose from 'mongoose';

const { Schema } = mongoose;

export enum DepartmentName {
    NicuPaeds = "NICU/Paeds",
    Maternity = "Maternity",
    Rehab = "Rehab",
    CommunityHealth = "Community & Health",
}

const departmentSchema = new Schema(
    {
        name: { type: DepartmentName, required: true },
        points: { type: Number, required: true, default: 0 }
    },
    { timestamps: true },
);

const Department = mongoose.model('Department', departmentSchema);

export default Department;
