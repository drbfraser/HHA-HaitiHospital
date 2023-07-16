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
import { EmployeeOfTheMonthRecord } from 'pages/employee_of_the_month_record/employee_of_the_month_record';
import { Role } from 'constants/interfaces';
import NotAuthorized from 'pages/not_authorized/not_authorized';
import { Report } from 'pages/report/Report';
import { UploadReport } from 'pages/upload_template/UploadReport';
import { UpdatePermissions } from 'pages/permissions/updatePermissions';
import { PathPatterns } from 'constants/paths';
import ReportView from 'pages/report_view/ReportView';

// Remember to keep the low level urls before high level urls
// Because Switch is picking the first matching url

const routes = [
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
    component: Admin,
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
    path: '/update-permissions',
    key: 'update_permissions',
    component: UpdatePermissions,
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
    rolesAllowed: [Role.Admin, Role.MedicalDirector, Role.HeadOfDepartment],
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
    key: 'department',
    component: Department,
    loginRequired: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: `${PathPatterns.BIOMECH_REPORT}`,
    key: 'bio_support',
    component: BrokenKitReport,
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
    path: `${PathPatterns.BIOMECH_MAIN}`,
    key: 'bio_support',
    component: BiomechanicalPage,
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
    component: CaseStudyMain,
    loginRequired: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: '/report',
    key: 'report',
    component: Report,
    loginRequired: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: '/leaderboard',
    key: 'leaderboard',
    component: LeaderBoardMain,
    loginRequired: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: '/message-board/edit/:id',
    component: EditMessage,
    key: 'message_board',
    isPrivate: true,
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
    component: MessageBoardMain,
    loginRequired: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: '/employee-of-the-month/record',
    key: 'employee_of_the_month',
    component: EmployeeOfTheMonthRecord,
    loginRequired: true,
    rolesAllowed: [],
    departmentsAllowed: [],
  },
  {
    path: '/employee-of-the-month/form',
    key: 'employee_of_the_month',
    component: EmployeeOfTheMonthForm,
    loginRequired: true,
    rolesAllowed: [Role.Admin, Role.MedicalDirector],
    departmentsAllowed: [],
  },
  {
    path: '/employee-of-the-month',
    key: 'employee_of_the_month',
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
