import React, {useEffect, useState} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBFormInline, MDBRow,} from "mdbreact";
import {
    FormControl,
    FormControlLabel,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from '@material-ui/core';
import Step from "./Step";
import BackBtn from "../../assets/back-btn.png";
import {fieldValidator} from "./validator";
import CustomCheckBox from "../../shared/utility";
import InputMask from "react-input-mask";

const Step2 = props => {
    const {state, prevStep, nextStep, history} = props;
    const [errorMsg, setErrorMsg] = useState({});
    const [fieldType, setFieldType] = useState('');

    useEffect(() => {
        setFieldType(props.state.applicantNumberType);
    }, []);


    const onChange = (e, fieldName, value) => {
        let updatedState = {...state};
        let errors = {...errorMsg};
        switch (fieldName) {
            case 'fieldType':
                setFieldType(value);
                updatedState.arNumber = '';
                updatedState.usssNumber = '';
                updatedState.uscisOAN = '';
                delete errors.fieldType;
                delete errors.arNumber;
                delete errors.usssNumber;
                delete errors.uscisOAN;
                setErrorMsg(errors);
                break;
            case 'arNumber':
                updatedState.arNumber = value;
                break;
            case 'arNumberFocusChange':
                setErrorMsg(fieldValidator('arNumber', updatedState, 'text', errorMsg).error);
                break;
            case 'uscisOAN':
                updatedState.uscisOAN = value;
                setErrorMsg(fieldValidator('uscisOAN', updatedState, 'text', errorMsg).error);
                break;
            case 'usssNumber':
                updatedState.usssNumber = value;
                break;
            case 'usssNumberFocusChange':
                setErrorMsg(fieldValidator('usssNumber', updatedState, 'text', errorMsg).error);
                break;
            case 'fname':
                updatedState.fname = value;
                setErrorMsg(fieldValidator(fieldName, updatedState, 'requiredWithSpace', errorMsg).error);
                break;
            case 'lname':
                updatedState.lname = value;
                setErrorMsg(fieldValidator(fieldName, updatedState, 'requiredWithSpace', errorMsg).error);
                break;
            case 'mName':
                updatedState.mName = value;
                setErrorMsg(fieldValidator(fieldName, updatedState, 'requiredWithSpace', errorMsg).error);
                break;
            case 'prevNamesToggle':
                updatedState.isPrevNames = !updatedState.isPrevNames;
                delete updatedState.prevfname;
                delete updatedState.prevlname;
                delete updatedState.prevMName;
                delete errors.prevfname;
                delete errors.prevlname;
                delete errors.prevMName;
                setErrorMsg(errors);
                break;
            case 'prevfname':
            case 'prevlname':
            case 'prevMName':
                updatedState[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState, 'requiredWithSpace', errorMsg).error);
                break;
            default:
                break;

        }
        props.onChangeState(updatedState);
    };

    const onNext = () => {
        let errors = {};

        if (fieldType === 'alien') {
            errors = fieldValidator('arNumber', state, 'text').error;
        } else if (fieldType === 'ssn') {
            errors = fieldValidator('usssNumber', state, 'text', errors).error;
        } else if (fieldType === 'uscis') {
            errors = fieldValidator('uscisOAN', state, 'text', errors).error;
        } else {
            errors = {
                ...errors,
                fieldType: 'Please select atleast one option!'
            }
        }

        errors = fieldValidator('fname', state, 'requiredWithSpace', errors).error;
        errors = fieldValidator('lname', state, 'requiredWithSpace', errors).error;
        let newForm = fieldValidator('mName', state, 'requiredWithSpace', errors);

        if (state.isPrevNames) {
            errors = fieldValidator('prevfname', state, 'requiredWithSpace', newForm.error).error;
            errors = fieldValidator('prevlname', state, 'requiredWithSpace', errors).error;
            newForm = fieldValidator('prevMName', state, 'requiredWithSpace', errors);
        }

        if (newForm.isValid) {
            props.onChangeState({...state, applicantNumberType: fieldType});
            props.history.push(nextStep);
        } else {
            setErrorMsg(newForm.error);
        }
    };

    return (
        <Step heading={`Information About You (Petitioner)`}>
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
                            >
                                <InputLabel id="fieldType">Select an identification option</InputLabel>
                                <Select
                                    labelId="fieldType-label"
                                    id="fieldType-select"
                                    value={fieldType || ''}
                                    onChange={e => onChange(e, 'fieldType', e.target.value)}
                                >
                                    <MenuItem value={`alien`}>Alien registration number</MenuItem>
                                    <MenuItem value={`ssn`}>United social security number</MenuItem>
                                    <MenuItem value={`uscis`}>USCIS number</MenuItem>
                                </Select>
                                <FormHelperText>{errorMsg.fieldType}</FormHelperText>
                            </FormControl>
                        </MDBRow>

                        <MDBRow center className={`mb-2`}>
                            {fieldType === 'alien' &&
                            <InputMask
                                mask="A-999999999"
                                id={`arNumber`}
                                value={state.arNumber || ''}
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
                                value={state.uscisOAN || ''}
                                onChange={e => onChange(e, 'uscisOAN', e.target.value)}
                                onBlur={e => onChange(e, 'uscisOAN', e.target.value)}
                                required
                            />}

                            {fieldType === "ssn" && <InputMask
                                mask="999-99-9999"
                                id={`usssNumber`}
                                value={state.usssNumber || ''}
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
                                    value={state.fname || ''}
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
                                    value={state.mName || ''}
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
                                    value={state.lname || ''}
                                    onChange={e => onChange(e, 'lname', e.target.value)}
                                    onBlur={e => onChange(e, 'lname', e.target.value)}
                                    required
                                />
                            </MDBCol>
                            <MDBCol>
                                <FormControlLabel
                                    className={`mb-0 mt-2`}
                                    control={
                                        <CustomCheckBox
                                            id={`prevNamesToggle`}
                                            checked={state.isPrevNames || false}
                                            onChange={e => onChange(e, "prevNamesToggle", e.target.checked)}
                                            color="primary"
                                            inputProps={{'aria-label': 'secondary checkbox'}}
                                        />
                                    }
                                    label={(<span className={`labelClass`}>Have you Ever used any other Names?</span>)}
                                />
                            </MDBCol>
                        </MDBRow>

                        {state.isPrevNames && <MDBRow center className={`mb-4`}>
                            <MDBFormInline className={`inline-components`}>
                                <MDBCol md={`3`} lg={`4`}>
                                    <TextField
                                        label="Previous First Name"
                                        error={!!errorMsg.prevfname}
                                        helperText={errorMsg.prevfname}
                                        type="text"
                                        id={`prevfname`}
                                        name="prevfname"
                                        placeholder={`Previous First Name`}
                                        value={state.prevfname || ''}
                                        onChange={e => onChange(e, 'prevfname', e.target.value)}
                                        onBlur={e => onChange(e, 'prevfname', e.target.value)}
                                        required
                                    />
                                </MDBCol>
                                <MDBCol md={`3`} lg={`4`}>
                                    <TextField
                                        label="Previous Last Name"
                                        error={!!errorMsg.prevlname}
                                        helperText={errorMsg.prevlname}
                                        type="text"
                                        id={`prevlname`}
                                        name="prevlname"
                                        placeholder={`Previous Last Name`}
                                        value={state.prevlname || ''}
                                        onChange={e => onChange(e, 'prevlname', e.target.value)}
                                        onBlur={e => onChange(e, 'prevlname', e.target.value)}
                                        required
                                    />
                                </MDBCol>
                                <MDBCol md={`3`} lg={`4`}>
                                    <TextField
                                        label="Previous Middle Name"
                                        error={!!errorMsg.prevMName}
                                        helperText={errorMsg.prevMName}
                                        type="text"
                                        id={`prevMName`}
                                        name="prevMName"
                                        placeholder={`Previous Middle Name`}
                                        value={state.prevMName || ''}
                                        onChange={e => onChange(e, 'prevMName', e.target.value)}
                                        onBlur={e => onChange(e, 'prevMName', e.target.value)}
                                        required
                                    />
                                </MDBCol>
                            </MDBFormInline>
                        </MDBRow>}

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

export default Step2;
