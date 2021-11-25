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

    const elements: any = Object.values(formModel);
    const fields: any = elements[0];

    function refreshPage() {
        window.location.reload();
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

    const addFormFields = (ID: number) => {

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



    let fieldCount = 0;

    document.body.classList.add("bg-light");

    return (
        <div className="nicu_form">
            <SideBar />

            <main className="container">
                <Header />

                <div className="py-3 text-start">
                    <h2>Community Form</h2>
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
                                                        // onBlur={() => inputValidation(i)}
                                                        />
                                                        <div className="invalid-feedback">
                                                            Requires a valid number
                                                        </div>
                                                    </div>
                                                </>
                                            );

                                        } else if (field.field_type === "table") {
                                            if (field.subsection_label === "Vaccination") {
                                                var count = [];
                                                var k = [];
                                                var inputCount = 0;
                                                for (let i = 0; i < field.row_labels.length; i++) {
                                                    count.push(0);
                                                    k.push(0);
                                                }
                                                ret.push(
                                                    <>
                                                        <table>
                                                            <caption style={{ captionSide: "top" }}><strong>{field.table_name}</strong></caption>

                                                            <tbody>
                                                                {/* COLUMNS */}

                                                                {field.col_labels.map((row, coli) => (
                                                                    <tr>
                                                                        {field.row_labels.map((x, y) => (
                                                                            <td></td>
                                                                        ))}

                                                                        {row.map((col, colj) => (
                                                                            <th colSpan={field.col_spans[coli][colj]} scope="colgroup">{field.col_labels[coli][colj]}</th>
                                                                        ))}
                                                                    </tr>
                                                                ))}

                                                                {/* ROWS */}
                                                                {[...Array(field.total_rows)].map((e, i) => (
                                                                    <tr>
                                                                        {[...Array(field.row_labels.length)].map((e, j) => {
                                                                            if (count[j] === 0) {
                                                                                const header = <th rowSpan={field.row_spans[j][k[j]]}>{field.row_labels[j][k[j]]}</th>
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
                                                                                    <td>
                                                                                        <input type="number"
                                                                                            {...register(field.subsection_label + "." +
                                                                                                inputCount + "." + j
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
                                                    </>
                                                )
                                            } else {
                                                var count = [];
                                                var k = [];
                                                var inputCount = 0;
                                                for (let i = 0; i < field.row_labels.length; i++) {
                                                    count.push(0);
                                                    k.push(0);
                                                }
                                                ret.push(
                                                    <>
                                                        <table>
                                                            <caption style={{ captionSide: "top" }}><strong>{field.table_name}</strong></caption>

                                                            <tbody>
                                                                {/* COLUMNS */}

                                                                {field.col_labels.map((row, coli) => (
                                                                    <tr>
                                                                        {field.row_labels.map((x, y) => (
                                                                            <td></td>
                                                                        ))}

                                                                        {row.map((col, colj) => (
                                                                            <th colSpan={field.col_spans[coli][colj]} scope="colgroup">{field.col_labels[coli][colj]}</th>
                                                                        ))}
                                                                    </tr>
                                                                ))}


                                                                {/* ROWS */}
                                                                {[...Array(field.total_rows)].map((e, i) => (
                                                                    <tr>
                                                                        {[...Array(field.row_labels.length)].map((e, j) => {
                                                                            if (count[j] === 0) {
                                                                                const header = <th rowSpan={field.row_spans[j][k[j]]}>{field.row_labels[j][k[j]]}</th>
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
                                                                                    <td>
                                                                                        <input type="number"
                                                                                            {...register(field.subsection_label + "." +
                                                                                                inputCount + "." + j
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

                                                    </>
                                                )
                                            }

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
