import Axios, { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";

import { useParams } from "react-router";

import {emptyMessage, Message} from 'constants/interfaces'
import Sidebar from "components/side_bar/side_bar";
import Header from "components/header/header";
import MessageForm from "components/message_form/message_form";

import './edit_message_styles.css'

async function fetchMsgFromDb(id: string) {

    const api = `/api/messageBoard/message/${id}`;
    try {
        const response = await Axios.get(api);
        return response.data;
    }
    catch (err){
        console.log("Fetch msg from db failed: ",err);
        return {};
    }

}

// sample url /messageBoard/edit/{id}
const EditMessage = () => {
    const { id } = useParams<{id? : string}>();
    const [msg, setMsg] = useState<Message>({} as Message)

    async function fetchMsg(id: string) {
        const msgData = await fetchMsgFromDb(id);

        const msg : Message = {
            messageBody: msgData["messageBody"],
            messageHeader: msgData["messageHeader"],
            departmentId: msgData["departmentId"],
            departmentName: msgData['deparmentName'],
            user: msgData['userId'],
            date: msgData['date'],
        }
    
        setMsg(msg);
    }

    useEffect(() => {
        fetchMsg(id);
    }, [])

    const updateMessage = async (data) => {
        const api = `api/messageboard/${id}`;
        try {
            let response = await Axios.put(api, data);
            alert('success');
        }
        catch (e) {
            if (e.response.status === 401)
                alert("update message failed: unauthorized");
            else 
                alert("update message failed");
            console.log("update message failed ", e.response.status);
        }
    }

    return (<>
        <div className='edit-message'>
            <Sidebar/>

            <main>
                <Header/>
                <div className="container">
                    <h1 className="">Edit Message</h1>
                    <MessageForm 
                        optionalMsg = {msg}
                        submitAction = {updateMessage}
                    />
                </div>
            </main>

        </div>

    </>
    )
}

export default EditMessage;