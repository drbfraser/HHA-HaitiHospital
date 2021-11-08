// import React from 'react';

// import { ElementStyleProps } from 'constants/interfaces';

// import './message_form_styles.css';

// interface MessageFormProps extends ElementStyleProps {

// };

// const MessageForm = (props: MessageFormProps) => {
//   return(
//     <div className={'message-form '+ (props.classes ||'')}></div>
//   );
// }

// export default MessageForm;

// Comment out during JS to TS for future reference
// import React from 'react';
// import { connect } from 'react-redux';
// import { useFormik } from 'formik';

// import { addMessage } from '../../store/actions/messageActions';
// import { messageFormSchema } from './validation';

// import './home_styles.css';

// const MessageForm = ({ addMessage, message: { messages } }) => {
//   const formik = useFormik({
//     initialValues: {
//       text: '',
//     },
//     validationSchema: messageFormSchema,
//     onSubmit: (values, { resetForm }) => {
//       addMessage({ text: values.text });
//       resetForm();
//     },
//   });

//   const isSubmiting = messages.some((m) => m.id === 0);

//   return (
//     <div className="message-form">
//       <h2>Write a message</h2>
//       <form onSubmit={formik.handleSubmit}>
//         <textarea
//           name="text"
//           cols="30"
//           rows="5"
//           placeholder="Write a message"
//           onChange={formik.handleChange}
//           onBlur={formik.handleBlur}
//           value={formik.values.text}
//           disabled={isSubmiting}
//         />
//         {formik.touched.text && formik.errors.text ? (
//           <p className="error">{formik.errors.text}</p>
//         ) : null}
//         <input type="submit" className="btn" value="Add Message" disabled={isSubmiting} />
//       </form>
//     </div>
//   );
// };

// const mapStateToProps = (state) => ({
//   message: state.message,
// });

// export default connect(mapStateToProps, { addMessage })(MessageForm);

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
    console.log(res.data);
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

  return (
    <div className="add_message">
      <SideBar/>

      <main className="main_container">
        <Header/>

        <div className="container">
          <h1 className="h1">Add Message</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">

              <div className="col-md-2 mb-3">
                <label htmlFor="" className="form-label">User ID</label>
                <input className="form-control" type="number" {...register("authorId")} />
              </div>

              <div className="col-md-3 mb-3">
                <label htmlFor="" className="form-label">Department</label>
                <select className="form-select" {...register("departmentName")}>
                  <option value=""> Select </option>
                  <option value="NICUPaeds">NICU/Paeds</option>
                  <option value="Maternity">Maternity</option>
                  <option value="Rehab">Rehabilitation</option>
                  <option value="CommunityHealth">Community Health</option>
                </select>
              </div>

            </div>



            <div className="mb-3">
              <label htmlFor="" className="form-label">Title</label>
              <input className="form-control" type="text" {...register("messageHeader")} />
            </div>

            <div className="mb-3">
              <label htmlFor="" className="form-label">Body</label>
              <textarea className="form-control" {...register("messageBody")} cols={30} rows={10}></textarea>
            </div>

            <button className="btn btn-primary">Submit</button>

          </form>

        </div>
      </main>
    </div>
  )

}

export default AddMessage;