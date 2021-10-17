import { useForm } from 'react-hook-form';
import React, { useState } from 'react';
import axios from 'axios';
// import { compose } from 'redux';
import { NICUPaedsModel } from 'pages/form/nicu_paeds_model';

// import Layout from '../../layout/Layout';
// import './styles.css';


function NICUForm() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<NICUPaedsModel>({});
    // const onSubmit: SubmitHandler<NICU> = data => console.log(data);

    // const [state, setState] = useState(NICUPaedsModel);

    const [state, setState] = useState({
        hospitalized: false,
        dischargedAlive: false,
        diedBefore48hr: false,
        diedAfter48hr: false,
        selfDischarge: false,
        admissions: false,
        numberOfOutPatients: false,
    });

    // const [state, setState] = useState<NICUPaedsModel>({
    //     hospitalized: 0
    // })

    const onSubmit = (data: any) => {
        
        // var hospitalizedTotal = document.getElementById("hospitalizedTotal") as HTMLInputElement;
        // data.hospitalized.total = hospitalizedTotal.value;

        // var dischargedAliveTotal = document.getElementById("dischargedAliveTotal") as HTMLInputElement;
        // data.dischargedAlive.total = dischargedAliveTotal.value;

        // var diedBefore48hrTotal = document.getElementById("diedBefore48hrTotal") as HTMLInputElement;
        // data.diedBefore48hr.total = diedBefore48hrTotal.value;

        // var diedAfter48hrTotal = document.getElementById("diedAfter48hrTotal") as HTMLInputElement;
        // data.diedAfter48hr.total = diedAfter48hrTotal.value;

        // var selfDischargeTotal = document.getElementById("selfDischargeTotal") as HTMLInputElement;
        // data.selfDischarge.total = selfDischargeTotal.value;

        // var selfDischargeTotal = document.getElementById("selfDischargeTotal") as HTMLInputElement;
        // data.selfDischarge.total = selfDischargeTotal.value;

        // var admissionsTotal = document.getElementById("admissionsTotal") as HTMLInputElement;
        // // data.admissions = {};
        // data.admissions.total = admissionsTotal.value;

        // var numberOfOutPatientsTotal = document.getElementById("numberOfOutPatientsTotal") as HTMLInputElement;
        // data.numberOfOutPatients.total = numberOfOutPatientsTotal.value;


        console.log(data);
        axios.post('http://localhost:5000/api/NicuPaeds/add', data).then(res => {
            console.log(res.data);
        }).catch(error =>{
            console.error('Something went wrong!', error.response);
        });

        reset({});
    }

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const value = e.target.value;
        const name = e.target.name.replace(".total", "");
        var pattern = new RegExp("[1-9]");
        if (pattern.test(value)){
            setState({
                ...state,
                [name]: true
            });
        }else{
            setState({
                ...state,
                [name]: false,
                [e.target.value]: 0,
            });
        }
    }    

    return (
        // <Layout>
            <div className="wrapper">
            <h1>HHA Form</h1>
            <div>
                <h2>MSPP DATA (NICU)</h2>
                <form onSubmit={handleSubmit(onSubmit)} >

                <div className = "input">
                    <label>Department ID</label>
                    <input type="number" {...register("departmentId", {required: true, min: 0})}/>
                    {errors.departmentId && errors.departmentId.type === "required" && (
                    <span>This input is required</span>
                    )}
                    
                </div>

                <div className = "input">
                    <label>createdOn</label>
                    <input className="date" type="date" {...register("createdOn", {required: true, min: 0})}/>
                    {errors.createdOn && errors.createdOn.type === "required" && (
                    <span>This input is required</span>
                    )}
                    
                </div>

                <div className = "input">
                    <label>createdByUserId</label>
                    <input type="number" {...register("createdByUserId", {required: true, min: 0})}/>
                    {errors.createdByUserId && errors.createdByUserId.type === "required" && (
                    <span>This input is required</span>
                    )}
                    
                </div>

                <div className = "input">
                    <label>userId</label>
                    <input type="number" {...register("userId", {required: true, min: 0})}/>
                    {errors.userId && errors.userId.type === "required" && (
                    <span>This input is required</span>
                    )}
                    
                </div>

                <div className = "input">
                    <label>Date last updated</label>
                    <input className="date" type="date" {...register("lastUpdatedOn", {required: true, min: 0})}/>
                    {errors.lastUpdatedOn && errors.lastUpdatedOn.type === "required" && (
                    <span>This input is required</span>
                    )}
                    
                </div>

                <div className = "input">
                    <label>Last updated by user</label>
                    <input type="number" {...register("lastUpdatedByUserId", {required: true, min: 0})}/>
                    {errors.lastUpdatedByUserId && errors.lastUpdatedByUserId.type === "required" && (
                    <span>This input is required</span>
                    )}
                    
                </div>

                <div className = "input">
                    <label>Beds available</label>
                    <input type="number" {...register("bedsAvailable", {required: true, min: 0})}/>
                    {errors.bedsAvailable && errors.bedsAvailable.type === "required" && (
                    <span>This input is required</span>
                    )}
                    
                </div>

                <div className = "input">
                    <label htmlFor="">Bed days</label>
                    <input 
                        type="number" 
                        {...register("bedDays", {required: true, min: 0})} 
                    />
                    {errors.bedDays && errors.bedDays.type === "required" && (
                    <span>This input is required</span>
                    )}
                </div>

                <div className = "input">
                    <label htmlFor="">Patient days</label>
                    <input type="number" {...register("patientDays", {required: true, min: 0})} />
                    {errors.patientDays && errors.patientDays.type === "required" && (
                    <span>This input is required</span>
                    )}
                </div>

                <div className = "input">
                    <label htmlFor="">Hospitalized</label>
                    <input 
                        type="number" 
                        id="hospitalizedTotal"
                        {...register("hospitalized.total", {required: true, min: 0})}
                        onChange={e => {
                            handleChange(e);
                        }}
                    />
                    {errors.hospitalized && (
                    <span>This input is required</span>
                    )}

                    {/* <input type="hidden" {...register("hospitalized.total")} /> */}

                    {state.hospitalized &&
                        <div className="inputChange">

                            <div>
                                <label>hospitalizedNICU</label>
                                <input type="number" {...register("hospitalized.nicu", {required: true, min: 0})}/>
                                {/* {errors.hospitalized?.hospitalizedNICU && ( <span>This input is required</span>)} */}
                            </div>

                            <div>
                                <label>hospitalizedPaeds</label>
                                <input type="number" {...register("hospitalized.paeds", {required: true, min: 0})}/>
                                {/* {errors.hospitalized?.hospitalizedPaeds && ( <span>This input is required</span>)} */}
                            </div>
                        </div>
                    }
                </div>

                <div className = "input">
                    <label htmlFor="">Discharged Alive</label>
                    <input 
                        type="number" 
                        id="dischargedAliveTotal"
                        {...register("dischargedAlive.total", {required: true, min: 0})}
                        onChange={handleChange}     
                    />
                    {errors.dischargedAlive && (
                    <span>This input input is required</span>
                    )}

                    {/* <input type="hidden" {...register("dischargedAlive.total")} /> */}

                    {state.dischargedAlive &&
                        <div className="inputChange">
                            <div>
                                <label>Discharged Alive NICU</label>
                                <div><input type="number" {...register("dischargedAlive.nicu", {required: true, min: 0})}/></div>
                            </div>

                            <div>
                                <label>Discharged Alive Paeds</label>
                                <input type="number"  {...register("dischargedAlive.paeds", {required: true, min: 0})}/>
                            </div>
                        </div>
                    }
                    
                    
                </div>

                <div className = "input">
                    <label htmlFor="">Died before 48h</label>
                    <input 
                        type="number" 
                        id="diedBefore48hrTotal"
                        {...register("diedBefore48hr.total", {required: true, min: 0})}  
                        onChange={handleChange}
                    />
                    {errors.diedBefore48hr && (
                    <span>This input is required</span>
                    )}
                    
                    {/* <input type="hidden" {...register("diedBefore48hr.total")} /> */}

                    {state.diedBefore48hr &&
                        <div className="inputChange">
                            <div>
                                <label>Died in NICU</label>
                                <input type="number" {...register("diedBefore48hr.nicu", {required: true, min: 0})}/>
                            </div>

                            <div>
                                <label>Died in Paeds</label>
                                <input type="number" {...register("diedBefore48hr.paeds", {required: true, min: 0})}/>
                            </div>
                        </div>
                    }                    
                </div>
                {/* Start here */}
                <div className = "input">
                    <label htmlFor="">Died after 48h</label>
                    <input 
                        type="number" 
                        id="diedAfter48hrTotal"
                        {...register("diedAfter48hr.total", {required: true, min: 0})}  
                        onChange={handleChange}
                    />
                    {errors.diedAfter48hr && (
                    <span>This input is required</span>
                    )}

                    {/* <input type="hidden" {...register("diedAfter48hr.total")} /> */}

                    {state.diedAfter48hr &&
                        <div className="inputChange">
                            <div>
                                <label>Died in NICU</label>
                                <input type="number" {...register("diedAfter48hr.nicu", {required: true, min: 0})}/>
                            </div>

                            <div>
                                <label>Died in Paeds</label>
                                <input type="number" {...register("diedAfter48hr.paeds", {required: true, min: 0})}/>
                            </div>
                        </div>
                    }
                    
                </div>

                <div className = "input">
                    <label htmlFor="">Days hospitalized</label>
                    <input type="number" {...register("daysHospitalized", {required: true, min: 0})} />
                    {errors.daysHospitalized && errors.daysHospitalized.type === "required" && (
                    <span>This input is required</span>
                    )}
                </div>

                <div className = "input">
                    <label htmlFor="">Referrals</label>
                    <input type="number" {...register("referrals", {required: true, min: 0})} />
                    {errors.referrals && errors.referrals.type === "required" && (
                    <span>This input is required</span>
                    )}
                </div>

                <div className = "input">
                    <label htmlFor="">Transfers</label>
                    <input type="number" {...register("transfers", {required: true, min: 0})} />
                    {errors.transfers && errors.transfers.type === "required" && (
                    <span>This input is required</span>
                    )}
                </div>

                <div className = "input">
                    <label htmlFor="">Self-discharged</label>
                    <input 
                        type="number" 
                        id="selfDischargeTotal"
                        {...register("selfDischarge.total", {required: true, min: 0})}  
                        onChange={handleChange}
                    />
                    {errors.selfDischarge && (
                    <span>This input is required</span>
                    )}

                    {/* <input type="hidden" {...register("selfDischarge.total")} /> */}

                    {state.selfDischarge &&
                        <div className="inputChange">
                            <label>Reason for self-discharge</label>

                            <div>
                                <label>Finance: Leave as cannot afford care</label>
                                <input type="number" {...register("selfDischarge.cannotAfford", {required: true, min: 0})}/>
                            </div>

                            <div>
                                <label>Finance: Left to avoid paying</label>
                                <input type="number" {...register("selfDischarge.avoidedPaying", {required: true, min: 0})}/>
                            </div>
<div></div>
                            <div>
                                <label>Religious/Cultural</label>
                                <input type="number" {...register("selfDischarge.religiousCultural", {required: true, min: 0})}/>
                            </div>

                            <div>
                                <label>Personal/Family</label>
                                <input type="number" {...register("selfDischarge.personalFamily", {required: true, min: 0})}/>
                            </div>

                            <div>
                                <label>Other</label>
                                <input type="number" {...register("selfDischarge.other", {required: true, min: 0})}/>
                            </div>
                        </div>
                    }

                </div>

                <div className = "input">
                    <label htmlFor="">Stayed in the ward</label>
                    <input type="number" {...register("stayedInWard", {required: true, min: 0})} />
                    {errors.stayedInWard && errors.stayedInWard.type === "required" && (
                    <span>This input is required</span>
                    )}
                </div>

                <div className = "input">
                    <label htmlFor="">Admissions</label>
                    <input 
                        type="number" 
                        id="admissionsTotal"
                        {...register("admissions.total", {required: true, min: 0})} 
                        onChange={handleChange}
                    />
                    {errors.admissions && (
                    <span>This input is required</span>
                    )}
                    
                    {/* <input type="hidden" {...register("admissions.total")} />
                    <input type="hidden" {...register("admissions.age")} />
                    <input type="hidden" {...register("admissions.gender")} />
                    <input type="hidden" {...register("admissions.mainCondition")} />
                    <input type="hidden" {...register("admissions.comeFrom")} />

                    <input type="hidden" {...register("admissions.total")} /> */}

                    {state.admissions &&
                        <div className="inputChange">
                            <div className="admissions">
                                <h4 className="subheading">Where do patients come from?</h4>

                                <div>
                                    <label>Quarter Morin</label>
                                    <input type="number" {...register("admissions.comeFrom.quarterMorin", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Cap Haitian</label>
                                    <input type="number" {...register("admissions.comeFrom.capHaitian", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Department Nord</label>
                                    <input type="number" {...register("admissions.comeFrom.departmentNord", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Other departments: IF YES TEXT BOX WHERE</label>
                                    <input className="optionalText" type="text" placeholder="Department Name" {...register("admissions.comeFrom.otherDepartments.0.nameOfDepartment", {required: true})}/>
                                    <input type="number" {...register("admissions.comeFrom.otherDepartments.0.numberOfPatients", {required: true, min: 0})}/>
                                </div>
                            </div>

                            <div className="admissions">
                                <h4 className="subheading">Age of infant admitted</h4>

                                <div>
                                    <label>extremely preterm (less than 28 weeks)</label>
                                    <input type="number" {...register("admissions.age.extremelyPreterm", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>very preterm (28 to 32 weeks)</label>
                                    <input type="number" {...register("admissions.age.veryPreterm", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>moderate to late preterm (32 to 37 weeks)</label>
                                    <input type="number" {...register("admissions.age.moderateToLatePreterm", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Full term (37 weeks plus)</label>
                                    <input type="number" {...register("admissions.age.fullTerm", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Older than neonate (&gt; 4 weeks old)</label>
                                    <input type="number" {...register("admissions.age.olderThanNeonate", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Age 4-5 weeks</label>
                                    <input type="number" {...register("admissions.age.age4To5Weeks", {required: true, min: 0})}/>
                                </div>
                                
                                <div>
                                    <label>Age 6-11 weeks</label>
                                    <input type="number" {...register("admissions.age.age6To11Weeks", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Age 12-18 weeks</label>
                                    <input type="number" {...register("admissions.age.age12To18Weeks", {required: true, min: 0})}/>
                                <div>
                                    <div></div></div>
                                </div>

                            </div>

                            <div className="admissions">
                                <h4 className="subheading">Gender</h4>

                                <div>
                                    <label>Male</label>
                                    <input type="number" {...register("admissions.gender.male", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Female</label>
                                    <input type="number" {...register("admissions.gender.female", {required: true, min: 0})}/>
                                </div>

                            </div>

                            <div className="admissions">
                                <h4 className="subheading">Main Condition</h4>

                                <div>
                                    <label>Respiratory arrest</label>
                                    <input type="number" {...register("admissions.mainCondition.respiratoryArrest", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Traumatic injury</label>
                                    <input type="number" {...register("admissions.mainCondition.traumaticInjury", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Septic Shock</label>
                                    <input type="number" {...register("admissions.mainCondition.septicShock", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Hypovolemic shock</label>
                                    <input type="number" {...register("admissions.mainCondition.hypovolemicShock", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Seizures/convulsions</label>
                                    <input type="number" {...register("admissions.mainCondition.seizuresOrConvulsions", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Poisoning</label>
                                    <input type="number" {...register("admissions.mainCondition.poisoning", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Altered mental status</label>
                                    <input type="number" {...register("admissions.mainCondition.alteredMentalStatus", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Gastroenteritis</label>
                                    <input type="number" {...register("admissions.mainCondition.gastroenteritis", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Hemorrhage</label>
                                    <input type="number" {...register("admissions.mainCondition.hemorrhage", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Hypothermia</label>
                                    <input type="number" {...register("admissions.mainCondition.hypothermia", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Cardiac congenital anomaly</label>
                                    <input type="number" {...register("admissions.mainCondition.cardiacCongenitalAnomaly", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Other congenital anomaly</label>
                                    <input type="number" {...register("admissions.mainCondition.otherCongenitalAnomaly", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Malnutrition</label>
                                    <input type="number" {...register("admissions.mainCondition.malnutrition", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Meningitis</label>
                                    <input type="number" {...register("admissions.mainCondition.meningitis", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Community acquired pneumonia</label>
                                    <input type="number" {...register("admissions.mainCondition.communityAcquiredPneumonia", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Aspiration pneumonia</label>
                                    <input type="number" {...register("admissions.mainCondition.aspirationPneumonia", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Moderate prematurity (32-36 weeks gestation)</label>
                                    <input type="number" {...register("admissions.mainCondition.moderatePrematurity", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Severe prematurity (&gt; 32 weeks)</label>
                                    <input type="number" {...register("admissions.mainCondition.severePrematurity", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Other medical</label>
                                    <input className="optionalText" type="text" placeholder="Condition Name" {...register("admissions.mainCondition.otherMedical.0.nameOfCondition", {required: true})}/>
                                    <input type="number" {...register("admissions.mainCondition.otherMedical.0.numberOfPatients", {required: true, min: 0})}/>
                                </div>
                            </div>
                        </div>
                    }
                

                </div>

                <div className="input">
                        <label>Total number of outpatients</label>
                        <input type="number" 
                        id="numberOfOutpatientsTotal" 
                        {...register("numberOfOutPatients.total", {required: true, min: 0})}
                        onChange={handleChange}
                        />
                        {/* <input type="hidden" {...register("numberOfOutpatients.total")} /> */}

                        {state.numberOfOutPatients &&
                        <div className="inputChange">
                            <div className="admissionsOutpatients">
                                <h4 className="subheading2">Age of infant admitted</h4>

                                <div>
                                    <label>extremely preterm (less than 28 weeks)</label>
                                    <input type="number" {...register("numberOfOutPatients.age.extremelyPreterm", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <div>
                                        <div><label>very preterm (28 to 32 weeks)</label></div>
                                    </div>
                                    <input type="number" {...register("numberOfOutPatients.age.veryPreterm", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>moderate to late preterm (32 to 37 weeks)</label>
                                    <input type="number" {...register("numberOfOutPatients.age.moderateToLatePreterm", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Full term (37 weeks plus)</label>
                                    <input type="number" {...register("numberOfOutPatients.age.fullTerm", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Older than neonate (&gt; 4 weeks old)</label>
                                    <input type="number" {...register("numberOfOutPatients.age.olderThanNeonate", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Age 4-5 weeks</label>
                                    <input type="number" {...register("numberOfOutPatients.age.age4To5Weeks", {required: true, min: 0})}/>
                                </div>
                                
                                <div>
                                    <label>Age 6-11 weeks</label>
                                    <input type="number" {...register("numberOfOutPatients.age.age6To11Weeks", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Age 12-18 weeks</label>
                                    <input type="number" {...register("numberOfOutPatients.age.age12To18Weeks", {required: true, min: 0})}/>
                                </div>
                            </div>
                            
                            <div className="admissionsOutpatients">
                                <h4 className="subheading2">Main Condition</h4>

                                <div>
                                    <label>Respiratory arrest</label>
                                    <input type="number" {...register("numberOfOutPatients.mainCondition.respiratoryArrest", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Traumatic injury</label>
                                    <input type="number" {...register("numberOfOutPatients.mainCondition.traumaticInjury", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Septic Shock</label>
                                    <input type="number" {...register("numberOfOutPatients.mainCondition.septicShock", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Hypovolemic shock</label>
                                    <input type="number" {...register("numberOfOutPatients.mainCondition.hypovolemicShock", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Seizures/convulsions</label>
                                    <input type="number" {...register("numberOfOutPatients.mainCondition.seizuresOrConvulsions", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Poisoning</label>
                                    <input type="number" {...register("numberOfOutPatients.mainCondition.poisoning", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Altered mental status</label>
                                    <input type="number" {...register("numberOfOutPatients.mainCondition.alteredMentalStatus", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Gastroenteritis</label>
                                    <input type="number" {...register("numberOfOutPatients.mainCondition.gastroenteritis", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Hemorrhage</label>
                                    <input type="number" {...register("numberOfOutPatients.mainCondition.hemorrhage", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Hypothermia</label>
                                    <input type="number" {...register("numberOfOutPatients.mainCondition.hypothermia", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Cardiac congenital anomaly</label>
                                    <input type="number" {...register("numberOfOutPatients.mainCondition.cardiacCongenitalAnomaly", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Other congenital anomaly</label>
                                    <input type="number" {...register("numberOfOutPatients.mainCondition.otherCongenitalAnomaly", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Malnutrition</label>
                                    <input type="number" {...register("numberOfOutPatients.mainCondition.malnutrition", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Meningitis</label>
                                    <input type="number" {...register("numberOfOutPatients.mainCondition.meningitis", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Community acquired pneumonia</label>
                                    <input type="number" {...register("numberOfOutPatients.mainCondition.communityAcquiredPneumonia", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Aspiration pneumonia</label>
                                    <input type="number" {...register("numberOfOutPatients.mainCondition.aspirationPneumonia", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Moderate prematurity (32-36 weeks gestation)</label>
                                    <input type="number" {...register("numberOfOutPatients.mainCondition.moderatePrematurity", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Severe prematurity (&gt; 32 weeks)</label>
                                    <input type="number" {...register("numberOfOutPatients.mainCondition.severePrematurity", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Other medical</label>
                                    <input className="optionalText" type="text" placeholder="Condition Name" {...register("numberOfOutPatients.mainCondition.otherMedical.0.nameOfCondition", {required: true})}/>
                                    <input type="number" {...register("numberOfOutPatients.mainCondition.otherMedical.0.numberOfPatients", {required: true, min: 0})}/>
                                </div>
                            </div>

                            <div className="admissionsOutpatients">
                                <h4 className="subheading2">Gender</h4>

                                <div>
                                    <label>Male</label>
                                    <input type="number" {...register("numberOfOutPatients.gender.male", {required: true, min: 0})}/>
                                </div>

                                <div>
                                    <label>Female</label>
                                    <input type="number" {...register("numberOfOutPatients.gender.female", {required: true, min: 0})}/>
                                </div>

                            </div>
                        </div>
                    }

                    </div>

                <div>
                    <input className="formSubmit" type="submit"/>
                </div>
                </form>
            </div>
        </div>
    // </Layout>
    )

}

export default NICUForm;
