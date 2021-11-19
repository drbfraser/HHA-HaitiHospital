import React from 'react';

import { ElementStyleProps } from 'constants/interfaces';
// import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import Sidebar from '../../components/side_bar/side_bar';
import Header from 'components/header/header';

import './add_message_styles.css'
import MessageForm  from './message_form';

// Not sure what these are for

// interface Message {
//   deparmentId: Number;
//   departmentName: String;
//   authorId: Number;
//   date: Date;
//   messageBody: String;
//   messageHeader: String;
// }


// const messageFormSchema = Yup.object({
//   authorId: Yup.number().min(0).required('Required'),

//   messageBody: Yup.string()
//     .min(5, 'Must be 5 characters at minimum')
//     .max(300, 'Must be 300 characters or less')
//     .required('Required'),

//   messageHeader: Yup.string()
//     .min(5, 'Must be 5 characters at minimum')
//     .max(100, 'Must be 100 characters or less')
//     .required('Required'),
// });



function AddMessage() {

  return (
    <div className="add_message">
      <Sidebar/>

      <main className="main_container">
        <Header/>

        <div className="container">
          <h1 className="h1">Add Message</h1>
          <MessageForm/>

        </div>
      </main>
    </div>
  )

}

export default AddMessage;



