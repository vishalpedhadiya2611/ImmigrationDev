import React, {useState} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBRow,} from "mdbreact";
import Step from "./Step";
import BackBtn from "../../assets/back-btn.png";
import {fieldValidator} from "./validator";
import TextField from "@material-ui/core/TextField";
import {DatePicker} from "@material-ui/pickers";
import CustomCheckBox from "../../shared/utility";
import {FormControlLabel} from "@material-ui/core";

export default function Step23(props) {
    const {state, prevStep, nextStep, history} = props;
    const [errorMsg, setErrorMsg] = useState({});

    const immigrationProceedingInfo = state.beneficiaryInfo.immigrationProceedingInfo;

    const onChange = (e, fieldName, value) => {
        let updatedState = {...state};
        let errors = {...errorMsg};
        switch (fieldName) {
            case 'everBeenInProceedings':
                updatedState.beneficiaryInfo.immigrationProceedingInfo[fieldName] = value;
                if (!value) {
                    delete updatedState.beneficiaryInfo.immigrationProceedingInfo.typeOfProceeding;
                    delete updatedState.beneficiaryInfo.immigrationProceedingInfo.proceedingCity;
                    delete updatedState.beneficiaryInfo.immigrationProceedingInfo.proceedingState;
                    delete updatedState.beneficiaryInfo.immigrationProceedingInfo.dateOfProceeding;
                    delete errors.typeOfProceeding;
                    delete errors.proceedingCity;
                    delete errors.proceedingState;
                    delete errors.dateOfProceeding;
                }
                setErrorMsg(fieldValidator(fieldName, updatedState.beneficiaryInfo.immigrationProceedingInfo, 'requiredBool', errors).error);
                break;
            case 'typeOfProceeding':
            case 'proceedingCity':
            case 'proceedingState':
            case 'dateOfProceeding':
                updatedState.beneficiaryInfo.immigrationProceedingInfo[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.beneficiaryInfo.immigrationProceedingInfo, 'required', errors).error);
                break;
            default:
                break;
        }
        props.onChangeState(updatedState);
    };

    const onNext = () => {
        let errors = {};
        let newForm = {isValid: true, error: {}};
        let shortState = state.beneficiaryInfo.immigrationProceedingInfo;

        newForm = fieldValidator('everBeenInProceedings', shortState, 'requiredBool', errors);

        if (shortState.everBeenInProceedings) {
            errors = fieldValidator('typeOfProceeding', shortState, 'required', newForm.error).error;
            errors = fieldValidator('proceedingCity', shortState, 'required', errors).error;
            errors = fieldValidator('proceedingState', shortState, 'required', errors).error;
            newForm = fieldValidator('dateOfProceeding', shortState, 'required', errors);
        }

        if (newForm.isValid) {
            props.history.push(nextStep);
        } else {
            setErrorMsg(newForm.error);
        }
    };

    return (
        <Step
            heading={`Immigration relative's Previous proceedings info`}
        >
            <img
                src={BackBtn}
                className="btn-back"
                alt={`Back`}
                onClick={() => history.push(prevStep)}
            />
            <MDBContainer>
                <MDBRow center>
                    <MDBCol sm={`10`} md={`8`}>

                        <h4 className={`mb-2 text-center`}>Was the beneficiary Ever in immigration proceedings?</h4>

                        <MDBRow center className={`mb-2`}>
                            <FormControlLabel
                                className={`mb-0 mt-2`}
                                control={
                                    <CustomCheckBox
                                        id={`everBeenInProceedingsYes`}
                                        checked={immigrationProceedingInfo.everBeenInProceedings || false}
                                        onChange={e => onChange(e, 'everBeenInProceedings', true)}
                                        color="primary"
                                        inputProps={{'aria-label': 'secondary checkbox'}}
                                    />
                                }
                                label={(<span className={`labelClass`}>Yes</span>)}
                            />
                            <FormControlLabel
                                className={`mb-0 mt-2`}
                                control={
                                    <CustomCheckBox
                                        id={`everBeenInProceedingsNo`}
                                        checked={immigrationProceedingInfo.everBeenInProceedings === false || false}
                                        onChange={e => onChange(e, 'everBeenInProceedings', false)}
                                        color="primary"
                                        inputProps={{'aria-label': 'secondary checkbox'}}
                                    />
                                }
                                label={(<span className={`labelClass`}>No</span>)}
                            />
                        </MDBRow>

                        {immigrationProceedingInfo.everBeenInProceedings && <React.Fragment>
                            <h4 className={`mb-2 text-center`}>
                                What type of proceeding was your immigrating relative in?
                            </h4>

                            <MDBRow center className={`mb-2`}>
                                <FormControlLabel
                                    className={`mb-0`}
                                    control={
                                        <CustomCheckBox
                                            id={`removal`}
                                            checked={immigrationProceedingInfo.typeOfProceeding === 'removal' || false}
                                            onChange={e => onChange(e, 'typeOfProceeding', 'removal')}
                                            color="primary"
                                            inputProps={{'aria-label': 'secondary checkbox'}}
                                        />
                                    }
                                    label={(<span className={`labelClass`}>Removal</span>)}
                                />
                                <FormControlLabel
                                    className={`mb-0`}
                                    control={
                                        <CustomCheckBox
                                            id={`exclusion`}
                                            checked={immigrationProceedingInfo.typeOfProceeding === 'exclusion' || false}
                                            onChange={e => onChange(e, 'typeOfProceeding', 'exclusion')}
                                            color="primary"
                                            inputProps={{'aria-label': 'secondary checkbox'}}
                                        />
                                    }
                                    label={(<span className={`labelClass`}>Exclusion/Deportation</span>)}
                                />
                                <FormControlLabel
                                    className={`mb-0`}
                                    control={
                                        <CustomCheckBox
                                            id={`rescission`}
                                            checked={immigrationProceedingInfo.typeOfProceeding === 'rescission'}
                                            onChange={e => onChange(e, 'typeOfProceeding', 'rescission')}
                                            color="primary"
                                            inputProps={{'aria-label': 'secondary checkbox'}}
                                        />
                                    }
                                    label={(<span className={`labelClass`}>Rescission</span>)}
                                />
                                <FormControlLabel
                                    className={`mb-0`}
                                    control={
                                        <CustomCheckBox
                                            id={`rescission`}
                                            checked={immigrationProceedingInfo.typeOfProceeding === 'otherJudicial'}
                                            onChange={e => onChange(e, 'typeOfProceeding', 'otherJudicial')}
                                            color="primary"
                                            inputProps={{'aria-label': 'secondary checkbox'}}
                                        />
                                    }
                                    label={(<span className={`labelClass`}>Other Judicial Proceedings</span>)}
                                />
                            </MDBRow>

                            <MDBRow center className={`mb-2`}>
                                <MDBCol>
                                    <TextField
                                        label="City or Town"
                                        error={!!errorMsg.proceedingCity}
                                        helperText={errorMsg.proceedingCity}
                                        type="text"
                                        id={`proceedingCity`}
                                        autoComplete="off"
                                        name="proceedingCity"
                                        placeholder={`City of Proceedings`}
                                        classes={{root: "custom-text-input"}}
                                        value={immigrationProceedingInfo.proceedingCity || ''}
                                        onChange={e => onChange(e, 'proceedingCity', e.target.value)}
                                        onBlur={e => onChange(e, 'proceedingCity', e.target.value)}
                                        required
                                    />
                                </MDBCol>
                                <MDBCol>
                                    <TextField
                                        label="State"
                                        error={!!errorMsg.proceedingState}
                                        helperText={errorMsg.proceedingState}
                                        type="text"
                                        id={`proceedingState`}
                                        autoComplete="off"
                                        name="proceedingState"
                                        placeholder={`Immigration Proceeding State`}
                                        classes={{root: "custom-text-input"}}
                                        value={immigrationProceedingInfo.proceedingState || ''}
                                        onChange={e => onChange(e, 'proceedingState', e.target.value)}
                                        onBlur={e => onChange(e, 'proceedingState', e.target.value)}
                                        required
                                    />
                                </MDBCol>
                            </MDBRow>

                            <MDBRow center className={`mb-2`}>
                                <DatePicker
                                    label="Date of Proceedings"
                                    variant="inline"
                                    id={`dateOfProceeding`}
                                    name={`dateOfProceeding`}
                                    format="dd/MM/yyyy"
                                    error={!!errorMsg.dateOfProceeding}
                                    helperText={errorMsg.dateOfProceeding}
                                    value={immigrationProceedingInfo.dateOfProceeding || null}
                                    autoOk={true}
                                    disableFuture={true}
                                    classes={{root: "custom-text-input"}}
                                    placeholder={`When did the proceedings occur?`}
                                    onChange={e => onChange(e, 'dateOfProceeding', e.toLocaleDateString())}
                                    required
                                />
                            </MDBRow>
                        </React.Fragment>}

                        <MDBRow center className="d-flex flex-column align-items-center">
                            {Object.keys(errorMsg).length > 0 && (
                                <div className="text-danger mb-2">Please Fill out all the required fields</div>
                            )}
                            <MDBBtn
                                color="pink"
                                rounded
                                type="button"
                                className="z-depth-1a"
                                onClick={() => onNext()}
                            >
                                Next
                            </MDBBtn>
                        </MDBRow>

                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </Step>
    );
}
