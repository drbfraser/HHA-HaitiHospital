export enum bioMechEnum {
  Urgent = 'urgent',
  Important = 'important',
  NonUrgent = 'non-urgent',
}

export enum bioMechBadge {
  Urgent = 'danger',
  Important = 'warning',
  NonUrgent = 'success',
}

export interface BiomechModel {
  //all BioMech Data
  userId: { type: Date; required: true };
  createdOn: { type: Date; required: true };
  equipmentName: { type: String; required: true };
  equipmentFault: { type: String; required: true };
  equipmentPriority: { type: bioMechEnum; required: true };

  //image data
  image: {
    // imageData: {type: Buffer, required: true},
    imgPath: { type: String; required: true };
    //contentType: {type: String, required: true},
  };
}

export const setPriority = (priority: bioMechEnum): string => {
  switch (priority) {
    case bioMechEnum.Urgent:
      return bioMechBadge.Urgent;
    case bioMechEnum.Important:
      return bioMechBadge.Important;
    case bioMechEnum.NonUrgent:
      return bioMechBadge.NonUrgent;
  }
};
