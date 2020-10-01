import React, {useState} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBRow} from "mdbreact";
import Step from "./Step";
import BackBtn from "../../assets/back-btn.png";
import {fieldValidator} from "./validator";
import TextField from "@material-ui/core/TextField";
import {DatePicker} from "@material-ui/pickers";
import {COUNTRY_LIST} from "../../shared/referenceData";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CustomCheckBox from "../../shared/utility";
import {FormControlLabel} from "@material-ui/core";

export default function Step15(props) {
    const {state, prevStep, nextStep, history} = props;
    const [errorMsg, setErrorMsg] = useState({});

    const onChange = (e, fieldName, value) => {
        let updatedState = {...state};
        let errors = {...errorMsg};
        switch (fieldName) {
            case 'prevNamesToggle':
                updatedState.beneficiaryInfo.isPrevNames = !updatedState.beneficiaryInfo.isPrevNames;
                updatedState.beneficiaryInfo.prevfname = "";
                updatedState.beneficiaryInfo.prevlname = "";
                updatedState.beneficiaryInfo.prevMName = "";
                delete errors.prevfname;
                delete errors.prevlname;
                delete errors.prevMName;
                setErrorMsg(errors);
                break;
            case 'prevfname':
            case 'prevlname':
            case 'prevMName':
                updatedState.beneficiaryInfo[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.beneficiaryInfo, 'requiredWithSpace', errorMsg).error);
                break;
            case 'city':
                updatedState.beneficiaryInfo[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.beneficiaryInfo, 'required', errorMsg).error);
                break;
            case 'country':
                updatedState.beneficiaryInfoCountry = value;
                updatedState.beneficiaryInfo[fieldName] = value.code;
                setErrorMsg(fieldValidator(fieldName, updatedState.beneficiaryInfo, 'required', errorMsg).error);
                break;
            case 'dateOfBirth':
                updatedState.beneficiaryInfo[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.beneficiaryInfo, 'required', errorMsg).error);
                break;
            case 'isPetitionFiled':
                updatedState.beneficiaryInfo[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.beneficiaryInfo, 'requiredBool', errorMsg).error);
                break;
            case 'gender':
                updatedState.beneficiaryInfo.gender = value;
                setErrorMsg(fieldValidator('gender', updatedState.beneficiaryInfo, 'required', errors).error);
                break;
            default:
                break;
        }
        props.onChangeState(updatedState);
    };


    const onNext = () => {
        let errors = {};
        if (state.beneficiaryInfo.isPrevNames) {
            errors = fieldValidator('prevfname', state.beneficiaryInfo, 'requiredWithSpace', errors).error;
            errors = fieldValidator('prevlname', state.beneficiaryInfo, 'requiredWithSpace', errors).error;
            errors = fieldValidator('prevMName', state.beneficiaryInfo, 'requiredWithSpace', errors).error;
        }
        errors = fieldValidator('city', state.beneficiaryInfo, 'required', errors).error;
        errors = fieldValidator('dateOfBirth', state.beneficiaryInfo, 'required', errors).error;
        errors = fieldValidator('gender', state.beneficiaryInfo, 'required', errors).error;
        errors = fieldValidator('isPetitionFiled', state.beneficiaryInfo, 'requiredBool', errors).error;
        let newForm = fieldValidator('country', state.beneficiaryInfo, 'required', errors);

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
                        <MDBRow center>
                            <FormControlLabel
                                className={`mb-0`}
                                control={
                                    <CustomCheckBox
                                        id={`prevNamesToggle`}
                                        checked={state.beneficiaryInfo.isPrevNames || false}
                                        onChange={e => onChange(e, "prevNamesToggle", e.target.checked)}
                                        color="primary"
                                        inputProps={{'aria-label': 'secondary checkbox'}}
                                    />
                                }
                                label={(<span className={`labelClass`}>Has your immigrating relative ever used any other names?</span>)}
                            />
                        </MDBRow>

                        {state.beneficiaryInfo.isPrevNames && <MDBRow center className={`mb-4`}>
                            <MDBCol md={`3`} lg={`4`}>
                                <TextField
                                    label="Previous First Name"
                                    error={!!errorMsg.prevfname}
                                    helperText={errorMsg.prevfname}
                                    type="text"
                                    id={`prevfname`}
                                    name="prevfname"
                                    placeholder={`Previous First Name`}
                                    value={state.beneficiaryInfo.prevfname || ''}
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
                                    value={state.beneficiaryInfo.prevlname || ''}
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
                                    value={state.beneficiaryInfo.prevMName || ''}
                                    onChange={e => onChange(e, 'prevMName', e.target.value)}
                                    onBlur={e => onChange(e, 'prevMName', e.target.value)}
                                    required
                                />
                            </MDBCol>
                        </MDBRow>}

                        <MDBRow center className={`mb-3`}>
                            <MDBCol>
                                <TextField
                                    label="City born in?"
                                    error={!!errorMsg.city}
                                    helperText={errorMsg.city}
                                    type="text"
                                    id={`city`}
                                    name="city"
                                    classes={{root: "custom-text-input"}}
                                    placeholder={`Born City`}
                                    value={state.beneficiaryInfo.city || ''}
                                    onChange={e => onChange(e, 'city', e.target.value)}
                                    onBlur={e => onChange(e, 'city', e.target.value)}
                                    required
                                />
                            </MDBCol>
                            <MDBCol>
                                <Autocomplete
                                    options={COUNTRY_LIST}
                                    autoHighlight={true}
                                    disableClearable={true}
                                    value={state.beneficiaryInfoCountry || null}
                                    blurOnSelect={true}
                                    id="employerCountry"
                                    placeholder={`Born Country`}
                                    onChange={(e, value) => onChange(e, 'country', value)}
                                    getOptionLabel={option => option.label || ''}
                                    renderInput={params => (
                                        <TextField
                                            {...params}
                                            label="Country born in?"
                                            classes={{root: "custom-text-input"}}
                                            error={!!errorMsg.country}
                                            helperText={errorMsg.country}
                                            inputProps={{
                                                ...params.inputProps
                                            }}
                                        />
                                    )}
                                />
                            </MDBCol>
                        </MDBRow>

                        <MDBRow center className={`mb-3`}>
                            <MDBCol>
                                <DatePicker
                                    label="Beneficiary's Date of Birth"
                                    variant="inline"
                                    id={`dob`}
                                    name="dob"
                                    format="dd/MM/yyyy"
                                    error={!!errorMsg.dateOfBirth}
                                    helperText={errorMsg.dateOfBirth}
                                    value={state.beneficiaryInfo.dateOfBirth || null}
                                    autoOk={true}
                                    disableFuture={true}
                                    classes={{root: "custom-text-input"}}
                                    placeholder={`Date of Birth`}
                                    onChange={e => onChange(e, 'dateOfBirth', e.toLocaleDateString())}
                                />
                            </MDBCol>
                            <MDBCol>
                                <h4 className={`text-center`}>Gender</h4>
                                <MDBRow center>
                                    <FormControlLabel
                                        className={`mb-0`}
                                        control={
                                            <CustomCheckBox
                                                id={`genderMale`}
                                                checked={state.beneficiaryInfo.gender === "Male" || false}
                                                onChange={e => onChange(e, "gender", "Male")}
                                                color="primary"
                                                inputProps={{'aria-label': 'secondary checkbox'}}
                                            />
                                        }
                                        label={(<span className={`labelClass`}>Male</span>)}
                                    />
                                    <FormControlLabel
                                        className={`mb-0`}
                                        control={
                                            <CustomCheckBox
                                                id={`genderFemale`}
                                                checked={state.beneficiaryInfo.gender === "Female" || false}
                                                onChange={e => onChange(e, "gender", "Female")}
                                                color="primary"
                                                inputProps={{'aria-label': 'secondary checkbox'}}
                                            />
                                        }
                                        label={(<span className={`labelClass`}>Female</span>)}
                                    />
                                </MDBRow>
                            </MDBCol>
                        </MDBRow>

                        <h4 className={`mb-2 text-center`}>Has anyone else ever filed a petition for the
                            beneficiary?</h4>

                        <MDBRow center className={`mb-2`}>
                            <FormControlLabel
                                className={`mb-0`}
                                control={
                                    <CustomCheckBox
                                        id={`petitionFiledYes`}
                                        checked={state.beneficiaryInfo.isPetitionFiled || false}
                                        onChange={e => onChange(e, "isPetitionFiled", true)}
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
                                        id={`petitionFiledNo`}
                                        checked={state.beneficiaryInfo.isPetitionFiled === false || false}
                                        onChange={e => onChange(e, "isPetitionFiled", false)}
                                        color="primary"
                                        inputProps={{'aria-label': 'secondary checkbox'}}
                                    />
                                }
                                label={(<span className={`labelClass`}>No</span>)}
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
