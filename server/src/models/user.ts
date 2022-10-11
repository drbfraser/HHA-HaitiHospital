import mongoose, { Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as ENV from '../utils/processEnv';
import Departments from '../utils/departments';
import { UserApiOut } from '../routes/api/jsons/user';

const { Schema } = mongoose;

export enum Role {
  Admin = 'Admin',
  MedicalDirector = 'Medical Director',
  HeadOfDepartment = 'Head of Department',
  User = 'User'
}

// User is used internally. Currently _id is optional since _id is generated by mongodb.
// May want to use uuid if so, can add replace _id with id and modify the schema accordingly into this.
export interface User {
  _id?: string;
  username: string;
  password: string;
  name: string;
  role: string;
  departmentId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserWithInstanceMethods extends User {
  toJson: () => Promise<UserApiOut.UserJson>;
  generateJWT: () => any;
  registerUser: (newUser: any, callback: Function) => void;
  comparePassword: (otherPw: any, callback: Function) => void;
}

const userSchema = new Schema<UserWithInstanceMethods>(
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
    departmentId: { type: String, required: true }
  },
  { timestamps: true }
);

userSchema.methods.toJson = async function (): Promise<UserApiOut.UserJson> {
  return {
    id: this._id,
    name: this.name,
    role: this.role,
    department: {
      id: this.departmentId,
      name: await Departments.Database.getDeptNameById(this.departmentId)
    },
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
    bcrypt.hash(newUser.password, salt, (err, hash) => {
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

export const USER_MODEL_NAME = 'User';
const UserCollection = mongoose.model<UserWithInstanceMethods>(USER_MODEL_NAME, userSchema);
export default UserCollection;
