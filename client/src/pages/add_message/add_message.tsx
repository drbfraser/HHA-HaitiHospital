import React from 'react';
import { useHistory } from 'react-router-dom';
import Axios, { AxiosError } from 'axios';

import Sidebar from '../../components/side_bar/side_bar';
import Header from 'components/header/header';

import './add_message_styles.css'
import MessageForm  from '../../components/message_form/message_form';
import DbErrorHandler from 'actions/http_error_handler';


function AddMessage() {
    const history = useHistory();

    const postMessage = (async (data) => {
        const api = '/api/messageboard/';
    try {
        let response = await Axios.post(api, data);
        history.push('/messageBoard')
        alert('success');
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



