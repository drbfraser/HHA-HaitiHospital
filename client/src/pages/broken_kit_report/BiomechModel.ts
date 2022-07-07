export enum BioMechPriority {
  URGENT = 'urgent',
  IMPORTANT = 'important',
  NONURGENT = 'non-urgent',
}

export enum BioMechBadge {
  URGENT = 'danger',
  IMPORTANT = 'warning',
  NONURGENT = 'success',
}

export interface BiomechModel {
  //all BioMech Data
  userId: { type: Date; required: true };
  createdOn: { type: Date; required: true };
  equipmentName: { type: String; required: true };
  equipmentFault: { type: String; required: true };
  equipmentPriority: { type: BioMechPriority; required: true };

  //image data
  image: {
    // imageData: {type: Buffer, required: true},
    imgPath: { type: String; required: true };
    //contentType: {type: String, required: true},
  };
}

export const setPriority = (priority: BioMechPriority): string => {
  switch (priority) {
    case BioMechPriority.URGENT:
      return BioMechBadge.URGENT;
    case BioMechPriority.IMPORTANT:
      return BioMechBadge.IMPORTANT;
    case BioMechPriority.NONURGENT:
      return BioMechBadge.NONURGENT;
  }
};
