import React, {useState} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBRow,} from "mdbreact";
import Step from "./Step";
import BackBtn from "../../assets/back-btn.png";
import {fieldValidator} from "./validator";
import TextField from "@material-ui/core/TextField";
import CustomCheckBox from "../../shared/utility";
import {FormControlLabel} from "@material-ui/core";

export default function Step25(props) {
    const {state, prevStep, nextStep, history} = props;
    const [errorMsg, setErrorMsg] = useState({});

    const onChange = (e, fieldName, value) => {
        let updatedState = {...state};
        let errors = {...errorMsg};
        switch (fieldName) {
            case 'isApplyingForAdjustmentOfStatus':
                updatedState[fieldName] = value;
                if (value) {
                    updatedState['applyingForStatusChangeInfo'] = {};
                } else {
                    delete updatedState.applyingForStatusChangeInfo;
                    delete errors.city;
                    delete errors.state;
                }
                setErrorMsg(fieldValidator(fieldName, updatedState, 'requiredBool', errors).error);
                break;
            case 'city':
            case 'state':
                updatedState.applyingForStatusChangeInfo[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.applyingForStatusChangeInfo, 'required', errors).error);
                break;
            default:
                break;
        }
        props.onChangeState(updatedState);
    };

    const onNext = () => {
        let errors = {};
        let newForm;

        newForm = fieldValidator('isApplyingForAdjustmentOfStatus', state, 'requiredBool', errors);

        if (state.isApplyingForAdjustmentOfStatus) {
            errors = fieldValidator('city', state.applyingForStatusChangeInfo, 'required', newForm.error).error;
            newForm = fieldValidator('state', state.applyingForStatusChangeInfo, 'required', errors);
        }

        if (newForm.isValid) {
            props.history.push(nextStep);
        } else {
            setErrorMsg(newForm.error);
        }
    };

    return (
        <Step
            heading={`Does the below Statement applies to you?`}
        >
            <img
                src={BackBtn}
                className="btn-back"
                alt={`Back`}
                onClick={() => history.push(prevStep)}
            />
            <MDBContainer>
                <MDBRow center>
                    <MDBCol sm={`10`} md={`8`}>

                        <h4 className={`mb-2 text-center`}>
                            The beneficiary is in the United States and will apply for adjustment of status to that of a
                            lawful permanent resident at the U.S. Citizenship and Immigration Services (USCIS) office in
                        </h4>

                        <MDBRow center className={`mb-2`}>
                            <FormControlLabel
                                className={`mb-0`}
                                control={
                                    <CustomCheckBox
                                        id={`isApplyingForAdjustmentOfStatusYes`}
                                        checked={state.isApplyingForAdjustmentOfStatus || false}
                                        onChange={e => onChange(e, 'isApplyingForAdjustmentOfStatus', true)}
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
                                        id={`isApplyingForAdjustmentOfStatusNo`}
                                        checked={state.isApplyingForAdjustmentOfStatus === false || false}
                                        onChange={e => onChange(e, 'isApplyingForAdjustmentOfStatus', false)}
                                        color="primary"
                                        inputProps={{'aria-label': 'secondary checkbox'}}
                                    />
                                }
                                label={(<span className={`labelClass`}>No</span>)}
                            />
                        </MDBRow>

                        {state.isApplyingForAdjustmentOfStatus && <React.Fragment>
                            <MDBRow center className={`mb-2`}>
                                <MDBCol>
                                    <TextField
                                        label="City or Town"
                                        error={!!errorMsg.city}
                                        helperText={errorMsg.city}
                                        type="text"
                                        id={`city`}
                                        autoComplete="off"
                                        name="city"
                                        placeholder={`City`}
                                        classes={{root: "custom-text-input"}}
                                        value={state.applyingForStatusChangeInfo.city || ''}
                                        onChange={e => onChange(e, 'city', e.target.value)}
                                        onBlur={e => onChange(e, 'city', e.target.value)}
                                        required
                                    />
                                </MDBCol>
                                <MDBCol>
                                    <TextField
                                        label="State"
                                        error={!!errorMsg.state}
                                        helperText={errorMsg.state}
                                        type="text"
                                        id={`stateInfo`}
                                        autoComplete="off"
                                        name="stateInfo"
                                        placeholder={`State Name`}
                                        classes={{root: "custom-text-input"}}
                                        value={state.applyingForStatusChangeInfo.state || ''}
                                        onChange={e => onChange(e, 'state', e.target.value)}
                                        onBlur={e => onChange(e, 'state', e.target.value)}
                                        required
                                    />
                                </MDBCol>
                            </MDBRow>
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
