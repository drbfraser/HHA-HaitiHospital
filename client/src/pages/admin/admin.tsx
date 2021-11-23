import React, { useEffect, useState } from 'react';
import { ElementStyleProps } from 'constants/interfaces';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './admin.css'

interface AdminProps extends ElementStyleProps {
};

const Admin = (props : AdminProps) => {
  const [users, setUsers] = useState([]);

  const usersUrl = '/api/users';
  const getUsers = async () => {
    const res = await axios.get(usersUrl);
    setUsers(res.data);
  }

  useEffect(() => {
    getUsers();
  }, [users.length])

  return(
    <div className={'admin '+ (props.classes||'')}>
      <SideBar/>
      <main className='container-fluid main-region'>
          <Header/>
          <div className="d-flex justify-content-start">
            <Link to="/admin-add-user"><button type="button" className="btn btn-outline-dark">Add Case Study</button></Link>
          </div>
          
          <div className="table-responsive">
            <table className="table table-hover mt-3">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Username</th>
                  <th scope="col">Name</th>
                  <th scope="col">Role</th>
                  <th scope="col">Department</th>
                  <th scope="col">Created</th>
                </tr>
              </thead>
              <tbody>
                {
                  users.map((item, index) => (
                    <tr key={item._id}>
                      <th scope="row">{index}</th>
                      <td>{item.username}</td>
                      <td>{item.name}</td>
                      <td>{item.role}</td>
                      <td>{item.department}</td>
                      <td>{(new Date(item.createdAt)).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
      </main>
    </div>
  );
}

export default Admin;