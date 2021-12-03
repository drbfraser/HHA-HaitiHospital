import { useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import SideBar from "../../components/side_bar/side_bar";
import Header from 'components/header/header';
import nicuJSON from './models/nicuModel.json';
import nicuJSONFr from './models/nicuModelFr.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import './nicu_form_styles.css'
import { useTranslation } from "react-i18next";


function DynamicForm() {
    const { register, handleSubmit, reset, } = useForm({});
    const [formModel, setFormModel] = useState({});
    const [formValuesComeFrom, setFormValuesComeFrom] = useState<{ name: any; value: any; }[]>([])
    const [formValuesAdCondition, setFormValuesAdCondition] = useState<{ name: any; value: any; }[]>([])
    const [formValuesOutCondition, setFormValuesOutCondition] = useState<{ name: any; value: any; }[]>([])
    const [sectionState, setSectionState] = useState(0);

    const history = useHistory();

    const {t, i18n} = useTranslation();

    useEffect(() => {
        const getData = async () => {
            await setFormModel(nicuJSON);
            setSectionState(0);
        }

        getData();
    }, [i18n.language])

    useEffect(() => {
        sidePanelClick(sectionState);
    })

    const elements: any = Object.values(formModel);
    const fields = [];
    for (var i = 0; i < elements.length; i++) {
        for (var j = 0; j < elements[i].section_fields.length; j++) {
            fields.push(elements[i].section_fields[j]);
        }
    }

    // function refreshPage() {
    //     window.location.reload();
    // }

    const addFormDescriptions = (formFields) => {
        var descriptions = {};
        fields.forEach(field => {
            if (field.field_type === "number") {
                let key = field.field_id.replaceAll(".", "_");
                descriptions[key] = field.field_label;
            } else if (field.field_type === "array") {
                let key = field.field_id.replaceAll(".", "_");
                descriptions[key] = field.field_label;
            } else if (field.field_type === "list") {
                let key = field.field_id.replaceAll(".", "_");
                descriptions[key] = field.field_label;
                field.field_template.forEach(listField => {
                    var listID = key + "_" + listField.field_id;
                    descriptions[listID] = listField.field_label;
                })
            }
        });
        return descriptions;
    }

    const onSubmit = async (data: any) => {

        if (!window.confirm("Press OK to finalize submission.")) {
            return;
        }

        if (true) {
            data.departmentId = 1;
            data.admissions.comeFrom.otherDepartments = formValuesComeFrom;
            data.admissions.mainCondition.otherMedical = formValuesAdCondition;
            data.numberOfOutPatients.mainCondition.otherMedical = formValuesOutCondition;
            data.descriptions = addFormDescriptions(fields);
            console.log(data);
            // await axios.post('/api/report/add', data).then(res => {
            //     console.log(res.data);
            // }).catch(error => {
            //     console.error('Something went wrong!', error.response);
            // });

            // history.push("/Department1NICU");

        } else {
            window.scrollTo(0, 0);
            alert("Some fields contain invalid values");
        }

    }

    const clickedPrev = () => {
        window.scrollTo(0, 0);
        sidePanelClick(sectionState - 1);
    }

    const clickedNext = () => {
        window.scrollTo(0, 0);
        sidePanelClick(sectionState + 1);
    }

    const handleChange = (ID: any, i: any, e: { target: { name: any; value: any; }; }, j: number) => {
        switch (ID) {
            case 30:
                let newFormValuesComeFrom = [...formValuesComeFrom];
                if (j === 0) {
                    newFormValuesComeFrom[i].name = e.target.value;
                } else {
                    newFormValuesComeFrom[i].value = e.target.value;
                }

                setFormValuesComeFrom(newFormValuesComeFrom);
                break;
            case 59:
                let newFormValuesAdCond = [...formValuesAdCondition];
                if (j === 0) {
                    newFormValuesAdCond[i].name = e.target.value;
                } else {
                    newFormValuesAdCond[i].value = e.target.value;
                }

                setFormValuesAdCondition(newFormValuesAdCond);
                break;
            case 89:
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

    const removeFormFields = (ID: any, idx: number) => {
        var inputGroup = document.getElementById("inputs" + ID).childNodes;

        for (let i = idx; i < inputGroup.length; i++) {
            var textInput1 = (inputGroup[i].childNodes[0].childNodes[0] as HTMLInputElement);
            var valueInput1 = (inputGroup[i].childNodes[1].childNodes[0] as HTMLInputElement);

            if (i == inputGroup.length - 1) {
                textInput1.value = "";
                valueInput1.value = "0";
                continue;
            }

            var textInput2 = (inputGroup[i + 1].childNodes[0].childNodes[0] as HTMLInputElement);
            var valueInput2 = (inputGroup[i + 1].childNodes[1].childNodes[0] as HTMLInputElement);

            textInput1.value = textInput2.value;
            valueInput1.value = valueInput2.value;

            textInput2.value = "";
            valueInput2.value = "0";

            if (textInput2.classList.contains("is-valid")) {
                makeValidity(textInput1, true, "");
            } else if (textInput2.classList.contains("is-invalid")) {
                makeValidity(textInput1, false, (textInput2.nextSibling as HTMLElement).innerHTML);
            } else {
                removeValidity(textInput1);
            }

            if (valueInput2.classList.contains("is-valid")) {
                makeValidity(valueInput1, true, "");
            } else if (valueInput2.classList.contains("is-invalid")) {
                makeValidity(valueInput1, false, (valueInput2.nextSibling as HTMLElement).innerHTML);
            } else {
                removeValidity(valueInput1);
            }
        }


        let newFormValues;
        if (ID === 30) {
            newFormValues = [...formValuesComeFrom];
            newFormValues.splice(idx, 1);
            setFormValuesComeFrom(newFormValues)
            arrayTotalValidation(26, 27, 30);
        } else if (ID === 59) {
            newFormValues = [...formValuesAdCondition];
            newFormValues.splice(idx, 1);
            setFormValuesAdCondition(newFormValues)
        } else if (ID === 89) {
            newFormValues = [...formValuesOutCondition];
            newFormValues.splice(idx, 1);
            setFormValuesOutCondition(newFormValues)
        }
    }

    const sidePanelClick = (index: any) => {
        
        const currentClass = document.getElementsByClassName("list-group-item");
        let startj = 1;
        for (let i = 0; i < currentClass.length; i++) {
            currentClass[i].classList.remove("active");

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






    //
    // VALIDATION FUNCTIONS
    // 

    function submitValidation() {
        var isFormValid = true;

        for (let i = 1; i <= 89; i++) {
            var formValues;
            if (i === 30) {
                formValues = formValuesComeFrom;
            } else if (i === 59) {
                formValues = formValuesAdCondition;
            } else if (i === 89) {
                formValues = formValuesOutCondition;
            }

            if (i === 30 || i === 59 || i === 89) {
                for (let j = 0; j < formValues.length; j++) {
                    isFormValid = arrayInputValidation(i, j, "text") && isFormValid;
                    isFormValid = arrayInputValidation(i, j, "number") && isFormValid;
                }
            } else {
                var inputElement = (document.getElementById("inputs" + i)?.childNodes[0] as HTMLInputElement);
                isFormValid = isValid(inputElement) && isFormValid;
            }
        }

        return isFormValid;
    }

    function checkSideBar() {
        const listGroup = document.getElementsByClassName("list-group-item");
        let num = 1;
        for (let i = 0; i < listGroup.length; i++) {
            var section = elements[i];

            var isSectionValid = true;
            for (let j = 1; j <= section.section_fields.length; j++, num++) {
                var formValues;
                if (num === 30) {
                    formValues = formValuesComeFrom;
                } else if (num === 59) {
                    formValues = formValuesAdCondition;
                } else if (num === 89) {
                    formValues = formValuesOutCondition;
                }

                if (num === 30 || num === 59 || num === 89) {
                    var inputGroup = (document.getElementById("inputs" + num) as HTMLElement);
                    for (let k = 0; k < formValues.length; k++) {
                        var textInput = (inputGroup.childNodes[k].childNodes[0].childNodes[0] as HTMLInputElement);
                        var valueInput = (inputGroup.childNodes[k].childNodes[1].childNodes[0] as HTMLInputElement);
                        if (textInput.classList.contains("is-invalid") || valueInput.classList.contains("is-invalid")) {
                            isSectionValid = false;
                        }
                    }
                } else {
                    var inputElement = (document.getElementById("inputs" + num)?.childNodes[0] as HTMLInputElement);
                    if (inputElement.classList.contains("is-invalid")) {
                        isSectionValid = false;
                    }
                }
            }

            var listElement = listGroup[i];
            if (isSectionValid) {
                if (listElement.childElementCount > 1) {
                    listElement.removeChild(listElement.childNodes[1]);
                }
                console.log("remed");
            } else {
                if (listElement.childElementCount > 1) {
                    listElement.removeChild(listElement.childNodes[1]);
                }
                var alertIcon = document.createElement("div")
                alertIcon.classList.add("bi", "bi-exclamation-circle-fill", "flex-shrink-0", "ms-2");
                listElement.appendChild(alertIcon);
            }
        }
    }

    function removeValidity(inputElement: HTMLInputElement) {
        var errorMessage = (inputElement.nextSibling as HTMLElement);
        inputElement.classList.remove("is-invalid");
        inputElement.classList.remove("is-valid");
        errorMessage.innerHTML = "";
    }

    function makeValidity(inputElement: HTMLInputElement, isVal: boolean, msg: string) {
        var errorMessage = (inputElement.nextSibling as HTMLElement);

        if (isVal) {
            inputElement.classList.remove("is-invalid");
            inputElement.classList.add("is-valid");
            errorMessage.innerHTML = "";
        } else {
            inputElement.classList.remove("is-valid");
            inputElement.classList.add("is-invalid");
            errorMessage.innerHTML = msg;
        }

        checkSideBar();
    }

    function isValid(inputElement: HTMLInputElement) {
        var numberAsText = inputElement.value;
        if (numberAsText == "") {
            makeValidity(inputElement, false, "Must enter a value");
            return false;
        }

        var number = Number(numberAsText);
        if (number < 0) {
            makeValidity(inputElement, false, "Positive numbers only");
            return false;
        }

        if (number % 1 != 0) {
            makeValidity(inputElement, false, "Integers only");
            return false;
        }

        makeValidity(inputElement, true, "");
        return true;
    }

    function inputValidation(num: number) {
        var inputElement = (document.getElementById("inputs" + num)?.childNodes[0] as HTMLInputElement);
        if (!isValid(inputElement)) return;

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

        makeValidity(inputElement, true, "");
    }

    function totalValidation(start: number, a: number, b: number) {
        // check if the entire series in total is all filled out 
        var totalElement = (document.getElementById("inputs" + start)?.childNodes[0] as HTMLInputElement);
        var isSeriesComplete = totalElement.classList.contains("is-valid") || totalElement.classList.contains("is-invalid");
        for (var i = a; i <= b; i++) {
            var inputElement = (document.getElementById("inputs" + i)?.childNodes[0] as HTMLInputElement);
            isSeriesComplete = (inputElement.classList.contains("is-valid") || inputElement.classList.contains("is-invalid")) && isSeriesComplete;
        }
        if (!isSeriesComplete) return;

        // calculated total vs total2
        var totalElement = (document.getElementById("inputs" + start)?.childNodes[0] as HTMLInputElement);
        var total = Number(totalElement.value);
        var isSeriesValid = isValid(totalElement);

        var total2 = 0;
        for (var i = a; i <= b; i++) {
            var inputElement = (document.getElementById("inputs" + i)?.childNodes[0] as HTMLInputElement);
            total2 += Number(inputElement.value);
            isSeriesValid = isValid(inputElement) && isSeriesValid;
        }

        if (isSeriesValid) {
            if (total !== total2) {
                makeValidity(totalElement, false, "Does not add up to total");
                for (var i = a; i <= b; i++) {
                    var inputElement = (document.getElementById("inputs" + i)?.childNodes[0] as HTMLInputElement);
                    makeValidity(inputElement, false, "");
                }
            } else {
                makeValidity(totalElement, true, "");
                for (var i = a; i <= b; i++) {
                    var inputElement = (document.getElementById("inputs" + i)?.childNodes[0] as HTMLInputElement);
                    makeValidity(inputElement, true, "");
                }
            }
        }
    }

    function arrayInputValidation(num: number, idx: number, type: string) {
        var inputGroup = (document.getElementById("inputs" + num) as HTMLElement);

        if (type == "text") {
            var textInput = (inputGroup.childNodes[idx].childNodes[0].childNodes[0] as HTMLInputElement);
            if (textInput.value == "") {
                makeValidity(textInput, false, "Must enter a name");
                return false;
            } else {
                makeValidity(textInput, true, "");
                return true;
            }

        } else if (type == "number") {
            var valueInput = (inputGroup.childNodes[idx].childNodes[1].childNodes[0] as HTMLInputElement);
            if (!isValid(valueInput)) return false;

            if (num === 30 && !arrayTotalValidation(26, 27, 30)) {
                return false;
            }
            if (num === 59 && !arrayTotalValidation(26, 41, 59)) {
                return false;
            }
            if (num === 89 && !arrayTotalValidation(60, 71, 89)) {
                return false;
            }

            makeValidity(valueInput, true, "");
            return true;
        }
    }

    function arrayTotalValidation(start: number, a: number, b: number) {
        // check if the entire series in total is all filled out 
        var totalElement = (document.getElementById("inputs" + start)?.childNodes[0] as HTMLInputElement);
        var isSeriesComplete = totalElement.classList.contains("is-valid") || totalElement.classList.contains("is-invalid");
        for (var i = a; i <= b - 1; i++) {
            var inputElement = (document.getElementById("inputs" + i)?.childNodes[0] as HTMLInputElement);
            isSeriesComplete = (inputElement.classList.contains("is-valid") || inputElement.classList.contains("is-invalid")) && isSeriesComplete;
        }
        var arrayElement = document.getElementById("inputs" + b)?.childNodes;
        for (var i = 0; i < arrayElement!.length; i++) {
            var inputElement = (arrayElement![i].childNodes[1].childNodes[0] as HTMLInputElement);
            isSeriesComplete = (inputElement.classList.contains("is-valid") || inputElement.classList.contains("is-invalid")) && isSeriesComplete;
        }
        if (!isSeriesComplete) return false;

        // calculated total vs total2
        var totalElement = (document.getElementById("inputs" + start)?.childNodes[0] as HTMLInputElement);
        var total = Number(totalElement.value);
        var isSeriesValid = isValid(totalElement);

        var total2 = 0;
        for (var i = a; i <= b - 1; i++) {
            var inputElement = (document.getElementById("inputs" + i)?.childNodes[0] as HTMLInputElement);
            total2 += Number(inputElement.value);
            isSeriesValid = isValid(inputElement) && isSeriesValid;
        }
        var arrayElement = document.getElementById("inputs" + b)?.childNodes;
        for (var i = 0; i < arrayElement!.length; i++) {
            var inputElement = (arrayElement![i].childNodes[1].childNodes[0] as HTMLInputElement);
            total2 += Number(inputElement.value);
            isSeriesValid = isValid(inputElement) && isSeriesValid;
        }

        if (isSeriesValid) {
            if (total !== total2) {
                makeValidity(totalElement, false, "");
                for (var i = a; i <= b - 1; i++) {
                    var inputElement = (document.getElementById("inputs" + i)?.childNodes[0] as HTMLInputElement);
                    var errorMsg = i == a ? "Does not add up to total" : "";
                    makeValidity(inputElement, false, errorMsg);
                }
                for (var i = 0; i < arrayElement!.length; i++) {
                    var inputElement = (arrayElement![i].childNodes[1].childNodes[0] as HTMLInputElement);
                    makeValidity(inputElement, false, "");
                }

                return false;
            } else {
                makeValidity(totalElement, true, "");
                for (var i = a; i <= b - 1; i++) {
                    var inputElement = (document.getElementById("inputs" + i)?.childNodes[0] as HTMLInputElement);
                    makeValidity(inputElement, true, "");
                }
                for (var i = 0; i < arrayElement!.length; i++) {
                    var inputElement = (arrayElement![i].childNodes[1].childNodes[0] as HTMLInputElement);
                    makeValidity(inputElement, true, "");
                }

                return true;
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

                <div className="d-flex justify-content-start">
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => {
                        history.push("/Department1NICU");
                    }}>Back</button>
                </div>

                <div className="py-3 text-start">
                    {/* <h2>NICU/Paediatrics Form</h2> */}
                    <span className="lead">Date: </span>
                    <select className="form-select form-select-sm" style={{ width: "auto", display: "inline-block" }}>
                        <option selected>Month</option>
                        <option value="1">January</option>
                        <option value="2">Feburary</option>
                        <option value="3">March</option>
                        <option value="4">April</option>
                        <option value="5">May</option>
                        <option value="6">June</option>
                        <option value="7">July</option>
                        <option value="8">August</option>
                        <option value="9">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                    </select>
                    <select className="form-select form-select-sm" style={{ width: "auto", display: "inline-block" }}>
                        <option selected>Year</option>
                        <option value="2021">2021</option>
                        <option value="2020">2020</option>
                        <option value="2019">2019</option>
                        <option value="2018">2018</option>
                        <option value="2017">2017</option>
                        <option value="2016">2016</option>
                        <option value="2015">2015</option>
                        <option value="2014">2014</option>
                        <option value="2013">2013</option>
                        <option value="2012">2012</option>
                        <option value="2011">2011</option>
                        <option value="2010">2010</option>
                    </select>
                </div>

                <div className="mb-3 text-start sticky-top bg-light">
                    <h4 className="text-primary">Steps: </h4>
                    <ul className="list-group list-group-horizontal">
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
                </div>

                <div className="row g-3">
                    <div className="col-sm-12 col-md-10 col-lg-8 col-xl-7 col-xxl-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="needs-validation">
                            <div className="row g-2">
                                {elements ? elements.map((section: any, idx: any) => {
                                    var ret = [];

                                    // render the section title
                                    ret.push(<h4 id={"section" + idx} className="mb-3 text-primary">{idx + 1}. {section.section_label}</h4>);

                                    var fields = section.section_fields;

                                    // i is the question number
                                    for (let i = fieldCount + 1; i <= fieldCount + fields.length; i++) {
                                        var field = fields[i - fieldCount - 1];

                                        var indentClass = field.field_level === 1 ? " ps-5" : "";

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
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder=""
                                                            {...register(field.field_id)}
                                                            onBlur={() => inputValidation(i)}
                                                        />
                                                        <div className="invalid-feedback">
                                                            {t("departmentFormRequiresValidNumber")}
                                                        </div>
                                                    </div>
                                                </>
                                            );

                                        } else if (field.field_type === "array") {
                                            var formValues;
                                            if (i === 30) {
                                                formValues = formValuesComeFrom;
                                            } else if (i === 59) {
                                                formValues = formValuesAdCondition;
                                            } else if (i === 89) {
                                                formValues = formValuesOutCondition;
                                            }

                                            ret.push(
                                                <>
                                                    <div id={"input" + i} className={"" + indentClass}>
                                                        <span className="me-2">{i}. {field.field_label}</span>
                                                        <button type="button" className="btn btn-success btn-sm" onClick={() => addFormFields(i)}>Add</button>
                                                    </div>

                                                    <div id={"inputs" + i}>
                                                        {formValues.map((element, j) => (
                                                            <div className={"row g-2 mb-1 align-items-center" + indentClass}>
                                                                <div className="col-sm-7">
                                                                    <input className="form-control" type="text"
                                                                        value={element.name || ""}
                                                                        placeholder="Name"
                                                                        onChange={e => handleChange(i, j, e, 0)}
                                                                        onBlur={() => arrayInputValidation(i, j, "text")}
                                                                    />
                                                                    <div className="invalid-feedback text-end">
                                                                        Requires a valid number
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-3">
                                                                    <input className="form-control" type="text"
                                                                        value={element.value || ""}
                                                                        placeholder="#"
                                                                        onChange={e => handleChange(i, j, e, 1)}
                                                                        onBlur={() => arrayInputValidation(i, j, "number")}
                                                                    />
                                                                    <div className="invalid-feedback text-end">
                                                                        Requires a valid number
                                                                    </div>
                                                                </div>

                                                                <div className="col-sm-2 d-grid">
                                                                    <button type="button" className="btn btn-danger btn-sm" onClick={() => removeFormFields(i, j)}>Remove</button>
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
                                }) : null}

                                <hr className="my-4"></hr>
                            </div>
                        </form>

                        <div className="btn-group d-flex mb-2">
                            <button className="w-100 btn btn-secondary btn-sm" onClick={clickedPrev} disabled={sectionState === 0 ? true : false}>Previous</button>
                            <button className="w-100 btn btn-secondary btn-sm" onClick={clickedNext} disabled={sectionState === 2 ? true : false}>Next</button>
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

            <footer className="my-5 pt-5 text-muted text-center text-small">

            </footer>
        </div>
    )
}

export default DynamicForm;
