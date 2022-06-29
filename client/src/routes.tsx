import Login from 'pages/login/login';
import Home from 'pages/home/home';
import NotFound from 'pages/not_found/not_found';
import Admin from 'pages/admin/admin';
import { AddUserForm } from 'pages/admin/admin-add-user';
import { EditUserForm } from 'pages/admin/admin-edit-user';
import { CaseStudyMain } from 'pages/case_study_main/case_study_main';
import { CaseStudyForm } from 'pages/case_study_forms/case_study_forms';
import { CaseStudyView } from 'pages/case_study_view/case_study_view';
import { LeaderBoardMain } from 'pages/leader_board_main/leader_board_main';
import { MessageBoardMain } from 'pages/message_board_main/message_board_main';
import AddMessage from 'pages/message_board_add/message_board_add';
import EditMessage from 'pages/message_board_edit/message_board_edit';
import MessageComments from 'pages/message_board_comments/message_board_comments';
import { BiomechanicalPage } from 'pages/biomechanical_page/biomechanical';
import { BrokenKitReport } from 'pages/broken_kit_report/broken_kit_report';
import { BrokenKitView } from 'pages/broken_kit_view/broken_kit_report_view';
import GeneralReports from 'pages/general_reports/general_reports';
import { Department } from 'pages/department/department';
import DepartmentReport from 'pages/department_report/department_report';
import { EmployeeOfTheMonthMain } from 'pages/employee_of_the_month_main/employee_of_the_month_main';
import { EmployeeOfTheMonthForm } from 'pages/employee_of_the_month_form/employee_of_the_month_form';
import { Role } from 'constants/interfaces';
import NotAuthorized from 'pages/not_authorized/not_authorized';
import Report from 'components/report/Report';
import { PathPatterns } from 'constants/paths';

// Remember to keep the low level urls before high level urls
// Because Switch is picking the first matching url

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
  // Explicitly setting department 0 (General) to be non-accessible
  {
    path: '/department/0',
    component: Department,
    loginRequired: true,
    rolesAllowed: ['None'],
    departmentsAllowed: ['None'],
  },
  {
    path: '/department/:deptId/edit/:id',
    component: () => <DepartmentReport edit={true} />,
    loginRequired: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: '/department/:deptId',
    component: Department,
    loginRequired: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: '/biomechanic/report-broken-kit',
    component: BrokenKitReport,
    isPrivate: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: '/biomechanic/view/:id',
    component: BrokenKitView,
    loginRequired: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: '/biomechanic',
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
