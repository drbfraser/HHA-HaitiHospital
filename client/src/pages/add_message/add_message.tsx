import React from 'react';
import { useHistory } from 'react-router-dom';
import Axios, { AxiosError } from 'axios';

import Sidebar from '../../components/side_bar/side_bar';
import Header from 'components/header/header';

import './add_message_styles.css'
import MessageForm  from '../../components/message_form/message_form';
import {useTranslation} from "react-i18next";


import DbErrorHandler from 'actions/http_error_handler';


function AddMessage() {
    const history = useHistory();
    const {t,i18n} = useTranslation();

    const postMessage = (async (data) => {
        const api = '/api/messageboard/';
    try {
        let response = await Axios.post(api, data);
        history.push('/message-board')
        alert('success');
        alert(i18n.t("addMessageAlertSuccess"));

    }
    catch (e) {
        DbErrorHandler(e, history);
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



