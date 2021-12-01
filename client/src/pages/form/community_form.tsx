import { useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import SideBar from "../../components/side_bar/side_bar";
import Header from 'components/header/header';
import communityModel from './models/communityModel.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import './nicu_form_styles.css'
import { spawn } from 'child_process';
import { render } from '@testing-library/react';



function CommunityForm() {
    const { register, handleSubmit, reset, } = useForm({});
    const [formModel, setFormModel] = useState({});
    const [sectionState, setSectionState] = useState(0);


    const history = useHistory();

    useEffect(() => {
        const getData = async () => {
            await setFormModel(communityModel);
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


    const onSubmit = async (data: any) => {
        console.log(data);
        // var valid = submitValidation();

        // if (valid === true) {

        //     data.departmentId = 1;
        //     data.admissions.comeFrom.otherDepartments = formValuesComeFrom;
        //     data.admissions.mainCondition.otherMedical = formValuesAdCondition;
        //     data.numberOfOutPatients.mainCondition.otherMedical = formValuesOutCondition;
        //     await axios.post('/api/report/add', data).then(res => {
        //         console.log(res.data);
        //     }).catch(error => {
        //         console.error('Something went wrong!', error.response);
        //     });

        //     //console.log(data);
        //     history.push("/Department1NICU");
        // } else {
        //     console.log(valid);
        //     alert("Some fields contain invalid values");
        //     window.scrollTo(0, 0);
        // }

    }

    const clickPrevious = () => {
        sidePanelClick(sectionState - 1);
        window.scrollTo(0, 0);
    }

    const clickNext = () => {
        sidePanelClick(sectionState + 1);
        window.scrollTo(0, 0);
    }



    const sidePanelClick = (index: any) => {
        fixVaccination();

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
            for (let j = 1; j <= sections[i].section_fields.length; j++, startj++) {
                if (document.getElementById("subsection" + startj)) document.getElementById("subsection" + startj)!.style.display = show;
                if (document.getElementById("input" + startj)) document.getElementById("input" + startj)!.style.display = show;
                if (document.getElementById("inputs" + startj)) document.getElementById("inputs" + startj)!.style.display = show;
            }
        }
    }

    const getRowLabel = (label: String) => {
        if (label === undefined) {
            return;
        } else {
            var newLabel = label.replaceAll("(DOT)", ".");
            return newLabel;
        }
    }

    function fixVaccination() {
        var tdElement = document.getElementById("tables" + "8" + "1" + "13") as HTMLTableCellElement;
        if (tdElement) {
            tdElement.rowSpan = 4;
            (tdElement.nextSibling as HTMLTableCellElement).rowSpan = 4;
        }
        tdElement = document.getElementById("tables" + "8" + "2" + "13") as HTMLTableCellElement;
        if (tdElement) {
            (tdElement.nextSibling as HTMLTableCellElement).remove();
            tdElement.remove();
        }
        tdElement = document.getElementById("tables" + "8" + "3" + "13") as HTMLTableCellElement;
        if (tdElement) {
            (tdElement.nextSibling as HTMLTableCellElement).remove();
            tdElement.remove();
        }
        tdElement = document.getElementById("tables" + "8" + "4" + "13") as HTMLTableCellElement;
        if (tdElement) {
            (tdElement.nextSibling as HTMLTableCellElement).remove();
            tdElement.remove();
        }


        tdElement = document.getElementById("tables" + "8" + "6" + "13") as HTMLTableCellElement;
        if (tdElement) {
            tdElement.rowSpan = 3;
            (tdElement.nextSibling as HTMLTableCellElement).rowSpan = 3;
        }
        tdElement = document.getElementById("tables" + "8" + "7" + "13") as HTMLTableCellElement;
        if (tdElement) {
            (tdElement.nextSibling as HTMLTableCellElement).remove();
            tdElement.remove();
        }
        tdElement = document.getElementById("tables" + "8" + "8" + "13") as HTMLTableCellElement;
        if (tdElement) {
            (tdElement.nextSibling as HTMLTableCellElement).remove();
            tdElement.remove();
        }

        tdElement = document.getElementById("tables" + "8" + "10" + "13") as HTMLTableCellElement;
        if (tdElement) {
            tdElement.rowSpan = 2;
            (tdElement.nextSibling as HTMLTableCellElement).rowSpan = 2;
        }
        tdElement = document.getElementById("tables" + "8" + "11" + "13") as HTMLTableCellElement;
        if (tdElement) {
            (tdElement.nextSibling as HTMLTableCellElement).remove();
            tdElement.remove();
        }

        tdElement = document.getElementById("tables" + "8" + "13" + "13") as HTMLTableCellElement;
        if (tdElement) {
            tdElement.rowSpan = 3;
            (tdElement.nextSibling as HTMLTableCellElement).rowSpan = 3;
        }
        tdElement = document.getElementById("tables" + "8" + "14" + "13") as HTMLTableCellElement;
        if (tdElement) {
            (tdElement.nextSibling as HTMLTableCellElement).remove();
            tdElement.remove();
        }
        tdElement = document.getElementById("tables" + "8" + "15" + "13") as HTMLTableCellElement;
        if (tdElement) {
            (tdElement.nextSibling as HTMLTableCellElement).remove();
            tdElement.remove();
        }

        tdElement = document.getElementById("tables" + "9" + "0" + "3") as HTMLTableCellElement;
        if (tdElement) {
            tdElement.rowSpan = 2;
            (tdElement.nextSibling as HTMLTableCellElement).rowSpan = 2;
        }
        tdElement = document.getElementById("tables" + "9" + "1" + "3") as HTMLTableCellElement;
        if (tdElement) {
            (tdElement.nextSibling as HTMLTableCellElement).remove();
            tdElement.remove();
        }
    }










    //
    // VALIDATION FUNCTIONS
    // 

    function submitValidation() {
        var isFormValid = true;

        for (let i = 1; i <= fields.length; i++) {

            var field = fields[i - 1];
            console.log(i, field.field_type);
            if (field.field_type === "table") {
                for (var idx = 0; idx < field.total_rows; idx++) {
                    for (var jdx = 0; jdx < field.total_cols; jdx++) {
                        if (field.invalid_inputs[idx][jdx] == 0) {
                            var inputElement = (document.getElementById("tables" + i + idx + jdx)?.childNodes[0] as HTMLInputElement);
                            isFormValid = isValid(inputElement) && isFormValid;
                        }
                    }
                }
            }
        }

        return isFormValid;
    }

    function checkSideBar() {
        // const listGroup = document.getElementsByClassName("list-group-item");
        // let num = 1;
        // for (let i = 0; i < listGroup.length; i++) {
        //     var section = sections[i];

        //     var isSectionValid = true;
        //     for (let j = 1; j <= section.section_fields.length; j++, num++) {
        //         var formValues = formValuesComeFrom;

        //         if (num === 22) {
        //             var inputGroup = (document.getElementById("inputs" + num) as HTMLElement);
        //             for (let k = 0; k < formValues.length; k++) {
        //                 var textInput = (inputGroup.childNodes[k].childNodes[0].childNodes[0] as HTMLInputElement);
        //                 var valueInput = (inputGroup.childNodes[k].childNodes[1].childNodes[0] as HTMLInputElement);
        //                 if (textInput.classList.contains("is-invalid") || valueInput.classList.contains("is-invalid")) {
        //                     isSectionValid = false;
        //                 }
        //             }
        //         } else {
        //             var inputElement = (document.getElementById("inputs" + num)?.childNodes[0] as HTMLInputElement);
        //             if (inputElement.classList.contains("is-invalid")) {
        //                 isSectionValid = false;
        //             }
        //         }
        //     }

        //     var listElement = listGroup[i];
        //     if (isSectionValid) {
        //         if (listElement.childElementCount > 1) {
        //             listElement.removeChild(listElement.childNodes[1]);
        //         }
        //     } else {
        //         if (listElement.childElementCount > 1) {
        //             listElement.removeChild(listElement.childNodes[1]);
        //         }
        //         var alertIcon = document.createElement("div")
        //         alertIcon.classList.add("bi", "bi-exclamation-circle-fill", "flex-shrink-0", "ms-2");
        //         listElement.appendChild(alertIcon);
        //     }
        // }
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

    function tableInputValidation(num: number, idx: number, jdx: number) {
        //console.log(num, idx, jdx);
        var inputElement = (document.getElementById("tables" + num + idx + jdx)?.childNodes[0] as HTMLInputElement);
        if (!isValid(inputElement)) return;

        // Support for wife and mother
        if (num === 8) {
            for (var i = 0; i < 3; i++) {
                var rowTotal = 0;
                for (var j = 0; j < 5; j++) {
                    inputElement = (document.getElementById("tables" + num + i + j)?.childNodes[0] as HTMLInputElement);
                    rowTotal += Number(inputElement.value);
                }

                var totalElement = document.getElementById("tables" + num + i + 5);
                totalElement.innerHTML = String(rowTotal);
            }

            for (var j = 0; j < 5; j++) {
                var colTotal = 0;
                for (var i = 0; i < 3; i++) {
                    inputElement = (document.getElementById("tables" + num + i + j)?.childNodes[0] as HTMLInputElement);
                    colTotal += Number(inputElement.value);
                }

                var totalElement = document.getElementById("tables" + num + 3 + j);
                totalElement.innerHTML = String(colTotal);
            }

            var rowTotal = 0;
            for (var j = 0; j < 5; j++) {
                var element = document.getElementById("tables" + num + 3 + j);
                rowTotal += Number(element.innerHTML);
            }

            var totalElement = document.getElementById("tables" + num + 3 + 5);
            totalElement.innerHTML = String(rowTotal);

            return;
        }

        makeValidity(inputElement, true, "");
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
                        history.push("/Department4ComHealth");
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
                                        onClick={() => { window.scrollTo(0, 0); sidePanelClick(idx); }}>
                                        <span>{idx + 1}. {section.section_label}</span>
                                    </li>
                                </>
                            )
                        }) : null}
                    </ul>
                </div>


                <div className="row g-3">
                    <div className="col-sm-10 col-md-10 col-lg-9">
                        <form onSubmit={handleSubmit(onSubmit)} className="needs-validation">
                            <div className="row g-2">
                                {sections ? sections.map((section: any, idx: any) => {
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
                                                        // onBlur={() => inputValidation(i)}
                                                        />
                                                        <div className="invalid-feedback">
                                                            Requires a valid number
                                                        </div>
                                                    </div>
                                                </>
                                            );

                                        } else if (field.field_type === "table") {

                                            var count = [];
                                            var k = [];
                                            var inputCount = 0;
                                            for (let i = 0; i < field.row_labels.length; i++) {
                                                count.push(0);
                                                k.push(0);
                                            }
                                            ret.push(
                                                <>
                                                    <div id={"inputs" + i}>
                                                        <table className="table table-bordered table-sm">
                                                            <tbody>
                                                                {/* COLUMNS */}

                                                                {field.col_labels.map((row, coli) => (
                                                                    <tr>
                                                                        {field.row_labels.map((x, y) => (
                                                                            <td></td>
                                                                        ))}

                                                                        {row.map((col, colj) => (
                                                                            <th className="text-center" colSpan={field.col_spans[coli][colj]} scope="colgroup">{field.col_labels[coli][colj]}</th>
                                                                        ))}
                                                                    </tr>
                                                                ))}


                                                                {/* ROWS */}
                                                                {[...Array(field.total_rows)].map((e, idx) => (
                                                                    <tr>
                                                                        {[...Array(field.row_labels.length)].map((e, j) => {
                                                                            if (count[j] === 0) {
                                                                                const rowLabel = getRowLabel(field.row_labels[j][k[j]]);
                                                                                const header = <th className="align-middle" rowSpan={field.row_spans[j][k[j]]}>{rowLabel}</th>
                                                                                count[j]++;

                                                                                if (count[j] === field.row_spans[j][k[j]]) {
                                                                                    k[j]++;
                                                                                    count[j] = 0;
                                                                                }

                                                                                return header;
                                                                            } else {
                                                                                count[j]++;

                                                                                if (count[j] === field.row_spans[j][k[j]]) {
                                                                                    k[j]++;
                                                                                    count[j] = 0;
                                                                                }
                                                                                return;
                                                                            }
                                                                        })}

                                                                        {/* ENTRIES */}

                                                                        {[...Array(field.total_cols)].map((e, j) => {
                                                                            var rowLength = field.row_labels.length - 1;
                                                                            var colLength = field.col_labels.length - 1;
                                                                            if (field.invalid_inputs[inputCount][j] === 1) {
                                                                                if ((j + 1) % field.total_cols === 0) {
                                                                                    inputCount++;
                                                                                }
                                                                                return <td id={"tables" + i + idx + j} className="text-center"></td>
                                                                            } else {
                                                                                const dataInput = (
                                                                                    <td id={"tables" + i + idx + j} className="align-middle">
                                                                                        <input className="form-control" type="text"
                                                                                            {...register(field.subsection_label + "." + field.row_labels[rowLength][inputCount] + "." + field.col_labels[colLength][j])}
                                                                                            onBlur={() => tableInputValidation(i, idx, j)}
                                                                                        />
                                                                                        <div className="invalid-feedback text-end">
                                                                                            Requires a valid number
                                                                                        </div>
                                                                                    </td>
                                                                                );
                                                                                if ((j + 1) % field.total_cols === 0) {
                                                                                    inputCount++;
                                                                                }
                                                                                return dataInput;
                                                                            }

                                                                        })}
                                                                    </tr>

                                                                ))}
                                                            </tbody>
                                                        </table>
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

export default CommunityForm;
