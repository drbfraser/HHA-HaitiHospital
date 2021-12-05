import { useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import SideBar from "../../components/side_bar/side_bar";
import Header from 'components/header/header';
import rehabModel from './models/rehabModel.json';
import 'bootstrap/dist/css/bootstrap.min.css';



function RehabForm() {
    const { register, handleSubmit, reset } = useForm({});
    const [formModel, setFormModel] = useState({});
    const [formValuesComeFrom, setFormValuesComeFrom] = useState<{ name: any; value: any; }[]>([])
    const [sectionState, setSectionState] = useState(0);
    const [patientStateBefore, setPatientStateBefore] = useState(0);
    const [patientStateAfter, setPatientStateAfter] = useState(0);
    const [patientStateDischarge, setPatientStateDischarge] = useState(0);


    const history = useHistory();

    useEffect(() => {
        const getData = async () => {
            await setFormModel(rehabModel);
            setSectionState(0);
        }

        getData();
    }, [])

    useEffect(() => {
        sidePanelClick(sectionState);
    })

    const sections: any = Object.values(formModel);
    const fields = [];
    for (var i = 0; i < sections.length; i++) {
        for (var j = 0; j < sections[i].section_fields.length; j++) {
            fields.push(sections[i].section_fields[j]);
        }
    }

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

        if (submitValidation()) {

            data.departmentId = 0; //Rehab ID
            data.admissions.comeFrom.otherDepartments = formValuesComeFrom;
            data.descriptions = addFormDescriptions(fields);
            console.log(data);
            await axios.post('/api/report/add', data).then(res => {
                console.log(res.data);
            }).catch(error => {
                console.error('Something went wrong!', error.response);
            });

            reset({});
            history.push("/Department3Rehab");
        } else {
            alert("Some fields contain invalid values");
            window.scrollTo(0, 0);
        }

    }

    const handleListInput = (field: any, event: any, index: any) => {
        switch (index) {
            case 5:
                setPatientStateDischarge(event.target.value);
                break;
            case 6:
                setPatientStateBefore(event.target.value);
                break;
            case 7:
                setPatientStateAfter(event.target.value);
                break;
            default:
        }

    }


    const renderList = (state: any, field: any, fieldIndex) => {
        if (state > 0) {
            return (
                <div className="form-group" id={"list" + fieldIndex}>
                    <div className="row g-2 pb-2">
                        <div className="col-sm-10 ps-5" id={"selectList" + fieldIndex}>
                            <span className="pe-2">Patient</span>
                            <select className="form-select-sm" aria-label=".form-select-sm" onChange={(e) => selectList(e.target.value, state, field)}>
                                <option selected>Select Patient</option>

                                {[...Array(Number(state))].map((e, i) => (
                                    <option>{i + 1}</option>
                                ))}
                            </select>
                            <div className="invalid-feedback">
                                One or more fields are invalid
                            </div>
                        </div>
                    </div>


                    <div>
                        {[...Array(Number(state))].map((e, i) => (
                            <div className="row g-2" id={field.field_id + "patient" + (i + 1)} style={{ display: "none" }}>

                                {field.field_template.map((item: any, j) => (
                                    item.field_type === "select" ?
                                        <>
                                            <div className={item.field_level === 1 ? "col-sm-8 ps-5" : "col-sm-10"}>
                                                <span className="align-middle">{item.field_label}</span>
                                            </div>
                                            <div id={"ListInputs" + fieldIndex + i + j} className="col-sm-4">
                                                <select className="form-select"
                                                    {...register(item.field_parent + ".patients.patient" + (i + 1) + "." + item.field_id)}
                                                    onBlur={() => listInputValidation(i, j, item.field_type, fieldIndex)}
                                                >
                                                    <option selected>Select option</option>
                                                    {item.field_options.map((opt) => (
                                                        <option>{opt}</option>
                                                    ))}

                                                </select>
                                                <div className="invalid-feedback">
                                                    Select an option
                                                </div>
                                            </div>
                                        </>
                                        :
                                        <>
                                            <div className={item.field_level === 1 ? "col-sm-10 ps-5" : "col-sm-10"}>
                                                <span className="align-middle">{item.field_label}</span>
                                            </div>
                                            <div id={"ListInputs" + fieldIndex + i + j} className="col-sm-2">
                                                <input type="text" className="form-control"
                                                    {...register(item.field_parent + ".patients.patient" + (i + 1) + "." + item.field_id)}
                                                    onBlur={() => listInputValidation(i, j, item.field_type, fieldIndex)}
                                                />
                                                <div className="invalid-feedback">
                                                    Requires a valid number
                                                </div>
                                            </div>
                                        </>

                                ))}

                            </div>
                        ))}

                    </div>
                </div>
            )
        }

    }

    const selectList = (value: any, state: any, field: any) => {
        for (let i = 1; i <= state; i++) {
            if (Number(i) === Number(value)) {
                document.getElementById(field.field_id + "patient" + i).style.display = "";
            } else {
                document.getElementById(field.field_id + "patient" + i).style.display = "none";
            }
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
        let newFormValuesComeFrom = [...formValuesComeFrom];
        if (j === 0) {
            newFormValuesComeFrom[i].name = e.target.value;
        } else {
            newFormValuesComeFrom[i].value = e.target.value;
        }

        setFormValuesComeFrom(newFormValuesComeFrom);
    }

    const addFormFields = (ID: number) => {
        setFormValuesComeFrom([...formValuesComeFrom, { name: "", value: null }])
    }

    const removeFormFields = (ID: any, idx: number) => {
        var inputGroup = document.getElementById("inputs" + ID).childNodes;

        for (let i = idx; i < inputGroup.length; i++) {
            var textInput1 = (inputGroup[i].childNodes[0].childNodes[0] as HTMLInputElement);
            var valueInput1 = (inputGroup[i].childNodes[1].childNodes[0] as HTMLInputElement);

            if (i === inputGroup.length - 1) {
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
        newFormValues = [...formValuesComeFrom];
        newFormValues.splice(idx, 1);
        setFormValuesComeFrom(newFormValues)
        arrayTotalValidation(28, 29, 32);
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
            for (let j = 1; j <= sections[i].section_fields.length; j++, startj++) {
                if (document.getElementById("subsection" + startj)) document.getElementById("subsection" + startj)!.style.display = show;
                if (document.getElementById("input" + startj)) document.getElementById("input" + startj)!.style.display = show;
                if (document.getElementById("inputs" + startj)) document.getElementById("inputs" + startj)!.style.display = show;
                if (document.getElementById("list" + startj)) document.getElementById("list" + startj)!.style.display = show;
            }
        }
    }



    //
    // VALIDATION FUNCTIONS
    // 

    function submitValidation() {
        var isFormValid = true;

        for (let i = 1; i <= fields.length; i++) {

            var field = fields[i - 1];
            if (field.field_type === "array") {
                var formValues = formValuesComeFrom;
                for (let j = 0; j < formValues.length; j++) {
                    isFormValid = arrayInputValidation(i, j, "text") && isFormValid;
                    isFormValid = arrayInputValidation(i, j, "number") && isFormValid;
                }

            } else if (field.field_type === "number") {
                var inputElement = (document.getElementById("inputs" + i)?.childNodes[0] as HTMLInputElement);
                isFormValid = isValid(inputElement) && isFormValid;

            } else if (field.field_type === "table") {
                for (var idx = 0; idx < field.total_rows; idx++) {
                    for (var jdx = 0; jdx < field.total_cols; jdx++) {
                        if (field.invalid_inputs[idx][jdx] === 0) {
                            inputElement = (document.getElementById("tables" + i + idx + jdx)?.childNodes[0] as HTMLInputElement);
                            isFormValid = isValid(inputElement) && isFormValid;
                        }
                    }
                }

            } else if (field.field_type === "list") {
                var patientState;
                if (i === 5) {
                    patientState = patientStateDischarge;
                } else if (i === 6) {
                    patientState = patientStateBefore;
                } else if (i === 7) {
                    patientState = patientStateAfter;
                }
                inputElement = (document.getElementById("inputs" + i)?.childNodes[0] as HTMLInputElement);
                isFormValid = isValid(inputElement) && isFormValid;
                for (let idx = 0; idx < patientState; idx++) {
                    for (let jdx = 0; jdx < field.field_template.length; jdx++) {
                        inputElement = (document.getElementById("ListInputs" + i + idx + jdx)?.childNodes[0] as HTMLInputElement);
                        isFormValid = listInputValidation(idx, jdx, field.field_template[jdx].field_type, i);
                    }
                }
            }
        }
        return isFormValid;
    }

    function checkSideBar() {
        const listGroup = document.getElementsByClassName("list-group-item");
        let num = 1;
        for (let i = 0; i < listGroup.length; i++) {
            var section = sections[i];

            var isSectionValid = true;
            for (let j = 1; j <= section.section_fields.length; j++, num++) {
                var formValues = formValuesComeFrom;

                if (num === 32) {
                    var inputGroup = (document.getElementById("inputs" + num) as HTMLElement);
                    for (let k = 0; k < formValues.length; k++) {
                        var textInput = (inputGroup.childNodes[k].childNodes[0].childNodes[0] as HTMLInputElement);
                        var valueInput = (inputGroup.childNodes[k].childNodes[1].childNodes[0] as HTMLInputElement);
                        if (textInput.classList.contains("is-invalid") || valueInput.classList.contains("is-invalid")) {
                            isSectionValid = false;
                        }
                    }
                } else if (num === 5) {
                    if (document.getElementById("selectList" + num) !== null) {
                        var selectList = document.getElementById("selectList" + num)?.childNodes[1] as HTMLInputElement
                        if (selectList.classList.contains("is-invalid")) {
                            isSectionValid = false;
                        }
                    }
                } else if(num === 6){
                    if (document.getElementById("selectList" + num) !== null) {
                        var selectList = document.getElementById("selectList" + num)?.childNodes[1] as HTMLInputElement
                        if (selectList.classList.contains("is-invalid")) {
                            isSectionValid = false;
                        }
                    }
                } else if(num === 7){
                    if (document.getElementById("selectList" + num) !== null) {
                        var selectList = document.getElementById("selectList" + num)?.childNodes[1] as HTMLInputElement
                        if (selectList.classList.contains("is-invalid")) {
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
        if (numberAsText === "") {
            makeValidity(inputElement, false, "Must enter a value");
            return false;
        }

        var number = Number(numberAsText);
        if (number < 0) {
            makeValidity(inputElement, false, "Positive numbers only");
            return false;
        }

        if (number % 1 !== 0) {
            makeValidity(inputElement, false, "Integers only");
            return false;
        }

        makeValidity(inputElement, true, "");
        return true;
    }

    function listInputValidation(i, j, type, fieldIndex) {
        var inputElement = (document.getElementById("ListInputs" + fieldIndex + i + j)?.childNodes[0] as HTMLInputElement);
        var selectList = document.getElementById("selectList" + fieldIndex)?.childNodes[1] as HTMLInputElement
        if (type === "number") {
            if (!isValid(inputElement)) {
                makeValidity(selectList, false, "One or more fields are invalid");
                return false;
            }
        } else if (type === "text") {
            if (inputElement.value === "") {
                makeValidity(inputElement, false, "Must enter field");
                makeValidity(selectList, false, "One or more fields are invalid");
                return false;
            }
        } else if (type === "select") {
            if (inputElement.value === "Select option") {
                makeValidity(inputElement, false, "Must select option");
                makeValidity(selectList, false, "One or more fields are invalid");
                return false;
            }

        } 
       
        makeValidity(selectList, true, "");
        makeValidity(inputElement, true, "");
        
        return true;


    }  


    function inputValidation(num: number) {
        var inputElement = (document.getElementById("inputs" + num)?.childNodes[0] as HTMLInputElement);
        if (!isValid(inputElement)) return;

        // Total number of self-discharged patients
        if (num === 11 || (num >= 12 && num <= 16)) {
            totalValidation(11, 12, 16);
            return;
        }

        // Number of patients that stayed in ward
        if (num >= 17 && num <= 27) {
            totalValidation(17, 18, 21);
            totalValidation(17, 22, 27);
            return;
        }

        // Total Admissions
        if (num >= 28 && num <= 48) {
            arrayTotalValidation(28, 29, 32);
            totalValidation(28, 33, 41);
            totalValidation(28, 42, 48);
            return;
        }

        // Number of Outpatients
        if (num >= 49 && num <= 58) {
            totalValidation(49, 50, 56);
            totalValidation(49, 57, 58);
            return;
        }

        // Returning outpatients
        if (num >= 59 && num <= 66) {
            totalValidation(59, 60, 66);
            return;
        }

        // New outpatiens initial evaluation
        if (num >= 67 && num <= 87) {
            totalValidation(67, 68, 78);
            totalValidation(67, 79, 85);
            totalValidation(67, 86, 87);
            return;
        }

        makeValidity(inputElement, true, "");
    }

    function totalValidation(start: number, a: number, b: number) {
        // check if the entire series in total is all filled out 
        var totalElement = (document.getElementById("inputs" + start)?.childNodes[0] as HTMLInputElement);
        var isSeriesComplete = totalElement.classList.contains("is-valid") || totalElement.classList.contains("is-invalid");
        for (let i = a; i <= b; i++) {
            var inputElement = (document.getElementById("inputs" + i)?.childNodes[0] as HTMLInputElement);
            isSeriesComplete = (inputElement.classList.contains("is-valid") || inputElement.classList.contains("is-invalid")) && isSeriesComplete;
        }
        if (!isSeriesComplete) return;

        // calculated total vs total2
        totalElement = (document.getElementById("inputs" + start)?.childNodes[0] as HTMLInputElement);
        var total = Number(totalElement.value);
        var isSeriesValid = isValid(totalElement);

        var total2 = 0;
        for (let i = a; i <= b; i++) {
            inputElement = (document.getElementById("inputs" + i)?.childNodes[0] as HTMLInputElement);
            total2 += Number(inputElement.value);
            isSeriesValid = isValid(inputElement) && isSeriesValid;
        }

        if (isSeriesValid) {
            if (total !== total2) {
                makeValidity(totalElement, false, "Does not add up to total");
                for (let i = a; i <= b; i++) {
                    inputElement = (document.getElementById("inputs" + i)?.childNodes[0] as HTMLInputElement);
                    makeValidity(inputElement, false, "");
                }
            } else {
                makeValidity(totalElement, true, "");
                for (let i = a; i <= b; i++) {
                    inputElement = (document.getElementById("inputs" + i)?.childNodes[0] as HTMLInputElement);
                    makeValidity(inputElement, true, "");
                }
            }
        }
    }

    function arrayInputValidation(num: number, idx: number, type: string) {
        var inputGroup = (document.getElementById("inputs" + num) as HTMLElement);

        if (type === "text") {
            var textInput = (inputGroup.childNodes[idx].childNodes[0].childNodes[0] as HTMLInputElement);
            if (textInput.value === "") {
                makeValidity(textInput, false, "Must enter a name");
                return false;
            } else {
                makeValidity(textInput, true, "");
                return true;
            }

        } else if (type === "number") {
            var valueInput = (inputGroup.childNodes[idx].childNodes[1].childNodes[0] as HTMLInputElement);
            if (!isValid(valueInput)) return false;

            if (num === 32 && !arrayTotalValidation(28, 29, 32)) {
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
        for (let i = a; i <= b - 1; i++) {
            var inputElement = (document.getElementById("inputs" + i)?.childNodes[0] as HTMLInputElement);
            isSeriesComplete = (inputElement.classList.contains("is-valid") || inputElement.classList.contains("is-invalid")) && isSeriesComplete;
        }
        var arrayElement = document.getElementById("inputs" + b)?.childNodes;
        for (let i = 0; i < arrayElement!.length; i++) {
            inputElement = (arrayElement![i].childNodes[1].childNodes[0] as HTMLInputElement);
            isSeriesComplete = (inputElement.classList.contains("is-valid") || inputElement.classList.contains("is-invalid")) && isSeriesComplete;
        }
        if (!isSeriesComplete) return false;

        // calculated total vs total2
        totalElement = (document.getElementById("inputs" + start)?.childNodes[0] as HTMLInputElement);
        var total = Number(totalElement.value);
        var isSeriesValid = isValid(totalElement);

        var total2 = 0;
        for (let i = a; i <= b - 1; i++) {
            inputElement = (document.getElementById("inputs" + i)?.childNodes[0] as HTMLInputElement);
            total2 += Number(inputElement.value);
            isSeriesValid = isValid(inputElement) && isSeriesValid;
        }
        arrayElement = document.getElementById("inputs" + b)?.childNodes;
        for (let i = 0; i < arrayElement!.length; i++) {
            inputElement = (arrayElement![i].childNodes[1].childNodes[0] as HTMLInputElement);
            total2 += Number(inputElement.value);
            isSeriesValid = isValid(inputElement) && isSeriesValid;
        }

        if (isSeriesValid) {
            if (total !== total2) {
                makeValidity(totalElement, false, "");
                for (let i = a; i <= b - 1; i++) {
                    inputElement = (document.getElementById("inputs" + i)?.childNodes[0] as HTMLInputElement);
                    var errorMsg = i === a ? "Does not add up to total" : "";
                    makeValidity(inputElement, false, errorMsg);
                }
                for (let i = 0; i < arrayElement!.length; i++) {
                    inputElement = (arrayElement![i].childNodes[1].childNodes[0] as HTMLInputElement);
                    makeValidity(inputElement, false, "");
                }

                return false;
            } else {
                makeValidity(totalElement, true, "");
                for (let i = a; i <= b - 1; i++) {
                    inputElement = (document.getElementById("inputs" + i)?.childNodes[0] as HTMLInputElement);
                    makeValidity(inputElement, true, "");
                }
                for (let i = 0; i < arrayElement!.length; i++) {
                    inputElement = (arrayElement![i].childNodes[1].childNodes[0] as HTMLInputElement);
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
                        {sections ? sections.map((section: any, idx: any) => {
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
                                {sections ? sections.map((section: any, idx: any) => {
                                    var ret = [];

                                    // render the section title
                                    ret.push(<h4 id={"section" + idx} className="mb-3">{idx + 1}. {section.section_label}</h4>);

                                    var fields = section.section_fields;

                                    // i is the question number
                                    for (let i = fieldCount + 1; i <= fieldCount + fields.length; i++) {
                                        let field = fields[i - fieldCount - 1];

                                        let indentClass = field.field_level === 1 ? " ps-5" : "";

                                        // render the subsection title
                                        if (field.subsection_label) {
                                            ret.push(<h6 id={"subsection" + i} className={"fw-bold" + indentClass}>{field.subsection_label}</h6>)
                                        }

                                        // render each entry
                                        if (field.field_type === "number") {
                                            ret.push(
                                                <>
                                                    <div id={"input" + i} className={"col-sm-10" + indentClass}>
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
                                            }
                                            ret.push(
                                                <>
                                                    <div id={"input" + i} className={"" + indentClass}>
                                                        <span className="align-middle me-2">{i}. {field.field_label}</span>
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

                                        } else if (field.field_type === "list") {
                                            var patientState;
                                            if (i === 5) {
                                                patientState = patientStateDischarge;
                                            } else if (i === 6) {
                                                patientState = patientStateBefore;
                                            } else if (i === 7) {
                                                patientState = patientStateAfter;
                                            }

                                            ret.push(
                                                <>
                                                    <div id={"input" + i} className={field.field_level === 1 ? "col-sm-10 ps-5" : "col-sm-10"}>
                                                        <span className="align-middle">{i}. {field.field_label}</span>
                                                    </div>
                                                    <div id={"inputs" + i} className="col-sm-2">
                                                        <input type="text" className="form-control" placeholder=""
                                                            {...register(field.field_id)}
                                                            onBlur={() => inputValidation(i)}
                                                            onChange={(event) => handleListInput(field, event, i)}
                                                        />
                                                        <div className="invalid-feedback">
                                                            Requires a valid number
                                                        </div>
                                                    </div>

                                                    {renderList(patientState, field, i)}
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

            <footer className="my-5 pt-5 text-muted text-center text-small">

            </footer>

        </div>
    )
}

export default RehabForm;
