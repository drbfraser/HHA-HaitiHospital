import * as mongoose from 'mongoose';
// import { FormDataModels } from './formdataModels';
const { Schema } = mongoose;

const departmentsSchema = new Schema({
    
});

const Departments = mongoose.model('Departments', departmentsSchema, 'Departments');
module.exports = Departments;