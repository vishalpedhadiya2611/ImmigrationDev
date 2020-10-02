import React, {useEffect, useState} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBRow,} from "mdbreact";
import Step from "./Step";
import BackBtn from "../../assets/back-btn.png";
import {fieldValidator} from "./validator";
import CustomCheckBox from "../../shared/utility";
import {FormControlLabel} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";

const Step29 = props => {
    const { prevStep, nextStep, history} = props;
    const [errorMsg, setErrorMsg] = useState({});
    const [localState, setLocalState] = useState(props.state);

    useEffect(() => {
        setLocalState(props.state);
    }, [props.state]);

    const onChange = (e, fieldName, value) => {
        let updatedState = {...localState};
        let errors = {...errorMsg};

        switch (fieldName) {
            case 'understandEnglish':
                updatedState.understandEnglish = !updatedState.understandEnglish;
                errors = {};
                setErrorMsg(fieldValidator(fieldName, updatedState, 'requiredBool', errors).error);
                break;
            case 'interpreterNeeded':
                updatedState.interpreterNeeded = !updatedState.interpreterNeeded;
                delete updatedState.language;
                errors = {};
                setErrorMsg(fieldValidator(fieldName, updatedState, 'requiredBool', errors).error);
                break;
            case 'preparerNeeded':
                updatedState.preparerNeeded = !updatedState.preparerNeeded;
                delete updatedState.preparerName;
                errors = {};
                setErrorMsg(fieldValidator(fieldName, updatedState, 'requiredBool', errors).error);
                break;
            case 'language':
            case 'preparerName':
                updatedState[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState, 'required', errors).error);
                break;
            default:
                break;
        }
        setLocalState(updatedState);
    };


    const onNext = () => {
        let errors = {};
        let newForm = {isValid: true, error: {}}

        if (!(localState.understandEnglish || localState.interpreterNeeded)) {
            newForm = {isValid: false, error: {msg: 'Select atleast one checkbox'}}
        } else {
            if (localState.interpreterNeeded) {
                newForm = fieldValidator('language', localState, 'required', errors);
            }
        }

        if (localState.preparerNeeded) {
            newForm = fieldValidator('preparerName', localState, 'required', newForm.error);
        }

        if (newForm.isValid) {
            props.onChangeState(localState);
            props.history.push(nextStep);
        } else {
            setErrorMsg(newForm.error);
        }
    };

    return (
        <Step heading={`Applicant's Statement, Contact, Information, Certification, and Signature`}>
            <img
                src={BackBtn}
                className="btn-back"
                alt={`Back`}
                onClick={() => history.push(prevStep)}
            />
            <MDBContainer>
                <MDBRow center>
                    <MDBCol sm={`10`} md={`8`}>

                        <h4 className="text-center mb-2">
                            Applicant's Statement
                        </h4>

                        <MDBRow center className={`mb-2`}>
                            <FormControlLabel
                                className={`mb-0`}
                                control={
                                    <CustomCheckBox
                                        id={`understandEnglish`}
                                        checked={localState.understandEnglish || false}
                                        disabled={localState.interpreterNeeded}
                                        onChange={e => onChange(e, "understandEnglish", true)}
                                        color="primary"
                                        inputProps={{'aria-label': 'secondary checkbox'}}
                                    />
                                }
                                label={(
                                    <span className={`labelClass`}>
                                        I can read and understand English, and I have read and understand every question
                                         and instruction on this application and my answer to every question.
                                    </span>)}
                            />
                        </MDBRow>

                        <MDBRow center className={`mb-2`}>
                            <FormControlLabel
                                className={`mb-0`}
                                control={
                                    <CustomCheckBox
                                        id={`interpreterNeeded`}
                                        checked={localState.interpreterNeeded || false}
                                        disabled={localState.understandEnglish}
                                        onChange={e => onChange(e, "interpreterNeeded", true)}
                                        color="primary"
                                        inputProps={{'aria-label': 'secondary checkbox'}}
                                    />
                                }
                                label={(
                                    <span className={`labelClass`}>
                                        The interpreter will read to me every question and instruction on this application
                                        and my answer to every question in a language in which I am fluent and i understand
                                        everything.
                                    </span>)}
                            />
                            {localState.interpreterNeeded && <TextField
                                label="Language"
                                error={!!errorMsg.language}
                                helperText={errorMsg.language}
                                type="text"
                                id={`language`}
                                autoComplete="off"
                                name="language"
                                classes={{root: "custom-text-input"}}
                                placeholder={`Language you are comfortable with`}
                                value={localState.language || ''}
                                onChange={e => onChange(e, 'language', e.target.value)}
                                onBlur={e => onChange(e, 'language', e.target.value)}
                                required
                            />}
                        </MDBRow>

                        <MDBRow center className={`mb-2`}>
                            <FormControlLabel
                                className={`mb-0`}
                                control={
                                    <CustomCheckBox
                                        id={`preparerNeeded`}
                                        checked={localState.preparerNeeded || false}
                                        onChange={e => onChange(e, "preparerNeeded", true)}
                                        color="primary"
                                        inputProps={{'aria-label': 'secondary checkbox'}}
                                    />
                                }
                                label={(
                                    <span className={`labelClass`}>
                                        At my request, the preparer prepared this application for me based only upon
                                        information I provided or authorized.
                                    </span>)}
                            />
                            {localState.preparerNeeded && <TextField
                                label="Name of the Preparer"
                                error={!!errorMsg.preparerName}
                                helperText={errorMsg.preparerName}
                                type="text"
                                id={`preparerName`}
                                autoComplete="off"
                                name="preparerName"
                                classes={{root: "custom-text-input"}}
                                placeholder={`Preparer's name who made this application`}
                                value={localState.preparerName || ''}
                                onChange={e => onChange(e, 'preparerName', e.target.value)}
                                onBlur={e => onChange(e, 'preparerName', e.target.value)}
                                required
                            />}
                        </MDBRow>

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

export default Step29;
