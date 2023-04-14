import Login from 'pages/login/login';
import Home from 'pages/home/home';
import NotFound from 'pages/not_found/not_found';
import Admin from 'pages/admin/main/main';
import { AddUserForm } from 'pages/admin/add/add';
import { EditUserForm } from 'pages/admin/edit/edit';
import { CaseStudyMain } from 'pages/case_study_main/case_study_main';
import { CaseStudyForm } from 'pages/case_study_forms/case_study_forms';
import { CaseStudyView } from 'pages/case_study_view/case_study_view';
import { LeaderBoardMain } from 'pages/leader_board_main/leader_board_main';
import { MessageBoardMain } from 'pages/message_board_main/message_board_main';
import AddMessage from 'pages/message_board_add/message_board_add';
import EditMessage from 'pages/message_board_edit/message_board_edit';
import MessageComments from 'pages/message_board_comments/message_board_comments';
import { BiomechanicalPage } from 'pages/biomech/main/main';
import { BrokenKitReport } from 'pages/biomech/report/report';
import { BrokenKitView } from 'pages/biomech/view/view';
import GeneralReports from 'pages/general_reports/general_reports';
import { Department } from 'pages/department/department';
import { EmployeeOfTheMonthMain } from 'pages/employee_of_the_month_main/employee_of_the_month_main';
import { EmployeeOfTheMonthForm } from 'pages/employee_of_the_month_form/employee_of_the_month_form';
import { Role } from 'constants/interfaces';
import NotAuthorized from 'pages/not_authorized/not_authorized';
import { Report } from 'pages/report/Report';
import { UploadReport } from 'pages/upload_template/UploadReport';
import { UpdatePermissions } from 'pages/permissions/updatePermissions';
import { PathPatterns } from 'constants/paths';
import ReportView from 'pages/report_view/ReportView';

// Remember to keep the low level urls before high level urls
// Because Switch is picking the first matching url

const permissionData = {
  permission: {
    _id: '643899a1d0a45d32207c8c94',
    modifiedUserId: '6438999fd0a45d32207c8b62',
    modifiedBy: 'user0',
    permissionObject: {
      roles: {
        Admin: {
          name: 'Admin',
          key: 'admin',
          pages: [
            {
              name: 'Dashboard',
              key: 'dashboard',
              permissions: [
                {
                  name: 'View Dashboard',
                  key: 'view_dashboard',
                  isChecked: true,
                },
                {
                  name: 'Edit Dashboard',
                  key: 'edit_dashboard',
                  isChecked: true,
                },
                {
                  name: 'Delete Dashboard',
                  key: 'delete_dashboard',
                  isChecked: true,
                },
              ],
            },
            {
              name: 'Settings',
              key: 'settings',
              permissions: [
                {
                  name: 'View Settings',
                  key: 'view_settings',
                  isChecked: true,
                },
                {
                  name: 'Edit Settings',
                  key: 'edit_settings',
                  isChecked: true,
                },
                {
                  name: 'Delete Settings',
                  key: 'delete_settings',
                  isChecked: true,
                },
              ],
            },
          ],
        },
        User: {
          name: 'User',
          key: 'user',
          pages: [
            {
              name: 'Dashboard',
              key: 'dashboard',
              permissions: [
                {
                  name: 'View Dashboard',
                  key: 'view_dashboard',
                  isChecked: true,
                },
              ],
            },
            {
              name: 'Settings',
              key: 'settings',
              permissions: [
                {
                  name: 'View Settings',
                  key: 'view_settings',
                  isChecked: true,
                },
              ],
            },
          ],
        },
        MedicalDirector: {
          name: 'MedicalDiretor',
          key: 'medicalDiretor',
          pages: [
            {
              name: 'Settings',
              key: 'settings',
              permissions: [
                {
                  name: 'View Settings',
                  key: 'view_settings',
                  isChecked: true,
                },
              ],
            },
          ],
        },
        HeadOfDepartment: {
          name: 'HeadOfDepartment',
          key: 'headOfDepartment',
          pages: [
            {
              name: 'Settings',
              key: 'settings',
              permissions: [
                {
                  name: 'View Settings',
                  key: 'view_settings',
                  isChecked: true,
                },
              ],
            },
          ],
        },
      },
    },
    lastModified: '2023-04-14T00:09:05.577Z',
    __v: 0,
  },
};

