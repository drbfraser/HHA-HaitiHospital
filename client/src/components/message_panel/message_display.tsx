import React from 'react';
import {Link} from 'react-router-dom'

import { Json, ElementStyleProps } from 'constants/interfaces';

interface MessageDisplayProps extends ElementStyleProps  {
    msgJson : Json;
}

const MessageDisplay = (props: MessageDisplayProps) => {

    return (<div className="d-flex text-muted pt-2">
        <svg className="bd-placeholder-img flex-shrink-0 me-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 32x32" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#007bff"></rect><text x="50%" y="50%" fill="#007bff" dy=".3em">32x32</text></svg>

        <div className="pb-3 mb-0 border-bottom flex-grow-1">
            <div className="d-md-flex justify-content-between text-gray-dark">
                <p><strong className="text-gray-dark">@{props.msgJson.authorId}</strong></p>
                <p><strong className="lh-sm">
                   {props.msgJson.departmentName}
                </strong></p>
                <p><strong className="lh-sm">
                    {props.msgJson.date}
                </strong></p>
            </div>

            <div className='text-gray-dark'>
                <p><strong>Title: {props.msgJson.messageHeader}</strong></p>

            </div>

            <div className="d-md-flex justify-content-between text-gray-dark text-break">
                <p className="lh-sm">
                    {props.msgJson.messageBody}
                </p>
                <p className='d-md-flex lh-sm'>
                    <Link className='align-self-center' to="#"><button type='button' className='btn btn-md btn-outline-secondary'>
                        <i className="bi bi-pencil"></i>
                    </button></Link>

                    <button type="button" className="btn btn-md btn-outline-secondary" >
                        <i className='bi bi-trash'></i>
                    </button>
                </p>
            </div>
        </div>

        
    </div>);
}

export default MessageDisplay;