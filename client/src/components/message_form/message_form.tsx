// import React from 'react';
import React from 'react';

import { ElementStyleProps } from 'constants/interfaces';
import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';

import SideBar from '../side_bar/side_bar';
import Header from 'components/header/header';

import './message_form_styles.css'
import {useTranslation} from "react-i18next";



interface Message {
  deparmentId: Number;
  departmentName: String;
  authorId: Number;
  date: Date;
  messageBody: String;
  messageHeader: String;
}


const messageFormSchema = Yup.object({
  authorId: Yup.number().min(0).required('Required'),

  messageBody: Yup.string()
    .min(5, 'Must be 5 characters at minimum')
    .max(300, 'Must be 300 characters or less')
    .required('Required'),

  messageHeader: Yup.string()
    .min(5, 'Must be 5 characters at minimum')
    .max(100, 'Must be 100 characters or less')
    .required('Required'),
});

const postMessage = (async (data) => {
  await Axios.post('/api/messageboard/', data).then(res => {
  }).catch(error => {
    console.error('Something went wrong!', error.response);
  });
})

function AddMessage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    // resolver: yupResolver(messageFormSchema)
  });

  const history = useHistory();

  const getDepartmentId = (department: any) => {
    switch (department) {
      case 'NICUPaeds':
        return 1;

      case 'CommunityHealth':
        return 2;

      case 'Rehab':
        return 3;

      case 'Maternity':
        return 4;

      default:
        return 0;
    }
  }

  const onSubmit = (data: any) => {

    if (data.departmentName === "") {
      alert("Must select a department");
      return;
    }

    if (getDepartmentId(data.departmentName) !== 0) {
      data.departmentId = getDepartmentId(data.departmentName);
    }

    data.date = Date();

    postMessage(data);
    // console.log(data);
    reset();
    history.push('/messageBoard')
  }

  const {t, i18n} = useTranslation();

  return (
    <div className="add_message">
      <SideBar/>

      <main className="main_container">
        <Header/>

        <div className="container">
          <h1 className="h1">{t("addMessageAddMessage")}</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">

              <div className="col-md-4 mb-4">
                <label htmlFor="" className="form-label">{t("addMessageUserID")}</label>
                <input className="form-control" type="number" {...register("authorId")} />
              </div>

              <div className="col-md-4 mb-4">
                <label htmlFor="" className="form-label">{t("addMessageDepartment")}</label>
                <select className="form-select" {...register("departmentName")}>
                  <option value="">{t("addMessageSelect")}</option>
                  <option value="NICUPaeds">NICU/Paeds</option>
                  <option value="Maternity">Maternity</option>
                  <option value="Rehab">Rehabilitation</option>
                  <option value="CommunityHealth">Community Health</option>
                </select>
              </div>

            </div>



            <div className="mb-3">
              <label htmlFor="" className="form-label">{t("addMessageTitle")}</label>
              <input className="form-control" type="text" {...register("messageHeader")} />
            </div>

            <div className="mb-3">
              <label htmlFor="" className="form-label">{t("addMessageBody")}</label>
              <textarea className="form-control" {...register("messageBody")} cols={30} rows={10}></textarea>
            </div>

            <button className="btn btn-primary">{t("addMessageSubmit")}</button>

          </form>

        </div>
      </main>
    </div>
  )

}

export default AddMessage;