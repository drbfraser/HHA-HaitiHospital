import * as mongoose from 'mongoose';

const { Schema } = mongoose;

export enum QuestionType {
  Simple
}

export const optionSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  }
});

export const questionSchema = new Schema({
  metadata: {
    type: {
      type: QuestionType,
      default: QuestionType.Simple,
      required: true
    }
  },
  description: {
    type: String,
    required: true,
    default: ''
  },
  answer: {
    type: String,
    default: '',
    required: true
  },
  options: [optionSchema]
});
