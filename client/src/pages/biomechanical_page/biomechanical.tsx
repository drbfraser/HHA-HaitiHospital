import { useEffect, useState } from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import { ElementStyleProps } from "constants/interfaces";
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header'
import axios from 'axios';

import "./biomechanical.css";
import {useTranslation} from "react-i18next";

interface BiomechanicalPageProps extends ElementStyleProps {
}

interface BiomechanicalPageProps extends RouteComponentProps {}

export const BiomechanicalPage = (props: BiomechanicalPageProps) => {

  return (
      
<div className = 'biomechanical_page'>
<SideBar/>
<main className="container-fluid main-region">
            <Header/>

            <div className="mt-3">

                <section>
                    <div className="row my-2 justify-items-center">

                        <div className='col-sm-6 col-md-6 col-lg-6'>
                            <Link to={"/brokenkit"}>
                                <button className=" btn btn-dark btn-sm rounded-bill">
                                    <div className="lead">Report Broken Kit</div>
                                </button>
                            </Link>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover mt-3">
                                <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Author</th>
                                    <th scope="col">Created</th>
                                    <th scope="col">Options</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    // caseStudies.map((item, index) => (
                                    // <tr key={item._id}>
                                    //     <th scope="row">{index + 1}</th>
                                    //     {/* <td>{item.caseStudyType}</td> */}
                                    //     <td>{item.user ? item.user.name : "[deleted]"}</td>
                                    //     <td>{(new Date(item.createdAt)).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}</td>
                                    //     <td>
                                    //     <Link to={'/bioMechView/' + item._id} className="link-primary text-decoration-none">View </Link>
                                    //     </td>
                                    // </tr>
                                    // ))
                                }
                                </tbody>
                            </table>
        </div>
                    </div>
                </section>

            </div>
        </main>
</div>
  );
};
