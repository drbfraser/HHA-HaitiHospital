import { useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import axios from 'axios';


import Header from 'components/header/header';
import nicuJSON from './models/nicuModel.json';
// import './styles.css'


function DynamicForm() {
    const { register, handleSubmit } = useForm({});
    const [formModel, setformModel] = useState({});
    const [formValues, setFormValues] = useState([{ name: "", value: null }])

    useEffect(() => {
        setformModel(nicuJSON[0]);
    }, [])

    const elements = Object.values(formModel);
    const fields: any = elements[0];

    const onSubmit = (data: any) => {
        data.admissions.comeFrom.otherDepartments = formValues;
        console.log(data);
    }

    const handleChange = (i: any, e: { target: { name: any; value: any; }; }, j: number) => {
        let newFormValues = [...formValues];
        if (j === 0) {
            newFormValues[i].name = e.target.value;
        } else {
            newFormValues[i].value = e.target.value;
        }

        setFormValues(newFormValues);
    }

    const addFormFields = () => {
        setFormValues([...formValues, { name: "", value: null }])
    }

    const removeFormFields = (i: number) => {
        let newFormValues = [...formValues];
        newFormValues.splice(i, 1);
        setFormValues(newFormValues)
    }

    const sidePanelClick = (index: any) => {
        const currentClass = document.getElementsByClassName("list-group-item");
        let startj = 1;
        for (let i = 0; i < currentClass.length; i++) {
            currentClass[i].classList.remove("active");
            if(currentClass[i].childNodes.length > 1){
                currentClass[i].removeChild(currentClass[i].childNodes[1])
            }
            if(i === index){
                currentClass[index].classList.add("active");
                for(let j = startj; j < startj + sections[i].field_value; j++){
                    document.getElementById("section"+ (i+1))!.style.display = "";
                    document.getElementById("input" + j)!.style.display = "";
                    document.getElementById("inputs" + j)!.style.display = "";
                }
                startj += sections[i].field_value;
            }else{
                for(let j = startj; j < startj + sections[i].field_value; j++){
                    document.getElementById("section"+ (i+1))!.style.display = "none";
                    document.getElementById("input" + j)!.style.display = "none";
                    document.getElementById("inputs" + j)!.style.display = "none";
                }
                startj += sections[i].field_value;
            }
        }
    }

    function getSections() {
        var a = [];
        for (let i in fields) {
            if (fields[i].field_type === 'section') {
                a.push(fields[i]);
            }
        }
        return a;
    }

    let sections = getSections();
    sidePanelClick(0);

    function getInputs() {
        var a = [];
        for (let i in fields) {
            if (fields[i].field_type !== 'section' && fields[i].field_type !== 'subsection') {
                a.push(fields[i]);
            }
        }
        return a;
    }

    let inputs = getInputs();

    let fieldCount = 0;
    let sectionCount = 0;
    document.body.classList.add("bg-light");
    return (

        <div className="container">
            <main>
                <div className="py-3 text-start">
                    <h2>NICU/Paediatrics Form</h2>
                    <p className="lead">For: September 2021</p>
                </div>

                <div className="row g-3">
                    <div className="col-md-5 col-lg-4">

                        <h4 className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-primary">Steps</span>
                        </h4>

                        <ul className="list-group mb-3">
                            {
                                sections ? sections.map((section: any, index: any) => {
                                    var isActive = false;
                                    if (index === 0) {
                                        isActive = true;
                                    }
                                    return (
                                        <>
                                            <li key={index}
                                                className={isActive ? "list-group-item d-flex justify-content-between active" : "list-group-item d-flex justify-content-between"}
                                                onClick={() => sidePanelClick(index)}>
                                                <span>{index + 1}. {section.field_label}</span>
                                                {/* {isActive ?
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24 " fill="currentColor"
                                                        className="bi bi-chevron-right" viewBox="0 0 16 16">
                                                        <path fill-rule="evenodd"
                                                            d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z">
                                                        </path>
                                                    </svg> 
                                                    : null
                                                } */}

                                            </li>
                                        </>
                                    )
                                }) : null
                            }
                        </ul>
                    </div>
                    <div className="col-md-7 col-lg-8">

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="row g-3">
                                {fields ? fields.map((field: any, index: any) => {
                                    switch (field.field_type) {
                                        case 'section':
                                            sectionCount += 1;
                                            return (<h4 id={"section" + sectionCount} className="mb-3">{field.field_label}</h4>)

                                        case 'subsection':
                                            return (<label>{field.field_label}</label>)

                                        case 'number':
                                            fieldCount += 1;
                                            
                                            return (
                                                <>
                                                    <div id={"input" + fieldCount} className="col-sm-10">
                                                        <span className="align-middle"><div className={field.field_level === 1 ? "px-5": ""}>{fieldCount}. {field.field_label}</div></span>
                                                    </div>
                                                    <div id={"inputs" + fieldCount} className="col-sm-2">
                                                        <input type="number" className="form-control" id="lastName" placeholder=""
                                                            {...register(field.field_id)}
                                                            required />
                                                        <div className="invalid-feedback">
                                                            Requires a valid number
                                                        </div>
                                                    </div>
                                                </>
                                            )

                                        case 'array':
                                            fieldCount += 1;
                                            return (
                                                <>
                                                    <div>
                                                        <span>{fieldCount}. {field.field_label}</span>
                                                        <button type="button" className="btn btn-success btn-sm" onClick={() => addFormFields()}>Add</button>
                                                    </div>
                                                    {formValues.map((element, index) => (
                                                        <div className="row g-3" key={index}>
                                                            <div className="col-sm-10">
                                                                <div className="input-group">
                                                                    <div className="input-group-prepend">
                                                                        <span className="input-group-text" id="">Name and value</span>
                                                                    </div>
                                                                    <input type="text" name="departmentName" value={element.name || ""} onChange={e => handleChange(index, e, 0)} />
                                                                    <input type="number" name="departmentNumber" value={element.value || ""} onChange={e => handleChange(index, e, 1)} />
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-2">
                                                                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeFormFields(index)}>Remove</button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </>
                                            )

                                        default:
                                            return null;
                                    }
                                }) : null}
                                <input type="submit" />
                            </div>
                        </form>

                    </div>
                </div>
            </main>
        </div>

    )

}

export default DynamicForm;

