import { useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import axios from 'axios';


import Header from 'components/header/header';
import testJSON from './models/testModel.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import './nicu_form.css';


function DynamicForm() {
    const { register, handleSubmit, reset, formState: { isSubmitSuccessful } } = useForm({});
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

    function refreshPage() {
        window.location.reload();
    }

    const onSubmit = (data: any) => {
        var valid = submitValidation();

        if(valid === true) {
            data.admissions.comeFrom.otherDepartments = formValuesComeFrom;
            data.admissions.mainCondition.otherMedical = formValuesAdCondition;
            data.numberOfOutPatients.mainCondition.otherMedical = formValuesOutCondition;
            console.log(data);
            refreshPage();
        } else {
            console.log(valid);
            alert("Some fields contain invalid values");
            window.scrollTo(0, 0);
        }
        
    }

    const clickPrevious = () => {
        sidePanelClick(sectionState - 1);
        window.scrollTo(0, 0);
    }

    const clickNext = () => {
        sidePanelClick(sectionState + 1);
        window.scrollTo(0, 0);
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
    
    function submitValidation() {
        for(let i = 1; i < 99; i++){
            if(i === 26 || i === 28 || i === 33 || i === 42 || i === 45 || i === 65 || i === 67 || i === 76 || i === 79){
                continue;
            }
            
            if(i === 32){
                for(let j = 0; j < formValuesComeFrom.length; j++){
                    if((document.getElementById("cf" + 32 + j)?.childNodes[1] as HTMLInputElement).classList.contains('is-invalid')){
                        return false;
                    }

                    if((document.getElementById("cf" + 32 + j)?.childNodes[2] as HTMLInputElement).classList.contains('is-invalid')){
                        return false;
                    }
                }  
            }else if(i === 64){
                for(let j = 0; j < formValuesAdCondition.length; j++){
                    if((document.getElementById("ac" + 64 + j)?.childNodes[1] as HTMLInputElement).classList.contains('is-invalid')){
                        return false;
                    }

                    if((document.getElementById("ac" + 64 + j)?.childNodes[2] as HTMLInputElement).classList.contains('is-invalid')){
                        return false;
                    }
                }  
            }else if(i === 98){
                for(let j = 0; j < formValuesOutCondition.length; j++){
                    if((document.getElementById("oc" + 98 + j)?.childNodes[1] as HTMLInputElement).classList.contains('is-invalid')){
                        return false;
                    }

                    if((document.getElementById("oc" + 98 + j)?.childNodes[2] as HTMLInputElement).classList.contains('is-invalid')){
                        return false;
                    }
                }  
            }else{
                if((document.getElementById("inputs" + i)?.childNodes[0] as HTMLInputElement).classList.contains('is-invalid')){
                    return false;
                }
            }
        }

        return true;
    }

    function arrayInputValidation(id: string, num: number, num2: number, type: string) {
        var wholeId = id + num + num2;
        var inputGroup = (document.getElementById(wholeId) as HTMLElement);

        if (type == "text") {
            var text = (inputGroup.childNodes[1] as HTMLInputElement).value;
            if (text == "") {
                (inputGroup.childNodes[1] as HTMLInputElement).classList.add("is-invalid");
                (inputGroup.childNodes[3] as HTMLElement).innerHTML = "Must enter a value for this field";
                return;
            }

            (inputGroup.childNodes[1] as HTMLInputElement).classList.remove("is-invalid");
            (inputGroup.childNodes[1] as HTMLInputElement).classList.add("is-valid");
            return;
        }

        if (type == "number") {
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

            if (num === 32) {
                if (!arrayTotalValidation(27, 29, 32)) {
                    return;
                }
            }

            //Main Condition
            if (num === 64) {
                if (!arrayTotalValidation(27, 46, 64)) {
                    return;
                }
            }

            //Main Condition
            if (num === 98) {
                if (!arrayTotalValidation(66, 80, 98)) {
                    return;
                }
            }

            (inputGroup.childNodes[2] as HTMLInputElement).classList.remove("is-invalid");
            (inputGroup.childNodes[2] as HTMLInputElement).classList.add("is-valid");
            return;
        }
    }

    function totalValidation(start: number, a: number, b: number) {
        var total = Number((document.getElementById("inputs" + start)?.childNodes[0] as HTMLInputElement).value);
        var total2 = 0;
        for (var i = a; i <= b; i++) {
            total2 += Number((document.getElementById("inputs" + i)?.childNodes[0] as HTMLInputElement).value)
        }
        if (total !== total2) {
            (document.getElementById("inputs" + start)?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
            (document.getElementById("inputs" + start)?.childNodes[1] as HTMLElement).innerHTML = "Does not add up to total";
            for (var i = a; i <= b; i++) {
                (document.getElementById("inputs" + i)?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                (document.getElementById("inputs" + i)?.childNodes[1] as HTMLElement).innerHTML = "";
            }
        } else {
            (document.getElementById("inputs" + start)?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
            (document.getElementById("inputs" + start)?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
            for (var i = a; i <= b; i++) {
                (document.getElementById("inputs" + i)?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                (document.getElementById("inputs" + i)?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
            }
        }
    }

    function arrayTotalValidation(start: number, a: number, b: number) {
        var total = Number((document.getElementById("inputs" + start)?.childNodes[0] as HTMLInputElement).value);
        var total2 = 0;
        for (var i = a; i <= b - 1; i++) {
            total2 += Number((document.getElementById("inputs" + i)?.childNodes[0] as HTMLInputElement).value)
        }
        var elementList = document.getElementById("inputs" + b)?.childNodes;
        for (var i = 0; i < elementList!.length; i++) {
            var inputElement = elementList![i].childNodes[0].childNodes[0].childNodes[2];
            total2 += Number((inputElement as HTMLInputElement).value);
        }
        console.log(total, total2);

        if (total !== total2) {
            (document.getElementById("inputs" + start)?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
            (document.getElementById("inputs" + start)?.childNodes[1] as HTMLElement).innerHTML = "";

            for (var i = a; i <= b - 1; i++) {
                (document.getElementById("inputs" + i)?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                var errorMsg = i == a ? "Does not add up to total" : "";
                (document.getElementById("inputs" + i)?.childNodes[1] as HTMLElement).innerHTML = errorMsg;
            }

            for (var i = 0; i < elementList!.length; i++) {
                (elementList![i].childNodes[0].childNodes[0].childNodes[2] as HTMLInputElement).classList.add("is-invalid");
                (elementList![i].childNodes[0].childNodes[0].childNodes[3] as HTMLElement).innerHTML = "";
            }

            return false;
        } else {
            (document.getElementById("inputs" + start)?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
            (document.getElementById("inputs" + start)?.childNodes[0] as HTMLInputElement).classList.add("is-valid");

            for (var i = a; i <= b - 1; i++) {
                (document.getElementById("inputs" + i)?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                (document.getElementById("inputs" + i)?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
            }

            for (var i = 0; i < elementList!.length; i++) {
                (elementList![i].childNodes[0].childNodes[0].childNodes[2] as HTMLInputElement).classList.remove("is-invalid");
                (elementList![i].childNodes[0].childNodes[0].childNodes[2] as HTMLInputElement).classList.add("is-valid");
            }

            return true;
        }
    }

    function inputValidation(num: number) {
        console.log("input: " + num);

        var numberAsText = (document.getElementById("inputs" + num)?.childNodes[0] as HTMLInputElement).value;
        if (numberAsText == "") {
            (document.getElementById("inputs" + num)?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
            (document.getElementById("inputs" + num)?.childNodes[1] as HTMLElement).innerHTML = "Must enter a value";
            return;
        }

        var number = Number((document.getElementById("inputs" + num)?.childNodes[0] as HTMLInputElement).value);
        if (number < 0) {
            (document.getElementById("inputs" + num)?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
            (document.getElementById("inputs" + num)?.childNodes[1] as HTMLElement).innerHTML = "Positive numbers only";
            return;
        }

        if (number % 1 != 0) {
            (document.getElementById("inputs" + num)?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
            (document.getElementById("inputs" + num)?.childNodes[1] as HTMLElement).innerHTML = "Integers only";
            return;
        }

        //Hospitalized
        if (num === 4 || num === 5 || num === 6) {
            totalValidation(4, 5, 6);
            return;
        }

        //discharged alive
        if (num === 7 || num === 8 || num === 9) {
            totalValidation(7, 8, 9);
            return;
        }

        //died before 48h
        if (num === 10 || num === 11 || num === 12) {
            totalValidation(10, 11, 12);
            return;
        }

        //died after 48h
        if (num === 13 || num === 14 || num === 15) {
            totalValidation(13, 14, 15);
            return;
        }

        //self-discharged
        if (num >= 19 && num <= 24) {
            totalValidation(19, 20, 24);
            return;
        }

        //Where do patients come from?
        if (num === 27 || num >= 29 && num <= 31) {
            arrayTotalValidation(27, 29, 32);
            return;
        }
        //Age
        if (num === 27 || num >= 34 && num <= 41) {
            totalValidation(27, 34, 41);
            return;
        }
        //Gender
        if (num === 27 || num >= 43 && num <= 44) {
            totalValidation(27, 43, 44);
            return;
        }
        //Main Condition
        if (num === 27 || num >= 46 && num <= 64) {
            arrayTotalValidation(27, 46, 64);
            return;
        }

        //Age
        if (num === 66 || num >= 68 && num <= 75) {
            totalValidation(66, 68, 75);
            return;
        }
        //Gender
        if (num === 66 || num >= 77 && num <= 78) {
            totalValidation(66, 77, 78);
            return;
        }
        //Main Condition
        if (num === 66 || num >= 80 && num <= 98) {
            arrayTotalValidation(66, 80, 98);
            return;
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

                        <button className="w-100 btn btn-primary btn-lg" type="submit" onClick={handleSubmit(onSubmit)}>Submit</button>
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
                                                                                    onBlur={() => arrayInputValidation("cf", index, index2, "text")}
                                                                                />
                                                                                <input className="form-control" type="text" name="numberOfPatients"
                                                                                    value={element.value || ""}
                                                                                    onChange={e => handleChange(field.field_id, index2, e, 1)}
                                                                                    onBlur={() => arrayInputValidation("cf", index, index2, "number")}
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
                                                                {formValuesAdCondition.map((element, index2) => (
                                                                    <div className="row g-3 mb-1" key={index}>
                                                                        <div className={field.field_level === 1 ? "col-sm-10 ps-5" : "col-sm-10"}>
                                                                            <div className="input-group" id={"ac" + index + index2}>
                                                                                <span className="input-group-text" id="">Name and value</span>
                                                                                <input className="form-control" type="text" name="nameOfDepartment"
                                                                                    value={element.name || ""}
                                                                                    onChange={e => handleChange(field.field_id, index2, e, 0)}
                                                                                    onBlur={() => arrayInputValidation("ac", index, index2, "text")}
                                                                                />
                                                                                <input className="form-control" type="text" name="numberOfPatients"
                                                                                    value={element.value || ""}
                                                                                    onChange={e => handleChange(field.field_id, index2, e, 1)}
                                                                                    onBlur={() => arrayInputValidation("ac", index, index2, "number")}
                                                                                />
                                                                                <div className="invalid-feedback text-end">
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
                                                                {formValuesOutCondition.map((element, index2) => (
                                                                    <div className="row g-3 mb-1">
                                                                        <div className={field.field_level === 1 ? "col-sm-10 ps-5" : "col-sm-10"}>
                                                                            <div className="input-group" id={"oc" + index + index2}>
                                                                                <span className="input-group-text">Name and value</span>
                                                                                <input className="form-control" type="text" name="nameOfDepartment"
                                                                                    value={element.name || ""}
                                                                                    onChange={e => handleChange(field.field_id, index2, e, 0)}
                                                                                    onBlur={() => arrayInputValidation("oc", index, index2, "text")}
                                                                                />
                                                                                <input className="form-control" type="text" name="numberOfPatients"
                                                                                    value={element.value || ""}
                                                                                    onChange={e => handleChange(field.field_id, index2, e, 1)}
                                                                                    onBlur={() => arrayInputValidation("oc", index, index2, "number")}
                                                                                />
                                                                                <div className="invalid-feedback text-end">
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
                                <div className="btn-group d-flex">
                                    <button className="w-100 btn btn-secondary btn-sm" onClick={clickPrevious} disabled={sectionState === 0 ? true : false}>Previous</button>
                                    <button className="w-100 btn btn-secondary btn-sm" onClick={clickNext} disabled={sectionState === 2 ? true : false}>Next</button>
                                </div>

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
