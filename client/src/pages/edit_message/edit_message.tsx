import Axios from "axios";
import React, { useEffect, useState } from "react";

import { useParams } from "react-router";

import {Message} from 'constants/interfaces'
import Sidebar from "components/side_bar/side_bar";
import Header from "components/header/header";

function fetchMsg(id: string) : Message {
    const response = fetchMsgFromDb(id);

    const msg : Message = {
        messageBody: response["messageBody"],
        messageHeader: response["messageHeader"],
        deparmentId: response["departmentId"],
        departmentName: response['deparmentName'],
        authorId: response['authorId'],
        date: response['date'],
    }

    return msg;
}

async function fetchMsgFromDb(id: string) {

    const api = `/message/${id}`;
    try {
        const response = await Axios.get(api);
        return response;
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

    useEffect(() => {
        const msg : Message = fetchMsg(id);
        setMsg(msg)
    }, [])

    return (<>
        <div className='edit_message'>
            <Sidebar/>

            <main>
                <Header/>
                <div className="container">
                    <h1 className="">Edit Message</h1>
                    
                </div>
            </main>

        </div>

    </>
    )
}