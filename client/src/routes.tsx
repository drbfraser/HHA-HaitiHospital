import React from 'react';
import Login from 'pages/login/login';
import Home from 'pages/home/home';
import NotFound from 'pages/not_found/not_found';

import Admin from 'pages/admin/admin';
import { AddUserForm } from 'pages/admin/admin-add-user';
import { EditUserForm } from 'pages/admin/admin-edit-user';

import { CaseStudyMain} from "pages/case_study_main/case_study_main";
import { CaseStudyForm } from 'pages/case_study_forms/case_study_forms';
import { CaseStudyView } from 'pages/case_study_view/case_study_view';

import { LeaderBoardMain } from "pages/leader_board_main/leader_board_main";

import { MessageBoardMain } from "pages/message_board_main/message_board_main";
import AddMessage from 'pages/add_message/add_message';
import EditMessage from 'pages/edit_message/edit_message';

import { BiomechanicalPage } from 'pages/biomechanical_page/biomechanical';
import { BrokenKitReport } from 'pages/broken_kit_report/broken_kit_report';
import GeneralReports from 'pages/general_reports/general_reports';
import { Department } from 'pages/department/department';
import AddReport from 'pages/add_report/add_report';
import  DepartmentReport from 'pages/department_report/department_report';

import { Role, DepartmentName } from 'constants/interfaces';
import NotAuthorized from 'pages/not_authorized/not_authorized';



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
        path: '/department/:deptId/add',
        component: AddReport,
        loginRequired: true,
        rolesAllowed: [Role.Admin, Role.HeadOfDepartment, Role.MedicalDirector],
        departmentAllowed: [],
    },
    {
        path: '/department/:deptId/view/:id',
        component: () => <DepartmentReport edit={false}/>,
        loginRequired: true,
        rolesAllowed: [Role.Admin, Role.User],
        departmentAllowed: [],
    },
    {
        path: '/department/:deptId/edit/:id',
        component: () => <DepartmentReport edit={true}/>,
        loginRequired: true,
        rolesAllowed: [Role.Admin, Role.User],
        departmentAllowed: []
    },
    {
        path: '/department/:deptId',
        component: Department,
        loginRequired: true,
        rolesAllowed: [Role.Admin, Role.MedicalDirector, Role.HeadOfDepartment],
        departmentAllowed: [],
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
    }
];

export default routes;