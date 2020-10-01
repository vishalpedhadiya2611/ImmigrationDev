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

export default function Step21(props) {
    const {state, prevStep, nextStep, history} = props;
    const [errorMsg, setErrorMsg] = useState({});
    const [expireType, setExpireType] = useState('date');

    const entryInfoState = state.beneficiaryInfo.entryInfo;

    const onChange = (e, fieldName, value) => {
        let updatedState = {...state};
        let errors = {...errorMsg};
        switch (fieldName) {
            case 'isBeenToUSA':
                updatedState.beneficiaryInfo.entryInfo = {
                    [fieldName]: value
                };
                errors = {};
                setErrorMsg(fieldValidator(fieldName, updatedState.beneficiaryInfo.entryInfo, 'requiredBool', errors).error);
                break;
            case 'currentlyInUSA':
                updatedState.beneficiaryInfo.entryInfo[fieldName] = value;
                updatedState.beneficiaryInfo.entryInfo = {
                    isBeenToUSA: updatedState.beneficiaryInfo.entryInfo.isBeenToUSA,
                    [fieldName]: value
                };
                errors = {};
                setErrorMsg(fieldValidator(fieldName, updatedState.beneficiaryInfo.entryInfo, 'requiredBool', errors).error);
                break;
            case 'admissionOfArrival':
            case 'dateOfArrival':
            case 'passportNumber':
            case 'stayExpire':
            case 'travelDocNumber':
            case 'expireDateOfDoc':
                updatedState.beneficiaryInfo.entryInfo[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.beneficiaryInfo.entryInfo, 'required', errors).error);
                break;
            case 'adRecordNumber':
                updatedState.beneficiaryInfo.entryInfo[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.beneficiaryInfo.entryInfo, 'adNumber', errors).error);
                break;
            case 'dateOfStayExpireType':
                setExpireType(value);
                delete updatedState.beneficiaryInfo.entryInfo.stayExpire;
                delete errors.stayExpire;
                setErrorMsg(errors);
                break;
            case 'docIssuanceCountry':
                updatedState.beneficiaryInfo.entryInfo[fieldName] = value.code;
                updatedState.docIssuanceCountry = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.beneficiaryInfo.entryInfo, "required", errors).error);
                break;
            default:
                break;
        }
        props.onChangeState(updatedState);
    };

    const onNext = () => {
        let errors = {};
        let newForm = {isValid: true, error: {}};
        const entryInfoState = state.beneficiaryInfo.entryInfo;

        newForm = fieldValidator('isBeenToUSA', entryInfoState, 'requiredBool', errors);

        if (entryInfoState.isBeenToUSA) {
            newForm = fieldValidator('currentlyInUSA', entryInfoState, 'requiredBool', newForm.error);
        }

        if (entryInfoState.isBeenToUSA && entryInfoState.currentlyInUSA) {
            errors = fieldValidator('dateOfArrival', entryInfoState, 'required', errors).error;
            errors = fieldValidator('passportNumber', entryInfoState, 'required', errors).error;
            errors = fieldValidator('stayExpire', entryInfoState, 'required', errors).error;
            errors = fieldValidator('adRecordNumber', entryInfoState, 'adNumber', errors).error;
            errors = fieldValidator('travelDocNumber', entryInfoState, 'required', errors).error;
            errors = fieldValidator('expireDateOfDoc', entryInfoState, 'required', errors).error;
            errors = fieldValidator('docIssuanceCountry', entryInfoState, 'required', errors).error;
            newForm = fieldValidator('admissionOfArrival', entryInfoState, 'required', errors);
        }

        if (newForm.isValid) {
            props.history.push(nextStep);
        } else {
            setErrorMsg(newForm.error);
        }
    };

    return (
        <Step
            heading={`Beneficiary's Entry Information`}
        >
            <img
                src={BackBtn}
                className="btn-back"
                alt={`Back`}
                onClick={() => {
                    if (state.beneficiaryInfo.maritalInfo.status === "married" ||
                        state.beneficiaryInfo.maritalInfo.status === "separated") {
                        history.push(prevStep);
                    } else if (state.beneficiaryInfo.maritalInfo.status === "single" ||
                        state.beneficiaryInfo.maritalInfo.status === "neverMarried") {
                        history.push('/start/18');
                    } else {
                        history.push('/start/19');
                    }
                }}
            />
            <MDBContainer>
                <MDBRow center>
                    <MDBCol md={`10`} lg={`8`}>

                        <h4 className={`mb-2 text-center`}>Has your immigrating relative ever been in the United
                            States?</h4>

                        <MDBRow center className={`mb-2`}>
                            <FormControlLabel
                                className={`mb-0 mt-2`}
                                control={
                                    <CustomCheckBox
                                        id={`isBeenToUSA`}
                                        checked={entryInfoState.isBeenToUSA || false}
                                        onChange={e => onChange(e, 'isBeenToUSA', true)}
                                        color="primary"
                                        inputProps={{'aria-label': 'secondary checkbox'}}
                                    />
                                }
                                label={(<span className={`labelClass`}>Yes</span>)}
                            />
                            <FormControlLabel
                                className={`mb-0 mt-2`}
                                control={
                                    <CustomCheckBox
                                        id={`isBeenToUSANo`}
                                        checked={entryInfoState.isBeenToUSA === false || false}
                                        onChange={e => onChange(e, 'isBeenToUSA', false)}
                                        color="primary"
                                        inputProps={{'aria-label': 'secondary checkbox'}}
                                    />
                                }
                                label={(<span className={`labelClass`}>No</span>)}
                            />
                        </MDBRow>

                        {entryInfoState.isBeenToUSA && <React.Fragment>
                            <h4 className="text-center mb-2 mt-2">Is your immigrating relative currently in the United
                                States?</h4>

                            <MDBRow center className={`mb-2`}>
                                <FormControlLabel
                                    className={`mb-0 mt-2`}
                                    control={
                                        <CustomCheckBox
                                            id={`currentlyInUSA`}
                                            checked={entryInfoState.currentlyInUSA || false}
                                            onChange={e => onChange(e, 'currentlyInUSA', true)}
                                            color="primary"
                                            inputProps={{'aria-label': 'secondary checkbox'}}
                                        />
                                    }
                                    label={(<span className={`labelClass`}>Yes</span>)}
                                />
                                <FormControlLabel
                                    className={`mb-0 mt-2`}
                                    control={
                                        <CustomCheckBox
                                            id={`currentlyInUSANo`}
                                            checked={entryInfoState.currentlyInUSA === false || false}
                                            onChange={e => onChange(e, 'currentlyInUSA', false)}
                                            color="primary"
                                            inputProps={{'aria-label': 'secondary checkbox'}}
                                        />
                                    }
                                    label={(<span className={`labelClass`}>No</span>)}
                                />
                            </MDBRow>

                            {entryInfoState.currentlyInUSA && <React.Fragment>
                                <MDBRow center className={`mb-2`}>
                                    <MDBCol>
                                        <TextField
                                            label="Arrival Class of Admission"
                                            type="text"
                                            id={`admissionOfArrival`}
                                            name="admissionOfArrival"
                                            error={!!errorMsg.admissionOfArrival}
                                            helperText={errorMsg.admissionOfArrival}
                                            value={entryInfoState.admissionOfArrival || ''}
                                            placeholder={`Class of Admission`}
                                            classes={{root: "custom-text-input"}}
                                            onChange={e => onChange(e, 'admissionOfArrival', e.target.value)}
                                            onBlur={e => onChange(e, 'admissionOfArrival', e.target.value)}
                                            required
                                        />
                                    </MDBCol>
                                    <MDBCol>
                                        <TextField
                                            label="Form I-94 A-D Record Number"
                                            type="number"
                                            id={`adRecordNumber`}
                                            name="adRecordNumber"
                                            error={!!errorMsg.adRecordNumber}
                                            helperText={errorMsg.adRecordNumber}
                                            value={entryInfoState.adRecordNumber || ''}
                                            placeholder={`Arrival-Departure Record Number`}
                                            classes={{root: "custom-text-input"}}
                                            onChange={e => onChange(e, 'adRecordNumber', e.target.value)}
                                            onBlur={e => onChange(e, 'adRecordNumber', e.target.value)}
                                            required
                                        />
                                    </MDBCol>
                                </MDBRow>

                                <MDBRow center className={`mb-2`}>
                                    <MDBCol>
                                        <DatePicker
                                            label="Immigrating Relative Arrival Date?"
                                            variant="inline"
                                            id={`dateOfArrival`}
                                            name={`dateOfArrival`}
                                            format="dd/MM/yyyy"
                                            error={!!errorMsg.dateOfArrival}
                                            helperText={errorMsg.dateOfArrival}
                                            value={entryInfoState.dateOfArrival || null}
                                            autoOk={true}
                                            disableFuture={true}
                                            classes={{root: "custom-text-input"}}
                                            placeholder={`Beneficiary's Arrival Date`}
                                            onChange={e => onChange(e, 'dateOfArrival', e.toLocaleDateString())}
                                            required
                                        />
                                    </MDBCol>
                                    <MDBCol>
                                        <TextField
                                            label="Immigrating Relative's Passport Number"
                                            type="text"
                                            id={`passportNumber`}
                                            name="passportNumber"
                                            error={!!errorMsg.passportNumber}
                                            helperText={errorMsg.passportNumber}
                                            value={entryInfoState.passportNumber || ''}
                                            placeholder={`Passport Number`}
                                            classes={{root: "custom-text-input"}}
                                            onChange={e => onChange(e, 'passportNumber', e.target.value)}
                                            onBlur={e => onChange(e, 'passportNumber', e.target.value)}
                                            required
                                        />
                                    </MDBCol>
                                </MDBRow>

                                <h4 className={`text-center mb-2 mt-2`}>
                                    According to your immigrating relatives form I-94 or I-95 when does his/her date
                                    authorized to stay expire?
                                </h4>

                                <MDBRow center className={`mb-2`}>
                                    <MDBCol>
                                        <FormControlLabel
                                            className={`mb-0`}
                                            control={
                                                <CustomCheckBox
                                                    id={`dateOfStayExpire`}
                                                    checked={expireType === "date" || false}
                                                    onChange={e => onChange(e, 'dateOfStayExpireType', 'date')}
                                                    color="primary"
                                                    inputProps={{'aria-label': 'secondary checkbox'}}
                                                />
                                            }
                                            label={(<span className={`labelClass`}>Date of Stay Expire</span>)}
                                        />
                                        <FormControlLabel
                                            className={`mb-0`}
                                            control={
                                                <CustomCheckBox
                                                    id={`durationOfStay`}
                                                    checked={expireType === "ds" || false}
                                                    onChange={e => onChange(e, 'dateOfStayExpireType', 'ds')}
                                                    color="primary"
                                                    inputProps={{'aria-label': 'secondary checkbox'}}
                                                />
                                            }
                                            label={(<span className={`labelClass`}>Duration of Stay</span>)}
                                        />
                                    </MDBCol>
                                    <MDBCol>
                                        {expireType === "ds" ? <TextField
                                                label={`Duration of Stay`}
                                                error={!!errorMsg.stayExpire}
                                                helperText={errorMsg.stayExpire}
                                                type="text"
                                                autoComplete="off"
                                                id={`stayExpire`}
                                                name={`stayExpire`}
                                                placeholder={`Duration of Stay`}
                                                classes={{root: "custom-text-input"}}
                                                value={entryInfoState.stayExpire || ''}
                                                onChange={(e) => onChange(e, 'stayExpire', e.target.value)}
                                                onBlur={e => onChange(e, 'stayExpire', e.target.value)}
                                                required
                                            /> :
                                            <DatePicker
                                                label="Date of Stay Expire"
                                                variant="inline"
                                                id={`dateOfExpire`}
                                                name={`dateOfExpire`}
                                                format="dd/MM/yyyy"
                                                error={!!errorMsg.stayExpire}
                                                helperText={errorMsg.stayExpire}
                                                value={entryInfoState.stayExpire || null}
                                                autoOk={true}
                                                disableFuture={true}
                                                classes={{root: "custom-text-input"}}
                                                placeholder={`Stay Expiration Date`}
                                                onChange={e => onChange(e, 'stayExpire', e.toLocaleDateString())}
                                                required
                                            />}
                                    </MDBCol>
                                </MDBRow>

                                <MDBRow center className={`mb-2`}>
                                    <MDBCol>
                                        <TextField
                                            label="Travel Document Number"
                                            type="text"
                                            id={`travelDocNumber`}
                                            name="travelDocNumber"
                                            error={!!errorMsg.travelDocNumber}
                                            helperText={errorMsg.travelDocNumber}
                                            value={entryInfoState.travelDocNumber || ''}
                                            placeholder={`Beneficiary's Travel Document Number`}
                                            classes={{root: "custom-text-input"}}
                                            onChange={e => onChange(e, 'travelDocNumber', e.target.value)}
                                            onBlur={e => onChange(e, 'travelDocNumber', e.target.value)}
                                            required
                                        />
                                    </MDBCol>
                                    <MDBCol>
                                        <Autocomplete
                                            id={`countryOfIssuance`}
                                            options={COUNTRY_LIST}
                                            autoHighlight={true}
                                            disableClearable={true}
                                            value={state.docIssuanceCountry || null}
                                            blurOnSelect={true}
                                            placeholder={"Select Country of Issuance"}
                                            onChange={(e, value) => onChange(e, 'docIssuanceCountry', value)}
                                            getOptionLabel={option => option.label || ''}
                                            renderInput={params => (
                                                <TextField
                                                    {...params}
                                                    label="Country of Passport Issuance"
                                                    error={!!errorMsg.docIssuanceCountry}
                                                    helperText={errorMsg.docIssuanceCountry}
                                                    classes={{root: "custom-text-input"}}
                                                    inputProps={{
                                                        ...params.inputProps
                                                    }}
                                                />
                                            )}
                                        />
                                    </MDBCol>
                                </MDBRow>

                                <MDBRow center className={`mb-2`}>
                                    <DatePicker
                                        label="Expiration Date for Passport"
                                        variant="inline"
                                        id={`expireDateOfDoc`}
                                        name={`expireDateOfDoc`}
                                        format="dd/MM/yyyy"
                                        error={!!errorMsg.expireDateOfDoc}
                                        helperText={errorMsg.expireDateOfDoc}
                                        value={entryInfoState.expireDateOfDoc || null}
                                        autoOk={true}
                                        disablePast={true}
                                        classes={{root: "custom-text-input"}}
                                        placeholder={`Beneficiary's Passport Expiration Date`}
                                        onChange={e => onChange(e, 'expireDateOfDoc', e.toLocaleDateString())}
                                        required
                                    />
                                </MDBRow>
                            </React.Fragment>}
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
