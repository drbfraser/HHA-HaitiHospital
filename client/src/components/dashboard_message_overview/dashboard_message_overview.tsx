import React from 'react';
import { ElementStyleProps } from 'constants/interfaces';
import { NavLink} from "react-router-dom";

import { MessageProps } from 'constants/interfaces';
import MessageOverviewRow from 'components/dashboard_message_row/dashboard_message_row';


interface DashboardMessageProps extends ElementStyleProps {
    messages :MessageProps[],
}

const DashboardMessageOverview = (props : DashboardMessageProps) => {
    return (
        <table className={'dashboard-message-overview '+ (props.classes || '')}>
            <tr>
                <th>MessageID</th>
                <th>MessageContent</th>
                <th>Creator</th>
                <th>LastUpdatedOn</th>
                <th>Priority</th>
            </tr>
            { props.messages.map(
                (message)=> (<MessageOverviewRow  messageID={message.MessageID as number}
                                                    messageContent={message.messageContent as string}
                                                    creator={message.creator as string}
                                                    lastUpdatedOn={message.lastUpdatedOn as string}
                                                    priority={message.priority as string}/>)
            )}
        </table>
    )
}


// interface DashboardMessageProps extends ElementStyleProps {}
//
// const DashboardMessageOverview = (props : DashboardMessageProps) => {
//     return (
//         <div className={'dashboard-message-overview '+ (props.classes||'')}>
//             <div className="my-3 p-3 bg-body rounded shadow-sm">
//                 <h5 className="pb-2 mb-3">Message Board</h5>
//
//                 <div className="d-flex justify-content-between border-bottom pb-2 mb-0 row">
//                     <h6 className="text-secondary col">Message</h6>
//                     <h6 className="text-secondary col-md-3">Creator</h6>
//                     <h6 className="text-secondary col-md-2">Date</h6>
//                     <h6 className="text-secondary col-md-2">Priority</h6>
//                 </div>
//
//                 <div className="d-flex text-muted pt-3">
//                     <div className="pb-3 mb-0 small lh-sm border-bottom w-100">
//                         <div className="d-flex row">
//                             <span className="text-black col">Need a Cup of Coffee and Some Bread to Wake Up.</span>
//                             <span className="text-black col-md-3">Creator's full name</span>
//                             <span className="text-black col-md-2">May 26, 2021</span>
//                             <span className="text-black col-md-2">HIGH</span>
//                         </div>
//                         <div className="d-flex justify-content-between row">
//                             <span className="text-black-50 col">Updated 1 day ago</span>
//                             <span className="text-black-50 col-md-3">on 24-05-2021</span>
//                             <span className="text-black-50 col-md-2">8:00 AM</span>
//                             <span className="text-black-50 col-md-2"/>
//                         </div>
//                     </div>
//                 </div>
//
//                 <div className="d-flex text-muted pt-3">
//                     <div className="pb-3 mb-0 small lh-sm border-bottom w-100">
//                         <div className="d-flex row">
//                             <span className="text-black col">Increasing cloudiness.</span>
//                             <span className="text-black col-md-3">Creator's full name</span>
//                             <span className="text-black col-md-2">May 26, 2021</span>
//                             <span className="text-black col-md-2">LOW</span>
//                         </div>
//                         <div className="d-flex justify-content-between row">
//                             <span className="text-black-50 col">Updated 1 day ago</span>
//                             <span className="text-black-50 col-md-3">on 24-05-2021</span>
//                             <span className="text-black-50 col-md-2">8:00 AM</span>
//                             <span className="text-black-50 col-md-2"/>
//                         </div>
//                     </div>
//                 </div>
//
//                 <div className="d-flex text-muted pt-3">
//                     <div className="pb-3 mb-0 small lh-sm border-bottom w-100">
//                         <div className="d-flex row">
//                             <span className="text-black col">Rain beginning this afternoon.</span>
//                             <span className="text-black col-md-3">Creator's full name</span>
//                             <span className="text-black col-md-2">May 26, 2021</span>
//                             <span className="text-black col-md-2">LOW</span>
//                         </div>
//                         <div className="d-flex justify-content-between row">
//                             <span className="text-black-50 col">Updated 1 day ago</span>
//                             <span className="text-black-50 col-md-3">on 24-05-2021</span>
//                             <span className="text-black-50 col-md-2">8:00 AM</span>
//                             <span className="text-black-50 col-md-2"/>
//                         </div>
//                     </div>
//                 </div>
//
//                 <small className="d-block text-end mt-3">
//                     <NavLink to="/messageBoard">See More</NavLink>
//                 </small>
//             </div>
//
//         </div>
//     )
// }

export default DashboardMessageOverview;