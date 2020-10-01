import React, {useState} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBFormInline, MDBInput, MDBRow,} from "mdbreact";
import Step from "./Step";
import BackBtn from "../../assets/back-btn.png";
import {fieldValidator} from "./validator";
import TextField from "@material-ui/core/TextField";
import CustomCheckBox from "../../shared/utility";
import {FormControlLabel} from "@material-ui/core";

export default function Step28(props) {
    const {state, prevStep, nextStep, history} = props;
    const [errorMsg, setErrorMsg] = useState({});

    const onChange = (e, fieldName, value) => {
        let updatedState = {...state};
        let errors = {...errorMsg};
        switch (fieldName) {
            case 'isFilingSeparateForOtherRelatives':
                updatedState[fieldName] = value;
                if (value) {
                    updatedState['petitionForOtherRelativeInfo'] = {};
                } else {
                    updatedState.petitionForOtherRelativeInfo = {};
                    updatedState.isFilingSeparateForAdditionalRelatives = undefined;
                    updatedState.petitionForAdditionalRelativeInfo = {};
                    errors = {};
                }
                setErrorMsg(fieldValidator(fieldName, updatedState, 'requiredBool', errors).error);
                break;
            case 'relativeFName':
            case 'relativeMName':
            case 'relativeLName':
            case 'relationship':
                updatedState.petitionForOtherRelativeInfo[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.petitionForOtherRelativeInfo, 'requiredWithSpace', errors).error);
                break;
            case 'isFilingSeparateForAdditionalRelatives':
                updatedState[fieldName] = value;
                if (value) {
                    updatedState['petitionForAdditionalRelativeInfo'] = {};
                } else {
                    delete updatedState.petitionForAdditionalRelativeInfo;
                    delete errors.otherRelativeFName;
                    delete errors.otherRelativeMName;
                    delete errors.otherRelativeLName;
                    delete errors.otherRelationship;
                }
                setErrorMsg(fieldValidator(fieldName, updatedState, 'requiredBool', errors).error);
                break;
            case 'otherRelativeFName':
            case 'otherRelativeMName':
            case 'otherRelativeLName':
            case 'otherRelationship':
                updatedState.petitionForAdditionalRelativeInfo[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.petitionForAdditionalRelativeInfo, 'requiredWithSpace', errors).error);
                break;
            default:
                break;
        }
        props.onChangeState(updatedState);
    };

    const onNext = () => {
        let errors = {};
        let newForm;

        newForm = fieldValidator('isFilingSeparateForOtherRelatives', state, 'requiredBool', errors);

        if (state.isFilingSeparateForOtherRelatives) {
            errors = fieldValidator('relativeFName', state.petitionForOtherRelativeInfo, 'requiredWithSpace', newForm.error).error;
            errors = fieldValidator('relativeMName', state.petitionForOtherRelativeInfo, 'requiredWithSpace', errors).error;
            errors = fieldValidator('relativeLName', state.petitionForOtherRelativeInfo, 'requiredWithSpace', errors).error;
            errors = fieldValidator('relationship', state.petitionForOtherRelativeInfo, 'requiredWithSpace', errors).error;

            newForm = fieldValidator('isFilingSeparateForAdditionalRelatives', state, 'requiredBool', errors);

            if (state.isFilingSeparateForAdditionalRelatives) {
                errors = fieldValidator('otherRelativeFName', state.petitionForAdditionalRelativeInfo, 'requiredWithSpace', newForm.error).error;
                errors = fieldValidator('otherRelativeMName', state.petitionForAdditionalRelativeInfo, 'requiredWithSpace', errors).error;
                errors = fieldValidator('otherRelativeLName', state.petitionForAdditionalRelativeInfo, 'requiredWithSpace', errors).error;
                newForm = fieldValidator('otherRelationship', state.petitionForAdditionalRelativeInfo, 'requiredWithSpace', errors);
            }
        }

        if (newForm.isValid) {
            props.history.push(nextStep);
        } else {
            setErrorMsg(newForm.error);
        }
    };

    return (
        <Step
            heading={`Information about You Filing Petition for other Relatives`}
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
                            Are you submitting separate petitions for other relatives?
                        </h4>

                        <MDBRow center className={`mb-2`}>
                            <FormControlLabel
                                className={`mb-0`}
                                control={
                                    <CustomCheckBox
                                        id={`isFilingSeparateForOtherRelativesYes`}
                                        checked={state.isFilingSeparateForOtherRelatives || false}
                                        onChange={e => onChange(e, 'isFilingSeparateForOtherRelatives', true)}
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
                                        id={`isFilingSeparateForOtherRelativesYes`}
                                        checked={state.isFilingSeparateForOtherRelatives === false || false}
                                        onChange={e => onChange(e, 'isFilingSeparateForOtherRelatives', false)}
                                        color="primary"
                                        inputProps={{'aria-label': 'secondary checkbox'}}
                                    />
                                }
                                label={(<span className={`labelClass`}>No</span>)}
                            />
                        </MDBRow>

                        {state.isFilingSeparateForOtherRelatives && <React.Fragment>
                            <h4 className="text-center mb-2">
                                What is the name of the Relative Petitioned For?
                            </h4>

                            <MDBRow center className={`mb-2`}>
                                <MDBCol md={`3`} lg={`4`}>
                                    <TextField
                                        label="First Name"
                                        error={!!errorMsg.relativeFName}
                                        helperText={errorMsg.relativeFName}
                                        type="text"
                                        id={`relativeFName`}
                                        name="relativeFName"
                                        placeholder={`First Name`}
                                        value={state.petitionForOtherRelativeInfo.relativeFName || ''}
                                        onChange={e => onChange(e, 'relativeFName', e.target.value)}
                                        onBlur={e => onChange(e, 'relativeFName', e.target.value)}
                                        required
                                    />
                                </MDBCol>
                                <MDBCol md={`3`} lg={`4`}>
                                    <TextField
                                        label="Middle Name"
                                        error={!!errorMsg.relativeMName}
                                        helperText={errorMsg.relativeMName}
                                        type="text"
                                        id={`relativeMName`}
                                        name="relativeMName"
                                        placeholder={`Middle Name`}
                                        value={state.petitionForOtherRelativeInfo.relativeMName || ''}
                                        onChange={e => onChange(e, 'relativeMName', e.target.value)}
                                        onBlur={e => onChange(e, 'relativeMName', e.target.value)}
                                        required
                                    />
                                </MDBCol>
                                <MDBCol md={`3`} lg={`4`}>
                                    <TextField
                                        label="Last Name"
                                        error={!!errorMsg.relativeLName}
                                        helperText={errorMsg.relativeLName}
                                        type="text"
                                        id={`relativeLName`}
                                        name="relativeLName"
                                        placeholder={`First Name`}
                                        value={state.petitionForOtherRelativeInfo.relativeLName || ''}
                                        onChange={e => onChange(e, 'relativeLName', e.target.value)}
                                        onBlur={e => onChange(e, '`relativeLName`', e.target.value)}
                                        required
                                    />
                                </MDBCol>
                            </MDBRow>

                            <h4 className={`text-center mb-2`}>
                                What is your Relationship with this Relative? (Select One)
                            </h4>
                            <MDBRow center className={`mb-2`}>
                                <FormControlLabel
                                    className={`mb-0`}
                                    control={
                                        <CustomCheckBox
                                            id={`spouse`}
                                            checked={state.petitionForOtherRelativeInfo.relationship === "spouse"}
                                            onChange={e => onChange(e, 'relationship', 'spouse')}
                                            color="primary"
                                            inputProps={{'aria-label': 'secondary checkbox'}}
                                        />
                                    }
                                    label={(<span className={`labelClass`}>Spouse (Husband/ Wife)</span>)}
                                />
                                <FormControlLabel
                                    className={`mb-0`}
                                    control={
                                        <CustomCheckBox
                                            id={`parent`}
                                            checked={state.petitionForOtherRelativeInfo.relationship === "parent"}
                                            onChange={e => onChange(e, 'relationship', 'parent')}
                                            color="primary"
                                            inputProps={{'aria-label': 'secondary checkbox'}}
                                        />
                                    }
                                    label={(<span className={`labelClass`}>Parent</span>)}
                                />
                                <FormControlLabel
                                    className={`mb-0`}
                                    control={
                                        <CustomCheckBox
                                            id={`siblings`}
                                            checked={state.petitionForOtherRelativeInfo.relationship === "siblings"}
                                            onChange={e => onChange(e, 'relationship', 'siblings')}
                                            color="primary"
                                            inputProps={{'aria-label': 'secondary checkbox'}}
                                        />
                                    }
                                    label={(<span className={`labelClass`}>Brother/ Sister</span>)}
                                />
                                <FormControlLabel
                                    className={`mb-0`}
                                    control={
                                        <CustomCheckBox
                                            id={`child`}
                                            checked={state.petitionForOtherRelativeInfo.relationship === "child"}
                                            onChange={e => onChange(e, 'relationship', 'child')}
                                            color="primary"
                                            inputProps={{'aria-label': 'secondary checkbox'}}
                                        />
                                    }
                                    label={(<span className={`labelClass`}>Child</span>)}
                                />
                            </MDBRow>

                            <h4 className={`mb-2 text-center`}>
                                Are you submitting separate petitions for any additional relative?
                            </h4>

                            <MDBRow center className={`mb-2`}>
                                <FormControlLabel
                                    className={`mb-0`}
                                    control={
                                        <CustomCheckBox
                                            id={`isFilingSeparateForAdditionalRelativesYes`}
                                            checked={state.isFilingSeparateForAdditionalRelatives || false}
                                            onChange={e => onChange(e, 'isFilingSeparateForAdditionalRelatives', true)}
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
                                            id={`isFilingSeparateForAdditionalRelativesNo`}
                                            checked={state.isFilingSeparateForAdditionalRelatives === false || false}
                                            onChange={e => onChange(e, 'isFilingSeparateForAdditionalRelatives', false)}
                                            color="primary"
                                            inputProps={{'aria-label': 'secondary checkbox'}}
                                        />
                                    }
                                    label={(<span className={`labelClass`}>No</span>)}
                                />
                            </MDBRow>

                            {state.isFilingSeparateForAdditionalRelatives && <React.Fragment>
                                <h4 className="text-center mb-2">
                                    What is the name of the Your Relative?
                                </h4>

                                <MDBRow center className={`mb-2`}>
                                    <MDBCol md={`3`} lg={`4`}>
                                        <TextField
                                            label="First Name"
                                            error={!!errorMsg.otherRelativeFName}
                                            helperText={errorMsg.otherRelativeFName}
                                            type="text"
                                            id={`otherRelativeFName`}
                                            name="otherRelativeFName"
                                            placeholder={`First Name`}
                                            value={state.petitionForAdditionalRelativeInfo.otherRelativeFName || ''}
                                            onChange={e => onChange(e, 'otherRelativeFName', e.target.value)}
                                            onBlur={e => onChange(e, 'otherRelativeFName', e.target.value)}
                                            required
                                        />
                                    </MDBCol>
                                    <MDBCol md={`3`} lg={`4`}>
                                        <TextField
                                            label="Middle Name"
                                            error={!!errorMsg.otherRelativeMName}
                                            helperText={errorMsg.otherRelativeMName}
                                            type="text"
                                            id={`otherRelativeMName`}
                                            name="otherRelativeMName"
                                            placeholder={`Middle Name`}
                                            value={state.petitionForAdditionalRelativeInfo.otherRelativeMName || ''}
                                            onChange={e => onChange(e, 'otherRelativeMName', e.target.value)}
                                            onBlur={e => onChange(e, 'otherRelativeMName', e.target.value)}
                                            required
                                        />
                                    </MDBCol>
                                    <MDBCol md={`3`} lg={`4`}>
                                        <TextField
                                            label="Last Name"
                                            error={!!errorMsg.otherRelativeLName}
                                            helperText={errorMsg.otherRelativeLName}
                                            type="text"
                                            id={`otherRelativeLName`}
                                            name="otherRelativeLName"
                                            placeholder={`First Name`}
                                            value={state.petitionForAdditionalRelativeInfo.otherRelativeLName || ''}
                                            onChange={e => onChange(e, 'otherRelativeLName', e.target.value)}
                                            onBlur={e => onChange(e, '`otherRelativeLName`', e.target.value)}
                                            required
                                        />
                                    </MDBCol>
                                </MDBRow>

                                <h4 className={`text-center mb-2`}>
                                    What is your Relationship with this Relative? (Select One)
                                </h4>
                                <MDBRow center className={`mb-2`}>
                                    <FormControlLabel
                                        className={`mb-0`}
                                        control={
                                            <CustomCheckBox
                                                id={`otherSpouse`}
                                                checked={state.petitionForAdditionalRelativeInfo.otherRelationship === "spouse"}
                                                onChange={e => onChange(e, 'otherRelationship', 'spouse')}
                                                color="primary"
                                                inputProps={{'aria-label': 'secondary checkbox'}}
                                            />
                                        }
                                        label={(<span className={`labelClass`}>Spouse (Husband/ Wife)</span>)}
                                    />
                                    <FormControlLabel
                                        className={`mb-0`}
                                        control={
                                            <CustomCheckBox
                                                id={`otherParent`}
                                                checked={state.petitionForAdditionalRelativeInfo.otherRelationship === "parent"}
                                                onChange={e => onChange(e, 'otherRelationship', 'parent')}
                                                color="primary"
                                                inputProps={{'aria-label': 'secondary checkbox'}}
                                            />
                                        }
                                        label={(<span className={`labelClass`}>Spouse (Husband/ Wife)</span>)}
                                    />
                                    <FormControlLabel
                                        className={`mb-0`}
                                        control={
                                            <CustomCheckBox
                                                id={`otherSiblings`}
                                                checked={state.petitionForAdditionalRelativeInfo.otherRelationship === "siblings"}
                                                onChange={e => onChange(e, 'otherRelationship', 'siblings')}
                                                color="primary"
                                                inputProps={{'aria-label': 'secondary checkbox'}}
                                            />
                                        }
                                        label={(<span className={`labelClass`}>Brother/ Sister</span>)}
                                    />
                                    <FormControlLabel
                                        className={`mb-0`}
                                        control={
                                            <CustomCheckBox
                                                id={`otherChild`}
                                                checked={state.petitionForAdditionalRelativeInfo.otherRelationship === "child"}
                                                onChange={e => onChange(e, 'otherRelationship', 'child')}
                                                color="primary"
                                                inputProps={{'aria-label': 'secondary checkbox'}}
                                            />
                                        }
                                        label={(<span className={`labelClass`}>Child</span>)}
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
