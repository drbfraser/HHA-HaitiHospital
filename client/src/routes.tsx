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
import { DepartmentMain} from "pages/department/department_main";
import { LeaderBoardMain } from "pages/leader_board_main/leader_board_main"
import { MessageBoardMain } from "pages/message_board_main/message_board_main";
import  DepartmentReport from 'pages/department_report/department_report';
import NICUForm from 'pages/form/nicu_form';
import AddMessage from 'components/message_form/message_form';

const routes = [
    {
        path: '/login',
        component: Login,
        isPrivate: false,
    },
    {
        path: '/admin',
        component: Admin,
        isPrivate: true,
    },
    {
        path: '/home',
        component: Home,
        isPrivate: true,
    },
    {
        path: '/Department1NICU',
        component: DepartmentOne,
        isPrivate: true,
    },
    {
        path: '/Department1NICU/detailed_report/view/:id',
        component: () => (<DepartmentReport edit={false}/>),
        isPrivate: true,
    },
    {
        path: '/Department1NICU/detailed_report/view/:id',
        component: () => (<DepartmentReport edit={true}/>),
        isPrivate: true,
    },
    {
        path: '/Department2Maternity',
        component: DepartmentTwo,
        isPrivate: true,
    },
    {
        path: '/Department3Rehab',
        component: DepartmentThree,
        isPrivate: true,
    },
    {
        path: '/Department4ComHealth',
        component: DepartmentFour,
        isPrivate: true,
    },
    {
        path: '/departmentMain',
        component: DepartmentMain,
        isPrivate: true,
    },
    {
        path: '/caseStudyMain',
        component: CaseStudyMain,
        isPrivate: true,
    },
    {
        path: '/caseStudyForm',
        component: CaseStudyForm,
        isPrivate: true,
    },
    {
        path: '/leaderBoard',
        component: LeaderBoardMain,
        isPrivate: true,
    },
    {
        path: '/messageBoard',
        component: MessageBoardMain,
        isPrivate: true,
    },
    {
        path: '/addMessage',
        component: AddMessage,
        isPrivate: true,
    },
    {
        path: '/NICUForm',
        component: NICUForm,
        isPrivate: true,
    },
    {
        path: '/*',
        component: NotFound,
        isPrivate: false,
    },
    {
        path: '/',
        component: Login,
        isPrivate: false,
    },
];

export default routes;