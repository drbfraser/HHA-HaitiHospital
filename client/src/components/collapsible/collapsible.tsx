import React, {useState} from "react";

function Collapsible(props) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="collapsible">
            {isOpen && <div className="content">{props.children}</div>}
            <button className="toggle btn btn-sm btn-outline-secondary" onClick={()=> setIsOpen(!isOpen)}>
                {isOpen ? "Show Less": "Show More" }
            </button>

        </div>
    );
}

export default Collapsible;