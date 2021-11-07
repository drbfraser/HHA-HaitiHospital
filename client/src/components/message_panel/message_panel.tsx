import React, { useEffect, useState } from 'react'

import {ElementStyleProps, Json} from 'constants/interfaces'
import Axios from 'axios'
import MessageDisplay  from './message_display';

interface MessagePanelProps extends ElementStyleProps {

}

const MessagePanel = (props: MessagePanelProps) => {

    const [count, setCount] = useState<number>(5);

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
    }, [count])

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

    
    return (<>
        <div className="my-3 p-3 bg-body rounded shadow-sm">
            <h6 className="border-bottom pb-2 mb-0">Recent updates</h6>
            {msgsJson.map((msgJson, index) => 
                {
                    if (index < count)
                        return (<MessageDisplay key={index} msgJson={msgJson}/>)
                }
            )}
           
           
            {/* <small className="d-block text-end mt-3">
            <a href="#">All updates</a>
            </small> */}
            <div className='d-md-flex flex-grow-1 justify-content-end'>
                <button
                onClick= {()=>(count <= msgsJson.length)&& setCount(count + 5)}>
                    More
                </button>
                <button
                onClick = {()=> (count > 0)&& setCount(count-5)}
                >Less</button>
            </div>
        </div>
    </>);
}

export default MessagePanel;


