import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as ENV from 'utils/processEnv';
import Departments from 'utils/departments';
import { UserApiOut } from '@hha/common';
import { logger } from '../logger';
import { Role, hashAlgorithm, User } from '@hha/common';

const argon2 = require('argon2');

const { Schema } = mongoose;

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
      match: [/^[a-zA-Z0-9_]+$/, 'Only letters, numbers and underscore allowed'],
      index: true,
    },
    password: {
      type: String,
      trim: true,
    },
    hashAlgorithm: {
      type: hashAlgorithm,
      default: null,
    },
    name: String,
    role: { type: String, default: Role.User },
    departmentId: { type: String, required: true },
  },
  {
    timestamps: true,
    writeConcern: {
      w: 'majority',
    },
  },
);

userSchema.methods.toJson = async function (): Promise<UserApiOut.UserJson> {
  return {
    id: this._id,
    name: this.name,
    username: this.username,
    role: this.role,
    department: {
      id: this.departmentId,
      name: await Departments.Database.getDeptNameById(this.departmentId),
    },
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

userSchema.methods.generateJWT = function () {
  const token = jwt.sign(
    {
      expiresIn: '12h',
      id: this._id,
      username: this.username,
      name: this.name,
      role: this.role,
    },
    ENV.JWT_SECRET,
  );
  return token;
};

userSchema.methods.registerUser = async (newUser, callback) => {
  // Using Argon2id June 12, 2023. Password is automatically hashed using this algorithm
  try {
    await hashPassword(newUser.password)
      .then((hash) => {
        newUser.password = hash;
        newUser.hashAlgorithm = hashAlgorithm.argon2id;
      })
      .then(() => newUser.save({ new: true }, callback));
  } catch (err) {
    logger.error(err);
  }
};

userSchema.methods.comparePassword = async function (plainTextPassword, callback) {
  switch (this.hashAlgorithm) {
    default:
      return callback('Password algorithm is invalid, please contact a developer');

    // null is bcrypt
    case null:
      bcrypt.compare(plainTextPassword, this.password, async (err, isMatch) => {
        if (err) return callback(err);

        if (isMatch) {
          const newPassword = await hashPassword(plainTextPassword);
          if (!argon2.verify(newPassword, plainTextPassword)) {
            callback('Error occured while processing login details. Please try again');
            return;
          }
          this.password = newPassword;
          this.hashAlgorithm = hashAlgorithm.argon2id;
          this.save();
          callback(null, isMatch);
        }
      });
      break;

    case hashAlgorithm.argon2id:
      try {
        const isMatch = await argon2.verify(this.password, plainTextPassword);
        callback(null, isMatch);
      } catch (err) {
        return callback(err);
      }
      break;
  }
};

export async function hashPassword(password: string): Promise<string> {
  // Using Argon2id June 12, 2023. Password is automatically hashed using this algorithm
  try {
    const hashedPassword = await argon2.hash(password, { type: argon2.argon2id });
    return hashedPassword;
  } catch (err) {
    logger.error(err);
    throw err;
  }
}

export const USER_MODEL_NAME = 'User';
const UserCollection = mongoose.model<UserWithInstanceMethods>(USER_MODEL_NAME, userSchema);
export default UserCollection;
