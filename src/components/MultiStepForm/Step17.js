import React, {useState, useEffect} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBRow} from "mdbreact";
import Step from "./Step";
import BackBtn from "../../assets/back-btn.png";
import {fieldValidator} from "./validator";
import TextField from "@material-ui/core/TextField";
import CustomCheckBox from "../../shared/utility";
import {FormControlLabel} from "@material-ui/core";
import InputMask from "react-input-mask";

export default function Step17(props) {
    const {state, prevStep, nextStep, history} = props;
    const [errorMsg, setErrorMsg] = useState({});
    const [dontHaveCell, setDontHaveCell] = useState(true);
    const [dontHaveEmail, setDontHaveEmail] = useState(true);

    useEffect(() => {
        if(props.state.beneficiaryInfo.contactInfo.cellNumber){
            setDontHaveCell(false);
        }
        if(props.state.beneficiaryInfo.contactInfo.email){
            setDontHaveEmail(false);
        }
    }, []);


    const onChange = (e, fieldName, value) => {
        let updatedState = {...state};
        let errors = {...errorMsg};
        switch (fieldName) {
            case 'phnNumber':
            case 'cellNumber':
                updatedState.beneficiaryInfo.contactInfo[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.beneficiaryInfo.contactInfo, 'required', errors).error)
                break;
            case 'email':
                updatedState.beneficiaryInfo.contactInfo[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.beneficiaryInfo.contactInfo, 'email', errors).error)
                break;
            case 'dontHaveCell':
                setDontHaveCell(!dontHaveCell);
                delete updatedState.beneficiaryInfo.contactInfo.cellNumber;
                delete errors.cellNumber;
                setErrorMsg(errors);
                break;
            case 'dontHaveEmail':
                setDontHaveEmail(!dontHaveEmail);
                delete updatedState.beneficiaryInfo.contactInfo.email;
                delete errors.email;
                setErrorMsg(errors);
                break;
            default:
                break;
        }
        props.onChangeState(updatedState);
    };


    const onNext = () => {
        let errors = {};
        let newForm = {};
        newForm = fieldValidator('phnNumber', state.beneficiaryInfo.contactInfo, 'phone', errors);

        if (!dontHaveCell)
            newForm = fieldValidator('cellNumber', state.beneficiaryInfo.contactInfo, 'phone', newForm.error);

        if (!dontHaveEmail)
            newForm = fieldValidator('email', state.beneficiaryInfo.contactInfo, 'email', newForm.error);

        if (newForm.isValid) {
            props.history.push(nextStep);
        } else {
            setErrorMsg(newForm.error);
        }

    };

    return (
        <Step
            heading={`Information about Beneficiaries!`}
        >
            <img
                src={BackBtn}
                className="btn-back"
                alt={`Back`}
                onClick={() => history.push(prevStep)}
            />
            <MDBContainer>
                <MDBRow center>
                    <MDBCol md={`10`} lg={`8`}>

                        <h4 className="mb-2 text-center">
                            What is your immigrating relative's daytime phone number?
                        </h4>

                        <MDBRow center className={`mb-2`}>
                            <InputMask
                                mask="(999)999-9999"
                                id={`phnNumber`}
                                value={state.beneficiaryInfo.contactInfo.phnNumber || ''}
                                onChange={e => onChange(e, 'phnNumber', e.target.value)}
                                onBlur={e => onChange(e, 'phnNumber', e.target.value)}
                                maskChar="_"
                            >
                                {() => <TextField
                                    error={!!errorMsg.phnNumber}
                                    helperText={errorMsg.phnNumber}
                                    classes={{root: "custom-text-input"}}
                                    placeholder={`Phone Number`}
                                    label="Phone Number"
                                />}
                            </InputMask>
                        </MDBRow>

                        <MDBRow center className={`mb-2`}>
                            <MDBCol lg={`7`} sm={`9`}>
                                <InputMask
                                    mask="(9-999)999-9999"
                                    id={`cellNumber`}
                                    disabled={dontHaveCell}
                                    value={state.beneficiaryInfo.contactInfo.cellNumber || ''}
                                    onChange={e => onChange(e, 'cellNumber', e.target.value)}
                                    onBlur={e => onChange(e, 'cellNumber', e.target.value)}
                                    maskChar=" "
                                >
                                    {() => <TextField
                                        error={!!errorMsg.cellNumber}
                                        disabled={dontHaveCell}
                                        helperText={errorMsg.cellNumber}
                                        label="What's your immigrating relatives cell number?"
                                        placeholder={`Cell Number`}
                                        classes={{root: "custom-text-input-medium"}}
                                    />}
                                </InputMask>
                            </MDBCol>
                            <MDBCol lg={`5`} sm={`6`}>
                                <FormControlLabel
                                    className={`mb-0 mt-2`}
                                    control={
                                        <CustomCheckBox
                                            id={`isCellNumber`}
                                            checked={dontHaveCell || false}
                                            onChange={e => onChange(e, "dontHaveCell", e.target.checked)}
                                            color="primary"
                                            inputProps={{'aria-label': 'secondary checkbox'}}
                                        />
                                    }
                                    label={(<span className={`labelClass`}>Don't have cell number</span>)}
                                />
                            </MDBCol>
                        </MDBRow>

                        <MDBRow center className={`mb-2`}>
                            <MDBCol lg={`7`} sm={`9`}>
                                <TextField
                                    error={!!errorMsg.email}
                                    helperText={errorMsg.email}
                                    label="What's your immigrating relatives email address?"
                                    type="text"
                                    id={`email`}
                                    name="email"
                                    value={state.beneficiaryInfo.contactInfo.email || ''}
                                    placeholder={`Email Address`}
                                    classes={{root: "custom-text-input-medium"}}
                                    disabled={dontHaveEmail}
                                    onChange={e => onChange(e, 'email', e.target.value)}
                                    onBlur={e => onChange(e, 'email', e.target.value)}
                                    required
                                />
                            </MDBCol>
                            <MDBCol lg={`5`} sm={`6`}>
                                <FormControlLabel
                                    className={`mb-0 mt-2`}
                                    control={
                                        <CustomCheckBox
                                            id={`isEmail`}
                                            checked={dontHaveEmail || false}
                                            onChange={e => onChange(e, "dontHaveEmail", e.target.checked)}
                                            color="primary"
                                            inputProps={{'aria-label': 'secondary checkbox'}}
                                        />
                                    }
                                    label={(<span className={`labelClass`}>Don't have email address</span>)}
                                />
                            </MDBCol>
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
