import { useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import axios from 'axios';


import Header from 'components/header/header';
import testJSON from './models/testModel.json';
import 'bootstrap/dist/css/bootstrap.min.css';


function DynamicForm() {
    const { register, handleSubmit } = useForm({});
    const [formModel, setformModel] = useState({});
    const [formValues, setFormValues] = useState<{ name: any; value: any; }[]>([])
    const [formValues2, setFormValues2] = useState<{ name: any; value: any; }[]>([])
    const [formValues3, setFormValues3] = useState<{ name: any; value: any; }[]>([])

    useEffect(() => {
        setformModel(testJSON[0]);
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
        let startj = 1
        for (let i = 0; i < currentClass.length; i++) {
            currentClass[i].classList.remove("active");
            if (currentClass[i].childNodes.length > 1) {
                currentClass[i].removeChild(currentClass[i].childNodes[1])
            }
            if (i === index) {
                currentClass[index].classList.add("active");
                for (let j = 0; j < sections[i].field_value; j++, startj++) {
                    document.getElementById("section" + (i + 1))!.style.display = "";
                    document.getElementById("input" + startj)!.style.display = "";
                    document.getElementById("inputs" + startj)!.style.display = "";
                    if (document.getElementById("subsection" + (startj - 1))) {
                        document.getElementById("subsection" + (startj - 1))!.style.display = "";
                    }
                }
            } else {
                for (let j = 0; j < sections[i].field_value; j++, startj++) {
                    document.getElementById("section" + (i + 1))!.style.display = "none";
                    document.getElementById("input" + startj)!.style.display = "none";
                    document.getElementById("inputs" + startj)!.style.display = "none";
                    if (document.getElementById("subsection" + (startj - 1))) {
                        document.getElementById("subsection" + (startj - 1))!.style.display = "none";
                    }
                }
            }
        }
    }

    function totalValidation(num: Number) {
        console.log(num);
        if(num===4 || num===5 || num===6) {
            var a = (document.getElementById("inputs4")?.childNodes[0] as HTMLInputElement).value;
            var b = (document.getElementById("inputs4")?.childNodes[0] as HTMLInputElement).value;
            var c = (document.getElementById("inputs4")?.childNodes[0] as HTMLInputElement).value;
            console.log(a);
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
    //sidePanelClick(0);




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
                                            </li>
                                        </>
                                    )
                                }) : null
                            }
                        </ul>
                    </div>
                    <div className="col-md-7 col-lg-8">

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="row g-2">
                                {fields ? fields.map((field: any, index: any) => {
                                    switch (field.field_type) {
                                        case 'section':
                                            sectionCount += 1;
                                            return (<h4 id={"section" + sectionCount} className="mb-3">{sectionCount}. {field.field_label}</h4>)

                                        case 'subsection':
                                            return (<h6 id={"subsection" + fieldCount} className={field.field_level === 1 ? "px-5 fw-bold" : "fw-bold"}>{field.field_label}</h6>)

                                        case 'number':
                                            fieldCount += 1;

                                            return (
                                                <>
                                                    <div id={"input" + fieldCount} className={field.field_level === 1 ? "col-sm-10 ps-5" : "col-sm-10"}>
                                                        <span className="align-middle">{fieldCount}. {field.field_label}</span>
                                                    </div>
                                                    <div id={"inputs" + fieldCount} className="col-sm-2">
                                                        <input type="number" className="form-control" id="lastName" placeholder=""
                                                            {...register(field.field_id)}
                                                            required 
                                                            onChange={() => totalValidation(index)}
                                                            />
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
                                                    <div id={"input" + fieldCount} className={field.field_level === 1 ? "ps-5" : ""}>
                                                        <span className="align-middle me-2">{fieldCount}. {field.field_label}</span>
                                                        <button type="button" className="btn btn-success btn-sm" onClick={() => addFormFields()}>Add</button>
                                                    </div>
                                                    <div id={"inputs" + fieldCount} >
                                                        {formValues.map((element, index) => (
                                                            <div className="row g-3 mb-1" key={index}>
                                                                <div id={"input" + fieldCount} className={field.field_level === 1 ? "col-sm-10 ps-5" : "col-sm-10"}>
                                                                    <div className="input-group">
                                                                        <span className="input-group-text" id="">Name and value</span>
                                                                        <input className="form-control" type="text" name="departmentName" value={element.name || ""} onChange={e => handleChange(index, e, 0)} />
                                                                        <input className="form-control" type="number" name="departmentNumber" value={element.value || ""} onChange={e => handleChange(index, e, 1)} />
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-2">
                                                                    <button type="button" className="btn btn-danger btn-sm btn-block" onClick={() => removeFormFields(index)}>Remove</button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            )

                                        default:
                                            return null;
                                    }
                                }) : null}

                                <hr className="my-4"></hr>

                                <button className="w-100 btn btn-primary btn-lg" type="submit">Submit</button>
                            </div>
                        </form>

                    </div>
                </div>
            </main>

            <footer className="my-5 pt-5 text-muted text-center text-small">
                <p className="mb-1">&copy; 2017–2021 Company Name</p>
                <ul className="list-inline">
                    <li className="list-inline-item"><a href="#">Privacy</a></li>
                    <li className="list-inline-item"><a href="#">Terms</a></li>
                    <li className="list-inline-item"><a href="#">Support</a></li>
                </ul>
            </footer>
        </div>

    )

}

export default DynamicForm;

