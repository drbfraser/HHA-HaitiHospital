import { NavLink } from 'react-router-dom';
import HhaLogo from 'components/hha_logo/hha_logo';
import { ElementStyleProps } from "../../constants/interfaces";
import './side_bar.css';
import { useAuthState } from 'Context';
import { useTranslation } from 'react-i18next';
import i18n from "i18next";
import { isUserInDepartment, renderBasedOnRole } from "../../actions/roleActions";
import { Role, DepartmentName } from "../../constants/interfaces";

interface SidebarProps extends ElementStyleProps {}

export const changeLanguage = (ln) => {
    return ()=> {
        console.log(`Language changed to ${ln}`);
        i18n.changeLanguage(ln)
    }
}

const Sidebar = (props: SidebarProps) => {
    const authState = useAuthState();

    const renderDeptIfUserInDept = (departmentName: string): boolean => {
        if (authState.userDetails.role === Role.User) {
            return isUserInDepartment(authState.userDetails.department, departmentName);
        }
        return true;
    }

    function getClassName() {
        if (props.classes === undefined) 
            return "Sidebar";
        else 
            return `Sidebar ${props.classes} `
    }

    const {t, i18n} = useTranslation();

    return (
        <div className={getClassName()}>
            <div className="bg-dark">
                <div className="sidebar_logo">
                    <div className="text-center" style={{width: 190}}>
                        <HhaLogo style={{width: 150}}/>
                    </div>
                </div>

                <ul className="nav nav-pills flex-column mb-auto p-2">
                    <li>
                        <NavLink to="/home" className="nav-link link-light" exact activeClassName="active">
                            <i className="bi bi-house-door-fill me-2"/>
                            <span className="text text-light">{t("sidebarHome")}</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/messageBoard" className="nav-link link-light" exact activeClassName="active">
                            <i className="bi bi-chat-right-text-fill me-2"/>
                            <span className="text text-light">{t("sidebarMessageBoard")}</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/leaderBoard" className="nav-link link-light" exact activeClassName="active">
                            <i className="bi bi-bar-chart-fill me-2"/>
                            <span className="text text-light">{t("sidebarLeaderBoard")}</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/caseStudyMain" className="nav-link link-light" exact activeClassName="active">
                            <i className="bi bi-award-fill me-2"/>
                            <span className="text text-light">{t("sidebarCaseStudy")}</span>
                        </NavLink>
                    </li>

                    <li className="border-top my-2"/>

                    <li>
                        {
                            renderBasedOnRole(authState.userDetails.role, [Role.Admin, Role.MedicalDirector, Role.HeadOfDepartment]) ? (                 
                                <li>
                                    <NavLink to='/general_reports' className='nav-link link-light' exact activeClassName="active">
                                        <i className="bi bi-folder-fill me-2"/>
                                        <span className='text text-light'>General</span>
                                    </NavLink>
                                </li>
                                ) : (<div></div>)
                        }
                    </li>

                    <li>
                        {
                            renderDeptIfUserInDept(DepartmentName.NicuPaeds) ? (
                                <NavLink to="/Department1NICU" className="nav-link link-light" exact activeClassName="active">
                                    <i className="bi bi-brightness-high-fill me-2"/>
                                    <span className="text text-light">{DepartmentName.NicuPaeds}</span>
                                </NavLink>
                            ) : (<div></div>)
                        }
                    </li>
                    <li>
                        {
                            renderDeptIfUserInDept(DepartmentName.Maternity) ? (
                                <NavLink to="/Department2Maternity" className="nav-link link-light" exact activeClassName="active">
                                    <i className="bi bi-heart-fill me-2"/>
                                    <span className="text text-light">{DepartmentName.Maternity}</span>
                                </NavLink>
                            ) : (<div></div>)
                        }
                    </li>
                    <li>
                        {
                            renderDeptIfUserInDept(DepartmentName.Rehab) ? (
                                <NavLink to="/Department3Rehab" className="nav-link link-light" exact activeClassName="active">
                                    <i className="bi bi-bootstrap-reboot me-2"/>
                                    <span className="text text-light">{DepartmentName.Rehab}</span>
                                </NavLink>
                            ) : (<div></div>)
                        }
                    </li>
                    <li>
                        {
                            renderDeptIfUserInDept(DepartmentName.CommunityHealth) ? (
                                <NavLink to="/Department4ComHealth" className="nav-link link-light" exact activeClassName="active">
                                    <i className="bi bi-headset me-2"/>
                                    {/* TODO: Use DepartmentName.CommunityHealth enum for the text in the sidebar.
                                    Problem: Text is too long */}
                                    <span className="text text-light">Com & Health</span>
                                </NavLink>
                            ) : (<div></div>)
                        }
                    </li>

                    <li className="border-top my-2"/>
                        {
                            renderBasedOnRole(authState.userDetails.role, [Role.Admin]) ? (                 
                                    <li>
                                        <NavLink to="/admin" className="nav-link link-light" exact activeClassName="active">
                                            <i className="bi bi-person-badge-fill me-2"/>
                                            <span className="text text-light">Admin</span>
                                        </NavLink>

                                        <li className="border-top my-2"/>
                                    </li>
                                ) : (<div></div>)
                        }

                    <li className="btn-group-toggle" data-toggle="buttons">
                        <button className="nav-link link-light"
                        onClick={changeLanguage("en")}>
                            <i className="bi bi-gear-fill me-2"/>
                            <span className="text text-light">{t("sidebarEnglish")}</span>
                        </button>
                    </li>
                    
                    <li>
                        <button className="nav-link link-light" id="fc"
                                onClick={changeLanguage("fr")}>
                            <i className="bi bi-gear me-2"/>
                            <span className="text text-light">{t("sidebarFrench")}</span>
                        </button>
                    </li>

                </ul>
            </div>
        </div>

    );
}

export default Sidebar