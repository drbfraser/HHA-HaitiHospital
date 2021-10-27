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

    function inputValidation(num: number, type: string) {
        console.log("input: " + num);

        if (type === "number") {
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
        }

        //Hospitalized
        if (num === 4 || num === 5 || num === 6) {
            console.log("TOTAL ERROR");
            var total = Number((document.getElementById("inputs4")?.childNodes[0] as HTMLInputElement).value);
            var x = Number((document.getElementById("inputs5")?.childNodes[0] as HTMLInputElement).value);
            var y = Number((document.getElementById("inputs6")?.childNodes[0] as HTMLInputElement).value);
            if (total !== (x + y)) {
                (document.getElementById("inputs4")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                (document.getElementById("inputs5")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                (document.getElementById("inputs6")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                (document.getElementById("inputs4")?.childNodes[1] as HTMLElement).innerHTML = "Does not add up to total";
                (document.getElementById("inputs5")?.childNodes[1] as HTMLElement).innerHTML = "";
                (document.getElementById("inputs6")?.childNodes[1] as HTMLElement).innerHTML = "";
            } else {
                (document.getElementById("inputs4")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                (document.getElementById("inputs5")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                (document.getElementById("inputs6")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                (document.getElementById("inputs4")?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
                (document.getElementById("inputs5")?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
                (document.getElementById("inputs6")?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
            }
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

        //----------ADMISSIONS----------
        if ((num >= 27 && num <= 63) || (type === "arrNumCF" || type === "arrNumAC")) {
            var total = Number((document.getElementById("inputs27")?.childNodes[0] as HTMLInputElement).value);

            //come from
            if ((num === 27 || num >= 29 && num <= 31) || (type === "arrNumCF")) {
                console.log("TOTAL ERROR");
                var total = Number((document.getElementById("inputs27")?.childNodes[0] as HTMLInputElement).value);

                //Check if array input is valid
                if (type === "arrNumCF") {
                    console.log('invalid arr');
                    if (formValuesComeFrom[num].value === null) {
                        console.log('null val');
                        (document.getElementById("arrNumCFInput" + num) as HTMLElement).classList.add("is-invalid");
                        (document.getElementById("arrCFInputError" + num) as HTMLElement).innerHTML = "Must enter a value";
                    }
                    if (formValuesComeFrom[num].value < 0) {
                        (document.getElementById("arrNumCFInput" + num) as HTMLElement).classList.add("is-invalid");
                        (document.getElementById("arrCFInputError" + num) as HTMLElement).innerHTML = "Positive numbers only";
                    }
                }
                var comeFrom1 = Number((document.getElementById("inputs29")?.childNodes[0] as HTMLInputElement).value);
                var comeFrom2 = Number((document.getElementById("inputs30")?.childNodes[0] as HTMLInputElement).value);
                var comeFrom3 = Number((document.getElementById("inputs31")?.childNodes[0] as HTMLInputElement).value);
                var arrTotal = 0;
                if (formValuesComeFrom.length > 0) {
                    for (let i = 0; i < formValuesComeFrom.length; i++) {
                        arrTotal += Number(formValuesComeFrom[i].value);
                    }
                }

                if (total !== (comeFrom1 + comeFrom2 + comeFrom3 + arrTotal)) {
                    console.log("total error array");
                    (document.getElementById("inputs27")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                    (document.getElementById("inputs29")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                    (document.getElementById("inputs30")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                    (document.getElementById("inputs31")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                    (document.getElementById("inputs27")?.childNodes[1] as HTMLElement).innerHTML = "Does not add up to total";
                    (document.getElementById("inputs29")?.childNodes[1] as HTMLElement).innerHTML = "";
                    (document.getElementById("inputs30")?.childNodes[1] as HTMLElement).innerHTML = "";
                    (document.getElementById("inputs31")?.childNodes[1] as HTMLElement).innerHTML = "";

                    //Array Loop
                    if (formValuesComeFrom.length > 0) {
                        for (let i = 0; i < formValuesComeFrom.length; i++) {
                            (document.getElementById("arrNumCFInput" + i) as HTMLElement).classList.add("is-invalid");
                            (document.getElementById("arrCFInputError" + i) as HTMLElement).innerHTML = "";
                        }
                    }
                } else {
                    (document.getElementById("inputs27")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                    (document.getElementById("inputs29")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                    (document.getElementById("inputs30")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                    (document.getElementById("inputs31")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                    (document.getElementById("inputs27")?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
                    (document.getElementById("inputs29")?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
                    (document.getElementById("inputs30")?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
                    (document.getElementById("inputs31")?.childNodes[0] as HTMLInputElement).classList.add("is-valid");

                    //Array Loop
                    if (formValuesComeFrom.length > 0) {
                        for (let i = 0; i < formValuesComeFrom.length; i++) {
                            (document.getElementById("arrNumCFInput" + i) as HTMLElement).classList.remove("is-invalid");
                            (document.getElementById("arrNumCFInput" + i) as HTMLElement).classList.add("is-valid");
                        }
                    }
                }

            }

            //age
            if (num === 27 || num >= 34 && num <= 41) {
                // var total = Number((document.getElementById("inputs27")?.childNodes[0] as HTMLInputElement).value);

                var age1 = Number((document.getElementById("inputs34")?.childNodes[0] as HTMLInputElement).value);
                var age2 = Number((document.getElementById("inputs35")?.childNodes[0] as HTMLInputElement).value);
                var age3 = Number((document.getElementById("inputs36")?.childNodes[0] as HTMLInputElement).value);
                var age4 = Number((document.getElementById("inputs37")?.childNodes[0] as HTMLInputElement).value);
                var age5 = Number((document.getElementById("inputs38")?.childNodes[0] as HTMLInputElement).value);
                var age6 = Number((document.getElementById("inputs39")?.childNodes[0] as HTMLInputElement).value);
                var age7 = Number((document.getElementById("inputs40")?.childNodes[0] as HTMLInputElement).value);
                var age8 = Number((document.getElementById("inputs41")?.childNodes[0] as HTMLInputElement).value);
                if (total !== (age1 + age2 + age3 + age4 + age5 + age6 + age7 + age8)) {
                    (document.getElementById("inputs27")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                    (document.getElementById("inputs34")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                    (document.getElementById("inputs35")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                    (document.getElementById("inputs36")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                    (document.getElementById("inputs37")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                    (document.getElementById("inputs38")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                    (document.getElementById("inputs39")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                    (document.getElementById("inputs40")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                    (document.getElementById("inputs41")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                    (document.getElementById("inputs27")?.childNodes[1] as HTMLElement).innerHTML = "Does not add up to total";
                    (document.getElementById("inputs34")?.childNodes[1] as HTMLElement).innerHTML = "";
                    (document.getElementById("inputs35")?.childNodes[1] as HTMLElement).innerHTML = "";
                    (document.getElementById("inputs36")?.childNodes[1] as HTMLElement).innerHTML = "";
                    (document.getElementById("inputs37")?.childNodes[1] as HTMLElement).innerHTML = "";
                    (document.getElementById("inputs38")?.childNodes[1] as HTMLElement).innerHTML = "";
                    (document.getElementById("inputs39")?.childNodes[1] as HTMLElement).innerHTML = "";
                    (document.getElementById("inputs40")?.childNodes[1] as HTMLElement).innerHTML = "";
                    (document.getElementById("inputs41")?.childNodes[1] as HTMLElement).innerHTML = "";
                } else {
                    (document.getElementById("inputs27")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                    (document.getElementById("inputs34")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                    (document.getElementById("inputs35")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                    (document.getElementById("inputs36")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                    (document.getElementById("inputs37")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                    (document.getElementById("inputs38")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                    (document.getElementById("inputs39")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                    (document.getElementById("inputs40")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                    (document.getElementById("inputs41")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                    (document.getElementById("inputs27")?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
                    (document.getElementById("inputs34")?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
                    (document.getElementById("inputs35")?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
                    (document.getElementById("inputs36")?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
                    (document.getElementById("inputs37")?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
                    (document.getElementById("inputs38")?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
                    (document.getElementById("inputs39")?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
                    (document.getElementById("inputs40")?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
                    (document.getElementById("inputs41")?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
                }
            }

            //gender
            if (num === 27 || num >= 43 && num <= 44) {
                // var total = Number((document.getElementById("inputs27")?.childNodes[0] as HTMLInputElement).value);

                var male = Number((document.getElementById("inputs43")?.childNodes[0] as HTMLInputElement).value);
                var female = Number((document.getElementById("inputs44")?.childNodes[0] as HTMLInputElement).value);
                if (total !== (male + female)) {
                    (document.getElementById("inputs27")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                    (document.getElementById("inputs43")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                    (document.getElementById("inputs44")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                    (document.getElementById("inputs27")?.childNodes[1] as HTMLElement).innerHTML = "Does not add up to total";
                    (document.getElementById("inputs43")?.childNodes[1] as HTMLElement).innerHTML = "";
                    (document.getElementById("inputs44")?.childNodes[1] as HTMLElement).innerHTML = "";
                } else {
                    (document.getElementById("inputs27")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                    (document.getElementById("inputs43")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                    (document.getElementById("inputs44")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                    (document.getElementById("inputs27")?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
                    (document.getElementById("inputs43")?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
                    (document.getElementById("inputs44")?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
                }
            }

            //main condition
            if ((num === 27 || num >= 46 && num <= 63) || (type === "arrNumAC")) {
                // var total = Number((document.getElementById("inputs27")?.childNodes[0] as HTMLInputElement).value);

                if (type === "arrNumAC") {
                    if (formValuesAdCondition[num].value === null) {
                        (document.getElementById("arrNumACInput" + num) as HTMLElement).classList.add("is-invalid");
                        (document.getElementById("arrACInputError" + num) as HTMLElement).innerHTML = "Must enter a value";
                        return;
                    }
                    if (formValuesAdCondition[num].value < 0) {
                        (document.getElementById("arrNumACInput" + num) as HTMLElement).classList.add("is-invalid");
                        (document.getElementById("arrACInputError" + num) as HTMLElement).innerHTML = "Positive numbers only";
                        return;
                    }
                }
                var cond1 = Number((document.getElementById("inputs46")?.childNodes[0] as HTMLInputElement).value);
                var cond2 = Number((document.getElementById("inputs47")?.childNodes[0] as HTMLInputElement).value);
                var cond3 = Number((document.getElementById("inputs48")?.childNodes[0] as HTMLInputElement).value);
                var cond4 = Number((document.getElementById("inputs49")?.childNodes[0] as HTMLInputElement).value);
                var cond5 = Number((document.getElementById("inputs50")?.childNodes[0] as HTMLInputElement).value);
                var cond6 = Number((document.getElementById("inputs51")?.childNodes[0] as HTMLInputElement).value);
                var cond7 = Number((document.getElementById("inputs52")?.childNodes[0] as HTMLInputElement).value);
                var cond8 = Number((document.getElementById("inputs53")?.childNodes[0] as HTMLInputElement).value);
                var cond9 = Number((document.getElementById("inputs54")?.childNodes[0] as HTMLInputElement).value);
                var cond10 = Number((document.getElementById("inputs55")?.childNodes[0] as HTMLInputElement).value);
                var cond11 = Number((document.getElementById("inputs56")?.childNodes[0] as HTMLInputElement).value);
                var cond12 = Number((document.getElementById("inputs57")?.childNodes[0] as HTMLInputElement).value);
                var cond13 = Number((document.getElementById("inputs58")?.childNodes[0] as HTMLInputElement).value);
                var cond14 = Number((document.getElementById("inputs59")?.childNodes[0] as HTMLInputElement).value);
                var cond15 = Number((document.getElementById("inputs60")?.childNodes[0] as HTMLInputElement).value);
                var cond16 = Number((document.getElementById("inputs61")?.childNodes[0] as HTMLInputElement).value);
                var cond17 = Number((document.getElementById("inputs62")?.childNodes[0] as HTMLInputElement).value);
                var cond18 = Number((document.getElementById("inputs63")?.childNodes[0] as HTMLInputElement).value);
                var arrTotal = 0;
                if (formValuesAdCondition.length > 0) {
                    for (let i = 0; i < formValuesAdCondition.length; i++) {
                        arrTotal += Number(formValuesAdCondition[i].value);
                    }
                }
                if (total !== (arrTotal + cond1 + cond2 + cond3 + cond4 + cond5 + cond6 + cond7 + cond8 + cond9 + cond10 + cond11 + cond12 + cond13 + cond14 + cond15 + cond16 + cond17 + cond18)) {
                    (document.getElementById("inputs27")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                    //Loop for less code
                    for (let i = 46; i <= 63; i++) {
                        (document.getElementById("inputs" + i)?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                    }

                    (document.getElementById("inputs27")?.childNodes[1] as HTMLElement).innerHTML = "Does not add up to total";
                    //Loop for less code
                    for (let i = 46; i <= 63; i++) {
                        (document.getElementById("inputs" + i)?.childNodes[1] as HTMLInputElement).innerHTML = "";
                    }

                    //Array Loop
                    if (formValuesAdCondition.length > 0) {
                        for (let i = 0; i < formValuesAdCondition.length; i++) {
                            (document.getElementById("arrNumACInput" + i) as HTMLElement).classList.add("is-invalid");
                            (document.getElementById("arrACInputError" + i) as HTMLElement).innerHTML = "";
                        }
                    }

                } else {
                    (document.getElementById("inputs27")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                    //Loop for less code
                    for (let i = 46; i <= 63; i++) {
                        (document.getElementById("inputs" + i)?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                    }

                    (document.getElementById("inputs27")?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
                    //Loop for less code
                    for (let i = 46; i <= 63; i++) {
                        (document.getElementById("inputs" + i)?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
                    }

                    //Array Loop
                    if (formValuesAdCondition.length > 0) {
                        for (let i = 0; i < formValuesAdCondition.length; i++) {
                            (document.getElementById("arrNumACInput" + i) as HTMLElement).classList.remove("is-invalid");
                            (document.getElementById("arrACInputError" + i) as HTMLElement).classList.add("is-valid");
                        }
                    }
                }
            }
        }


        //----------OUTPATIENTS----------
        if (num >= 66 && num <= 97) {
            console.log("TOTAL ERROR");
            var total = Number((document.getElementById("inputs66")?.childNodes[0] as HTMLInputElement).value);

            //age
            var age1 = Number((document.getElementById("inputs68")?.childNodes[0] as HTMLInputElement).value);
            var age2 = Number((document.getElementById("inputs69")?.childNodes[0] as HTMLInputElement).value);
            var age3 = Number((document.getElementById("inputs70")?.childNodes[0] as HTMLInputElement).value);
            var age4 = Number((document.getElementById("inputs71")?.childNodes[0] as HTMLInputElement).value);
            var age5 = Number((document.getElementById("inputs72")?.childNodes[0] as HTMLInputElement).value);
            var age6 = Number((document.getElementById("inputs72")?.childNodes[0] as HTMLInputElement).value);
            var age7 = Number((document.getElementById("inputs74")?.childNodes[0] as HTMLInputElement).value);
            var age8 = Number((document.getElementById("inputs75")?.childNodes[0] as HTMLInputElement).value);
            if (total !== (age1 + age2 + age3 + age4 + age5 + age6 + age7 + age8)) {
                (document.getElementById("inputs66")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                (document.getElementById("inputs68")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                (document.getElementById("inputs69")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                (document.getElementById("inputs70")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                (document.getElementById("inputs71")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                (document.getElementById("inputs72")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                (document.getElementById("inputs73")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                (document.getElementById("inputs74")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                (document.getElementById("inputs75")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                (document.getElementById("inputs66")?.childNodes[1] as HTMLElement).innerHTML = "Does not add up to total";
                (document.getElementById("inputs68")?.childNodes[1] as HTMLElement).innerHTML = "";
                (document.getElementById("inputs69")?.childNodes[1] as HTMLElement).innerHTML = "";
                (document.getElementById("inputs70")?.childNodes[1] as HTMLElement).innerHTML = "";
                (document.getElementById("inputs71")?.childNodes[1] as HTMLElement).innerHTML = "";
                (document.getElementById("inputs72")?.childNodes[1] as HTMLElement).innerHTML = "";
                (document.getElementById("inputs73")?.childNodes[1] as HTMLElement).innerHTML = "";
                (document.getElementById("inputs74")?.childNodes[1] as HTMLElement).innerHTML = "";
                (document.getElementById("inputs75")?.childNodes[1] as HTMLElement).innerHTML = "";
            } else {
                (document.getElementById("inputs66")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                (document.getElementById("inputs68")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                (document.getElementById("inputs69")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                (document.getElementById("inputs70")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                (document.getElementById("inputs71")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                (document.getElementById("inputs72")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                (document.getElementById("inputs73")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                (document.getElementById("inputs74")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                (document.getElementById("inputs75")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                (document.getElementById("inputs66")?.childNodes[0] as HTMLElement).classList.add("is-valid");
                (document.getElementById("inputs68")?.childNodes[0] as HTMLElement).classList.add("is-valid");
                (document.getElementById("inputs69")?.childNodes[0] as HTMLElement).classList.add("is-valid");
                (document.getElementById("inputs70")?.childNodes[0] as HTMLElement).classList.add("is-valid");
                (document.getElementById("inputs71")?.childNodes[0] as HTMLElement).classList.add("is-valid");
                (document.getElementById("inputs72")?.childNodes[0] as HTMLElement).classList.add("is-valid");
                (document.getElementById("inputs73")?.childNodes[0] as HTMLElement).classList.add("is-valid");
                (document.getElementById("inputs74")?.childNodes[0] as HTMLElement).classList.add("is-valid");
                (document.getElementById("inputs75")?.childNodes[0] as HTMLElement).classList.add("is-valid");
            }
            //gender
            var male = Number((document.getElementById("inputs77")?.childNodes[0] as HTMLInputElement).value);
            var female = Number((document.getElementById("inputs78")?.childNodes[0] as HTMLInputElement).value);
            if (total !== (male + female)) {
                (document.getElementById("inputs66")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                (document.getElementById("inputs77")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                (document.getElementById("inputs78")?.childNodes[0] as HTMLInputElement).classList.add("is-invalid");
                (document.getElementById("inputs66")?.childNodes[1] as HTMLElement).innerHTML = "Does not add up to total";
                (document.getElementById("inputs77")?.childNodes[1] as HTMLElement).innerHTML = "";
                (document.getElementById("inputs78")?.childNodes[1] as HTMLElement).innerHTML = "";
            } else {
                (document.getElementById("inputs66")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                (document.getElementById("inputs77")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                (document.getElementById("inputs78")?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
                (document.getElementById("inputs66")?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
                (document.getElementById("inputs77")?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
                (document.getElementById("inputs78")?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
            }

            //main condition

            return;
        }

        if (type === "number") {
            (document.getElementById("inputs" + num)?.childNodes[0] as HTMLInputElement).classList.remove("is-invalid");
            (document.getElementById("inputs" + num)?.childNodes[0] as HTMLInputElement).classList.add("is-valid");
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
                                                            onBlur={() => inputValidation(index, "number")}
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
                                                                {formValuesComeFrom.map((element, index) => (
                                                                    <div className="row g-3 mb-1" key={index}>
                                                                        <div className={field.field_level === 1 ? "col-sm-10 ps-5" : "col-sm-10"}>
                                                                            <div className="input-group">
                                                                                <span className="input-group-text" id="">Name and value</span>
                                                                                <input id={"arrTextCFInput" + index} className="form-control" type="text" name="nameOfDepartment"
                                                                                    value={element.name || ""}
                                                                                    onChange={e => handleChange(field.field_id, index, e, 0)}
                                                                                    onBlur={() => inputValidation(index, "arrTextCF")}
                                                                                />
                                                                                <input id={"arrNumCFInput" + index} className="form-control" type="number" name="numberOfPatients"
                                                                                    value={element.value || ""}
                                                                                    onChange={e => handleChange(field.field_id, index, e, 1)}
                                                                                    onBlur={() => inputValidation(index, "arrNumCF")}
                                                                                />
                                                                                <div id={"arrCFInputError" + index} className="invalid-feedback">
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
                                                                                    onBlur={() => inputValidation(index, "arrTextAC")}
                                                                                />
                                                                                <input id={"arrNumACInput" + index} className="form-control" type="number" name="numberOfPatients"
                                                                                    value={element.value || ""}
                                                                                    onChange={e => handleChange(field.field_id, index, e, 1)}
                                                                                    onBlur={() => inputValidation(index, "arrNumAC")}
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
                                                                                    onBlur={() => inputValidation(index, "arrTextOC")}
                                                                                />
                                                                                <input id={"arrNumOCInput" + index} className="form-control" type="number" name="numberOfPatients"
                                                                                    value={element.value || ""}
                                                                                    onChange={e => handleChange(field.field_id, index, e, 1)}
                                                                                    onBlur={() => inputValidation(index, "arrNumOC")}
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
