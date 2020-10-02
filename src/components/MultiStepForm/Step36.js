import React, {useEffect, useState} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBRow,} from "mdbreact";
import Step from "./Step";
import BackBtn from "../../assets/back-btn.png";
import TextField from "@material-ui/core/TextField";
import {fieldValidator} from "./validator";
import InputMask from "react-input-mask";

const Step36 = props => {
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
            case 'preparerTeleNumber':
                updatedState[fieldName] = value;
                break;
            case 'preparerTeleNumberFocusChange':
                setErrorMsg(fieldValidator('preparerTeleNumber', updatedState, 'phone', errors).error);
                break;
            case 'preparerMobileNumber':
            case 'preparerEmail':
                updatedState[fieldName] = value;
                break;
            default:
                break;
        }
        setLocalState(updatedState);
    };


    const onNext = () => {
        let newForm = fieldValidator('preparerTeleNumber', localState, 'phone', {});

        if (newForm.isValid) {
            props.onChangeState(localState);
            props.history.push(nextStep);
        } else {
            setErrorMsg(newForm.error);
        }
    };

    return (
        <Step heading={`Preparer's Contact Information`}>
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
                                    id={`preparerTeleNumber`}
                                    value={localState.preparerTeleNumber || ''}
                                    onChange={e => onChange(e, 'preparerTeleNumber', e.target.value)}
                                    onBlur={e => onChange(e, 'preparerTeleNumberFocusChange', e.target.value)}
                                    required
                                    maskChar="_"
                                >
                                    {() => <TextField
                                        label="Preparer's Daytime Telephone Number"
                                        error={!!errorMsg.preparerTeleNumber}
                                        helperText={errorMsg.preparerTeleNumber}
                                        autoComplete="off"
                                        classes={{root: "custom-text-input"}}
                                        placeholder={`Daytime Telephone Number`}
                                    />}
                                </InputMask>
                            </MDBCol>
                            <MDBCol>
                                <InputMask
                                    mask="(999)999-9999"
                                    id={`preparerMobileNumber`}
                                    value={localState.preparerMobileNumber || ''}
                                    onChange={e => onChange(e, 'preparerMobileNumber', e.target.value)}
                                    maskChar="_"
                                >
                                    {() => <TextField
                                        label="Preparer's Mobile Telephone Number"
                                        error={!!errorMsg.preparerTeleNumber}
                                        helperText={errorMsg.preparerTeleNumber}
                                        autoComplete="off"
                                        classes={{root: "custom-text-input"}}
                                        placeholder={`Daytime Telephone Number`}
                                    />}
                                </InputMask>
                            </MDBCol>
                        </MDBRow>

                        <MDBRow center className={`mb-2`}>
                            <TextField
                                label="Preparer's Email Address"
                                type="text"
                                id={`preparerEmail`}
                                autoComplete="off"
                                name="preparerEmail"
                                classes={{root: "custom-text-input"}}
                                placeholder={`Email Address`}
                                value={localState.preparerEmail || ''}
                                onChange={e => onChange(e, 'preparerEmail', e.target.value)}
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

export default Step36;
