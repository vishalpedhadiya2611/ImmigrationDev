import React, {useState} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBRow,} from "mdbreact";
import Step from "./Step";
import BackBtn from "../../assets/back-btn.png";
import {fieldValidator} from "./validator";
import TextField from "@material-ui/core/TextField";
import {DatePicker} from "@material-ui/pickers";
import CustomCheckBox from "../../shared/utility";
import {FormControlLabel} from "@material-ui/core";

export default function Step7(props) {
    const {state, prevStep, nextStep, history} = props;
    const [errorMsg, setErrorMsg] = useState({});

    const onChange = (e, fieldName, value) => {
        let updatedState = {...state};
        let errors = {...errorMsg};
        switch (fieldName) {
            case 'residenceType':
                updatedState.residenceType = value;
                if (value === "usCitizen") {
                    updatedState['usCitizen'] = {};
                } else {
                    updatedState['lawfulPR'] = {isPRThroughMarriage: false};
                }
                setErrorMsg(fieldValidator(fieldName, updatedState, 'required', {}).error);
                break;
            case 'type':
                updatedState.usCitizen[fieldName] = value;
                if (value === "naturalBorn") {
                    delete updatedState.usCitizen.certNumber;
                    delete updatedState.usCitizen.certIssuePlace;
                    delete updatedState.usCitizen.certIssueDate;
                    delete updatedState.usCitizen.haveCert;
                    delete errors.certNumber;
                    delete errors.certIssuePlace;
                    delete errors.certIssueDate;
                    delete errors.haveCert;
                }
                setErrorMsg(fieldValidator(fieldName, updatedState.usCitizen, 'required', errors).error);
                break;
            case 'certNumber':
            case 'certIssuePlace':
            case 'certIssueDate':
                updatedState.usCitizen[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.usCitizen, 'required', errors).error);
                break;
            case 'haveCert':
                updatedState.usCitizen[fieldName] = value;
                delete updatedState.usCitizen.certNumber;
                delete updatedState.usCitizen.certIssuePlace;
                delete updatedState.usCitizen.certIssueDate;
                delete errors.certNumber;
                delete errors.certIssuePlace;
                delete errors.certIssueDate;
                setErrorMsg(fieldValidator(fieldName, updatedState.usCitizen, 'requiredBool', errors).error);
                break;
            case 'classAdmission':
            case 'dateAdmission':
            case 'stateAdmission':
            case 'cityAdmission':
                updatedState.lawfulPR[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.lawfulPR, 'required', errors).error);
                break;
            case 'isPRThroughMarriage':
                updatedState.lawfulPR.isPRThroughMarriage = !updatedState.lawfulPR.isPRThroughMarriage;
                break;
            default:
                break;
        }
        props.onChangeState(updatedState);
    };


    const onNext = () => {
        let errors = {};
        let newForm;
        newForm = fieldValidator('residenceType', state, 'required', errors);

        if (newForm.isValid) {
            if (state.residenceType === "usCitizen") {
                newForm = fieldValidator('type', state.usCitizen, 'required', newForm.error);
                if (newForm.isValid && state.usCitizen.type !== "naturalBorn") {
                    newForm = fieldValidator('haveCert', state.usCitizen, 'requiredBool', errors);
                    if (state.usCitizen.haveCert) {
                        errors = fieldValidator('certNumber', state.usCitizen, 'required', errors).error;
                        errors = fieldValidator('certIssuePlace', state.usCitizen, 'required', errors).error;
                        newForm = fieldValidator('certIssueDate', state.usCitizen, 'required', errors);
                    }
                }
            } else {
                errors = fieldValidator('classAdmission', state.lawfulPR, 'required', newForm.error).error;
                errors = fieldValidator('stateAdmission', state.lawfulPR, 'required', errors).error;
                errors = fieldValidator('cityAdmission', state.lawfulPR, 'required', errors).error;
                newForm = fieldValidator('dateAdmission', state.lawfulPR, 'required', errors);
            }
        }

        if (newForm.isValid) {
            props.history.push(nextStep);
        } else {
            setErrorMsg(newForm.error);
        }
    };

    return (
        <Step
            heading={`US Citizenship information`}
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

                        <MDBRow center className={`mb-2`}>
                            <FormControlLabel
                                className={`mb-0`}
                                control={
                                    <CustomCheckBox
                                        id={`isUSCitizen`}
                                        checked={state.residenceType === "usCitizen" || false}
                                        onChange={e => onChange(e, "residenceType", 'usCitizen')}
                                        color="primary"
                                        inputProps={{'aria-label': 'secondary checkbox'}}
                                    />
                                }
                                label={(<span className={`labelClass`}>Are you a U.S. Citizen?</span>)}
                            />
                            <FormControlLabel
                                className={`mb-0`}
                                control={
                                    <CustomCheckBox
                                        id={`isLawfulPR`}
                                        checked={state.residenceType === "lawfulPR" || false}
                                        onChange={e => onChange(e, "residenceType", 'lawfulPR')}
                                        color="primary"
                                        inputProps={{'aria-label': 'secondary checkbox'}}
                                    />
                                }
                                label={(<span className={`labelClass`}>Are you a Lawful Permanent Resident?</span>)}
                            />
                        </MDBRow>

                        {state.residenceType === "usCitizen" && <React.Fragment>
                            <h4 className={`text-center mb-2`}>How did you obtained U.S. Citizenship?</h4>

                            <MDBRow center className={`mb-2`}>
                                <FormControlLabel
                                    className={`mb-0`}
                                    control={
                                        <CustomCheckBox
                                            id={`naturalBorn`}
                                            checked={state.usCitizen.type === "naturalBorn" || false}
                                            onChange={e => onChange(e, "type", 'naturalBorn')}
                                            color="primary"
                                            inputProps={{'aria-label': 'secondary checkbox'}}
                                        />
                                    }
                                    label={(<span className={`labelClass`}>Natural Born Citizen</span>)}
                                />
                                <FormControlLabel
                                    className={`mb-0`}
                                    control={
                                        <CustomCheckBox
                                            id={`naturalization`}
                                            checked={state.usCitizen.type === "naturalization" || false}
                                            onChange={e => onChange(e, "type", 'naturalization')}
                                            color="primary"
                                            inputProps={{'aria-label': 'secondary checkbox'}}
                                        />
                                    }
                                    label={(<span className={`labelClass`}>Naturalization</span>)}
                                />
                                <FormControlLabel
                                    className={`mb-0`}
                                    control={
                                        <CustomCheckBox
                                            id={`parents`}
                                            checked={state.usCitizen.type === "parents" || false}
                                            onChange={e => onChange(e, "type", 'parents')}
                                            color="primary"
                                            inputProps={{'aria-label': 'secondary checkbox'}}
                                        />
                                    }
                                    label={(<span className={`labelClass`}>Parents</span>)}
                                />
                            </MDBRow>

                            {(state.usCitizen.type === "parents" ||
                                state.usCitizen.type === "naturalization") && <React.Fragment>
                                <h4 className={`text-center mb-2`}>
                                    Have you obtained a Certificate of Naturalization or a
                                    Certificate of Citizenship?
                                </h4>

                                <MDBRow center className={`mb-2`}>
                                    <FormControlLabel
                                        className={`mb-0`}
                                        control={
                                            <CustomCheckBox
                                                id={`certYes`}
                                                checked={state.usCitizen.haveCert || false}
                                                onChange={e => onChange(e, "haveCert", true)}
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
                                                id={`certNo`}
                                                checked={state.usCitizen.haveCert === false || false}
                                                onChange={e => onChange(e, "haveCert", false)}
                                                color="primary"
                                                inputProps={{'aria-label': 'secondary checkbox'}}
                                            />
                                        }
                                        label={(<span className={`labelClass`}>No</span>)}
                                    />
                                </MDBRow>

                                {state.usCitizen.haveCert && <React.Fragment>
                                    <MDBRow center className={`mb-2`}>
                                        <MDBCol>
                                            <TextField
                                                label="What is your Certificate Number?"
                                                type="text"
                                                id={`certNumber`}
                                                name="certNumber"
                                                error={!!errorMsg.certNumber}
                                                helperText={errorMsg.certNumber}
                                                value={state.usCitizen.certNumber || ''}
                                                classes={{root: "custom-text-input"}}
                                                placeholder={`Certificate Number`}
                                                onChange={e => onChange(e, 'certNumber', e.target.value)}
                                                onBlur={e => onChange(e, 'certNumber', e.target.value)}
                                                required
                                            />
                                        </MDBCol>
                                        <MDBCol>
                                            <TextField
                                                label="Where was your Certificate issued?"
                                                type="text"
                                                id={`certIssuePlace`}
                                                name="certIssuePlace"
                                                error={!!errorMsg.certIssuePlace}
                                                helperText={errorMsg.certIssuePlace}
                                                value={state.usCitizen.certIssuePlace || ''}
                                                classes={{root: "custom-text-input"}}
                                                placeholder={`Certificate Issue Place`}
                                                onChange={e => onChange(e, 'certIssuePlace', e.target.value)}
                                                onBlur={e => onChange(e, 'certIssuePlace', e.target.value)}
                                                required
                                            />
                                        </MDBCol>
                                    </MDBRow>

                                    <MDBRow center className={`mb-2`}>
                                        <DatePicker
                                            label="When was your Certificate issued?"
                                            variant="inline"
                                            id={`certIssueDate`}
                                            name="certIssueDate"
                                            format="dd/MM/yyyy"
                                            error={!!errorMsg.certIssueDate}
                                            helperText={errorMsg.certIssueDate}
                                            value={state.usCitizen.certIssueDate || null}
                                            autoOk={true}
                                            disableFuture={true}
                                            classes={{root: "custom-text-input"}}
                                            placeholder={`Certificate Issue Date`}
                                            onChange={e => onChange(e, 'certIssueDate', e.toLocaleDateString())}
                                            onBlur={e => onChange(e, 'certIssueDate', e.target.value)}
                                            required
                                            controlled
                                        />
                                    </MDBRow>

                                </React.Fragment>}

                            </React.Fragment>}

                        </React.Fragment>}

                        {state.residenceType === "lawfulPR" && <React.Fragment>
                            <MDBRow center className={`mb-2`}>
                                <MDBCol>
                                    <TextField
                                        label="What is your Class of Admission?"
                                        type="text"
                                        id={`classAdmission`}
                                        name="classAdmission"
                                        error={!!errorMsg.classAdmission}
                                        helperText={errorMsg.classAdmission}
                                        value={state.lawfulPR.classAdmission || ''}
                                        classes={{root: "custom-text-input"}}
                                        placeholder={`Class of Admission`}
                                        onChange={e => onChange(e, 'classAdmission', e.target.value)}
                                        onBlur={e => onChange(e, 'classAdmission', e.target.value)}
                                        required
                                    />
                                </MDBCol>
                                <MDBCol>
                                    <DatePicker
                                        label="What is the date of your admission?"
                                        variant="inline"
                                        id={`dateAdmission`}
                                        name="dateAdmission"
                                        format="dd/MM/yyyy"
                                        error={!!errorMsg.dateAdmission}
                                        helperText={errorMsg.dateAdmission}
                                        value={state.lawfulPR.dateAdmission || null}
                                        autoOk={true}
                                        disableFuture={true}
                                        classes={{root: "custom-text-input"}}
                                        placeholder={`Date of Admission`}
                                        onChange={e => onChange(e, 'dateAdmission', e.toLocaleDateString())}
                                    />
                                </MDBCol>
                            </MDBRow>

                            <MDBRow center className={`mb-2`}>
                                <MDBCol>
                                    <TextField
                                        label="In what city were you admitted in US?"
                                        type="text"
                                        id={`cityAdmission`}
                                        name="cityAdmission"
                                        error={!!errorMsg.cityAdmission}
                                        helperText={errorMsg.cityAdmission}
                                        value={state.lawfulPR.cityAdmission || ''}
                                        classes={{root: "custom-text-input"}}
                                        placeholder={`City of Admission`}
                                        onChange={e => onChange(e, 'cityAdmission', e.target.value)}
                                        onBlur={e => onChange(e, 'cityAdmission', e.target.value)}
                                        required
                                    />
                                </MDBCol>
                                <MDBCol>
                                    <TextField
                                        label="In what state were you admitted in US?"
                                        type="text"
                                        id={`stateAdmission`}
                                        name="stateAdmission"
                                        error={!!errorMsg.stateAdmission}
                                        helperText={errorMsg.stateAdmission}
                                        value={state.lawfulPR.stateAdmission || ''}
                                        classes={{root: "custom-text-input"}}
                                        placeholder={`State of Admission`}
                                        onChange={e => onChange(e, 'stateAdmission', e.target.value)}
                                        onBlur={e => onChange(e, 'stateAdmission', e.target.value)}
                                        required
                                    />
                                </MDBCol>
                            </MDBRow>

                            <MDBRow center className={`mb-2`}>
                                <FormControlLabel
                                    className={`mb-0`}
                                    control={
                                        <CustomCheckBox
                                            id={`isPRThroughMarriage`}
                                            checked={state.lawfulPR.isPRThroughMarriage || false}
                                            onChange={e => onChange(e, "isPRThroughMarriage", e.target.checked)}
                                            color="primary"
                                            inputProps={{'aria-label': 'secondary checkbox'}}
                                        />
                                    }
                                    label={(<span className={`labelClass`}>Did you gain Lawful Permanent resident status through marriage?</span>)}
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
