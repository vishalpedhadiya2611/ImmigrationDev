import React, {useEffect, useState} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBRow,} from "mdbreact";
import Step from "./Step";
import BackBtn from "../../assets/back-btn.png";
import TextField from "@material-ui/core/TextField";
import InputMask from "react-input-mask";
import {fieldValidator} from "./validator";

const Step30 = props => {
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
            case 'teleNumber':
                updatedState[fieldName] = value;
                break;
            case 'teleNumberFocusChange':
                setErrorMsg(fieldValidator('teleNumber', updatedState, 'phone', errors).error);
                break;
            case 'mobileNumber':
            case 'email':
                updatedState[fieldName] = value;
                break;
            default:
                break;
        }
        setLocalState(updatedState);
    };


    const onNext = () => {
        let newForm = fieldValidator('teleNumber', localState, 'phone', {});

        if (newForm.isValid) {
            props.onChangeState(localState);
            if (localState.understandEnglish && !localState.preparerNeeded) {
                props.history.push('/start/thankyou');
            } else {
                if (localState.understandEnglish && localState.preparerNeeded) {
                    props.history.push('/start/34');
                } else {
                    props.history.push(nextStep);
                }
            }
        } else {
            setErrorMsg(newForm.error);
        }
    };

    return (
        <Step heading={`Applicant's Contact Information`}>
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
                                <InputMask
                                    mask="(999)999-9999"
                                    id={`teleNumber`}
                                    value={localState.teleNumber || ''}
                                    onChange={e => onChange(e, 'teleNumber', e.target.value)}
                                    onBlur={e => onChange(e, 'teleNumberFocusChange', e.target.value)}
                                    required
                                    maskChar="_"
                                >
                                    {() => <TextField
                                        label="Applicant's Daytime Telephone Number"
                                        error={!!errorMsg.teleNumber}
                                        helperText={errorMsg.teleNumber}
                                        autoComplete="off"
                                        classes={{root: "custom-text-input"}}
                                        placeholder={`Phone Number`}
                                    />}
                                </InputMask>
                            </MDBCol>
                            <MDBCol>
                                <InputMask
                                    mask="(999)999-9999"
                                    id={`mobileNumber`}
                                    value={localState.mobileNumber || ''}
                                    onChange={e => onChange(e, 'mobileNumber', e.target.value)}
                                    maskChar="_"
                                >
                                    {() => <TextField
                                        label="Applicant's Mobile Telephone Number"
                                        autoComplete="off"
                                        classes={{root: "custom-text-input"}}
                                        placeholder={`Mobile Number`}
                                    />}
                                </InputMask>
                            </MDBCol>
                        </MDBRow>

                        <MDBRow center className={`mb-2`}>
                            <TextField
                                label="Applicant's Email Address"
                                type="text"
                                id={`email`}
                                autoComplete="off"
                                name="email"
                                classes={{root: "custom-text-input"}}
                                placeholder={`Email Address`}
                                value={localState.email || ''}
                                onChange={e => onChange(e, 'email', e.target.value)}
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

export default Step30;
