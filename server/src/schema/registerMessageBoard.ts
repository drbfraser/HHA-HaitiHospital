import { check } from 'express-validator';
import { msgNumber, msgString } from '../utils/sanitizationMessages';

const messageBoardCreate = [
  // check('messageBody').trim().escape().isLength({ min: 1 }).withMessage(msgString),
  // check('messageHeader').trim().escape().isLength({ min: 1 }).withMessage(msgString),
  // check('departmentId').trim().escape().isLength({ min: 1}).withMessage(msgNumber),
];

export { messageBoardCreate as registerMessageBoardCreate };
