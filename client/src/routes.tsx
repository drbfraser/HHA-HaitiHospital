import React from 'react';
import Login from 'pages/login/login';
import Home from 'pages/home/home';
import Admin from 'pages/admin/admin';
import NotFound from 'pages/not_found/not_found';
import { DepartmentOne } from "pages/department/department_1_nicu";
import { DepartmentTwo } from "pages/department/department_2_maternity";
import { DepartmentThree} from "pages/department/department_3_rehab";
import { DepartmentFour} from "pages/department/department_4_comhealth";
import { CaseStudyMain} from "pages/case_study_main/case_study_main";
import { CaseStudyForm } from 'pages/case_study_forms/case_study_forms';
import { CaseStudyView } from 'pages/case_study_view/case_study_view';
import { DepartmentMain} from "pages/department/department_main";
import { LeaderBoardMain } from "pages/leader_board_main/leader_board_main"
import { MessageBoardMain } from "pages/message_board_main/message_board_main";
import  DepartmentReport from 'pages/department_report/department_report';
import { BiomechanicalPage } from 'pages/biomechanical_page/biomechanical';
import { BrokenKitReport } from 'pages/broken_kit_report/broken_kit_report';
import { BrokenKitView } from 'pages/broken_kit_view/broken_kit_report_view';
import NICUForm from 'pages/form/nicu_form';
import AddMessage from 'pages/add_message/add_message';
import EditMessage from 'pages/edit_message/edit_message';
import MaternityForm from 'pages/form/maternity_form';
import CommunityForm from 'pages/form/community_form';
import { Role, DepartmentName } from 'constants/interfaces';
import { AddUserForm } from 'pages/admin/admin-add-user';
import { EditUserForm } from 'pages/admin/admin-edit-user';
import RehabForm from 'pages/form/rehab_form';
import GeneralReports from 'pages/general_reports/general_reports';

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
        path: '/admin',
        component: Admin,
        loginRequired: true,
        rolesAllowed: [Role.Admin],
        departmentsAllowed: [],
    },
    {
        path: '/admin-add-user',
        component: AddUserForm,
        loginRequired: true,
        rolesAllowed: [Role.Admin],
        departmentsAllowed: [],
    },
    {
        path: '/admin-edit-user/:id',
        component: EditUserForm,
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
        path: '/general_reports',
        component: GeneralReports,
        loginRequired: true,
        rolesAllowed: [Role.Admin, Role.MedicalDirector, Role.HeadOfDepartment],
        departmentsAllowed: [],
    },
    {
        path: '/Department1NICU/detailed_report/view/:id',
        component: () => <DepartmentReport edit = {false}/>,
        loginRequired: true,
        rolesAllowed: [],
        departmentsAllowed: [DepartmentName.NicuPaeds],
    },
    {
        path: '/Department1NICU/detailed_report/edit/:id',
        component: () => <DepartmentReport edit={true} />,
        loginRequired: true,
        rolesAllowed: [Role.Admin, Role.User],
        departmentsAllowed: [DepartmentName.NicuPaeds],
    },
    {
        path: '/biomechanic',
        component: BiomechanicalPage,
        isPrivate: true,
        rolesAllowed: [],
        departmentsAllowed: [],
    },
    {
        path: '/brokenkit',
        component: BrokenKitReport,
        isPrivate: true,
        rolesAllowed: [],
        departmentsAllowed: [],
    },
    {
        path: '/Department1NICU',
        component: DepartmentOne,
        loginRequired: true,
        rolesAllowed: [Role.Admin, Role.MedicalDirector, Role.HeadOfDepartment],
        departmentsAllowed: [DepartmentName.NicuPaeds],
    },
    
    {
        path: '/NICUForm',
        component: NICUForm,
        loginRequired: true,
        rolesAllowed: [],
        departmentsAllowed: [DepartmentName.NicuPaeds],
    },
    {
        path: '/Department2Maternity',
        component: DepartmentTwo,
        loginRequired: true,
        rolesAllowed: [Role.Admin, Role.MedicalDirector, Role.HeadOfDepartment],
        departmentsAllowed: [DepartmentName.Maternity],
    },
    {
        path: '/maternityForm',
        component: MaternityForm,
        loginRequired: true,
        rolesAllowed: [],
        departmentsAllowed: [DepartmentName.Maternity],
    },
    {
        path: '/Department3Rehab',
        component: DepartmentThree,
        loginRequired: true,
        rolesAllowed: [Role.Admin, Role.MedicalDirector, Role.HeadOfDepartment],
        departmentsAllowed: [DepartmentName.Rehab],
    },
    {
        path: '/rehabForm',
        component: RehabForm,
        loginRequired: true,
        rolesAllowed: [],
        departmentsAllowed: [DepartmentName.Rehab]
    },
    {
        path: '/Department4ComHealth',
        component: DepartmentFour,
        loginRequired: true,
        rolesAllowed: [Role.Admin, Role.MedicalDirector, Role.HeadOfDepartment],
        departmentsAllowed: [DepartmentName.CommunityHealth],
    },
    {
        path: '/communityForm',
        component: CommunityForm,
        loginRequired: true,
        rolesAllowed: [],
        departmentsAllowed: [DepartmentName.CommunityHealth]
    },
     // TODO: DepartmentMain can be deleted?
    {
        path: '/departmentMain',
        component: DepartmentMain,
        loginRequired: true,
        rolesAllowed: [],
        departmentsAllowed: [],
    },
    {
        path: '/caseStudyMain',
        component: CaseStudyMain,
        loginRequired: true,
        rolesAllowed: [],
        departmentsAllowed: [],
    },
    {
        path: '/caseStudyForm',
        component: CaseStudyForm,
        loginRequired: true,
        rolesAllowed: [],
        departmentsAllowed: [],
    },
    {
        path: '/caseStudyView/:id',
        component: CaseStudyView,
        loginRequired: true,
        rolesAllowed: [],
        departmentsAllowed: [],
    },
    {
        path: '/bioMechView/:id',
        component: BrokenKitView,
        loginRequired: true,
        rolesAllowed: [],
        departmentsAllowed: [],
    },
    {
        path: '/leaderBoard',
        component: LeaderBoardMain,
        loginRequired: true,
        rolesAllowed: [],
        departmentsAllowed: [],
    },
    {
        path: '/messageBoard/edit/:id',
        component: EditMessage,
        isPrivate: true,
        rolesRequired: [],
    },
    {
        path: '/messageBoard',
        component: MessageBoardMain,
        loginRequired: true,
        rolesAllowed: [],
        departmentsAllowed: [],
    },
    {
        path: '/addMessage',
        component: AddMessage,
        loginRequired: true,
        rolesAllowed: [Role.Admin, Role.MedicalDirector],
        departmentsAllowed: [],
    },
    {
        path: '/notFound',
        component: NotFound,
        loginRequired: false,
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
    }
];

export default routes;