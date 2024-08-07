import AddMessage from 'pages/message_board/AddMessage';
import { AddUserForm } from 'pages/admin/AddUserForm';
import AdminList from 'pages/admin/AdminList';
import { BiomechanicalList } from 'pages/biomech/BiomechanicalList';
import { BrokenKitAdd } from 'pages/biomech/BrokenKitAdd';
import { BrokenKitEdit } from 'pages/biomech/BrokenKitEdit';
import { BrokenKitView } from 'pages/biomech/BrokenKitView';
import { CaseStudyForm } from 'pages/case_study/CaseStudyForm';
import { CaseStudyList } from 'pages/case_study/CaseStudyList';
import { CaseStudyView } from 'pages/case_study/CaseStudyView';
import { Department } from 'pages/department/Department';
import EditMessage from 'pages/message_board/EditMessage';
import { EditUserForm } from 'pages/admin/EditUserForm';
import { EmployeeOfTheMonthAddForm } from 'pages/employee_of_the_month/EmployeeOfTheMonthAddForm';
import { EmployeeOfTheMonthView } from 'pages/employee_of_the_month/EmployeeOfTheMonthView';
import { EmployeeOfTheMonthList } from 'pages/employee_of_the_month/EmployeeOfTheMonthList';
import GeneralReports from 'pages/general_reports/GeneralReports';
import Home from 'pages/home/Home';
import { LeaderBoard } from 'pages/leader_board/LeaderBoard';
import Login from 'pages/login/Login';
import { MessageBoardView } from 'pages/message_board/MessageBoardView';
import MessageComments from 'pages/message_board/MessageComments';
import NotAuthorized from 'pages/not_authorized/NotAuthorized';
import NotFound from 'pages/not_found/NotFound';
import { PathPatterns } from 'constants/paths';
import { Report } from 'pages/report/Report';
import ReportView from 'pages/report/ReportView';
import { Role } from '@hha/common';
import { UploadReport } from 'pages/report/UploadReport';
import { EmployeeOfTheMonthUpdateForm } from 'pages/employee_of_the_month/EmployeeOfTheMonthUpdateForm';
import Analytics from 'pages/analytics/Analytics';

// Remember to keep the low level urls before high level urls
// Because Switch is picking the first matching url
interface Routes {
  path: string;
  key: string;
  component: (_: any) => JSX.Element;
  loginRequired: boolean;
  rolesAllowed: Role[];
  departmentsAllowed: any[];
  isPrivate?: boolean;
}

