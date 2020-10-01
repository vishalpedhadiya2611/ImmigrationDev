import React, {useEffect, useState} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBRow,} from "mdbreact";
import Step from "./Step";
import BackBtn from "../../assets/back-btn.png";
import TextField from "@material-ui/core/TextField";
import {fieldValidator} from "./validator";

const Step34 = props => {
    const {state, prevStep, nextStep, history} = props;
    const [errorMsg, setErrorMsg] = useState({});
    const [localState, setLocalState] = useState(props.state);

    useEffect(() => {
        setLocalState(props.state);
    }, [props.state]);

    const onChange = (e, fieldName, value) => {
        let updatedState = {...localState};
        let errors = {...errorMsg};

        switch (fieldName) {
            case 'preparerFirstName':
            case 'preparerLastName':
                updatedState[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState, 'requiredWithSpace', errors).error);
                break;
            case 'preparerOrg':
                updatedState[fieldName] = value;
                break;
            default:
                break;
        }
        setLocalState(updatedState);
    };


    const onNext = () => {
        let errors = fieldValidator('preparerFirstName', localState, 'requiredWithSpace', {}).error;
        let newForm = fieldValidator('preparerLastName', localState, 'requiredWithSpace', errors);

        if (newForm.isValid) {
            props.onChangeState(localState);
            props.history.push(nextStep);
        } else {
            setErrorMsg(newForm.error);
        }
    };

    return (
        <Step heading={`Preparer's Information`}>
            <img
                src={BackBtn}
                className="btn-back"
                alt={`Back`}
                onClick={() => {
                    if(!localState.understandEnglish) {
                        history.push(prevStep);
                    } else {
                        history.push('/start/30');
                    }
                }}
            />
            <MDBContainer>
                <MDBRow center>
                    <MDBCol sm={`10`} md={`8`}>

                        <MDBRow center className={`mb-2`}>
                            <MDBCol>
                                <TextField
                                    label="Preparer's First Name"
                                    error={!!errorMsg.preparerFirstName}
                                    helperText={errorMsg.preparerFirstName}
                                    type="text"
                                    id={`preparerFirstName`}
                                    autoComplete="off"
                                    name="preparerFirstName"
                                    classes={{root: "custom-text-input"}}
                                    placeholder={`First Name`}
                                    value={localState.preparerFirstName || ''}
                                    onChange={e => onChange(e, 'preparerFirstName', e.target.value)}
                                    onBlur={e => onChange(e, 'preparerFirstName', e.target.value)}
                                    required
                                />
                            </MDBCol>
                            <MDBCol>
                                <TextField
                                    label="Preparer's Last Name"
                                    error={!!errorMsg.preparerLastName}
                                    helperText={errorMsg.preparerLastName}
                                    type="text"
                                    id={`preparerLastName`}
                                    autoComplete="off"
                                    name="preparerLastName"
                                    classes={{root: "custom-text-input"}}
                                    placeholder={`Last Name`}
                                    value={localState.preparerLastName || ''}
                                    onChange={e => onChange(e, 'preparerLastName', e.target.value)}
                                    onBlur={e => onChange(e, 'preparerLastName', e.target.value)}
                                    required
                                />
                            </MDBCol>
                        </MDBRow>

                        <MDBRow center className={`mb-2`}>
                            <TextField
                                label="Preparer's Business or Organization Name"
                                type="text"
                                id={`preparerOrg`}
                                autoComplete="off"
                                name="preparerOrg"
                                classes={{root: "custom-text-input"}}
                                placeholder={`Organization Name`}
                                value={localState.preparerOrg || ''}
                                onChange={e => onChange(e, 'preparerOrg', e.target.value)}
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

export default Step34;
