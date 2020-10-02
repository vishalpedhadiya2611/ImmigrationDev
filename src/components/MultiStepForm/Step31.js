import React, {useEffect, useState} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBRow,} from "mdbreact";
import Step from "./Step";
import BackBtn from "../../assets/back-btn.png";
import TextField from "@material-ui/core/TextField";
import {fieldValidator} from "./validator";

const Step31 = props => {
    const {prevStep, nextStep, history} = props;
    const [errorMsg, setErrorMsg] = useState({});
    const [localState, setLocalState] = useState(props.state);

    useEffect(() => {
        setLocalState(props.state);
    }, [props.state]);

    const onChange = (e, fieldName, value) => {
        let updatedState = {...localState};
        let errors = {...errorMsg};

        switch (fieldName) {
            case 'interpreterFirstName':
            case 'interpreterLastName':
                updatedState[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState, 'requiredWithSpace', errors).error);
                break;
            case 'interpreterOrg':
                updatedState[fieldName] = value;
                break;
            default:
                break;
        }
        setLocalState(updatedState);
    };


    const onNext = () => {
        let errors = fieldValidator('interpreterFirstName', localState, 'requiredWithSpace', {}).error;
        let newForm = fieldValidator('interpreterLastName', localState, 'requiredWithSpace', errors);

        if (newForm.isValid) {
            props.onChangeState(localState);
            props.history.push(nextStep);
        } else {
            setErrorMsg(newForm.error);
        }
    };

    return (
        <Step heading={`Interpreter's Information`}>
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
                            <MDBCol>
                                <TextField
                                    label="Interpreter's First Name"
                                    error={!!errorMsg.interpreterFirstName}
                                    helperText={errorMsg.interpreterFirstName}
                                    type="text"
                                    id={`interpreterFirstName`}
                                    autoComplete="off"
                                    name="interpreterFirstName"
                                    classes={{root: "custom-text-input"}}
                                    placeholder={`First Name`}
                                    value={localState.interpreterFirstName || ''}
                                    onChange={e => onChange(e, 'interpreterFirstName', e.target.value)}
                                    onBlur={e => onChange(e, 'interpreterFirstName', e.target.value)}
                                    required
                                />
                            </MDBCol>
                            <MDBCol>
                                <TextField
                                    label="Interpreter's Last Name"
                                    error={!!errorMsg.interpreterLastName}
                                    helperText={errorMsg.interpreterLastName}
                                    type="text"
                                    id={`interpreterLastName`}
                                    autoComplete="off"
                                    name="interpreterLastName"
                                    classes={{root: "custom-text-input"}}
                                    placeholder={`Last Name`}
                                    value={localState.interpreterLastName || ''}
                                    onChange={e => onChange(e, 'interpreterLastName', e.target.value)}
                                    onBlur={e => onChange(e, 'interpreterLastName', e.target.value)}
                                    required
                                />
                            </MDBCol>
                        </MDBRow>

                        <MDBRow center className={`mb-2`}>
                            <TextField
                                label="Interpreter's Business or Organization Name"
                                type="text"
                                id={`interpreterOrg`}
                                autoComplete="off"
                                name="interpreterOrg"
                                classes={{root: "custom-text-input"}}
                                placeholder={`Organization Name`}
                                value={localState.interpreterOrg || ''}
                                onChange={e => onChange(e, 'interpreterOrg', e.target.value)}
                            />
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

export default Step31;
