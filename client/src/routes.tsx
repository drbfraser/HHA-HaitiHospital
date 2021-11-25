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
import NICUForm from 'pages/form/nicu_form';
import AddMessage from 'components/message_form/message_form';
import MaternityForm from 'pages/form/maternity_form';
import { Role } from 'constants/interfaces';

const routes = [
    {
        path: '/login',
        component: Login,
        isPrivate: false,
        rolesRequired: [],
    },
    {
        path: '/admin',
        component: Admin,
        isPrivate: true,
        rolesRequired: [Role.Admin],
    },
    {
        path: '/home',
        component: Home,
        isPrivate: true,
        rolesRequired: [],
    },
    {
        path: '/Department1NICU',
        component: DepartmentOne,
        isPrivate: true,
        rolesRequired: [],
    },
    {
        path: '/NICUForm',
        component: NICUForm,
        isPrivate: true,
        rolesRequired: [],
    },
    {
        path: '/Department1NICU/detailed_report/view/:id',
        component: () => (<DepartmentReport edit={false}/>),
        isPrivate: true,
        rolesRequired: [],
    },
    {
        path: '/Department1NICU/detailed_report/view/:id',
        component: () => (<DepartmentReport edit={true}/>),
        isPrivate: true,
        rolesRequired: [],
    },
    {
        path: '/Department2Maternity',
        component: DepartmentTwo,
        isPrivate: true,
        rolesRequired: [],
    },
    {
        path: 'maternityForm',
        component: MaternityForm,
        isPrivate: true,
        rolesRequired: [],
    },
    {
        path: '/Department3Rehab',
        component: DepartmentThree,
        isPrivate: true,
        rolesRequired: [],
    },
    {
        path: '/Department4ComHealth',
        component: DepartmentFour,
        isPrivate: true,
        rolesRequired: [],
    },
    {
        path: '/departmentMain',
        component: DepartmentMain,
        isPrivate: true,
        rolesRequired: [],
    },
    {
        path: '/caseStudyMain',
        component: CaseStudyMain,
        isPrivate: true,
        rolesRequired: [],
    },
    {
        path: '/caseStudyForm',
        component: CaseStudyForm,
        isPrivate: true,
        rolesRequired: [],
    },
    {
        path: '/caseStudyView/:id',
        component: CaseStudyView,
        isPrivate: true,
        rolesRequires: [],
    },
    {
        path: '/leaderBoard',
        component: LeaderBoardMain,
        isPrivate: true,
        rolesRequired: [],
    },
    {
        path: '/messageBoard',
        component: MessageBoardMain,
        isPrivate: true,
        rolesRequired: [],
    },
    {
        path: '/addMessage',
        component: AddMessage,
        isPrivate: true,
        rolesRequired: [],
    },
    {
        path: '/',
        component: Login,
        isPrivate: false,
        rolesRequired: [],
    },
    {
        path: '/notFound',
        component: NotFound,
        isPrivate: true,
        rolesRequired: [],
    },
];

export default routes;