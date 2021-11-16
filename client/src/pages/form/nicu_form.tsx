import { useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import SideBar from "../../components/side_bar/side_bar";
import Header from 'components/header/header';
import nicuJSON from './models/nicuModel.json';
import './nicu_form_styles.css'
import { text } from 'stream/consumers';



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

    const removeFormFields = (ID: any, i: number) => {
        let newFormValues;
        if (ID === 30) {
            newFormValues = [...formValuesComeFrom];
            newFormValues.splice(i, 1);
            setFormValuesComeFrom(newFormValues)
        } else if (ID === 59) {
            newFormValues = [...formValuesAdCondition];
            newFormValues.splice(i, 1);
            setFormValuesAdCondition(newFormValues)
        } else if (ID === 89) {
            newFormValues = [...formValuesOutCondition];
            newFormValues.splice(i, 1);
            setFormValuesOutCondition(newFormValues)
        }

        if (i < newFormValues.length) {
            var textInput = (document.getElementById("inputs" + ID).childNodes[i].childNodes[0].childNodes[0] as HTMLInputElement);
            var valueInput = (document.getElementById("inputs" + ID).childNodes[i].childNodes[1].childNodes[0] as HTMLInputElement);
            removeValidity(textInput);
            removeValidity(valueInput);
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

    //
    // VALIDATION FUNCTIONS
    // 
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

    function isSeriesComplete(start: number, a: number, b: number) {
        var totalElement = (document.getElementById("inputs" + start)?.childNodes[0] as HTMLInputElement);
        var isSeriesComplete = totalElement.classList.contains("is-valid") || totalElement.classList.contains("is-invalid");

        for (var i = a; i <= b; i++) {
            var inputElement = (document.getElementById("inputs" + i)?.childNodes[0] as HTMLInputElement);
            isSeriesComplete = (inputElement.classList.contains("is-valid") || inputElement.classList.contains("is-invalid"))&& isSeriesComplete;
        }

        return isSeriesComplete;
    }

    function totalValidation(start: number, a: number, b: number) {
        if (!isSeriesComplete(start, a, b)) return;

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
            } else {
                makeValidity(textInput, true, "");
            }

        } else if (type == "number") {
            var valueInput = (inputGroup.childNodes[idx].childNodes[1].childNodes[0] as HTMLInputElement);
            if (!isValid(valueInput)) return;

            if (num === 30 && !arrayTotalValidation(26, 27, 30)) {
                return;
            }
            if (num === 59 && !arrayTotalValidation(26, 41, 59)) {
                return;
            }
            if (num === 89 && !arrayTotalValidation(60, 71, 89)) {
                return;
            }

            makeValidity(valueInput, true, "");
        }
    }

    function arrayTotalValidation(start: number, a: number, b: number) {
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
                for (var i = a; i <= b-1; i++) {
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
                for (var i = a; i <= b-1; i++) {
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
                                                            Requires a valid number
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

export default DynamicForm;
