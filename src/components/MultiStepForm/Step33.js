import React, {useEffect, useState} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBRow,} from "mdbreact";
import Step from "./Step";
import BackBtn from "../../assets/back-btn.png";
import TextField from "@material-ui/core/TextField";
import {fieldValidator} from "./validator";
import InputMask from "react-input-mask";

const Step33 = props => {
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
            case 'interpreterTeleNumber':
                updatedState[fieldName] = value;
                break;
            case 'interpreterTeleNumberFocusChange':
                setErrorMsg(fieldValidator('interpreterTeleNumber', updatedState, 'phone', errors).error);
                break;
            case 'interpreterMobileNumber':
            case 'interpreterEmail':
                updatedState[fieldName] = value;
                break;
            default:
                break;
        }
        setLocalState(updatedState);
    };


    const onNext = () => {
        let newForm = fieldValidator('interpreterTeleNumber', localState, 'phone', {});

        if (newForm.isValid) {
            props.onChangeState(localState);

            if (localState.preparerNeeded) {
                props.history.push(nextStep);
            } else {
                props.history.push('/start/thankyou');
            }
        } else {
            setErrorMsg(newForm.error);
        }
    };

    return (
        <Step heading={`Interpreter's Contact Information`}>
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
                                    id={`interpreterTeleNumber`}
                                    value={localState.interpreterTeleNumber || ''}
                                    onChange={e => onChange(e, 'interpreterTeleNumber', e.target.value)}
                                    onBlur={e => onChange(e, 'interpreterTeleNumberFocusChange', e.target.value)}
                                    required
                                    maskChar="_"
                                >
                                    {() => <TextField
                                        label="Interpreter's Daytime Telephone Number"
                                        error={!!errorMsg.interpreterTeleNumber}
                                        helperText={errorMsg.interpreterTeleNumber}
                                        autoComplete="off"
                                        classes={{root: "custom-text-input"}}
                                        placeholder={`Daytime Telephone Number`}
                                    />}
                                </InputMask>
                            </MDBCol>
                            <MDBCol>
                                <InputMask
                                    mask="(999)999-9999"
                                    id={`interpreterMobileNumber`}
                                    value={localState.interpreterMobileNumber || ''}
                                    onChange={e => onChange(e, 'interpreterMobileNumber', e.target.value)}
                                    maskChar="_"
                                >
                                    {() => <TextField
                                        label="Interpreter's Daytime Telephone Number"
                                        autoComplete="off"
                                        classes={{root: "custom-text-input"}}
                                        placeholder={`Mobile Number`}
                                    />}
                                </InputMask>
                            </MDBCol>
                        </MDBRow>

                        <MDBRow center className={`mb-2`}>
                            <TextField
                                label="Interpreter's Email Address"
                                type="text"
                                id={`interpreterEmail`}
                                autoComplete="off"
                                name="interpreterEmail"
                                classes={{root: "custom-text-input"}}
                                placeholder={`Email Address`}
                                value={localState.interpreterEmail || ''}
                                onChange={e => onChange(e, 'interpreterEmail', e.target.value)}
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

export default Step33;
