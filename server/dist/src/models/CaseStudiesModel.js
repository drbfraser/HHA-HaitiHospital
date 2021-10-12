"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CaseStudyOptions;
(function (CaseStudyOptions) {
    CaseStudyOptions[CaseStudyOptions["OtherStory"] = 0] = "OtherStory";
    CaseStudyOptions[CaseStudyOptions["PatientStory"] = 1] = "PatientStory";
    CaseStudyOptions[CaseStudyOptions["StaffRecognition"] = 2] = "StaffRecognition";
    CaseStudyOptions[CaseStudyOptions["TrainingSession"] = 3] = "TrainingSession";
    CaseStudyOptions[CaseStudyOptions["EquipmentReceived"] = 4] = "EquipmentReceived";
})(CaseStudyOptions || (CaseStudyOptions = {}));
var DepartmentEnum;
(function (DepartmentEnum) {
    DepartmentEnum["Rehab"] = "REHAB";
    DepartmentEnum["NICU_PAED"] = "NICU_PAED";
    DepartmentEnum["Maternity"] = "MATERNITY";
    DepartmentEnum["CommunityHealth"] = "COMMUNITY_HEALTH";
})(DepartmentEnum || (DepartmentEnum = {}));
var PurchasedOrDonatedEnum;
(function (PurchasedOrDonatedEnum) {
    PurchasedOrDonatedEnum["Purchased"] = "PURCHASED";
    PurchasedOrDonatedEnum["Donated"] = "DONATED";
})(PurchasedOrDonatedEnum || (PurchasedOrDonatedEnum = {}));