//based on pages in permission Data I have to configure roles allowed
//based on roles allowed I have to configure departments allowed


const routes = [
  {
    path: '/login',
    component: Login,
    loginRequired: false,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: `${PathPatterns.ADMIN_ADD_USER}`,
    component: AddUserForm,
    loginRequired: true,
    rolesAllowed: [Role.Admin],
    departmentsAllowed: [],
  },
  {
    path: `${PathPatterns.ADMIN_EDIT_USER}`,
    component: EditUserForm,
    loginRequired: true,
    rolesAllowed: [Role.Admin],
    departmentsAllowed: [],
  },
  {
    path: `${PathPatterns.ADMIN_MAIN}`,
    component: Admin,
    loginRequired: true,
    rolesAllowed: [Role.Admin],
    departmentsAllowed: [],
  },
  {
    path: '/upload-report',
    component: UploadReport,
    loginRequired: true,
    rolesAllowed: [Role.Admin],
    departmentsAllowed: [],
  },
  {
    path: '/update-permissions',
    component: UpdatePermissions,
    loginRequired: true,
    rolesAllowed: [Role.Admin],
    departmentsAllowed: [],
  },
  {
    path: '/home',
    component: Home,
    loginRequired: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: '/general-reports',
    component: GeneralReports,
    loginRequired: true,
    rolesAllowed: [Role.Admin, Role.MedicalDirector, Role.HeadOfDepartment],
    departmentsAllowed: [],
  },
  {
    path: '/report-view/:id',
    component: ReportView,
    loginRequired: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  // Explicitly setting department 0 (General) to be non-accessible
  {
    path: '/department/0',
    component: Department,
    loginRequired: true,
    rolesAllowed: ['None'],
    departmentsAllowed: ['None'],
  },
  /*{
    path: '/department/:deptId/edit/:id',
    component: () => <DepartmentReport edit={true} />,
    loginRequired: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },*/
  {
    path: '/department/:deptId',
    component: Department,
    loginRequired: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: `${PathPatterns.BIOMECH_REPORT}`,
    component: BrokenKitReport,
    isPrivate: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: `${PathPatterns.BIOMECH_VIEW}`,
    component: BrokenKitView,
    loginRequired: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: `${PathPatterns.BIOMECH_MAIN}`,
    component: BiomechanicalPage,
    isPrivate: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: '/case-study/view/:id',
    component: CaseStudyView,
    loginRequired: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: '/case-study/form',
    component: CaseStudyForm,
    loginRequired: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: '/case-study',
    component: CaseStudyMain,
    loginRequired: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: '/report',
    component: Report,
    loginRequired: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: '/leaderboard',
    component: LeaderBoardMain,
    loginRequired: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: '/message-board/edit/:id',
    component: EditMessage,
    isPrivate: true,
    rolesAllowed: [Role.Admin, Role.MedicalDirector],
    departmentsAllowed: [],
  },
  {
    path: '/message-board/add-message',
    component: AddMessage,
    loginRequired: true,
    rolesAllowed: [Role.Admin, Role.MedicalDirector],
    departmentsAllowed: [],
  },
  {
    path: '/message-board/comments/:id',
    component: MessageComments,
    loginRequired: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: '/message-board',
    component: MessageBoardMain,
    loginRequired: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: '/employee-of-the-month/form',
    component: EmployeeOfTheMonthForm,
    loginRequired: true,
    rolesAllowed: [Role.Admin, Role.MedicalDirector],
    departmentsAllowed: [],
  },
  {
    path: '/employee-of-the-month',
    component: EmployeeOfTheMonthMain,
    loginRequired: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: '/notFound',
    component: NotFound,
    loginRequired: false,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: '/unauthorized',
    component: NotAuthorized,
    loginRequired: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  // WARNING: If adding new routes, do not add anything below the '/' route.
  // Have new routes above otherwise routing may not work properly.
  {
    path: '/',
    component: Login,
    loginRequired: false,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
];

export default routes;
