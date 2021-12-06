import React from 'react';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';

// import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import Sidebar from '../../components/side_bar/side_bar';
import Header from 'components/header/header';

import './add_message_styles.css'
import MessageForm  from '../../components/message_form/message_form';
import {useTranslation} from "react-i18next";

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
    const {t,i18n} = useTranslation();

    const postMessage = (async (data) => {
        const api = '/api/messageboard/';
    try {
        let response = await Axios.post(api, data);
        history.push('/message-board')
        alert(i18n.t("addMessageAlertSuccess"));

    }
    catch (e) {
        if (e.response.status === 401)
            alert(i18n.t("addMessageAlertUnauthorized"));
        else 
            alert(i18n.t("addMessageAlertFailed"));
        console.log("update message failed ", e.response.status);
    }
    })


  return (
    <div className="add_message">
      <Sidebar/>

      <main className="main_container">
        <Header/>

        <div className="container">
            <h1 className="h1">{t("addMessageAddMessage")}</h1>
            <MessageForm
            submitAction={postMessage}
            />

            <br/>

            <button 
            className="btn btn-md btn-outline-secondary"
            onClick={history.goBack}
            > {t("addMessageBack")} </button>

        </div>
      </main>
    </div>
  )

}

export default AddMessage;



