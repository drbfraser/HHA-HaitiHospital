import * as mongoose from 'mongoose';
import UserCollection, { USER_MODEL_NAME } from './user';

const { Schema } = mongoose;

export interface IPermission {
  _id: string;
  submittedDate: Date;
  submittedUserId: string;
  submittedBy: string;
  permissionObject: object;
}

const PATH_TO_USER_ID = 'modifiedUserId';

const permissionSchema = new Schema({
  lastModified: {
    type: Date,
    required: true,
    default: Date.now,
  },
  modifiedBy: {
    type: String,
    required: true,
  },
  modifiedUserId: {
    type: String,
    required: true,
    ref: USER_MODEL_NAME,
  },
  permissionObject: { type: Object, required: true },
});

export const PERMISSION_MODEL_NAME = 'Permission';
export const PermissionCollection = mongoose.model(PERMISSION_MODEL_NAME, permissionSchema);

// >>>> VALIDATORS >>>>
const verifyUser = async (value: string) => {
  const existed = await UserCollection.exists({ _id: value });
  return existed;
};

// don't validate in test environment
if (process.env.NODE_ENV !== 'test') {
  permissionSchema.path(`${PATH_TO_USER_ID}`).validate({
    validator: verifyUser,
    message: function (props: mongoose.ValidatorProps) {
      return `Permission references to non-existing user`;
    },
  });
}
