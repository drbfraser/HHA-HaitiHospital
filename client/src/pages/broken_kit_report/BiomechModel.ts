export enum BiomechPriority {
  URGENT = 'urgent',
  IMPORTANT = 'important',
  NONURGENT = 'non-urgent',
}

export enum BiomechBadge {
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
  equipmentPriority: { type: BiomechPriority; required: true };

  //image data
  image: {
    // imageData: {type: Buffer, required: true},
    imgPath: { type: String; required: true };
    //contentType: {type: String, required: true},
  };
}

export const setPriority = (priority: BiomechPriority): string => {
  switch (priority) {
    case BiomechPriority.URGENT:
      return BiomechBadge.URGENT;
    case BiomechPriority.IMPORTANT:
      return BiomechBadge.IMPORTANT;
    case BiomechPriority.NONURGENT:
      return BiomechBadge.NONURGENT;
  }
};
