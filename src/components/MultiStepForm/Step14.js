import React, {useEffect, useState} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBRow,} from "mdbreact";
import TextField from '@material-ui/core/TextField';
import Step from "./Step";
import BackBtn from "../../assets/back-btn.png";
import {fieldValidator} from "./validator";
import {FormControl, FormHelperText, InputLabel, MenuItem, Select} from "@material-ui/core";
import InputMask from "react-input-mask";

export default function Step14(props) {
    const {state, prevStep, nextStep, history} = props;
    const [errorMsg, setErrorMsg] = useState({});
    const [fieldType, setFieldType] = useState('');

    useEffect(() => {
        setFieldType(props.state.beneficiaryNumberType);
    }, []);

    const onChange = (e, fieldName, value) => {
        let updatedState = {...state};
        let errors = {...errorMsg};
        switch (fieldName) {
            case 'fieldType':
                setFieldType(value);
                updatedState.beneficiaryInfo.arNumber = '';
                updatedState.beneficiaryInfo.usssNumber = '';
                updatedState.beneficiaryInfo.uscisOAN = '';
                delete errors.fieldType;
                delete errors.arNumber;
                delete errors.usssNumber;
                delete errors.uscisOAN;
                setErrorMsg(errors);
                break;
            case 'arNumber':
                updatedState.beneficiaryInfo.arNumber = value;
                break;
            case 'arNumberFocusChange':
                setErrorMsg(fieldValidator('arNumber', updatedState.beneficiaryInfo, 'text', errorMsg).error);
                break;
            case 'uscisOAN':
                updatedState.beneficiaryInfo.uscisOAN = value;
                setErrorMsg(fieldValidator('uscisOAN', updatedState.beneficiaryInfo, 'text', errorMsg).error);
                break;
            case 'usssNumber':
                updatedState.beneficiaryInfo.usssNumber = value;
                break;
            case 'usssNumberFocusChange':
                setErrorMsg(fieldValidator('usssNumber', updatedState.beneficiaryInfo, 'text', errorMsg).error);
                break;
            case 'fname':
            case 'lname':
            case 'mName':
                updatedState.beneficiaryInfo[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.beneficiaryInfo, 'requiredWithSpace', errorMsg).error);
                break;
            default:
                break;

        }
        props.onChangeState(updatedState);
    };

    const onNext = () => {
        let errors = {};

        if (fieldType === 'alien') {
            errors = fieldValidator('arNumber', state.beneficiaryInfo, 'text').error;
        } else if (fieldType === 'ssn') {
            errors = fieldValidator('usssNumber', state.beneficiaryInfo, 'text', errors).error;
        } else if (fieldType === 'uscis') {
            errors = fieldValidator('uscisOAN', state.beneficiaryInfo, 'text', errors).error;
        } else {
            errors = {
                ...errors,
                fieldType: 'Please select atleast one option!'
            }
        }
        errors = fieldValidator('fname', state.beneficiaryInfo, 'requiredWithSpace', errors).error;
        errors = fieldValidator('lname', state.beneficiaryInfo, 'requiredWithSpace', errors).error;
        let newForm = fieldValidator('mName', state.beneficiaryInfo, 'requiredWithSpace', errors);

        if (newForm.isValid) {
            props.onChangeState({...state, beneficiaryNumberType: fieldType})
            props.history.push(nextStep);
        } else {
            setErrorMsg(newForm.error);
        }
    };

    return (
        <Step heading={`Information about beneficiary`}>
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
                            <FormControl
                                className={`custom-select-box`}
                                error={!!errorMsg.fieldType}
                                helpeerText={errorMsg.fieldType}
                            >
                                <InputLabel id="fieldType">Select an identification option</InputLabel>
                                <Select
                                    labelId="fieldType-label"
                                    id="fieldType-select"
                                    value={fieldType || ''}
                                    onChange={e => onChange(e, 'fieldType', e.target.value)}
                                >
                                    <MenuItem value={`alien`}>Alien Registration Number</MenuItem>
                                    <MenuItem value={`ssn`}>United Social Security Number</MenuItem>
                                    <MenuItem value={`uscis`}>USCIS Number</MenuItem>
                                </Select>
                                <FormHelperText>{errorMsg.fieldType}</FormHelperText>
                            </FormControl>
                        </MDBRow>

                        <MDBRow center className={`mb-2`}>
                            {fieldType === 'alien' && <InputMask
                                mask="A-999999999"
                                id={`arNumber`}
                                value={state.beneficiaryInfo.arNumber || ''}
                                onChange={e => onChange(e, 'arNumber', e.target.value)}
                                onBlur={e => onChange(e, 'arNumberFocusChange', e.target.value)}
                                required
                                maskChar="_"
                            >
                                {() => <TextField
                                    error={!!errorMsg.arNumber}
                                    helperText={errorMsg.arNumber}
                                    label="Alien Registration Number"
                                    name="arNumber"
                                    placeholder={`i.e. A-123456789`}
                                    classes={{root: "custom-text-input"}}
                                />}
                            </InputMask>}

                            {fieldType === "uscis" && <TextField
                                error={!!errorMsg.uscisOAN}
                                helperText={errorMsg.uscisOAN}
                                label="USCIS Online Account Number"
                                type="number"
                                classes={{root: "custom-text-input"}}
                                id={`uscisOAN`}
                                name="uscisOAN"
                                placeholder={`i.e. 123456789123`}
                                value={state.beneficiaryInfo.uscisOAN || ''}
                                disabled={state.beneficiaryInfo.dontHaveUSCIS}
                                onChange={e => onChange(e, 'uscisOAN', e.target.value)}
                                onBlur={e => onChange(e, 'uscisOAN', e.target.value)}
                                required
                            />}

                            {fieldType === "ssn" && <InputMask
                                mask="999-99-9999"
                                id={`usssNumber`}
                                value={state.beneficiaryInfo.usssNumber || ''}
                                onChange={e => onChange(e, 'usssNumber', e.target.value)}
                                onBlur={e => onChange(e, 'usssNumberFocusChange', e.target.value)}
                                required
                                maskChar="_"
                            >
                                {() => <TextField
                                    label="U.S. Social Security Number"
                                    error={!!errorMsg.usssNumber}
                                    helperText={errorMsg.usssNumber}
                                    name="usssNumber"
                                    placeholder={`i.e. 123456789`}
                                    classes={{root: "custom-text-input"}}
                                />}
                            </InputMask>}
                        </MDBRow>

                        <MDBRow center className={`mb-2`}>
                            <MDBCol>
                                <TextField
                                    label="First Name"
                                    error={!!errorMsg.fname}
                                    helperText={errorMsg.fname}
                                    type="text"
                                    id={`fname`}
                                    name="fname"
                                    placeholder={`First Name`}
                                    classes={{root: "custom-text-input"}}
                                    value={state.beneficiaryInfo.fname || ''}
                                    onChange={e => onChange(e, 'fname', e.target.value)}
                                    onBlur={e => onChange(e, 'fname', e.target.value)}
                                    required
                                />
                            </MDBCol>
                            <MDBCol>
                                <TextField
                                    label="Middle Name"
                                    error={!!errorMsg.mName}
                                    helperText={errorMsg.mName}
                                    type="text"
                                    id={`mName`}
                                    name="mName"
                                    placeholder={`Middle Name`}
                                    classes={{root: "custom-text-input"}}
                                    value={state.beneficiaryInfo.mName || ''}
                                    onChange={e => onChange(e, 'mName', e.target.value)}
                                    onBlur={e => onChange(e, 'mName', e.target.value)}
                                    required
                                />
                            </MDBCol>
                        </MDBRow>
                        <MDBRow center className={`mb-2`}>
                            <MDBCol>
                                <TextField
                                    label="Family Name"
                                    error={!!errorMsg.lname}
                                    helperText={errorMsg.lname}
                                    type="text"
                                    id={`lname`}
                                    name="lname"
                                    placeholder={`Last Name or Family Name`}
                                    classes={{root: "custom-text-input"}}
                                    value={state.beneficiaryInfo.lname || ''}
                                    onChange={e => onChange(e, 'lname', e.target.value)}
                                    onBlur={e => onChange(e, 'lname', e.target.value)}
                                    required
                                />
                            </MDBCol>
                        </MDBRow>

                        <MDBRow center className="d-flex flex-column align-items-center">
                            {Object.keys(errorMsg).length > 0 && (
                                <div className="text-danger mb-2">
                                    Please Fill out all the details
                                </div>
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
