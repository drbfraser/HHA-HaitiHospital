export enum bioMechEnum {
    Urgent = "Urgent",
    Important = "Important",
    NonUrgent = "Non-Urgent",
}


export interface BiomechModel{
    //all BioMech Data
    userId: {type: Date, required: true},
    createdOn: {type: Date, required: true},
    equipmentName: {type: String, required: true},
    equipmentFault: {type: String, required: true},
    equipmentPriority: {type: bioMechEnum, required: true},

    //image data
    image: {
        // imageData: {type: Buffer, required: true},
        imgPath: {type: String, required: true},
        //contentType: {type: String, required: true},
    },
};

export default BiomechModel;