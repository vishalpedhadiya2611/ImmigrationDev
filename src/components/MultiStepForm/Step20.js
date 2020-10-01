import React, {useState} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBRow} from "mdbreact";
import Step from "./Step";
import BackBtn from "../../assets/back-btn.png";
import {arrayFieldsValidator, fieldValidator} from "./validator";
import TextField from "@material-ui/core/TextField";
import {DatePicker} from "@material-ui/pickers";
import {COUNTRY_LIST} from "../../shared/referenceData";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CustomCheckBox from "../../shared/utility";
import {FormControlLabel} from "@material-ui/core";

export default function Step20(props) {
    const {state, prevStep, nextStep, history} = props;
    const [errorMsg, setErrorMsg] = useState({});
    const shortState = state.beneficiaryInfo.maritalInfo;

    const chilInfoObj = {
        childFname: "",
        childMName: "",
        childLname: "",
        dateOfBirth: "",
        countryOfBirth: ""
    };

    const onChange = (e, fieldName, value) => {
        let updatedState = {...state};
        let errors = {...errorMsg};
        switch (fieldName) {
            case 'dontHaveChild':
                updatedState.beneficiaryInfo.maritalInfo.dontHaveChild = !updatedState.beneficiaryInfo.maritalInfo.dontHaveChild;
                delete updatedState.beneficiaryInfo.maritalInfo.numberOfChildren;
                delete updatedState.beneficiaryInfo.maritalInfo.childrenInfo;
                updatedState.childInfoCountryList = [];
                delete errors.numberOfChildren;
                delete errors.childrenInfo;
                setErrorMsg(errors);
                break;
            case 'numberOfChildren':
                updatedState.beneficiaryInfo.maritalInfo[fieldName] = value;
                if (value > 0) {
                    updatedState.beneficiaryInfo.maritalInfo['childrenInfo'] = [];
                } else {
                    delete updatedState.beneficiaryInfo.maritalInfo.childrenInfo;
                    updatedState.childInfoCountryList = [];
                    delete errors.childrenInfo;
                }
                setErrorMsg(fieldValidator(fieldName, updatedState.beneficiaryInfo.maritalInfo, 'nonZero', errors).error);
                break;
            default:
                break;
        }
        props.onChangeState(updatedState);
    };

    const onChildInfoChange = (e, fieldName, value, index = -1) => {
        let updatedState = {...state};
        let errors = {...errorMsg};

        switch (fieldName) {
            case 'childFname':
            case 'childMName':
            case 'childLname':
                updatedState.beneficiaryInfo.maritalInfo.childrenInfo[index][fieldName] = value;
                setErrorMsg(arrayFieldsValidator(fieldName, updatedState.beneficiaryInfo.maritalInfo, index, "requiredWithSpace", "childrenInfo", errors).error);
                break;
            case 'dateOfBirth':
                updatedState.beneficiaryInfo.maritalInfo.childrenInfo[index][fieldName] = value;
                setErrorMsg(arrayFieldsValidator(fieldName, updatedState.beneficiaryInfo.maritalInfo, index, "required", "childrenInfo", errors).error);
                break;
            case 'countryOfBirth':
                updatedState.beneficiaryInfo.maritalInfo.childrenInfo[index][fieldName] = value.code;
                updatedState.childInfoCountryList[index] = value;
                setErrorMsg(arrayFieldsValidator(fieldName, updatedState.beneficiaryInfo.maritalInfo, index, "required", "childrenInfo", errors).error);
                break;
        }
        props.onChangeState(updatedState);
    };

    const onNext = () => {
        let errors = {};
        let newForm = {isValid: true, error: {}};

        if (!shortState.dontHaveChild) {
            newForm = fieldValidator('numberOfChildren', shortState, 'nonZero', errors);

            if(newForm.isValid){
                if ((Number(shortState.numberOfChildren) === shortState.childrenInfo.length)) {
                    if (shortState.hasOwnProperty('childInfo') || shortState.numberOfChildren > 0) {
                        shortState.childrenInfo.forEach((item, index) => {
                            newForm = arrayFieldsValidator('childFname', shortState, index, "requiredWithSpace", "childrenInfo", newForm.error);
                            newForm = arrayFieldsValidator('childLname', shortState, index, "requiredWithSpace", "childrenInfo", newForm.error);
                            newForm = arrayFieldsValidator('childMName', shortState, index, "requiredWithSpace", "childrenInfo", newForm.error);
                            newForm = arrayFieldsValidator('dateOfBirth', shortState, index, "required", "childrenInfo", newForm.error);
                            newForm = arrayFieldsValidator('countryOfBirth', shortState, index, "required", "childrenInfo", newForm.error);
                        });
                    }
                } else {
                    newForm.isValid = false;
                    newForm.error = {
                        ...newForm.error,
                        msg: "Please Add Records!"
                    };
                }
            }
        } else {
            props.history.push(nextStep);
        }

        if (newForm.isValid) {
            props.history.push(nextStep);
        } else {
            setErrorMsg(newForm.error);
        }

    };

    const addChildObject = () => {
        let updatedState = {...state};
        let errors = {...errorMsg};
        updatedState.beneficiaryInfo.maritalInfo.childrenInfo.push(chilInfoObj);
        updatedState.childInfoCountryList.push({});
        if (Number(updatedState.beneficiaryInfo.maritalInfo.numberOfChildren) === updatedState.beneficiaryInfo.maritalInfo.childrenInfo.length) {
            if (errors.hasOwnProperty('msg')) {
                delete errors.msg;
            }
        }
        setErrorMsg(errors);
        props.onChangeState(updatedState);
    };

    return (
        <Step
            heading={`Beneficiary's Family Information (Spouse and Children)`}
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

                        <h4 className="text-center mb-2">How many children does your immigrating relative have?</h4>

                        <MDBRow center className={`mb-2`}>
                            <FormControlLabel
                                className={`mb-0 mt-2`}
                                control={
                                    <CustomCheckBox
                                        id={`dontHaveChild`}
                                        checked={shortState.dontHaveChild || false}
                                        onChange={e => onChange(e, 'dontHaveChild', e.target.checked)}
                                        color="primary"
                                        inputProps={{'aria-label': 'secondary checkbox'}}
                                    />
                                }
                                label={(<span className={`labelClass`}>Do not have Child?</span>)}
                            />
                        </MDBRow>
                        <MDBRow center className={`mb-2`}>
                            {!shortState.dontHaveChild && <TextField
                                error={!!errorMsg.numberOfChildren}
                                helperText={errorMsg.numberOfChildren}
                                label="Number of Children Beneficiary have"
                                type="number"
                                id={`numberOfChildren`}
                                name="numberOfChildren"
                                value={shortState.numberOfChildren || ''}
                                placeholder={`Provide how many Children the Beneficiary have`}
                                classes={{root: "custom-text-input"}}
                                disabled={shortState.dontHaveChild}
                                onChange={e => onChange(e, 'numberOfChildren', e.target.value)}
                                onBlur={e => onChange(e, 'numberOfChildren', e.target.value)}
                                required
                            />}
                        </MDBRow>

                        <div className={`childinfo-container mt-4`}>
                            {shortState.numberOfChildren > 0 && <div className={`array-list mb-2`}>
                                <span>Beneficiary's Children Information (Click the icon to add record if available) </span>
                                {!(Number(shortState.numberOfChildren) === shortState.childrenInfo.length) && <span>
                                <a onClick={addChildObject} className={`add-icon`}>
                                    +
                                </a>
                            </span>}
                            </div>}

                            {shortState.childrenInfo && shortState.childrenInfo.map((item, index) => (
                                <MDBRow center className={`mb-2 childinfo-block`} key={index}>
                                    <h4 className={`mb-2 text-center`}>{index === 0 ? 'Child Information' : 'Next Child Information'}</h4>
                                    <MDBRow center className={`mb-2`}>
                                        <MDBCol md={`3`} lg={`4`}>
                                            <TextField
                                                label="First Name"
                                                error={
                                                    !!(errorMsg.childrenInfo &&
                                                    errorMsg.childrenInfo[index] &&
                                                    errorMsg.childrenInfo[index].childFname)
                                                }
                                                helperText={
                                                    errorMsg.childrenInfo &&
                                                    errorMsg.childrenInfo[index] &&
                                                    errorMsg.childrenInfo[index].childFname
                                                }
                                                type="text"
                                                id={`childFname-${index}`}
                                                name={`childFname-${index}`}
                                                placeholder={`Child First Name`}
                                                value={item.childFname || ''}
                                                onChange={e => onChildInfoChange(e, 'childFname', e.target.value, index)}
                                                onBlur={e => onChildInfoChange(e, 'childFname', e.target.value, index)}
                                                required
                                            />
                                        </MDBCol>
                                        <MDBCol md={`3`} lg={`4`}>
                                            <TextField
                                                label="Middle Name"
                                                error={
                                                    !!(errorMsg.childrenInfo &&
                                                    errorMsg.childrenInfo[index] &&
                                                    errorMsg.childrenInfo[index].childMName)
                                                }
                                                helperText={
                                                    errorMsg.childrenInfo &&
                                                    errorMsg.childrenInfo[index] &&
                                                    errorMsg.childrenInfo[index].childMName
                                                }
                                                type="text"
                                                id={`childMName-${index}`}
                                                name={`childMName-${index}`}
                                                placeholder={`Child Middle Name`}
                                                value={item.childMName || ''}
                                                onChange={e => onChildInfoChange(e, 'childMName', e.target.value, index)}
                                                onBlur={e => onChildInfoChange(e, 'childMName', e.target.value, index)}
                                                required
                                            />
                                        </MDBCol>
                                        <MDBCol md={`3`} lg={`4`}>
                                            <TextField
                                                label="Last Name"
                                                error={
                                                    errorMsg.childrenInfo &&
                                                    errorMsg.childrenInfo[index] &&
                                                    !!errorMsg.childrenInfo[index].childLname
                                                }
                                                helperText={
                                                    errorMsg.childrenInfo &&
                                                    errorMsg.childrenInfo[index] &&
                                                    errorMsg.childrenInfo[index].childLname
                                                }
                                                type="text"
                                                id={`childLname-${index}`}
                                                name={`childLname-${index}`}
                                                placeholder={`Child Last Name`}
                                                value={item.childLname || ''}
                                                onChange={e => onChildInfoChange(e, 'childLname', e.target.value, index)}
                                                onBlur={e => onChildInfoChange(e, 'childLname', e.target.value, index)}
                                                required
                                            />
                                        </MDBCol>
                                    </MDBRow>
                                    <MDBRow center className={`mb-2`}>
                                        <MDBCol>
                                            <DatePicker
                                                label="Child born date?"
                                                variant="inline"
                                                id={`childDOB-${index}`}
                                                name={`childDOB-${index}`}
                                                format="dd/MM/yyyy"
                                                error={
                                                    errorMsg.childrenInfo &&
                                                    errorMsg.childrenInfo[index] &&
                                                    !!errorMsg.childrenInfo[index].dateOfBirth
                                                }
                                                helperText={
                                                    errorMsg.childrenInfo &&
                                                    errorMsg.childrenInfo[index] &&
                                                    errorMsg.childrenInfo[index].dateOfBirth
                                                }
                                                value={item.dateOfBirth || null}
                                                autoOk={true}
                                                disableFuture={true}
                                                classes={{root: "custom-text-input"}}
                                                placeholder={`Child's Date of Birth`}
                                                onChange={e => onChildInfoChange(e, 'dateOfBirth', e.toLocaleDateString(), index)}
                                                required
                                            />
                                        </MDBCol>
                                        <MDBCol>
                                            <Autocomplete
                                                id={`childCountryOfBirth-${index}`}
                                                options={COUNTRY_LIST}
                                                autoHighlight={true}
                                                disableClearable={true}
                                                value={state.childInfoCountryList[index] || null}
                                                blurOnSelect={true}
                                                placeholder={"Select Birth Country"}
                                                onChange={(e, value) => onChildInfoChange(e, 'countryOfBirth', value, index)}
                                                getOptionLabel={option => option.label || ''}
                                                renderInput={params => (
                                                    <TextField
                                                        {...params}
                                                        label="Country of Birth"
                                                        error={
                                                            errorMsg.childrenInfo &&
                                                            errorMsg.childrenInfo[index] &&
                                                            !!errorMsg.childrenInfo[index].countryOfBirth
                                                        }
                                                        helperText={
                                                            errorMsg.childrenInfo &&
                                                            errorMsg.childrenInfo[index] &&
                                                            errorMsg.childrenInfo[index].countryOfBirth
                                                        }
                                                        classes={{root: "custom-text-input"}}
                                                        inputProps={{
                                                            ...params.inputProps
                                                        }}
                                                    />
                                                )}
                                            />
                                        </MDBCol>
                                    </MDBRow>
                                </MDBRow>
                            ))}

                        </div>

                        <MDBRow center className="d-flex flex-column align-items-center">
                            {Object.keys(errorMsg).length > 0 && (
                                <div className="text-danger mb-2">Please Fill out all the required fields or add
                                    records</div>
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
