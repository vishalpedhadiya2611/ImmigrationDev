import React, {useEffect, useState} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBRow} from "mdbreact";
import Step from "./Step";
import {fieldValidator} from "./validator";
import {FormControlLabel} from "@material-ui/core";
import CustomCheckBox from "../../shared/utility";

const Step1 = props => {
    const {nextStep} = props;
    const [errorMsg, setErrorMsg] = useState({});
    const [localState, setLocalState] = useState(props.state);

    useEffect(() => {
        setLocalState(props.state);
    }, [props.state])

    const onChange = (e, fieldName, value) => {
        let updatedState = {...localState};
        let errors = {...errorMsg};
        switch (fieldName) {
            case 'reqFor':
                updatedState.reqFor = value;
                delete updatedState.reqForSub;
                delete updatedState.adoptRelated;
                delete updatedState.adoptCiti;
                delete errors.reqFor;
                break;
            case 'reqForSub':
                updatedState['reqForSub'] = value;
                delete updatedState.adoptRelated;
                delete errors.reqForSub;
                break;
            case 'adoptRelated':
                updatedState['adoptRelated'] = value;
                delete updatedState.reqForSub;
                delete updatedState.adoptCiti;
                delete errors.adoptRelated;
                break;
            case 'adoptCiti':
                updatedState['adoptCiti'] = value;
                delete errors.adoptCiti;
                break;
            default:
                break;
        }
        setErrorMsg(errors);
        setLocalState(updatedState);
    };

    const onNext = () => {
        let newForm;
        let errors = {};
        if (localState.reqFor === "Spouse") {
            props.history.push(nextStep);
        } else {
            newForm = fieldValidator('reqFor', localState, 'required');

            if (localState.reqFor === "Parent" || localState.reqFor === "Child") {
                newForm = fieldValidator('reqForSub', localState, 'required', errors);
            } else if (localState.reqFor === "Brother") {
                newForm = fieldValidator('adoptRelated', localState, 'requiredBool', newForm.error);
                if (localState.adoptRelated) {
                    newForm = fieldValidator('adoptCiti', localState, 'requiredBool', newForm.error);
                }
            }

            if (newForm.isValid) {
                props.onChangeState(localState);
                props.history.push(nextStep);
            } else {
                setErrorMsg(newForm.error);
            }
        }
    };

    return (
        <Step
            heading={
                "Hello, my name's madison I'm here to help you complete your I-130."
            }
        >
            <MDBContainer>
                <MDBRow center>
                    <MDBCol sm={`10`} md={`12`}>
                        <h4 className={`mb-2 mt-2 text-center`}>Which relative are you petitioning for?</h4>

                        <MDBRow center>
                            <FormControlLabel
                                className={`mb-0`}
                                control={
                                    <CustomCheckBox
                                        id={`spouse`}
                                        checked={localState.reqFor === "Spouse" || false}
                                        onChange={e => onChange(e, "reqFor", "Spouse")}
                                        color="primary"
                                        inputProps={{'aria-label': 'secondary checkbox'}}
                                    />
                                }
                                label={(<span className={`labelClass`}>Spouse</span>)}
                            />
                            <FormControlLabel
                                className={`mb-0`}
                                control={
                                    <CustomCheckBox
                                        id={`parent`}
                                        checked={localState.reqFor === "Parent" || false}
                                        onChange={e => onChange(e, "reqFor", "Parent")}
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
                                        id={`brother`}
                                        checked={localState.reqFor === "Brother" || false}
                                        onChange={e => onChange(e, "reqFor", "Brother")}
                                        color="primary"
                                        inputProps={{'aria-label': 'secondary checkbox'}}
                                    />
                                }
                                label={(<span className={`labelClass`}>Brother/Sister</span>)}
                            />
                            <FormControlLabel
                                className={`mb-0`}
                                control={
                                    <CustomCheckBox
                                        id={`child`}
                                        checked={localState.reqFor === "Child" || false}
                                        onChange={e => onChange(e, "reqFor", "Child")}
                                        color="primary"
                                        inputProps={{'aria-label': 'secondary checkbox'}}
                                    />
                                }
                                label={(<span className={`labelClass`}>Child</span>)}
                            />
                        </MDBRow>

                        {(localState.reqFor === "Parent" || localState.reqFor === "Child") && <React.Fragment>
                            <div>
                                <h3 className={`text-center`}>
                                    What best Describes your Relationship?
                                </h3>
                            </div>

                            <MDBRow center>
                                <div className={`text-center`}>
                                    <MDBRow start>
                                        <FormControlLabel
                                            className={`mb-0`}
                                            control={
                                                <CustomCheckBox
                                                    id={`parentSub1`}
                                                    checked={localState.reqForSub === "parentsMarriedAtBirth" || false}
                                                    onChange={e => onChange(e, "reqForSub", "parentsMarriedAtBirth")}
                                                    color="primary"
                                                    inputProps={{'aria-label': 'secondary checkbox'}}
                                                />
                                            }
                                            label={(<span className={`labelClass`}>Child was born to parents who were married to each other at the time of the child`s birth</span>)}
                                        />
                                    </MDBRow>
                                    <MDBRow start>
                                        <FormControlLabel
                                            className={`mb-0`}
                                            control={
                                                <CustomCheckBox
                                                    id={`parentSub2`}
                                                    checked={localState.reqForSub === "stepChildParent" || false}
                                                    onChange={e => onChange(e, "reqForSub", "stepChildParent")}
                                                    color="primary"
                                                    inputProps={{'aria-label': 'secondary checkbox'}}
                                                />
                                            }
                                            label={(<span className={`labelClass`}>Stepchild/Stepparent</span>)}
                                        />
                                    </MDBRow>
                                    <MDBRow start>
                                        <FormControlLabel
                                            className={`mb-0`}
                                            control={
                                                <CustomCheckBox
                                                    id={`parentSub3`}
                                                    checked={localState.reqForSub === "parentsNotMarriedAtBirth" || false}
                                                    onChange={e => onChange(e, "reqForSub", "parentsNotMarriedAtBirth")}
                                                    color="primary"
                                                    inputProps={{'aria-label': 'secondary checkbox'}}
                                                />
                                            }
                                            label={(
                                                <span className={`labelClass`}>Child was born to parents who were not married to each other at the time of the child`s birth</span>)}
                                        />
                                    </MDBRow>
                                    <MDBRow start>
                                        <FormControlLabel
                                            className={`mb-0`}
                                            control={
                                                <CustomCheckBox
                                                    id={`parentSub4`}
                                                    checked={localState.reqForSub === "adoptedChild" || false}
                                                    onChange={e => onChange(e, "reqForSub", "adoptedChild")}
                                                    color="primary"
                                                    inputProps={{'aria-label': 'secondary checkbox'}}
                                                />
                                            }
                                            label={(
                                                <span className={`labelClass`}>Child was adopted (not an Orphan or Hague Convention adoptee)</span>)}
                                        />
                                    </MDBRow>
                                </div>
                            </MDBRow>

                        </React.Fragment>}

                        {(localState.reqFor === "Brother") && <React.Fragment>
                            <div>
                                <h3 className={`text-center`}>
                                    Are you related by Adoption?
                                </h3>
                            </div>

                            <MDBRow center>
                                <FormControlLabel
                                    className={`mb-0`}
                                    control={
                                        <CustomCheckBox
                                            id={`yes`}
                                            checked={localState.adoptRelated || false}
                                            onChange={e => onChange(e, "adoptRelated", true)}
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
                                            id={`no`}
                                            checked={localState.adoptRelated === false || false}
                                            onChange={e => onChange(e, "adoptRelated", false)}
                                            color="primary"
                                            inputProps={{'aria-label': 'secondary checkbox'}}
                                        />
                                    }
                                    label={(<span className={`labelClass`}>No</span>)}
                                />
                            </MDBRow>
                        </React.Fragment>}

                        {localState.adoptRelated && <React.Fragment>
                            <div>
                                <h3 className={`text-center`}>
                                    Did you gain resident status or citizenship through adoption?
                                </h3>
                            </div>

                            <MDBRow center>
                                <FormControlLabel
                                    className={`mb-0`}
                                    control={
                                        <CustomCheckBox
                                            id={`yesCiti1`}
                                            checked={localState.adoptCiti || false}
                                            onChange={e => onChange(e, "adoptCiti", true)}
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
                                            id={`noCity2`}
                                            checked={localState.adoptCiti === false || false}
                                            onChange={e => onChange(e, "adoptCiti", false)}
                                            color="primary"
                                            inputProps={{'aria-label': 'secondary checkbox'}}
                                        />
                                    }
                                    label={(<span className={`labelClass`}>No</span>)}
                                />
                            </MDBRow>
                        </React.Fragment>}


                        <MDBRow center className="d-flex flex-column align-items-center">
                            {(Object.keys(errorMsg).length > 0) && (
                                <div className="text-danger mb-2">Please select atleast one option from each
                                    category</div>
                            )}
                            <MDBBtn
                                color="pink"
                                rounded
                                type="button"
                                className="z-depth-1a"
                                onClick={() => onNext()}
                            >
                                Let's Do This
                            </MDBBtn>
                        </MDBRow>

                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </Step>
    );
}
export default Step1;
