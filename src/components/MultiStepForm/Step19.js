import React, {useEffect, useState} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBRow} from "mdbreact";
import Step from "./Step";
import BackBtn from "../../assets/back-btn.png";
import {fieldValidator} from "./validator";
import TextField from "@material-ui/core/TextField";
import {DatePicker} from "@material-ui/pickers";
import {COUNTRY_LIST} from "../../shared/referenceData";
import Autocomplete from "@material-ui/lab/Autocomplete";

export default function Step19(props) {
    const {state, prevStep, nextStep, history} = props;
    const [errorMsg, setErrorMsg] = useState({});
    const [spouseInfoRequire, setSpouseInfoRequire] = useState(false);
    const [prevSpouseInfoRequire, setPrevSpouseInfoRequire] = useState(false);

    const maritalInfoState = state.beneficiaryInfo.maritalInfo;

    useEffect(() => {
        if (maritalInfoState.status === "married" ||
            maritalInfoState.status === "separated") {
            setSpouseInfoRequire(true);
        }

        if (maritalInfoState.marriageCount > 1) {
            setPrevSpouseInfoRequire(true);
        }
    }, []);

    const onChange = (e, fieldName, value) => {
        let updatedState = {...state};
        let errors = {...errorMsg};
        switch (fieldName) {
            case 'spouseFName':
            case 'spouseMName':
            case 'spouseLName':
                updatedState.beneficiaryInfo.maritalInfo.spouseDetails[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.beneficiaryInfo.maritalInfo.spouseDetails, 'requiredWithSpace', errors).error);
                break;
            case 'dateOfBirth':
                updatedState.beneficiaryInfo.maritalInfo.spouseDetails[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.beneficiaryInfo.maritalInfo.spouseDetails, 'required', errors).error);
                break;
            case 'countryOfBirth':
                updatedState.beneficiaryInfo.maritalInfo.spouseDetails[fieldName] = value.code;
                updatedState.beneSpouseBirthCountry = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.beneficiaryInfo.maritalInfo.spouseDetails, 'required', errors).error);
                break;
            case 'prevSpouseFName':
            case 'prevSpouseLName':
            case 'prevSpouseMName':
                updatedState.beneficiaryInfo.maritalInfo.prevSpouseDetails[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.beneficiaryInfo.maritalInfo.prevSpouseDetails, 'requiredWithSpace', errors).error);
                break;
            case 'dateOfMarriageEnd':
                updatedState.beneficiaryInfo.maritalInfo.prevSpouseDetails[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.beneficiaryInfo.maritalInfo.prevSpouseDetails, 'required', errors).error);
                break;
            default:
                break;
        }
        if (!updatedState.beneficiaryInfo.maritalInfo.spouseDetails.hasOwnProperty('relationship')) {
            updatedState.beneficiaryInfo.maritalInfo.spouseDetails['relationship'] = "Spouse";
        }
        props.onChangeState(updatedState);
    };


    const onNext = () => {
        let errors = {};
        let newForm = {isValid: true, error: {}};
        const maritalInfoState = state.beneficiaryInfo.maritalInfo;

        if (spouseInfoRequire) {
            errors = fieldValidator('spouseFName', maritalInfoState.spouseDetails, 'requiredWithSpace', newForm.error).error;
            errors = fieldValidator('spouseMName', maritalInfoState.spouseDetails, 'requiredWithSpace', errors).error;
            errors = fieldValidator('spouseLName', maritalInfoState.spouseDetails, 'requiredWithSpace', errors).error;
            errors = fieldValidator('dateOfBirth', maritalInfoState.spouseDetails, 'required', errors).error;
            newForm = fieldValidator('countryOfBirth', maritalInfoState.spouseDetails, 'required', errors);
        }

        if (prevSpouseInfoRequire) {
            errors = fieldValidator('prevSpouseFName', maritalInfoState.prevSpouseDetails, 'requiredWithSpace', newForm.error).error;
            errors = fieldValidator('prevSpouseLName', maritalInfoState.prevSpouseDetails, 'requiredWithSpace', errors).error;
            errors = fieldValidator('prevSpouseMName', maritalInfoState.prevSpouseDetails, 'requiredWithSpace', errors).error;
            newForm = fieldValidator('dateOfMarriageEnd', maritalInfoState.prevSpouseDetails, 'required', errors);
        }

        if (newForm.isValid) {
            props.history.push(nextStep);
        } else {
            setErrorMsg(newForm.error);
        }

    };

    return (
        <Step
            heading={`Beneficiary's Spouse Information!`}
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

                        {spouseInfoRequire && <React.Fragment>
                            <h4 className={`mb-2 text-center`}>Beneficiary's Spouse Information</h4>

                            <MDBRow center className={`mb-2`}>
                                <MDBCol md={`3`} lg={`4`}>
                                    <TextField
                                        label="First Name"
                                        error={!!errorMsg.spouseFName}
                                        helperText={errorMsg.spouseFName}
                                        type="text"
                                        id={`spouseFName`}
                                        name="spouseFName"
                                        placeholder={`First Name`}
                                        value={maritalInfoState.spouseDetails.spouseFName || ''}
                                        onChange={e => onChange(e, 'spouseFName', e.target.value)}
                                        onBlur={e => onChange(e, 'spouseFName', e.target.value)}
                                        required
                                    />
                                </MDBCol>
                                <MDBCol md={`3`} lg={`4`}>
                                    <TextField
                                        label="Middle Name"
                                        error={!!errorMsg.spouseMName}
                                        helperText={errorMsg.spouseMName}
                                        type="text"
                                        id={`spouseMName`}
                                        name="spouseMName"
                                        placeholder={`Middle Name`}
                                        value={maritalInfoState.spouseDetails.spouseMName || ''}
                                        onChange={e => onChange(e, 'spouseMName', e.target.value)}
                                        onBlur={e => onChange(e, 'spouseMName', e.target.value)}
                                        required
                                    />
                                </MDBCol>
                                <MDBCol md={`3`} lg={`4`}>
                                    <TextField
                                        label="Last Name"
                                        error={!!errorMsg.spouseLName}
                                        helperText={errorMsg.spouseLName}
                                        type="text"
                                        id={`spouseLName`}
                                        name="spouseLName"
                                        placeholder={`Last Name`}
                                        value={maritalInfoState.spouseDetails.spouseLName || ''}
                                        onChange={e => onChange(e, 'spouseLName', e.target.value)}
                                        onBlur={e => onChange(e, 'spouseLName', e.target.value)}
                                        required
                                    />
                                </MDBCol>
                            </MDBRow>

                            <MDBRow center className={`mb-2`}>
                                <MDBCol>
                                    <DatePicker
                                        variant="inline"
                                        id="dateOfBirth"
                                        label="Beneficiary's Spouse Date of Birth?"
                                        classes={{root: "custom-text-input"}}
                                        format="dd/MM/yyyy"
                                        autoOk={true}
                                        disableFuture={true}
                                        required
                                        placeholder={"Date of Birth"}
                                        error={!!errorMsg.dateOfBirth}
                                        helperText={errorMsg.dateOfBirth}
                                        value={maritalInfoState.spouseDetails.dateOfBirth || null}
                                        onChange={e => onChange(e, 'dateOfBirth', e.toLocaleDateString())}
                                    />
                                </MDBCol>
                                <MDBCol>
                                    <Autocomplete
                                        id="country"
                                        options={COUNTRY_LIST}
                                        autoHighlight={true}
                                        disableClearable={true}
                                        value={state.beneSpouseBirthCountry || null}
                                        blurOnSelect={true}
                                        placeholder={"Select Country"}
                                        onChange={(e, value) => onChange(e, 'countryOfBirth', value)}
                                        getOptionLabel={option => option.label || ''}
                                        renderInput={params => (
                                            <TextField
                                                {...params}
                                                label="Country of Birth"
                                                error={!!errorMsg.countryOfBirth}
                                                helperText={errorMsg.countryOfBirth}
                                                classes={{root: "custom-text-input"}}
                                                inputProps={{
                                                    ...params.inputProps
                                                }}
                                            />
                                        )}
                                    />
                                </MDBCol>
                            </MDBRow>
                        </React.Fragment>}

                        {prevSpouseInfoRequire && <React.Fragment>
                            <h4 className={`mb-2 text-center`}>Beneficiary's Previous Spouse Information</h4>

                            <MDBRow center className={`mb-2`}>
                                <MDBCol md={`3`} lg={`4`}>
                                    <TextField
                                        label="First Name"
                                        error={!!errorMsg.prevSpouseFName}
                                        helperText={errorMsg.prevSpouseFName}
                                        type="text"
                                        id={`prevSpouseFName`}
                                        name="prevSpouseFName"
                                        placeholder={`First Name`}
                                        value={maritalInfoState.prevSpouseDetails.prevSpouseFName || ''}
                                        onChange={e => onChange(e, 'prevSpouseFName', e.target.value)}
                                        onBlur={e => onChange(e, 'prevSpouseFName', e.target.value)}
                                        required
                                    />
                                </MDBCol>
                                <MDBCol md={`3`} lg={`4`}>
                                    <TextField
                                        label="Middle Name"
                                        error={!!errorMsg.prevSpouseMName}
                                        helperText={errorMsg.prevSpouseMName}
                                        type="text"
                                        id={`prevSpouseMName`}
                                        name="prevSpouseMName"
                                        placeholder={`Middle Name`}
                                        value={maritalInfoState.prevSpouseDetails.prevSpouseMName || ''}
                                        onChange={e => onChange(e, 'prevSpouseMName', e.target.value)}
                                        onBlur={e => onChange(e, 'prevSpouseMName', e.target.value)}
                                        required
                                    />
                                </MDBCol>
                                <MDBCol md={`3`} lg={`4`}>
                                    <TextField
                                        label="Last Name"
                                        error={!!errorMsg.prevSpouseLName}
                                        helperText={errorMsg.prevSpouseLName}
                                        type="text"
                                        id={`prevSpouseLName`}
                                        name="prevSpouseLName"
                                        placeholder={`Last Name`}
                                        value={maritalInfoState.prevSpouseDetails.prevSpouseLName || ''}
                                        onChange={e => onChange(e, 'prevSpouseLName', e.target.value)}
                                        onBlur={e => onChange(e, 'prevSpouseLName', e.target.value)}
                                        required
                                    />
                                </MDBCol>
                            </MDBRow>

                            <MDBRow center className={`mb-2`}>
                                <DatePicker
                                    variant="inline"
                                    id="dateOfMarriageEnd"
                                    label="Beneficiary's Previous Marriage End Date?"
                                    classes={{root: "custom-text-input"}}
                                    format="dd/MM/yyyy"
                                    autoOk={true}
                                    disableFuture={true}
                                    required
                                    placeholder={"Date of Marriage End"}
                                    error={!!errorMsg.dateOfMarriageEnd}
                                    helperText={errorMsg.dateOfMarriageEnd}
                                    value={maritalInfoState.prevSpouseDetails.dateOfMarriageEnd || null}
                                    onChange={e => onChange(e, 'dateOfMarriageEnd', e.toLocaleDateString())}
                                    onBlur={e => onChange(e, 'dateOfMarriageEnd', e.target.value)}
                                />
                            </MDBRow>
                        </React.Fragment>}

                        {(!spouseInfoRequire && !prevSpouseInfoRequire) && <React.Fragment>
                            <h4 className="text-center mb-2">
                                No Information is required for this category. Please click next to Proceed.
                            </h4>
                        </React.Fragment>}

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
