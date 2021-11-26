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
    <div>
    <SideBar/>
    <main className="container-fluid main-region">
        <Header/>

        <div className="mt-3">

            <section>
                <div className="row my-2 justify-items-center">
                    <div className='col-sm-6 col-md-6 col-lg-6'>
                            <button className="btn btn-dark btn-sm rounded-bill">
                                Support Form
                            </button>
                    </div>
                </div>
            </section>
        </div>
    </main>

</div>
  );
};
