import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { DepartmentName } from '../common/definitions/departments';
import * as ENV from '../utils/processEnv';

const { Schema } = mongoose;

export enum Role {
  Admin = 'Admin',
  MedicalDirector = 'Medical Director',
  HeadOfDepartment = 'Head of Department',
  User = 'User'
}

// Reference to fix .js to .ts here: https://stackoverflow.com/questions/45485073/typescript-date-type
export interface User extends Document {
  _id: number;
  username: String;
  password: String;
  name: String;
  role: String;
  department: DepartmentName;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<User>(
  {
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9_]+$/, 'is invalid'],
      index: true
    },
    password: {
      type: String,
      trim: true,
      minlength: 6,
      maxlength: 60
    },
    name: String,
    role: { type: String, default: Role.User },
    department: { type: DepartmentName }
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  return {
    id: this._id,
    username: this.username,
    name: this.name,
    role: this.role,
    department: this.department,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

userSchema.methods.generateJWT = function () {
  const token = jwt.sign(
    {
      expiresIn: '12h',
      id: this._id,
      username: this.username,
      name: this.name,
      role: this.role
    },
    ENV.JWT_SECRET
  );
  return token;
};

userSchema.methods.registerUser = (newUser, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (errh, hash) => {
      if (err) {
        console.log(err);
      }
      // set pasword to hash
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

export async function hashPassword(password) {
  const saltRounds = 10;

  const hashedPassword: string = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) reject(err);
      else resolve(hash);
    });
  });

  return hashedPassword;
}

export const validateUserSchema = Joi.object().keys({
  username: Joi.string().alphanum().min(2).max(20).required(),
  password: Joi.string().min(6).max(20).required(),
  name: Joi.string().min(2).max(30).required(),
  role: Joi.string().required(),
  department: Joi.string()
});

export const validateUpdatedUserSchema = Joi.object().keys({
  username: Joi.string().alphanum().min(2).max(20).allow(''),
  password: Joi.string().min(6).max(20).allow(''),
  name: Joi.string().min(2).max(30).allow(''),
  role: Joi.string().allow(''),
  department: Joi.string().allow('')
});

export const validateUser = (user) => {
  return validateUserSchema.validate(user);
};

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
