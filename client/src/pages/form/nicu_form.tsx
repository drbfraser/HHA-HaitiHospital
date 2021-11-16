import { useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import SideBar from "../../components/side_bar/side_bar";
import Header from 'components/header/header';
import nicuJSON from './models/nicuModel.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import './nicu_form_styles.css'



function DynamicForm() {
    const { register, handleSubmit, reset, } = useForm({});
    const [formModel, setFormModel] = useState({});
    const [formValuesComeFrom, setFormValuesComeFrom] = useState<{ name: any; value: any; }[]>([])
    const [formValuesAdCondition, setFormValuesAdCondition] = useState<{ name: any; value: any; }[]>([])
    const [formValuesOutCondition, setFormValuesOutCondition] = useState<{ name: any; value: any; }[]>([])
    const [sectionState, setSectionState] = useState(0);

    const history = useHistory();

    useEffect(() => {
        const getData = async () => {
            await setFormModel(nicuJSON);
            setSectionState(0);
        }

        getData();
    }, [])

    useEffect(() => {
        sidePanelClick(sectionState);
    })

    const elements: any = Object.values(formModel);
    const fields: any = elements[0];

    function refreshPage() {
        window.location.reload();
    }

    const onSubmit = async (data: any) => {
        var valid = submitValidation();

        if (valid === true) {

            data.departmentId = 1;
            data.admissions.comeFrom.otherDepartments = formValuesComeFrom;
            data.admissions.mainCondition.otherMedical = formValuesAdCondition;
            data.numberOfOutPatients.mainCondition.otherMedical = formValuesOutCondition;
            await axios.post('/api/report/add', data).then(res => {
                console.log(res.data);
            }).catch(error => {
                console.error('Something went wrong!', error.response);
            });

            //console.log(data);
            history.push("/Department1NICU");
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

    const addFormFields = (ID: number) => {
        switch (ID) {
            case 30:
                setFormValuesComeFrom([...formValuesComeFrom, { name: "", value: null }])
                break;
            case 59:
                setFormValuesAdCondition([...formValuesAdCondition, { name: "", value: null }])
                break;
            case 89:
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
        let startj = 1;
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

            document.getElementById("section" + i)!.style.display = show;
            for (let j = 1; j <= elements[i].section_fields.length; j++, startj++) {
                if (document.getElementById("subsection" + startj)) document.getElementById("subsection" + startj)!.style.display = show;
                if (document.getElementById("input" + startj)) document.getElementById("input" + startj)!.style.display = show;
                if (document.getElementById("inputs" + startj)) document.getElementById("inputs" + startj)!.style.display = show;
            }
        }
    }

    function submitValidation() {
        for (let i = 1; i < 99; i++) {
            if (i === 26 || i === 28 || i === 33 || i === 42 || i === 45 || i === 65 || i === 67 || i === 76 || i === 79) {
                continue;
            }

            if (i === 32) {
                for (let j = 0; j < formValuesComeFrom.length; j++) {
                    if ((document.getElementById("cf" + 32 + j)?.childNodes[1] as HTMLInputElement).classList.contains('is-invalid')) {
                        return false;
                    }

                    if ((document.getElementById("cf" + 32 + j)?.childNodes[2] as HTMLInputElement).classList.contains('is-invalid')) {
                        return false;
                    }
                }
            } else if (i === 64) {
                for (let j = 0; j < formValuesAdCondition.length; j++) {
                    if ((document.getElementById("ac" + 64 + j)?.childNodes[1] as HTMLInputElement).classList.contains('is-invalid')) {
                        return false;
                    }

                    if ((document.getElementById("ac" + 64 + j)?.childNodes[2] as HTMLInputElement).classList.contains('is-invalid')) {
                        return false;
                    }
                }
            } else if (i === 98) {
                for (let j = 0; j < formValuesOutCondition.length; j++) {
                    if ((document.getElementById("oc" + 98 + j)?.childNodes[1] as HTMLInputElement).classList.contains('is-invalid')) {
                        return false;
                    }

                    if ((document.getElementById("oc" + 98 + j)?.childNodes[2] as HTMLInputElement).classList.contains('is-invalid')) {
                        return false;
                    }
                }
            } else {
                if ((document.getElementById("inputs" + i)?.childNodes[0] as HTMLInputElement).classList.contains('is-invalid')) {
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

    function makeValidity(num: number, isVal: boolean, msg: string) {
        var inputElement = (document.getElementById("inputs" + num)?.childNodes[0] as HTMLInputElement);
        var errorMessage = (document.getElementById("inputs" + num)?.childNodes[1] as HTMLElement);

        if (isVal) {
            inputElement.classList.remove("is-invalid");
            inputElement.classList.add("is-valid");
            errorMessage.innerHTML = "";
        } else {
            inputElement.classList.remove("is-valid");
            inputElement.classList.add("is-invalid");
            errorMessage.innerHTML = msg;
        }
    }

    function isValid(num: number) {
        console.log("input: " + num);
        var inputElement = (document.getElementById("inputs" + num)?.childNodes[0] as HTMLInputElement);

        var numberAsText = inputElement.value;
        if (numberAsText == "") {
            makeValidity(num, false, "Must enter a value");
            return false;
        }

        var number = Number(numberAsText);
        if (number < 0) {
            makeValidity(num, false, "Positive numbers only");
            return false;
        }

        if (number % 1 != 0) {
            makeValidity(num, false, "Integers only");
            return false;
        }

        makeValidity(num, true, "");
        return true;
    }

    function inputValidation(num: number) {
        if (!isValid(num)) return;

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
        if (num === 26 || num >= 27 && num <= 30) {
            arrayTotalValidation(26, 27, 30);
            return;
        }
        //Age
        if (num === 26 || num >= 31 && num <= 38) {
            totalValidation(26, 31, 38);
            return;
        }
        //Gender
        if (num === 26 || num >= 39 && num <= 40) {
            totalValidation(26, 39, 40);
            return;
        }
        //Main Condition
        if (num === 26 || num >= 41 && num <= 59) {
            arrayTotalValidation(26, 41, 59);
            return;
        }

        //Age
        if (num === 60 || num >= 61 && num <= 68) {
            totalValidation(60, 61, 68);
            return;
        }
        //Gender
        if (num === 60 || num >= 69 && num <= 70) {
            totalValidation(60, 69, 70);
            return;
        }
        //Main Condition
        if (num === 60 || num >= 71 && num <= 89) {
            arrayTotalValidation(60, 71, 89);
            return;
        }

        makeValidity(num, true, "");
    }

    function totalValidation(start: number, a: number, b: number) {
        var inputElement = (document.getElementById("inputs" + start)?.childNodes[0] as HTMLInputElement);
        var total = Number(inputElement.value);
        var isSeriesValid = isValid(start);

        var total2 = 0;
        for (var i = a; i <= b; i++) {
            console.log("loop", i);
            inputElement = (document.getElementById("inputs" + i)?.childNodes[0] as HTMLInputElement);
            total2 += Number(inputElement.value);
            isSeriesValid = isValid(i) && isSeriesValid;
        }
        
        if (isSeriesValid) {
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
    }






    let fieldCount = 0;

    document.body.classList.add("bg-light");

    return (
        <div className="nicu_form">
            <SideBar />

            <main className="container">
                <Header />

                <div className="py-3 text-start">
                    <h2>NICU/Paediatrics Form</h2>
                    <p className="lead">For: September 2021</p>
                </div>

                <div className="row g-3">
                    <div className="col-sm-4 col-md-4 col-lg-4">

                        <h4 className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-primary">Steps</span>
                        </h4>

                        <ul className="list-group mb-3">
                            {elements ? elements.map((section: any, idx: any) => {
                                var isActive = idx === 0 ? true : false;
                                return (
                                    <>
                                        <li className={isActive ? "list-group-item d-flex justify-content-between active" : "list-group-item d-flex justify-content-between"}
                                            onClick={() => sidePanelClick(idx)}>
                                            <span>{idx + 1}. {section.section_label}</span>
                                        </li>
                                    </>
                                )
                            }) : null}
                        </ul>

                        <button className="w-100 btn btn-primary btn-lg" type="submit" onClick={handleSubmit(onSubmit)}>Submit</button>
                    </div>


                    <div className="col-sm-7 col-md-7 col-lg-7">
                        <form onSubmit={handleSubmit(onSubmit)} className="needs-validation">
                            <div className="row g-2">
                                {elements ? elements.map((section: any, idx: any) => {
                                    var ret = [];

                                    // render the section title
                                    ret.push(<h4 id={"section" + idx} className="mb-3">{idx + 1}. {section.section_label}</h4>);

                                    var fields = section.section_fields;

                                    // i is the question number
                                    for (let i = fieldCount + 1; i <= fieldCount + fields.length; i++) {
                                        var field = fields[i - fieldCount - 1];

                                        // render the subsection title
                                        if (field.subsection_label) {
                                            ret.push(<h6 id={"subsection" + i} className={field.field_level === 1 ? "px-5 fw-bold" : "fw-bold"}>{field.subsection_label}</h6>)
                                        }

                                        // render each entry
                                        if (field.field_type === "number") {
                                            ret.push(
                                                <>
                                                    <div id={"input" + i} className={field.field_level === 1 ? "col-sm-10 ps-5" : "col-sm-10"}>
                                                        <span className="align-middle">{i}. {field.field_label}</span>
                                                    </div>
                                                    <div id={"inputs" + i} className="col-sm-2">
                                                        <input type="text" className="form-control" placeholder=""
                                                            {...register(field.field_id)}
                                                            onBlur={() => inputValidation(i)}
                                                        />
                                                        <div className="invalid-feedback">
                                                            Requires a valid number
                                                        </div>
                                                    </div>
                                                </>
                                            );

                                        } else if (field.field_type === "array") {
                                            var formValues;
                                            if (field.field_id === "admissions.comeFrom.otherDepartments") {
                                                formValues = formValuesComeFrom;
                                            } else if (field.field_id === "admissions.mainCondition.otherMedical") {
                                                formValues = formValuesAdCondition;
                                            } else if (field.field_id === "numberOfOutPatients.mainCondition.otherMedical") {
                                                formValues = formValuesOutCondition;
                                            }
                                            var formId = field.field_id;
                                            ret.push(
                                                <>
                                                    <div id={"input" + i} className={field.field_level === 1 ? "ps-5" : ""}>
                                                        <span className="align-middle me-2">{i}. {field.field_label}</span>
                                                        <button type="button" className="btn btn-success btn-sm" onClick={() => addFormFields(i)}>Add</button>
                                                    </div>
                                                    <div id={"inputs" + i} >
                                                        {formValues.map((element, index2) => (
                                                            <div className="row g-3 mb-1">
                                                                <div className={field.field_level === 1 ? "col-sm-10 ps-5" : "col-sm-10"}>
                                                                    <div className="input-group" id={"cf" + i + index2}>
                                                                        <span className="input-group-text" id="">Name and value</span>
                                                                        <input className="form-control" type="text" name="nameOfDepartment"
                                                                            value={element.name || ""}
                                                                            onChange={e => handleChange(field.field_id, index2, e, 0)}
                                                                            onBlur={() => arrayInputValidation("cf", i, index2, "text")}
                                                                        />
                                                                        <input className="form-control" type="text" name="numberOfPatients"
                                                                            value={element.value || ""}
                                                                            onChange={e => handleChange(field.field_id, index2, e, 1)}
                                                                            onBlur={() => arrayInputValidation("cf", i, index2, "number")}
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
                                        }

                                    }

                                    fieldCount += fields.length;
                                    return ret;

                                    //     case 'array':
                                    //         fieldCount += 1;
                                    //         switch (field.field_id) {
                                    //             case 'admissions.comeFrom.otherDepartments':
                                    //                 return (
                                    //                     <>
                                    //                         <div id={"input" + index} className={field.field_level === 1 ? "ps-5" : ""}>
                                    //                             <span className="align-middle me-2">{fieldCount}. {field.field_label}</span>
                                    //                             <button type="button" className="btn btn-success btn-sm" onClick={() => addFormFields(field.field_id)}>Add</button>
                                    //                         </div>
                                    //                         <div id={"inputs" + index} >
                                    //                             {formValuesComeFrom.map((element, index2) => (
                                    //                                 <div className="row g-3 mb-1" key={index}>
                                    //                                     <div className={field.field_level === 1 ? "col-sm-10 ps-5" : "col-sm-10"}>
                                    //                                         <div className="input-group" id={"cf" + index + index2}>
                                    //                                             <span className="input-group-text" id="">Name and value</span>
                                    //                                             <input className="form-control" type="text" name="nameOfDepartment"
                                    //                                                    value={element.name || ""}
                                    //                                                    onChange={e => handleChange(field.field_id, index2, e, 0)}
                                    //                                                    onBlur={() => arrayInputValidation("cf", index, index2, "text")}
                                    //                                             />
                                    //                                             <input className="form-control" type="text" name="numberOfPatients"
                                    //                                                    value={element.value || ""}
                                    //                                                    onChange={e => handleChange(field.field_id, index2, e, 1)}
                                    //                                                    onBlur={() => arrayInputValidation("cf", index, index2, "number")}
                                    //                                             />
                                    //                                             <div className="invalid-feedback text-end">
                                    //                                                 Requires a valid number
                                    //                                             </div>
                                    //                                         </div>
                                    //                                     </div>
                                    //                                     <div className="col-sm-2">
                                    //                                         <button type="button" className="btn btn-danger btn-sm btn-block" onClick={() => removeFormFields(field.field_id, index2)}>Remove</button>
                                    //                                     </div>
                                    //                                 </div>
                                    //                             ))}
                                    //                         </div>
                                    //                     </>
                                    //                 )

                                    //             case 'admissions.mainCondition.otherMedical':
                                    //                 return (
                                    //                     <>
                                    //                         <div id={"input" + index} className={field.field_level === 1 ? "ps-5" : ""}>
                                    //                             <span className="align-middle me-2">{fieldCount}. {field.field_label}</span>
                                    //                             <button type="button" className="btn btn-success btn-sm" onClick={() => addFormFields(field.field_id)}>Add</button>
                                    //                         </div>
                                    //                         <div id={"inputs" + index} >
                                    //                             {formValuesAdCondition.map((element, index2) => (
                                    //                                 <div className="row g-3 mb-1" key={index}>
                                    //                                     <div className={field.field_level === 1 ? "col-sm-10 ps-5" : "col-sm-10"}>
                                    //                                         <div className="input-group" id={"ac" + index + index2}>
                                    //                                             <span className="input-group-text" id="">Name and value</span>
                                    //                                             <input className="form-control" type="text" name="nameOfDepartment"
                                    //                                                    value={element.name || ""}
                                    //                                                    onChange={e => handleChange(field.field_id, index2, e, 0)}
                                    //                                                    onBlur={() => arrayInputValidation("ac", index, index2, "text")}
                                    //                                             />
                                    //                                             <input className="form-control" type="text" name="numberOfPatients"
                                    //                                                    value={element.value || ""}
                                    //                                                    onChange={e => handleChange(field.field_id, index2, e, 1)}
                                    //                                                    onBlur={() => arrayInputValidation("ac", index, index2, "number")}
                                    //                                             />
                                    //                                             <div className="invalid-feedback text-end">
                                    //                                                 Requires a valid number
                                    //                                             </div>
                                    //                                         </div>
                                    //                                     </div>
                                    //                                     <div className="col-sm-2">
                                    //                                         <button type="button" className="btn btn-danger btn-sm btn-block" onClick={() => removeFormFields(field.field_id, index)}>Remove</button>
                                    //                                     </div>
                                    //                                 </div>
                                    //                             ))}
                                    //                         </div>
                                    //                     </>
                                    //                 )

                                    //             case 'numberOfOutPatients.mainCondition.otherMedical':
                                    //                 return (
                                    //                     <>
                                    //                         <div id={"input" + index} className={field.field_level === 1 ? "ps-5" : ""}>
                                    //                             <span className="align-middle me-2">{fieldCount}. {field.field_label}</span>
                                    //                             <button type="button" className="btn btn-success btn-sm" onClick={() => addFormFields(field.field_id)}>Add</button>
                                    //                         </div>
                                    //                         <div id={"inputs" + index} >
                                    //                             {formValuesOutCondition.map((element, index2) => (
                                    //                                 <div className="row g-3 mb-1">
                                    //                                     <div className={field.field_level === 1 ? "col-sm-10 ps-5" : "col-sm-10"}>
                                    //                                         <div className="input-group" id={"oc" + index + index2}>
                                    //                                             <span className="input-group-text">Name and value</span>
                                    //                                             <input className="form-control" type="text" name="nameOfDepartment"
                                    //                                                    value={element.name || ""}
                                    //                                                    onChange={e => handleChange(field.field_id, index2, e, 0)}
                                    //                                                    onBlur={() => arrayInputValidation("oc", index, index2, "text")}
                                    //                                             />
                                    //                                             <input className="form-control" type="text" name="numberOfPatients"
                                    //                                                    value={element.value || ""}
                                    //                                                    onChange={e => handleChange(field.field_id, index2, e, 1)}
                                    //                                                    onBlur={() => arrayInputValidation("oc", index, index2, "number")}
                                    //                                             />
                                    //                                             <div className="invalid-feedback text-end">
                                    //                                                 Requires a valid number
                                    //                                             </div>
                                    //                                         </div>
                                    //                                     </div>
                                    //                                     <div className="col-sm-2">
                                    //                                         <button type="button" className="btn btn-danger btn-sm btn-block" onClick={() => removeFormFields(field.field_id, index)}>Remove</button>
                                    //                                     </div>
                                    //                                 </div>
                                    //                             ))}
                                    //                         </div>
                                    //                     </>
                                    //                 )

                                    //             default:
                                    //                 return null
                                    //         }

                                    //     default:
                                    //         return null;
                                    // }
                                }) : null}

                                <hr className="my-4"></hr>
                            </div>
                        </form>

                        <div className="btn-group d-flex">
                            <button className="w-100 btn btn-secondary btn-sm" onClick={clickPrevious} disabled={sectionState === 0 ? true : false}>Previous</button>
                            <button className="w-100 btn btn-secondary btn-sm" onClick={clickNext} disabled={sectionState === 2 ? true : false}>Next</button>
                        </div>

                        <button
                            className="w-100 btn btn-primary btn-lg"
                            type="submit"
                            style={{ display: sectionState === 2 ? '' : 'none' }}
                            onClick={handleSubmit(onSubmit)}>
                            Submit
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default DynamicForm;
