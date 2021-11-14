import mongoose from 'mongoose';

const { Schema } = mongoose;

export enum DepartmentName {
    NicuPaeds = "NICU_PAEDS",
    Maternity = "MATERNITY",
    Rehab = "REHAB",
    CommunityHealth = "COMMUNITY_HEALTH",
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
