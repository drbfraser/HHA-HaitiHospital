import React, {useState} from "react";
import {useTranslation} from "react-i18next";

function Collapsible(props) {
    const [isOpen, setIsOpen] = useState(false);

    const {t, i18n} = useTranslation();

    return (
        <div className="collapsible">
            {isOpen && <div className="content">{props.children}</div>}
            <button className="toggle btn btn-sm btn-outline-secondary" onClick={()=> setIsOpen(!isOpen)}>
                {isOpen ? <div>{t("leaderBoardOverviewShowLess")}</div> : <div>{t("leaderBoardOverviewShowMore")}</div>}
            </button>

        </div>
    );
}

export default Collapsible;
