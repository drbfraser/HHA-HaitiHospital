import { useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import axios from 'axios';


import Header from 'components/header/header';
import testJSON from './models/testModel.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import './nicu_form.css';


function DynamicForm() {
    const { register, handleSubmit } = useForm({});
    const [formModel, setformModel] = useState({});
    const [formValuesComeFrom, setFormValuesComeFrom] = useState<{ name: any; value: any; }[]>([])
    const [formValuesAdCondition, setFormValuesAdCondition] = useState<{ name: any; value: any; }[]>([])
    const [formValuesOutCondition, setFormValuesOutCondition] = useState<{ name: any; value: any; }[]>([])
    const [sectionState, setSectionState] = useState(0);

    useEffect(() => {
        setformModel(testJSON[0]);
        setSectionState(0);
    }, [])

    useEffect(() => {
        sidePanelClick(sectionState);
    })

    const elements = Object.values(formModel);
    const fields: any = elements[0];

    const onSubmit = (data: any) => {
        data.admissions.comeFrom.otherDepartments = formValuesComeFrom;
        data.admissions.mainCondition.otherMedical = formValuesAdCondition;
        data.numberOfOutPatients.mainCondition.otherMedical = formValuesOutCondition;
        console.log(data);
    }

    const clickPrevious = () => {
        sidePanelClick(sectionState - 1);
    }

    const clickNext = () => {
        sidePanelClick(sectionState + 1);
    }

    const handleChange = (ID: any, i: any, e: { target: { name: any; value: any; }; }, j: number) => {
        switch (ID) {
            case 'admissions.comeFrom.otherDepartments':
                let newFormValuesComeFrom = [...formValuesComeFrom];
                if (j === 0) {
                    newFormValuesComeFrom[i].name = e.target.value;
                } else {
                    newFormValuesComeFrom[i].value = e.target.value;
                }

                setFormValuesComeFrom(newFormValuesComeFrom);
                break;
            case 'admissions.mainCondition.otherMedical':
                let newFormValuesAdCond = [...formValuesAdCondition];
                if (j === 0) {
                    newFormValuesAdCond[i].name = e.target.value;
                } else {
                    newFormValuesAdCond[i].value = e.target.value;
                }

                setFormValuesAdCondition(newFormValuesAdCond);
                break;
            case 'numberOfOutPatients.mainCondition.otherMedical':
                let newFormValuesOutCond = [...formValuesOutCondition];
                if (j === 0) {
                    newFormValuesOutCond[i].name = e.target.value;
                } else {
                    newFormValuesOutCond[i].value = e.target.value;
                }

                setFormValuesOutCondition(newFormValuesOutCond);
                break;

            default:

        }

    }

    const addFormFields = (ID: any) => {
        switch (ID) {
            case 'admissions.comeFrom.otherDepartments':
                setFormValuesComeFrom([...formValuesComeFrom, { name: "", value: null }])
                break;
            case 'admissions.mainCondition.otherMedical':
                setFormValuesAdCondition([...formValuesAdCondition, { name: "", value: null }])
                break;
            case 'numberOfOutPatients.mainCondition.otherMedical':
                setFormValuesOutCondition([...formValuesOutCondition, { name: "", value: null }])
                break;
            default:

        }
    }

    const removeFormFields = (ID: any, i: number) => {
        switch (ID) {
            case 'admissions.comeFrom.otherDepartments':
                let newFormValuesComeFrom = [...formValuesComeFrom];
                newFormValuesComeFrom.splice(i, 1);
                setFormValuesComeFrom(newFormValuesComeFrom)
                break;
            case 'admissions.mainCondition.otherMedical':
                let newFormValuesAdCond = [...formValuesAdCondition];
                newFormValuesAdCond.splice(i, 1);
                setFormValuesAdCondition(newFormValuesAdCond)
                break;
            case 'numberOfOutPatients.mainCondition.otherMedical':
                let newFormValuesOutCond = [...formValuesOutCondition];
                newFormValuesOutCond.splice(i, 1);
                setFormValuesOutCondition(newFormValuesOutCond)
                break;
            default:

        }
    }

    const sidePanelClick = (index: any) => {
        const currentClass = document.getElementsByClassName("list-group-item");
        let startj = 0
        for (let i = 0; i < currentClass.length; i++) {
            currentClass[i].classList.remove("active");
            if (currentClass[i].childNodes.length > 1) {
                currentClass[i].removeChild(currentClass[i].childNodes[1])
            }

            var show = "none"
            if (i === index) {
                setSectionState(index);
                currentClass[index].classList.add("active");
                show = "";
            }

            for (let j = 0; j < sections[i].field_value; j++, startj++) {
                document.getElementById("section" + (i + 1))!.style.display = show;
                if (document.getElementById("input" + startj)) document.getElementById("input" + startj)!.style.display = show;
                if (document.getElementById("inputs" + startj)) document.getElementById("inputs" + startj)!.style.display = show;
                if (document.getElementById("subsection" + (startj))) document.getElementById("subsection" + (startj))!.style.display = show;
            }
        }
    }

    function arrayInputValidation(id: string) {
        var inputGroup = (document.getElementById(id) as HTMLElement);
        var text = (inputGroup.childNodes[1] as HTMLInputElement).value;
        if (text == "") {
            (inputGroup.childNodes[1] as HTMLInputElement).classList.add("is-invalid");
            (inputGroup.childNodes[3] as HTMLElement).innerHTML = "Must enter a value for this field";
            return;
        }

        (inputGroup.childNodes[1] as HTMLInputElement).classList.remove("is-invalid");
        (inputGroup.childNodes[1] as HTMLInputElement).classList.add("is-valid");

        var numberAsText = (inputGroup.childNodes[2] as HTMLInputElement).value;
        if (numberAsText == "") {
            (inputGroup.childNodes[2] as HTMLInputElement).classList.add("is-invalid");
            (inputGroup.childNodes[3] as HTMLElement).innerHTML = "Must enter a value for this field";
            return;
        }

        var number = Number((inputGroup.childNodes[2] as HTMLInputElement).value);
        if (number < 0) {
            (inputGroup.childNodes[2] as HTMLInputElement).classList.add("is-invalid");
            (inputGroup.childNodes[3] as HTMLElement).innerHTML = "Positive numbers only for this field";
            return;
        }

        if (number % 1 != 0) {
            (inputGroup.childNodes[2] as HTMLInputElement).classList.add("is-invalid");
            (inputGroup.childNodes[3] as HTMLElement).innerHTML = "Integers only for this field";
            return;
        }

        (inputGroup.childNodes[2] as HTMLInputElement).classList.remove("is-invalid");
        (inputGroup.childNodes[2] as HTMLInputElement).classList.add("is-valid");
    }

    function totalValidation(start: number, end: number) {
        var total = Number((document.getElementById("inputs"+start)?.childNodes[0] as HTMLInputElement).value);
        var total2 = 0;
        for (var i=start+1; i<=end; i++) {
            total2 += Number((document.getElementById("inputs"+i)?.childNodes[0] as HTMLInputElement).value)
        }
        if (total !== total2) {
            for (var i=start; i<=end; i++) {
                (document.getElementById("inputs"+i)?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                var errorMsg = i==start ? "Does not add up to total" : "";
                (document.getElementById("inputs"+i)?.childNodes[1] as HTMLElement).innerHTML = errorMsg;
            }
        } else {
            for (var i=start; i<=end; i++) {
                (document.getElementById("inputs"+i)?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                (document.getElementById("inputs"+i)?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
            }
        }
    }

    function inputValidation(num: number) {
        console.log("input: " + num);

        var a = (document.getElementById("inputs" + num)?.childNodes[0] as HTMLInputElement).value;
        if (a == "") {
            (document.getElementById("inputs" + num)?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
            (document.getElementById("inputs" + num)?.childNodes[1] as HTMLElement).innerHTML = "Must enter a value";
            return;
        }

        var b = Number((document.getElementById("inputs" + num)?.childNodes[0] as HTMLInputElement).value);
        if (b < 0) {
            (document.getElementById("inputs" + num)?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
            (document.getElementById("inputs" + num)?.childNodes[1] as HTMLElement).innerHTML = "Positive numbers only";
            return;
        }

        if (b % 1 != 0) {
            (document.getElementById("inputs" + num)?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
            (document.getElementById("inputs" + num)?.childNodes[1] as HTMLElement).innerHTML = "Integers only";
            return;
        }


        //Hospitalized
        if (num === 4 || num === 5 || num === 6) {
            totalValidation(4,6);
            return;
        }

        //discharged alive
        if (num === 7 || num === 8 || num === 9) {
            console.log("TOTAL ERROR");
            var total = Number((document.getElementById("inputs7")?.childNodes[0] as HTMLInputElement).value);
            var x = Number((document.getElementById("inputs8")?.childNodes[0] as HTMLInputElement).value);
            var y = Number((document.getElementById("inputs9")?.childNodes[0] as HTMLInputElement).value);
            if (total !== (x + y)) {
                (document.getElementById("inputs7")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                (document.getElementById("inputs8")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                (document.getElementById("inputs9")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                (document.getElementById("inputs7")?.childNodes[1] as HTMLElement).innerHTML = "Does not add up to total";
                (document.getElementById("inputs8")?.childNodes[1] as HTMLElement).innerHTML = "";
                (document.getElementById("inputs9")?.childNodes[1] as HTMLElement).innerHTML = "";
            } else {
                (document.getElementById("inputs7")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                (document.getElementById("inputs8")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                (document.getElementById("inputs9")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                (document.getElementById("inputs7")?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
                (document.getElementById("inputs8")?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
                (document.getElementById("inputs9")?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
            }
            return;
        }

        //died before 48h
        if (num === 10 || num === 11 || num === 12) {
            console.log("TOTAL ERROR");
            var total = Number((document.getElementById("inputs10")?.childNodes[0] as HTMLInputElement).value);
            var x = Number((document.getElementById("inputs11")?.childNodes[0] as HTMLInputElement).value);
            var y = Number((document.getElementById("inputs12")?.childNodes[0] as HTMLInputElement).value);
            if (total !== (x + y)) {
                (document.getElementById("inputs10")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                (document.getElementById("inputs11")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                (document.getElementById("inputs12")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                (document.getElementById("inputs10")?.childNodes[1] as HTMLElement).innerHTML = "Does not add up to total";
                (document.getElementById("inputs11")?.childNodes[1] as HTMLElement).innerHTML = "";
                (document.getElementById("inputs12")?.childNodes[1] as HTMLElement).innerHTML = "";
            } else {
                (document.getElementById("inputs10")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                (document.getElementById("inputs11")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                (document.getElementById("inputs12")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                (document.getElementById("inputs10")?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
                (document.getElementById("inputs11")?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
                (document.getElementById("inputs12")?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
            }
            return;
        }

        //died after 48h
        if (num === 13 || num === 14 || num === 15) {
            console.log("TOTAL ERROR");
            var total = Number((document.getElementById("inputs13")?.childNodes[0] as HTMLInputElement).value);
            var x = Number((document.getElementById("inputs14")?.childNodes[0] as HTMLInputElement).value);
            var y = Number((document.getElementById("inputs15")?.childNodes[0] as HTMLInputElement).value);
            if (total !== (x + y)) {
                (document.getElementById("inputs13")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                (document.getElementById("inputs14")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                (document.getElementById("inputs15")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                (document.getElementById("inputs13")?.childNodes[1] as HTMLElement).innerHTML = "Does not add up to total";
                (document.getElementById("inputs14")?.childNodes[1] as HTMLElement).innerHTML = "";
                (document.getElementById("inputs15")?.childNodes[1] as HTMLElement).innerHTML = "";
            } else {
                (document.getElementById("inputs13")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                (document.getElementById("inputs14")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                (document.getElementById("inputs15")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                (document.getElementById("inputs13")?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
                (document.getElementById("inputs14")?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
                (document.getElementById("inputs15")?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
            }
            return;
        }

        //self-discharged
        if (num === 19 || num === 20 || num === 21 || num === 22 || num === 23 || num === 24) {
            console.log("TOTAL ERROR");
            var total = Number((document.getElementById("inputs19")?.childNodes[0] as HTMLInputElement).value);
            var i1 = Number((document.getElementById("inputs20")?.childNodes[0] as HTMLInputElement).value);
            var i2 = Number((document.getElementById("inputs21")?.childNodes[0] as HTMLInputElement).value);
            var i3 = Number((document.getElementById("inputs22")?.childNodes[0] as HTMLInputElement).value);
            var i4 = Number((document.getElementById("inputs23")?.childNodes[0] as HTMLInputElement).value);
            var i5 = Number((document.getElementById("inputs24")?.childNodes[0] as HTMLInputElement).value);
            if (total !== (i1 + i2 + i3 + i4 + i5)) {
                (document.getElementById("inputs19")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                (document.getElementById("inputs20")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                (document.getElementById("inputs21")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                (document.getElementById("inputs22")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                (document.getElementById("inputs23")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                (document.getElementById("inputs24")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                (document.getElementById("inputs19")?.childNodes[1] as HTMLElement).innerHTML = "Does not add up to total";
                (document.getElementById("inputs20")?.childNodes[1] as HTMLElement).innerHTML = "";
                (document.getElementById("inputs21")?.childNodes[1] as HTMLElement).innerHTML = "";
                (document.getElementById("inputs22")?.childNodes[1] as HTMLElement).innerHTML = "";
                (document.getElementById("inputs23")?.childNodes[1] as HTMLElement).innerHTML = "";
                (document.getElementById("inputs24")?.childNodes[1] as HTMLElement).innerHTML = "";
            } else {
                (document.getElementById("inputs19")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                (document.getElementById("inputs20")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                (document.getElementById("inputs21")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                (document.getElementById("inputs22")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                (document.getElementById("inputs23")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                (document.getElementById("inputs24")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                (document.getElementById("inputs19")?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
                (document.getElementById("inputs20")?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
                (document.getElementById("inputs21")?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
                (document.getElementById("inputs22")?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
                (document.getElementById("inputs23")?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
                (document.getElementById("inputs24")?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
            }
            return;
        }

        if(num == 27) {
            console.log(document.getElementById("inputs" + 32)?.childNodes);
        }

        (document.getElementById("inputs" + num)?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
        (document.getElementById("inputs" + num)?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
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
                            {sections ? sections.map((section: any, index: any) => {
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
                            }) : null}
                        </ul>
                        <div className="btn-group d-flex">
                            <button className="w-100 btn btn-secondary btn-sm" onClick={clickPrevious} disabled={sectionState === 0 ? true : false}>Previous</button>
                            <button className="w-100 btn btn-secondary btn-sm" onClick={clickNext} disabled={sectionState === 2 ? true : false}>Next</button>
                        </div>

                        <button className="w-100 btn btn-primary btn-lg" type="submit">Submit</button>
                    </div>
                    <div className="col-md-7 col-lg-8">

                        <form onSubmit={handleSubmit(onSubmit)} className="needs-validation">
                            <div className="row g-2">
                                {fields ? fields.map((field: any, index: any) => {
                                    switch (field.field_type) {
                                        case 'section':
                                            sectionCount += 1;
                                            return (<h4 id={"section" + sectionCount} className="mb-3">{sectionCount}. {field.field_label}</h4>)

                                        case 'subsection':
                                            return (<h6 id={"subsection" + index} className={field.field_level === 1 ? "px-5 fw-bold" : "fw-bold"}>{field.field_label}</h6>)

                                        case 'number':
                                            fieldCount += 1;

                                            return (
                                                <>
                                                    <div id={"input" + index} className={field.field_level === 1 ? "col-sm-10 ps-5" : "col-sm-10"}>
                                                        <span className="align-middle">{fieldCount}. {field.field_label}</span>
                                                    </div>
                                                    <div id={"inputs" + index} className="col-sm-2">
                                                        <input type="text" className="form-control" placeholder=""
                                                            {...register(field.field_id)}
                                                            // required 
                                                            //onChange={() => totalValidation(index)}
                                                            onBlur={() => inputValidation(index)}
                                                        />
                                                        <div className="invalid-feedback">
                                                            Requires a valid number
                                                        </div>
                                                    </div>
                                                </>
                                            )

                                        case 'array':
                                            fieldCount += 1;
                                            switch (field.field_id) {
                                                case 'admissions.comeFrom.otherDepartments':
                                                    return (
                                                        <>
                                                            <div id={"input" + index} className={field.field_level === 1 ? "ps-5" : ""}>
                                                                <span className="align-middle me-2">{fieldCount}. {field.field_label}</span>
                                                                <button type="button" className="btn btn-success btn-sm" onClick={() => addFormFields(field.field_id)}>Add</button>
                                                            </div>
                                                            <div id={"inputs" + index} >
                                                                {formValuesComeFrom.map((element, index2) => (
                                                                    <div className="row g-3 mb-1" key={index}>
                                                                        <div className={field.field_level === 1 ? "col-sm-10 ps-5" : "col-sm-10"}>
                                                                            <div className="input-group" id={"cf" + index + index2}>
                                                                                <span className="input-group-text" id="">Name and value</span>
                                                                                <input className="form-control" type="text" name="nameOfDepartment"
                                                                                    value={element.name || ""}
                                                                                    onChange={e => handleChange(field.field_id, index2, e, 0)}
                                                                                    onBlur={() => arrayInputValidation("cf" + index + index2)}
                                                                                />
                                                                                <input className="form-control" type="text" name="numberOfPatients"
                                                                                    value={element.value || ""}
                                                                                    onChange={e => handleChange(field.field_id, index2, e, 1)}
                                                                                    onBlur={() => arrayInputValidation("cf" + index + index2)}
                                                                                />
                                                                                <div className="invalid-feedback text-end">
                                                                                    Requires a valid number
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-sm-2">
                                                                            <button type="button" className="btn btn-danger btn-sm btn-block" onClick={() => removeFormFields(field.field_id, index2)}>Remove</button>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </>
                                                    )

                                                case 'admissions.mainCondition.otherMedical':
                                                    return (
                                                        <>
                                                            <div id={"input" + index} className={field.field_level === 1 ? "ps-5" : ""}>
                                                                <span className="align-middle me-2">{fieldCount}. {field.field_label}</span>
                                                                <button type="button" className="btn btn-success btn-sm" onClick={() => addFormFields(field.field_id)}>Add</button>
                                                            </div>
                                                            <div id={"inputs" + index} >
                                                                {formValuesAdCondition.map((element, index) => (
                                                                    <div className="row g-3 mb-1" key={index}>
                                                                        <div className={field.field_level === 1 ? "col-sm-10 ps-5" : "col-sm-10"}>
                                                                            <div className="input-group">
                                                                                <span className="input-group-text" id="">Name and value</span>
                                                                                <input id={"arrTextACInput" + index} className="form-control" type="text" name="nameOfDepartment"
                                                                                    value={element.name || ""}
                                                                                    onChange={e => handleChange(field.field_id, index, e, 0)}
                                                                                    onBlur={() => arrayInputValidation("arrTextAC")}
                                                                                />
                                                                                <input id={"arrNumACInput" + index} className="form-control" type="number" name="numberOfPatients"
                                                                                    value={element.value || ""}
                                                                                    onChange={e => handleChange(field.field_id, index, e, 1)}
                                                                                    onBlur={() => arrayInputValidation("arrNumAC")}
                                                                                />
                                                                                <div id={"arrACInputError" + index} className="invalid-feedback">
                                                                                    Requires a valid number
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-sm-2">
                                                                            <button type="button" className="btn btn-danger btn-sm btn-block" onClick={() => removeFormFields(field.field_id, index)}>Remove</button>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </>
                                                    )

                                                case 'numberOfOutPatients.mainCondition.otherMedical':
                                                    return (
                                                        <>
                                                            <div id={"input" + index} className={field.field_level === 1 ? "ps-5" : ""}>
                                                                <span className="align-middle me-2">{fieldCount}. {field.field_label}</span>
                                                                <button type="button" className="btn btn-success btn-sm" onClick={() => addFormFields(field.field_id)}>Add</button>
                                                            </div>
                                                            <div id={"inputs" + index} >
                                                                {formValuesOutCondition.map((element, index) => (
                                                                    <div className="row g-3 mb-1" key={index}>
                                                                        <div className={field.field_level === 1 ? "col-sm-10 ps-5" : "col-sm-10"}>
                                                                            <div className="input-group">
                                                                                <span className="input-group-text" id="">Name and value</span>
                                                                                <input id={"arrTextOCInput" + index} className="form-control" type="text" name="nameOfDepartment"
                                                                                    value={element.name || ""}
                                                                                    onChange={e => handleChange(field.field_id, index, e, 0)}
                                                                                    onBlur={() => arrayInputValidation("arrTextOC")}
                                                                                />
                                                                                <input id={"arrNumOCInput" + index} className="form-control" type="number" name="numberOfPatients"
                                                                                    value={element.value || ""}
                                                                                    onChange={e => handleChange(field.field_id, index, e, 1)}
                                                                                    onBlur={() => arrayInputValidation("arrNumOC")}
                                                                                />
                                                                                <div id={"arrOCInputError" + index} className="invalid-feedback">
                                                                                    Requires a valid number
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-sm-2">
                                                                            <button type="button" className="btn btn-danger btn-sm btn-block" onClick={() => removeFormFields(field.field_id, index)}>Remove</button>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </>
                                                    )

                                                default:
                                                    return null
                                            }

                                        default:
                                            return null;
                                    }
                                }) : null}

                                <hr className="my-4"></hr>

                                <button className="w-100 btn btn-primary btn-lg" type="submit" style={{ display: sectionState === 2 ? '' : 'none' }}>Submit</button>
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
