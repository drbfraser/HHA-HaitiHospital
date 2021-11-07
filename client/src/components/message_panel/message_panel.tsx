import React, { useEffect, useState } from 'react'

import {ElementStyleProps, Json} from 'constants/interfaces'
import Axios from 'axios'

interface MessagePanelProps extends ElementStyleProps {

}

const MessagePanel = (props: MessagePanelProps) => {

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
    })

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
        {/* <div className="my-3 p-3 bg-body rounded shadow-sm">
            <h6 className="border-bottom pb-2 mb-0">Recent updates</h6>
            <div className="d-flex text-muted pt-3">
            <svg className="bd-placeholder-img flex-shrink-0 me-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 32x32" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#007bff"></rect><text x="50%" y="50%" fill="#007bff" dy=".3em">32x32</text></svg>

            <p className="pb-3 mb-0 small lh-sm border-bottom">
                <strong className="d-block text-gray-dark">@username</strong>
                Some representative placeholder content, with some information about this user. Imagine this being some sort of status update, perhaps?
            </p>
            </div>
            <div className="d-flex text-muted pt-3">
            <svg className="bd-placeholder-img flex-shrink-0 me-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 32x32" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#e83e8c"></rect><text x="50%" y="50%" fill="#e83e8c" dy=".3em">32x32</text></svg>

            <p className="pb-3 mb-0 small lh-sm border-bottom">
                <strong className="d-block text-gray-dark">@username</strong>
                Some more representative placeholder content, related to this other user. Another status update, perhaps.
            </p>
            </div>
            <div className="d-flex text-muted pt-3">
            <svg className="bd-placeholder-img flex-shrink-0 me-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 32x32" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#6f42c1"></rect><text x="50%" y="50%" fill="#6f42c1" dy=".3em">32x32</text></svg>

            <p className="pb-3 mb-0 small lh-sm border-bottom">
                <strong className="d-block text-gray-dark">@username</strong>
                This user also gets some representative placeholder content. Maybe they did something interesting, and you really want to highlight this in the recent updates.
            </p>
            </div>
            <small className="d-block text-end mt-3">
            <a href="#">All updates</a>
            </small>
        </div> */}
    </>);
}

export default MessagePanel
