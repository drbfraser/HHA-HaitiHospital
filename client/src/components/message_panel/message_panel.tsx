import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'

import {ElementStyleProps, Json} from 'constants/interfaces'
import Axios from 'axios'
import MessageDisplay  from './message_display';

interface MessagePanelProps extends ElementStyleProps {

}

const MessagePanel = (props: MessagePanelProps) => {

    const [count, setCount] = useState<number>(5);
    const [rerender, setRerender] = useState<boolean> (false);

    const [msgsJson, setMsgJson] = useState<Json[]>([]);
    const dbApiForMessageBoard = '/api/messageBoard/'

    const apiSource = Axios.CancelToken.source();
    useEffect(() => {
        let isMounted = true;
        const getMsgs = async() => {
            const msgsFromServer = await fetchMsgs();
            if (isMounted === true)
              setMsgJson(msgsFromServer);
        }

        getMsgs();

        return function leaveSite() {
            apiSource.cancel();
            isMounted = false;
        }
    }, [count, rerender])

    const fetchMsgs = async() => {
        try {
            const res = await Axios.get(dbApiForMessageBoard, {cancelToken: apiSource.token});
            return res.data;
        } catch(err) {
            if (Axios.isCancel(err)) {
                console.log(`Info: Request to ${dbApiForMessageBoard} is canceled`, err)
            }
            else 
                console.log(err);
            return [];
        }
    }

    const toggleRerender = async() => {
        setRerender(!rerender);
        console.log("Rerendering....");
    }

    
    return (<>
        <div className="my-3 p-3 bg-body rounded shadow-sm">

            {/* Add message */}
            <div className="d-sm-flex align-items-center">
                <h6 className="border-bottom pb-2 mb-0">Recent updates</h6>
                <div className='ml-auto'>
                    <Link to='/addMessage'>
                        <button
                            className='btn btn-md btn-outline-secondary'
                        >
                            Add Message
                        </button>
                    </Link>
                </div>
            </div>

            {/* Messsage row */}
            {msgsJson.map((msgJson, index) => 
                {
                    if (index < count)
                        return (<MessageDisplay 
                            key={index} 
                            msgJson={msgJson}
                            notifyChange={toggleRerender}/>)
                }
            )}

            {/* Expand/shrink buttons */}
            <div className='d-sm-flex jutify-content-end'>
                <div className='ml-auto d-sm-flex'>
                    <button
                    className='btn btn-md btn-outline-secondary'
                    onClick= {()=>(count <= msgsJson.length)&& setCount(count + 5)}>
                        More
                    </button>

                    <button
                    className='btn btn-md btn-outline-secondary'
                    onClick = {()=> (count > 0)&& setCount(count-5)}
                    >
                        Less
                    </button>
                </div>
                
            </div>
        </div>

    </>);
}

export default MessagePanel;


