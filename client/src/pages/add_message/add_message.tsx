import React from 'react';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';

// import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import Sidebar from '../../components/side_bar/side_bar';
import Header from 'components/header/header';

import './add_message_styles.css'
import MessageForm  from '../../components/message_form/message_form';

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
    const history = useHistory();

    const postMessage = (async (data) => {
        const api = '/api/messageboard/';
    try {
        let response = await Axios.post(api, data);
        history.push('/message-board')
        alert('success');

    }
    catch (e) {
        if (e.response.status === 401)
            alert("update message failed: unauthorized");
        else 
            alert("update message failed");
        console.log("update message failed ", e.response.status);
    }
    })


  return (
    <div className="add_message">
      <Sidebar/>

      <main className="main_container">
        <Header/>

        <div className="container">
            <h1 className="h1">Add Message</h1>
            <MessageForm
            submitAction={postMessage}
            />

            <br/>

            <button 
            className="btn btn-md btn-outline-secondary"
            onClick={history.goBack}
            > Back </button>

        </div>
      </main>
    </div>
  )

}

export default AddMessage;



