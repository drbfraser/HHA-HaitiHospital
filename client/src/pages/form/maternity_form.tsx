import { useFieldArray, useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import SideBar from "../../components/side_bar/side_bar";
import Header from 'components/header/header';
import maternityModel from './models/maternityModel.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import { spawn } from 'child_process';
import { render } from '@testing-library/react';
import { text } from 'node:stream/consumers';



function MaternityForm() {
    const { register, handleSubmit } = useForm({});
    const [formModel, setFormModel] = useState({});
    const [formValuesComeFrom, setFormValuesComeFrom] = useState<{ name: any; value: any; }[]>([])
    const [sectionState, setSectionState] = useState(0);
    const [patientStateBefore, setPatientStateBefore] = useState(0);
    const [patientStateAfter, setPatientStateAfter] = useState(0);


    const history = useHistory();

    useEffect(() => {
        const getData = async () => {
            await setFormModel(maternityModel);
            setSectionState(0);
        }

        getData();
    }, [])

    useEffect(() => {
        sidePanelClick(sectionState);
    })

    const elements: any = Object.values(formModel);

    function refreshPage() {
        window.location.reload();
    }

    const onSubmit = async (data: any) => {
        data.admissions.comeFrom.otherDepartments = formValuesComeFrom;
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

    const handleListInput = (field: any, event: any, index: any) => {
        switch (index) {
            case 6:
                setPatientStateBefore(event.target.value);
                break;
            case 7:
                setPatientStateAfter(event.target.value);
                break;
            default:
        }

    }


    const renderList = (state: any, field: any) => {
        if (state > 0) {
            return (
                <div className="form-group">
                    <div className="row g-2 pb-2">
                        <div className="col-sm-10 ps-5">
                            <span className="pe-2">Patient</span>
                            <select className="form-select-sm" aria-label=".form-select-sm" onChange={(e) => selectList(e.target.value, state, field)}>
                                <option selected>Select Patient</option>

                                {[...Array(Number(state))].map((e, i) => (
                                    <option>{i + 1}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        {[...Array(Number(state))].map((e, i) => (
                            <div className="row g-2" id={field.field_id + "patient" + (i + 1)} style={{ display: "none" }}>

                                {field.field_template.map((item: any) => (
                                    <>
                                        <div className={item.field_level === 1 ? "col-sm-10 ps-5" : "col-sm-10"}>
                                            <span className="align-middle">{item.field_label}</span>
                                        </div>
                                        <div id={"ListInputs" + i} className="col-sm-2">
                                            <input type="text" className="form-control"
                                                {...register(item.field_parent + ".patient" + (i+1) + "." + item.field_id)}
                                            // onBlur={() => inputValidation(i)}
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
            console.log(value);
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
        console.log(ID);
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

            default:

        }

    }

    const addFormFields = (ID: number) => {
        setFormValuesComeFrom([...formValuesComeFrom, { name: "", value: null }])
    }

    const removeFormFields = (ID: any, i: number) => {

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

    const getRowLabel = (label: String) => {
        if(label === undefined){
            return;
        }else{
            var newLabel = label.replaceAll("(DOT)", ".");
            return newLabel;
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

                                        } else if (field.field_type === "array") {
                                            var formValues;
                                            if (field.field_id === "admissions.comeFrom.otherDepartments") {
                                                formValues = formValuesComeFrom;
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
                                                                        // onBlur={() => arrayInputValidation("cf", i, index2, "text")}
                                                                        />
                                                                        <input className="form-control" type="text" name="numberOfPatients"
                                                                            value={element.value || ""}
                                                                            onChange={e => handleChange(field.field_id, index2, e, 1)}
                                                                        // onBlur={() => arrayInputValidation("cf", i, index2, "number")}
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
                                                                {[...Array(field.total_rows)].map((e, i) => (
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

                                                                        {[...Array(field.total_cols)].map((e, j) => {
                                                                            var rowLength = field.row_labels.length - 1;
                                                                            var colLength = field.col_labels.length - 1;
                                                                            if (field.invalid_inputs[inputCount][j] === 1) {
                                                                                if ((j + 1) % field.total_cols === 0) {
                                                                                    inputCount++;
                                                                                }
                                                                                return <td></td>
                                                                            } else {
                                                                                const dataInput = (
                                                                                    <td className="align-middle">
                                                                                        <input className="form-control" type="number"
                                                                                            {...register(field.subsection_label + "." + field.row_labels[rowLength][inputCount] + "." + field.col_labels[colLength][j]
                                                                                            )}
                                                                                        />
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
                                        } else if (field.field_type === "list") {
                                            var patientState;
                                            if (i === 6) {
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
                                                            // onBlur={() => inputValidation(i)}
                                                            onChange={(event) => handleListInput(field, event, i)}
                                                        />
                                                        <div className="invalid-feedback">
                                                            Requires a valid number
                                                        </div>
                                                    </div>

                                                    {renderList(patientState, field)}
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
                            <button className="w-100 btn btn-secondary btn-sm" onClick={clickNext} disabled={sectionState === 4 ? true : false}>Next</button>
                        </div>

                        <button
                            className="w-100 btn btn-primary btn-lg"
                            type="submit"
                            style={{ display: sectionState === 4 ? '' : 'none' }}
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

export default MaternityForm;
