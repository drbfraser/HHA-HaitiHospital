import mongoose from 'mongoose';

import CaseStudy from './CaseStudies';

const { Schema } = mongoose;

const leaderSchema = new Schema(
    {
        department: { type: String, required: true },
        points: { type: Number, required: true }
    },
    { timestamps: true },
);

export async function updateLeaderboard() {
    CaseStudy.find().populate({
        path: 'author',
        match: {
            department: 'NICU_PAEDS'
        }
    })
    // .exec(function(err, users) {
    //     users = users.filter(function(user) {
    //         return user.email; // return only users with email matching 'type: "Gmail"' query
    //     });
    // });

    // var pointsNicuPaeds = 0;
    // await CaseStudy.find({ userDepartment: 0 }).exec(function (err, results) {
    //     pointsNicuPaeds += results.length;
    // });
    // var pointsMaternity = 0;
    // await CaseStudy.find({ userDepartment: 1 }).exec(function (err, results) {
    //     pointsMaternity += results.length;
    // });
    // var pointsRehab = 0;
    // await CaseStudy.find({ userDepartment: 2 }).exec(function (err, results) {
    //     pointsRehab += results.length;
    // });
    // var pointsCommunity = 0;
    // await CaseStudy.find({ userDepartment: 3 }).exec(function (err, results) {
    //     pointsCommunity += results.length;
    // });
};

const Leader = mongoose.model('Leader', leaderSchema);

export default Leader;