const routes: Routes[] = [
  {
    path: '/login',
    key: 'login',
    component: Login,
    loginRequired: false,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: `${PathPatterns.ADMIN_ADD_USER}`,
    key: 'admin',
    component: AddUserForm,
    loginRequired: true,
    rolesAllowed: [Role.Admin],
    departmentsAllowed: [],
  },
  {
    path: `${PathPatterns.ADMIN_EDIT_USER}`,
    key: 'admin',
    component: EditUserForm,
    loginRequired: true,
    rolesAllowed: [Role.Admin],
    departmentsAllowed: [],
  },
  {
    path: `${PathPatterns.ADMIN_MAIN}`,
    key: 'admin',
    component: AdminList,
    loginRequired: true,
    rolesAllowed: [Role.Admin],
    departmentsAllowed: [],
  },
  {
    path: '/upload-report',
    key: 'upload_report',
    component: UploadReport,
    loginRequired: true,
    rolesAllowed: [Role.Admin],
    departmentsAllowed: [],
  },
  {
    path: '/home',
    key: 'home',
    component: Home,
    loginRequired: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: '/general-reports',
    key: 'general_reports',
    component: GeneralReports,
    loginRequired: true,
    rolesAllowed: [Role.Admin, Role.MedicalDirector, Role.HeadOfDepartment, Role.User],
    departmentsAllowed: [],
  },
  {
    path: '/report-view/:id',
    key: 'view_reports',
    component: ReportView,
    loginRequired: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  // Explicitly setting department 0 (General) to be non-accessible
  {
    path: '/department/0',
    key: 'department_0',
    component: Department,
    loginRequired: true,
    rolesAllowed: [],
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
    key: 'department',
    component: Department,
    loginRequired: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: `${PathPatterns.BIOMECH_REPORT}`,
    key: 'bio_support',
    component: BrokenKitAdd,
    loginRequired: true,
    isPrivate: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: `${PathPatterns.BIOMECH_VIEW}`,
    key: 'bio_support',
    component: BrokenKitView,
    loginRequired: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: `${PathPatterns.BIOMECH_EDIT}`,
    key: 'bio_support',
    component: BrokenKitEdit,
    loginRequired: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: `${PathPatterns.BIOMECH_MAIN}`,
    key: 'bio_support',
    component: BiomechanicalList,
    loginRequired: true,
    isPrivate: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: '/case-study/view/:id',
    key: 'case_study',
    component: CaseStudyView,
    loginRequired: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: '/case-study/form',
    key: 'case_study',
    component: CaseStudyForm,
    loginRequired: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: '/case-study',
    key: 'case_study',
    component: CaseStudyList,
    loginRequired: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: '/report',
    key: 'report',
    component: Report,
    loginRequired: true,
    rolesAllowed: [Role.Admin, Role.HeadOfDepartment, Role.MedicalDirector],
    departmentsAllowed: [],
  },
  {
    path: '/leaderboard',
    key: 'leaderboard',
    component: LeaderBoard,
    loginRequired: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: '/message-board/edit/:id',
    component: EditMessage,
    key: 'message_board',
    isPrivate: true,
    loginRequired: true,
    rolesAllowed: [Role.Admin, Role.MedicalDirector],
    departmentsAllowed: [],
  },
  {
    path: '/message-board/add-message',
    component: AddMessage,
    key: 'message_board',
    loginRequired: true,
    rolesAllowed: [Role.Admin, Role.MedicalDirector],
    departmentsAllowed: [],
  },
  {
    path: '/message-board/comments/:id',
    component: MessageComments,
    key: 'message_board',
    loginRequired: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: '/message-board',
    key: 'message_board',
    component: MessageBoardView,
    loginRequired: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: '/employee-of-the-month/archive',
    key: 'employee_of_the_month',
    component: EmployeeOfTheMonthList,
    loginRequired: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: '/employee-of-the-month/add',
    key: 'employee_of_the_month',
    component: EmployeeOfTheMonthAddForm,
    loginRequired: true,
    rolesAllowed: [Role.Admin, Role.MedicalDirector],
    departmentsAllowed: [],
  },
  {
    path: '/employee-of-the-month/update/:eotmId',
    key: 'employee_of_the_month',
    component: EmployeeOfTheMonthUpdateForm,
    loginRequired: true,
    rolesAllowed: [Role.Admin, Role.MedicalDirector],
    departmentsAllowed: [],
  },
  {
    path: '/employee-of-the-month/:year/:month',
    key: 'employee_of_the_month',
    component: EmployeeOfTheMonthView,
    loginRequired: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: '/employee-of-the-month/:eotmId',
    key: 'employee_of_the_month',
    component: EmployeeOfTheMonthView,
    loginRequired: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: '/employee-of-the-month',
    key: 'employee_of_the_month',
    component: EmployeeOfTheMonthView,
    loginRequired: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: '/notFound',
    key: 'notFound',
    component: NotFound,
    loginRequired: false,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: '/unauthorized',
    key: 'unauthorized',
    component: NotAuthorized,
    loginRequired: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },

  {
    path: '/analytics',
    key: 'analytics',
    component: Analytics,
    loginRequired: true,
    rolesAllowed: [Role.Admin, Role.MedicalDirector],
    departmentsAllowed: [],
  },
  // WARNING: If adding new routes, do not add anything below the '/' route.
  // Have new routes above otherwise routing may not work properly.
  {
    path: '/',
    key: 'login',
    component: Login,
    loginRequired: false,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
];

export default routes;
