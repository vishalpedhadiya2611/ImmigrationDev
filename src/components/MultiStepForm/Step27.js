import React, {useState} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBRow,} from "mdbreact";
import Step from "./Step";
import BackBtn from "../../assets/back-btn.png";
import {fieldValidator} from "./validator";
import TextField from "@material-ui/core/TextField";
import {DatePicker} from "@material-ui/pickers";
import CustomCheckBox from "../../shared/utility";
import {FormControlLabel} from "@material-ui/core";

export default function Step27(props) {
    const {state, prevStep, nextStep, history} = props;
    const [errorMsg, setErrorMsg] = useState({});

    const onChange = (e, fieldName, value) => {
        let updatedState = {...state};
        let errors = {...errorMsg};
        switch (fieldName) {
            case 'isFiledPetitionPreviously':
                updatedState[fieldName] = value;
                if (value) {
                    updatedState['prevFiledPetitionInfo'] = {};
                } else {
                    delete updatedState.prevFiledPetitionInfo;
                    delete errors.personFName;
                    delete errors.personMName;
                    delete errors.personLName;
                    delete errors.city;
                    delete errors.state;
                    delete errors.resultDesc;
                    delete errors.dateOfPrevPetition;
                    delete errors.petitionResult;
                }
                setErrorMsg(fieldValidator(fieldName, updatedState, 'requiredBool', errors).error);
                break;
            case 'personFName':
            case 'personMName':
            case 'personLName':
            case 'city':
            case 'state':
            case 'resultDesc':
                updatedState.prevFiledPetitionInfo[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.prevFiledPetitionInfo, 'requiredWithSpace', errors).error);
                break;
            case 'dateOfPrevPetition':
            case 'petitionResult':
                updatedState.prevFiledPetitionInfo[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.prevFiledPetitionInfo, 'required', errors).error);
                break;
            default:
                break;
        }
        props.onChangeState(updatedState);
    };

    const onNext = () => {
        let errors = {};
        let newForm;

        newForm = fieldValidator('isFiledPetitionPreviously', state, 'requiredBool', errors);

        if (state.isFiledPetitionPreviously) {
            errors = fieldValidator('personFName', state.prevFiledPetitionInfo, 'requiredWithSpace', newForm.error).error;
            errors = fieldValidator('personMName', state.prevFiledPetitionInfo, 'requiredWithSpace', errors).error;
            errors = fieldValidator('personLName', state.prevFiledPetitionInfo, 'requiredWithSpace', errors).error;
            errors = fieldValidator('city', state.prevFiledPetitionInfo, 'required', errors).error;
            errors = fieldValidator('state', state.prevFiledPetitionInfo, 'required', errors).error;
            errors = fieldValidator('dateOfPrevPetition', state.prevFiledPetitionInfo, 'required', errors).error;
            errors = fieldValidator('petitionResult', state.prevFiledPetitionInfo, 'required', errors).error;
            newForm = fieldValidator('resultDesc', state.prevFiledPetitionInfo, 'required', errors);
        }

        if (newForm.isValid) {
            props.history.push(nextStep);
        } else {
            setErrorMsg(newForm.error);
        }
    };

    return (
        <Step
            heading={`Information about Previously filed Petition`}
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

                        <h4 className={`mb-2 text-center`}>
                            Have you ever previously filed a petition for your immigrating relative or any other alien?
                        </h4>

                        <MDBRow center className={`mb-2`}>
                            <FormControlLabel
                                className={`mb-0`}
                                control={
                                    <CustomCheckBox
                                        id={`isFiledPetitionPreviouslyYes`}
                                        checked={state.isFiledPetitionPreviously || false}
                                        onChange={e => onChange(e, 'isFiledPetitionPreviously', true)}
                                        color="primary"
                                        inputProps={{'aria-label': 'secondary checkbox'}}
                                    />
                                }
                                label={(<span className={`labelClass`}>Yes</span>)}
                            />
                            <FormControlLabel
                                className={`mb-0`}
                                control={
                                    <CustomCheckBox
                                        id={`isFiledPetitionPreviouslyNo`}
                                        checked={state.isFiledPetitionPreviously === false || false}
                                        onChange={e => onChange(e, 'isFiledPetitionPreviously', false)}
                                        color="primary"
                                        inputProps={{'aria-label': 'secondary checkbox'}}
                                    />
                                }
                                label={(<span className={`labelClass`}>No</span>)}
                            />
                        </MDBRow>

                        {state.isFiledPetitionPreviously && <React.Fragment>

                            <h4 className="text-center mb-2">What is the name of the person you petitioned for?</h4>

                            <MDBRow center className={`mb-2`}>
                                <MDBCol md={`3`} lg={`4`}>
                                    <TextField
                                        label="First Name"
                                        error={!!errorMsg.personFName}
                                        helperText={errorMsg.personFName}
                                        type="text"
                                        id={`personFName`}
                                        name="personFName"
                                        placeholder={`First Name`}
                                        value={state.prevFiledPetitionInfo.personFName || ''}
                                        onChange={e => onChange(e, 'personFName', e.target.value)}
                                        onBlur={e => onChange(e, 'personFName', e.target.value)}
                                        required
                                    />
                                </MDBCol>
                                <MDBCol md={`3`} lg={`4`}>
                                    <TextField
                                        label="Middle Name"
                                        error={!!errorMsg.personMName}
                                        helperText={errorMsg.personMName}
                                        type="text"
                                        id={`personMName`}
                                        name="personMName"
                                        placeholder={`Middle Name`}
                                        value={state.prevFiledPetitionInfo.personMName || ''}
                                        onChange={e => onChange(e, 'personMName', e.target.value)}
                                        onBlur={e => onChange(e, 'personMName', e.target.value)}
                                        required
                                    />
                                </MDBCol>
                                <MDBCol md={`3`} lg={`4`}>
                                    <TextField
                                        label="Last Name"
                                        error={!!errorMsg.personLName}
                                        helperText={errorMsg.personLName}
                                        type="text"
                                        id={`personLName`}
                                        name="personLName"
                                        placeholder={`Last Name`}
                                        value={state.prevFiledPetitionInfo.personLName || ''}
                                        onChange={e => onChange(e, 'personLName', e.target.value)}
                                        onBlur={e => onChange(e, 'personLName', e.target.value)}
                                        required
                                    />
                                </MDBCol>
                            </MDBRow>

                            <MDBRow center className={`mb-2`}>
                                <MDBCol>
                                    <TextField
                                        label="City or Town"
                                        error={!!errorMsg.city}
                                        helperText={errorMsg.city}
                                        type="text"
                                        id={`city`}
                                        autoComplete="off"
                                        name="city"
                                        placeholder={`City`}
                                        classes={{root: "custom-text-input"}}
                                        value={state.prevFiledPetitionInfo.city || ''}
                                        onChange={e => onChange(e, 'city', e.target.value)}
                                        onBlur={e => onChange(e, 'city', e.target.value)}
                                        required
                                    />
                                </MDBCol>
                                <MDBCol>
                                    <TextField
                                        label="State"
                                        error={!!errorMsg.state}
                                        helperText={errorMsg.state}
                                        type="text"
                                        id={`stateInfo`}
                                        autoComplete="off"
                                        name="stateInfo"
                                        placeholder={`State Name`}
                                        classes={{root: "custom-text-input"}}
                                        value={state.prevFiledPetitionInfo.state || ''}
                                        onChange={e => onChange(e, 'state', e.target.value)}
                                        onBlur={e => onChange(e, 'state', e.target.value)}
                                        required
                                    />
                                </MDBCol>
                            </MDBRow>

                            <MDBRow center className={`mb-2`}>
                                <MDBCol>
                                    <DatePicker
                                        label="Previous Petition Filing Date"
                                        variant="inline"
                                        id={`dateOfPrevPetition`}
                                        name={`dateOfPrevPetition`}
                                        format="dd/MM/yyyy"
                                        error={errorMsg.dateOfPrevPetition}
                                        helperText={errorMsg.dateOfPrevPetition}
                                        value={state.prevFiledPetitionInfo.dateOfPrevPetition || null}
                                        autoOk={true}
                                        disableFuture={true}
                                        classes={{root: "custom-text-input"}}
                                        placeholder={`When did you filed the Petition?`}
                                        onChange={e => onChange(e, 'dateOfPrevPetition', e.toLocaleDateString())}
                                        required
                                    />
                                </MDBCol>
                                <MDBCol>

                                    <h4 className={`text-center mb-2`}>
                                        What was the result or your petition?
                                    </h4>

                                    <MDBRow center className={`mb-2`}>
                                        <FormControlLabel
                                            className={`mb-0`}
                                            control={
                                                <CustomCheckBox
                                                    id={`approved`}
                                                    checked={state.prevFiledPetitionInfo.petitionResult === "approved"}
                                                    onChange={e => onChange(e, 'petitionResult', 'approved')}
                                                    color="primary"
                                                    inputProps={{'aria-label': 'secondary checkbox'}}
                                                />
                                            }
                                            label={(<span className={`labelClass`}>Approved</span>)}
                                        />
                                        <FormControlLabel
                                            className={`mb-0`}
                                            control={
                                                <CustomCheckBox
                                                    id={`denied`}
                                                    checked={state.prevFiledPetitionInfo.petitionResult === "denied"}
                                                    onChange={e => onChange(e, 'petitionResult', 'denied')}
                                                    color="primary"
                                                    inputProps={{'aria-label': 'secondary checkbox'}}
                                                />
                                            }
                                            label={(<span className={`labelClass`}>Denied</span>)}
                                        />
                                        <FormControlLabel
                                            className={`mb-0`}
                                            control={
                                                <CustomCheckBox
                                                    id={`withdrawn`}
                                                    checked={state.prevFiledPetitionInfo.petitionResult === "withdrawn"}
                                                    onChange={e => onChange(e, 'petitionResult', 'withdrawn')}
                                                    color="primary"
                                                    inputProps={{'aria-label': 'secondary checkbox'}}
                                                />
                                            }
                                            label={(<span className={`labelClass`}>Withdrawn</span>)}
                                        />
                                    </MDBRow>

                                    <MDBRow center className={`mb-2`}>
                                        <TextField
                                            label="Description for Result"
                                            error={!!errorMsg.resultDesc}
                                            helperText={errorMsg.resultDesc}
                                            type="text"
                                            id={`resultDesc`}
                                            autoComplete="off"
                                            name="resultDesc"
                                            inputProps={{
                                                maxLength: 30,
                                            }}
                                            placeholder={`Small Description for Result (max. 30 Chars)`}
                                            classes={{root: "custom-text-input"}}
                                            value={state.prevFiledPetitionInfo.resultDesc || ''}
                                            onChange={e => onChange(e, 'resultDesc', e.target.value)}
                                            onBlur={e => onChange(e, 'resultDesc', e.target.value)}
                                            required
                                        />
                                    </MDBRow>
                                </MDBCol>
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
