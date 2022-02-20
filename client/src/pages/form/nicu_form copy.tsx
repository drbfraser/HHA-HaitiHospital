import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import React, { useState, useEffect, Fragment as div, Fragment } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import SideBar from '../../components/side_bar/side_bar';
import Header from 'components/header/header';
import nicuJSON from './models/nicuModel.json';
import nicuJSONFr from './models/nicuModelFr.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import { useTranslation } from 'react-i18next';
import { FieldInputProps } from 'formik';
import * as TestData from './models/TestModels';
import { toInteger } from 'lodash';
import { v4 as uuid } from 'uuid';
import { fromString } from 'uuidv4';
import { Link } from 'react-scroll';

function Report() {
  const formContext = useForm();
  const history = useHistory();
  const { t, i18n } = useTranslation();
  useEffect(() => {
    $('body').scrollspy({ target: '#navbar' });
  });

  // console.log(form.metadata.name)
  // console.log(form.items)
  // const [formState, setFormState] = useState(sections);

  return (
    <Fragment>
      <Header />
      <SideBar />
      <main className="container">

        <div className="row justify-content-center">

          <div className="col-sm-2 p-auto">
            <div className="card sticky-top" >
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">
                  Some quick example text to build on the card title and make up the bulk of the
                  card's content.
                </p>
                <a href="#" className="btn btn-primary">
                  Go somewhere
                </a>
              </div>
            </div>
          </div>

          <div className="col-sm-8">
            <nav id="navbar" className="navbar sticky-top navbar-light bg-secondary">
              <a className="navbar-brand" href="#">
                Navbar
              </a>
              <ul className="nav nav-pills">
                <li className="nav-item">
                  <a className="nav-link" href="#section1">
                    Label 1
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#section2">
                    Label 2
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#section3">
                    Label 3
                  </a>
                </li>
              </ul>
            </nav>
            
            <FormProvider {...formContext}>
              <form onSubmit={formContext.handleSubmit((data) => console.log(data))}>
                <div id="section1" className="pt-5">
                  <h1>Section 1</h1>
                  {[...Array(50).keys()].map((i) => (
                    <NumberInputField id={uuid()} />
                  ))}
                </div>

                <div id="section2" className="pt-5">
                  <h1>Section 2</h1>
                  {[...Array(50).keys()].map((i) => (
                    <NumberInputField id={uuid()} />
                  ))}
                </div>

                <div id="section3" className="pt-5">
                  <h1>Section 3</h1>
                  {[...Array(50).keys()].map((i) => (
                    <NumberInputField id={uuid()} />
                  ))}
                </div>

                <input type="submit" />
              </form>
            </FormProvider>
          </div>
        </div>
      </main>
    </Fragment>
  );
}

//   return (
//     <div>
//       <SideBar />
//       <Header />
//       <main className="container">
//         {/* Render back Button */}
//         <div className="d-flex justify-content-start">
//           <button
//             type="button"
//             className="btn btn-primary btn-sm"
//             onClick={() => {
//               history.goBack();
//             }}
//           >
//             {t('departmentAddBack')}
//           </button>
//         </div>

//         {/* TODO: Render report title */}

//         {/* Render date selection. TODO: Relaced with a calendar selection from General report*/}
//         <div className="py-3 text-start">
//           <span className="lead">{t('departmentAddDate')} </span>
//           {/* TODO: Add calendar selection here */}
//         </div>

//         {/* Render scroll buttons*/}
//         <nav id="navbar-example2" className="navbar bg-light sticky-top">
//           <a className="navbar-brand" href="#">
//             Navbar
//           </a>
//           <ul className="nav nav-pills">
//             <li className="nav-item">
//               <a className="nav-link" href="#1">
//                 111111111111111
//               </a>
//             </li>
//             <li className="nav-item">
//               <a className="nav-link" href="#2">
//                 222222222222
//               </a>
//             </li>
//             <li className="nav-item">
//               <a className="nav-link" href="#3">
//                 33333333333333
//               </a>
//             </li>
//           </ul>
//         </nav>

//         {/* Render questions and their sections */}
//         <div className="row">
//           <div className="col-8 mx-auto">
//             <div className="row g-2" >
//               <FormProvider {...formContext}>
//                 <form onSubmit={formContext.handleSubmit((data) => console.log(data))}>
//                   {[...Array(50).keys()].map((i) => (
//                     <NumberInputField id={uuid()} />
//                   ))}
//                   <Label id="1" text="1" />
//                   {[...Array(50).keys()].map((i) => (
//                     <NumberInputField id={uuid()} />
//                   ))}
//                   <Label id="2" text="2" />
//                   {[...Array(50).keys()].map((i) => (
//                     <NumberInputField id={uuid()} />
//                   ))}
//                   <Label id="3" text="3" />
//                   <input type="submit" />
//                 </form>
//               </FormProvider>
//             </div>

//             {/* Render bottom buttons */}
//             <div className="btn-group d-flex mb-2">
//               <button className="w-100 btn btn-secondary btn-sm">
//                 {t('departmentFormPrevious')}
//               </button>
//               <button className="w-100 btn btn-secondary btn-sm">{t('departmentFormNext')}</button>
//             </div>

//             <button className="w-100 btn btn-primary btn-lg" type="submit">
//               {t('departmentFormSubmit')}
//             </button>
//           </div>
//         </div>

//         <footer className="my-5 pt-5 text-muted text-center text-small"></footer>
//       </main>
//     </div>
//   );
// }

type SectionProps = {
  id: number;
  title?: string;
  items?: any[];
  formHooks?: any;
};

function Section(props: SectionProps): JSX.Element {
  const formHooks = props.formHooks;

  return (
    <Fragment>
      <h4 className="mb-3 text-primary"> {props.title} </h4>
      {props.items.map((item, index: number) => {
        switch (item.type) {
          case 'label':
          // return <Label key={index} options={(item as Label)}/>;
          default:
          // return (
          //   <InputField
          //     id={item.id}
          //     key={item.id}
          //     value={item.value}
          //     type={item.type}
          //     text={item.text}
          //     formHook={formHooks}
          //   />
          // );
        }
      })}
    </Fragment>
  );
}

enum Indent {
  None = '',
  ONE = 'ms-5',
}

enum FieldTypes {
  Text = 'text',
  Number = 'number',
}

function Label(props: { id: string; text: string; size?: number }) {
  return <h1 id={props.id ?? ''}>{props.text}</h1>;
}

type NumberInputField = {
  id: string;
  text?: string;
  value?: string;
  indent?: string;
};

function NumberInputField(props: NumberInputField): JSX.Element {
  const { register } = useFormContext();
  const [state, setState] = useState({});
  const { t, i18n } = useTranslation();
  return (
    <div className={'form-group row mb-3 ' + props.indent ?? Indent.None}>
      <label className="col-sm-10 col-form-label" htmlFor={props.id}>
        {props.text ?? 'Hello'}
      </label>
      <div className="col-sm-2">
        <input id={props.id} type={'number'} className="form-control" {...register(props.id)} />
      </div>
    </div>
  );
}

export default Report;
