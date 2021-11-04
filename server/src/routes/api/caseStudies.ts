import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { resolve } from 'path';

import requireJwtAuth from '../../middleware/requireJwtAuth';
import User, { hashPassword, validateUser } from '../../models/User';
// import { PatientStory, StaffRecognition, TrainingSession, EquipmentReceived, OtherStory, CaseStudies } from '../../models/CaseStudies';
import CaseStudies from '../../models/CaseStudies';
import { Mongoose } from 'mongoose';

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, resolve(__dirname, '../../../public/images'));
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, `avatar-${Date.now()}-${fileName}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  },
});

router.get('/', async (req, res) => {
    try {
        await CaseStudies.find().then(data => res.json(data));
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

// add user, currently working
router.post('/', async (req, res) => {
    try {
        const { caseStudyType, patientStory, staffRecognition, trainingSession, equipmentReceived, otherStory } = req.body;
        const newCaseStudy = new CaseStudies({
            caseStudyType,
            patientStory,
            staffRecognition,
            trainingSession,
            equipmentReceived,
            otherStory
        });

        newCaseStudy.save()
            .then(() => res.json("Case study submmitted successfully"))

    } catch (err) {
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

// router.get('/:caseStudyType', async (req, res) => {
//   try {
//     switch (req.params.caseStudyType) {
//       case "PatientStory": {
//         await PatientStory.find().then(data => res.json(data));
//         break;
//       }
//       case "StaffRecognition": {
//         await StaffRecognition.find().then(data => res.json(data));
//         break;
//       }
//       default: {}
//     }
//     var caseStudies = [];
//     await StaffRecognition.find().then(data => {
//       data.map((d, k) => {
//         caseStudies.push(d);
//       });
//     });
//     await TrainingSession.find().then(data => {
//       data.map((d, k) => {
//         caseStudies.push(d);
//       });
//     });
//     await EquipmentReceived.find().then(data => {
//       data.map((d, k) => {
//         caseStudies.push(d);
//       });
//     });
//     await OtherStory.find().then(data => {
//       data.map((d, k) => {
//         caseStudies.push(d);
//       });
//     });

//     res.json({
//       caseStudies: caseStudies.map((m) => {
//         return m.toJSON();
//       }),
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Something went wrong.' });
//   }
// });


// router.put('/:id', [requireJwtAuth, upload.single('avatar')], async (req : Request, res : Response, next : NextFunction) => {
//   try {
//     const tempUser = await User.findById(req.params.id);
//     const reqUser : any = req.user;
//     if (!tempUser) return res.status(404).json({ message: 'No such user.' });
//     if (!(tempUser.id === reqUser.id || reqUser.role === 'ADMIN'))
//       return res.status(400).json({ message: 'You do not have privilegies to edit this user.' });

//     //validate name, username and password
//     const { error } = validateUser(req.body);
//     if (error) return res.status(400).json({ message: error.details[0].message });

//     // let avatarPath = null;
//     // if (req.file) {
//     //   avatarPath = req.file.filename;
//     // }

//     // if fb or google user provider dont update password
//     let password = null;
//     if (req.body.password && req.body.password !== '') {
//       password = await hashPassword(req.body.password);
//     }

//     const existingUser = await User.findOne({ username: req.body.username });
//     if (existingUser && existingUser.id !== tempUser.id) {
//       return res.status(400).json({ message: 'Username alredy taken.' });
//     }

//     const updatedUser = { name: req.body.name, username: req.body.username, password };
//     // remove '', null, undefined
//     Object.keys(updatedUser).forEach((k) => !updatedUser[k] && updatedUser[k] !== undefined && delete updatedUser[k]);
//     // console.log(req.body, updatedUser);
//     const user = await User.findByIdAndUpdate(tempUser.id, { $set: updatedUser }, { new: true });

//     res.status(200).json({ user });
//   } catch (err) {
//     res.status(500).json({ message: 'Something went wrong.' });
//   }
// });

// router.get('/me', requireJwtAuth, async (req, res) => {
//   // const reqUser : any = req.user;
//   // const me : any = req.user.toJSON();
//   const me : any = JSON.parse(JSON.stringify(req.user));
//   res.json({ me });
// });

// // get one user, currently working
// router.get('/:username', requireJwtAuth, async (req, res) => {
//   try {
//     const user = await User.findOne({ username: req.params.username });
//     if (!user) return res.status(404).json({ message: 'No user found.' });
//     res.json({ user: user.toJSON() });
//   } catch (err) {
//     res.status(500).json({ message: 'Something went wrong.' });
//   }
// });

// // get all users, currently working
// router.get('/', requireJwtAuth, async (req, res) => {
//   try {
//     const users = await User.find().sort({ createdAt: 'desc' });

//     res.json({
//       users: users.map((m) => {
//         return m.toJSON();
//       }),
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Something went wrong.' });
//   }
// });

// // delete user, currently working without req.user 
// router.delete('/:id', requireJwtAuth, async (req, res) => {
//   try {
//     const tempUser = await User.findById(req.params.id);
//     console.log(tempUser);
//     const reqUser : any = req.user;
//     console.log(reqUser);
//     if (!tempUser) return res.status(404).json({ message: 'No such user.' });
//     if (reqUser.role !== 'ADMIN')
//       return res.status(400).json({ message: 'You do not have privilegies to delete that user.' });

//     // //delete all messages from that user
//     // await Message.deleteMany({ user: tempUser.id });
//     //delete user
//     const user = await User.findByIdAndRemove(tempUser.id);
//     res.status(200).json({ user });
//   } catch (err) {
//     res.status(500).json({ message: 'Something went wrong.' });
//   }
// });

// // add user, currently working
// router.post('/', requireJwtAuth, async (req, res) => {
//   try {
//     const reqUser : any = req.user;
//     if (reqUser.role !== 'ADMIN')
//       return res.status(400).json({ message: 'You do not have privilegies to add a user.' });

//     const { username, password, name, role } = req.body;

//     const existingUser = await User.findOne({ username });

//     console.log(req.body);
//     if (existingUser) {
//       return res.status(422).send({ message: 'Username is in use' });
//     }


//     const newUser = await new User({
//       // provider: "email",
//       // email,
//       username,
//       password,
//       name,
//       role,
//       // avatar: faker.image.avatar(),
//     });

//     newUser.registerUser(newUser, (err, user) => {
//       if (err) throw err;
//       res.json({ message: 'Successfully added user.' }); // just redirect to login
//     });

//   } catch (err) {
//     res.status(500).json({ message: 'Something went wrong.' });
//   }
// });

export default router;
