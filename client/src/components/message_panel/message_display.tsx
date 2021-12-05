import React from 'react';
import {Link} from 'react-router-dom'
import { renderBasedOnRole } from "../../actions/roleActions";
import { useAuthState } from 'Context';
import { Role } from "../../constants/interfaces"

import { Json, ElementStyleProps } from 'constants/interfaces';
import Axios from 'axios';

interface MessageDisplayProps extends ElementStyleProps  {
    msgJson : Json;
    notifyChange : Function;
}

const MessageDisplay = (props: MessageDisplayProps) => {
    const authState = useAuthState();

    async function deleteMessage(msgId: string) {
        if (window.confirm("Delete message?")) {

            const success = await deleteMessageFromDb(msgId);

            if (success === true)
                props.notifyChange();
        }
    }

    async function deleteMessageFromDb(msgId: string) : Promise<boolean> {
        const deleteMsgApi = `/api/messageboard/${msgId}`;
        try {
            const response = await Axios.delete(deleteMsgApi);
            return true; 
        }
        catch (err: any) {
            console.log("Delete message failed");
            return false;
        }
    }  

    let readableDate = new Date(props.msgJson.date as string).toLocaleString();

    return (
    <div className="d-flex text-muted pt-2">
        {/* Profile pic */}
        <svg className="bd-placeholder-img flex-shrink-0 me-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 32x32" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#007bff"></rect><text x="50%" y="50%" fill="#007bff" dy=".3em">32x32</text></svg>
        
        {/* Message content */}
        <div className="pb-3 mb-0 border-bottom flex-grow-1">

            {/* Author Id, Deparment, Date */}
            <div className="d-md-flex justify-content-between text-gray-dark">
                <p><strong className="text-gray-dark">@{
                ((props.msgJson as Json).userId as Json).name}</strong></p>
                <p><strong className="lh-sm">
                    {props.msgJson.departmentName}
                </strong></p>
                <p><strong className="lh-sm">
                    {readableDate}
                </strong></p>
            </div>

            {/* Message title */}
            <div className='text-gray-dark'>
                <p><strong>Title: {props.msgJson.messageHeader}</strong></p>
            </div>

            {/* Message body with utility buttons */}
            <div className="d-md-flex justify-content-between text-gray-dark text-break">
                <p className="lh-sm">
                    {props.msgJson.messageBody}
                </p>

                <p className='d-md-flex lh-sm'>

                    { renderBasedOnRole(authState.userDetails.role, [Role.Admin, Role.MedicalDirector]) ? (
                        <Link className='align-self-center' to={`message-board/edit/${props.msgJson["_id"]}`}>
                            <button type='button' className='btn btn-md btn-outline-secondary'>
                                <i className="bi bi-pencil"></i>
                            </button>
                        </Link>
                        ): (<div></div>)
                    }

                    { renderBasedOnRole(authState.userDetails.role, [Role.Admin, Role.MedicalDirector]) ? (
                        <button type="button" className="btn btn-md btn-outline-secondary" 
                        onClick = {() => deleteMessage(props.msgJson["_id"] as string)} >
                            <i className='bi bi-trash'></i>
                        </button>
                        ): (<div></div>)
                    }
                </p>
            </div>
        </div>

        
    </div>);
}

export default MessageDisplay;