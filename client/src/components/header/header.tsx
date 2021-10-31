import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ElementStyleProps } from 'constants/interfaces';
// import * as Routing from 'constants/routing';


interface HeaderProps extends ElementStyleProps{
}

function HeaderView() {
    const location = useLocation();
    // console.log(location.pathname);
    // return <span>{location.pathname}</span>
    return <h4 className="text-secondary">{location.pathname.slice(1)}</h4>
}

// function HeaderUserName() {
//     const { user } = useAuth0();
//     console.log("user id:", user.sub);
// }


// import {Component} from "react";
//
// class WelcomePage extends Component {
//     render() {
//
//         const { auth } = UserStore.username
//
//         var pageTitle = `Welcome, { auth.firstname }`
//
//         return (
//             <h1>{ pageTitle }</h1>
//         )
//     }
// }
// export default WelcomePage


// {window.["user_image"] ? (
//     <img src={window.["user_image"]}/>
// ):(
//     <UserAvatar/>
// )}

// import React, {FC, ReactElement, useEffect, useState} from 'react';
// import {Text, View} from 'react-native';
// import Parse from 'parse/react-native';
// import Styles from './Styles';
//
// export const HelloUser: FC<{}> = ({}): ReactElement => {
//     // State variable that will hold username value
//     const [username, setUsername] = useState('');
//
//     // useEffect is called after the component is initially rendered and
//     // after every other render
//     useEffect(() => {
//         // Since the async method Parse.User.currentAsync is needed to
//         // retrieve the current user data, you need to declare an async
//         // function here and call it afterwards
//         async function getCurrentUser() {
//             // This condition ensures that username is updated only if needed
//             if (username === '') {
//                 const currentUser = await Parse.User.currentAsync();
//                 if (currentUser !== null) {
//                     setUsername(currentUser.getUsername());
//                 }
//             }
//         }
//         getCurrentUser();
//     }, [username]);
//
//     // Note the conditional operator here, so the "Hello" text is only
//     // rendered if there is an username value
//     return (
//         <View style={Styles.login_wrapper}>
//             <View style={Styles.form}>
//                 {username !== '' && <Text>{`Hello ${username}!`}</Text>}
//             </View>
//         </View>
//     );
// };

const Header = (props: HeaderProps) => {
    return (
        <div className={'header '+ (props.classes || '')}>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom row">

                <div className="col">
                    <HeaderView/>
                </div>


                {/*<div className="btn-toolbar mb-2 mb-md-0">*/}
                <div className="col-md-auto">user name</div>

                <NavLink className="btn btn-sm btn-outline-secondary col-md-2" to="/login" exact>
                    <i className="bi bi-door-open-fill me-2"/>
                    Sign Out
                </NavLink>

                {/*<div className="col col-lg-2">*/}
                {/*    <NavLink className="btn btn-sm btn-outline-secondary" to="/login" exact>*/}
                {/*        <i className="bi bi-door-open-fill me-2"/>*/}
                {/*        Sign Out*/}
                {/*    </NavLink>*/}
                {/*</div>*/}
            </div>
        </div>
        )

  // const location = useLocation();
  //
  // if (location.pathname === Routing.HOME_ROUTE)
  //   return (
  //     <div className={'header '+ (props.classes || '')}
  //         style={props.style}>
  //       <HhaLogo
  //         classes='logo grid-item'
  //         style={
  //           {'--griditem-alignself': 'center',
  //           '--griditem-justifyself': 'center',
  //           'width' : '300px',
  //           } as CustomCssProps
  //         }
  //       />
  //       <Button classes='btn grid-item goto-admin-btn'
  //         style= {
  //           {'--griditem-alignself':'center'} as CustomCssProps
  //         }
  //         value='ADMIN PANEL'
  //       />
  //       <Button classes='btn grid-item signout-btn'
  //         style = {
  //           {'--griditem-alignself':'center'} as CustomCssProps
  //         }
  //         value='SIGN OUT'/>
  //     </div>
  //   );
  // else
  //   return (
  //     <NavBar/>
  //   )
}

export default Header;