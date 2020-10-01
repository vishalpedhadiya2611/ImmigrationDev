import React, {useState} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBRow,} from "mdbreact";
import Step from "./Step";
import BackBtn from "../../assets/back-btn.png";
import {fieldValidator} from "./validator";
import TextField from "@material-ui/core/TextField";
import CustomCheckBox from "../../shared/utility";
import {FormControlLabel} from "@material-ui/core";

const raceValues = [
    {value: 'white', label: 'White'},
    {value: 'asian', label: 'Asian'},
    {value: 'black', label: 'Black or African American'},
    {value: 'americanIndian', label: 'American Indian or Alaska Native'},
    {value: 'nativeHawaiian', label: 'Native Hawaiian or Other Pacific Islander'}
];

const eyeColorValues = [
    {value: 'black', label: 'Black'},
    {value: 'gray', label: 'Gray'},
    {value: 'maroon', label: 'Maroon'},
    {value: 'blue', label: 'Blue'},
    {value: 'green', label: 'Green'},
    {value: 'pink', label: 'Pink'},
    {value: 'brown', label: 'Brown'},
    {value: 'hazel', label: 'Hazel'},
    {value: 'unknown', label: 'Unknown/Other'}
];

const hairColorValues = [
    {value: 'bald', label: 'Bald(No Hair)'},
    {value: 'brown', label: 'Brown'},
    {value: 'gray', label: 'Gray'},
    {value: 'sandy', label: 'Sandy'},
    {value: 'black', label: 'Black'},
    {value: 'white', label: 'White'},
    {value: 'blond', label: 'Blond'},
    {value: 'red', label: 'Red'},
    {value: 'unknown', label: 'Unknown/Other'}
];

export default function Step13(props) {
    const {state, prevStep, nextStep, history} = props;
    const [errorMsg, setErrorMsg] = useState({});

    const onChange = (e, fieldName, value) => {
        let updatedState = {...state};
        let errors = {...errorMsg};
        switch (fieldName) {
            case 'hispanicOrLatino':
                updatedState.bioGraphicInfo[fieldName] = value;
                if (!value && !updatedState.bioGraphicInfo.hasOwnProperty('race')) {
                    updatedState.bioGraphicInfo['race'] = [];
                    delete errors.race;
                } else {
                    delete updatedState.bioGraphicInfo.race;
                }
                setErrorMsg(errors);
                break;
            case 'race':
                if (updatedState.bioGraphicInfo.race.includes(value)) {
                    updatedState.bioGraphicInfo.race = updatedState.bioGraphicInfo.race.filter(item => item !== value);
                } else {
                    updatedState.bioGraphicInfo.race.push(value);
                }
                setErrorMsg(fieldValidator('race', updatedState.bioGraphicInfo, 'arrayLength', errors).error);
                break;
            case 'feet':
                updatedState.bioGraphicInfo[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.bioGraphicInfo, 'feet', errors).error);
                break;
            case 'inch':
                updatedState.bioGraphicInfo[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.bioGraphicInfo, 'inch', errors).error);
                break;
            case 'weight':
                updatedState.bioGraphicInfo[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.bioGraphicInfo, 'weight', errors).error);
                break;
            case 'eyeColor':
            case 'hairColor':
                updatedState.bioGraphicInfo[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.bioGraphicInfo, 'required', errors).error);
                break;
            default:
                break;
        }
        props.onChangeState(updatedState);
    };


    const onNext = () => {
        let errors = {};
        let newForm;
        errors = fieldValidator('feet', state.bioGraphicInfo, 'feet', errors).error;
        errors = fieldValidator('inch', state.bioGraphicInfo, 'inch', errors).error;
        errors = fieldValidator('eyeColor', state.bioGraphicInfo, 'required', errors).error;
        errors = fieldValidator('hairColor', state.bioGraphicInfo, 'required', errors).error;
        newForm = fieldValidator('weight', state.bioGraphicInfo, 'weight', errors);

        if (!state.bioGraphicInfo.hispanicOrLatino) {
            newForm = fieldValidator('race', state.bioGraphicInfo, 'arrayLength', newForm.error);
        }

        if (newForm.isValid) {
            props.history.push(nextStep);
        } else {
            setErrorMsg(newForm.error)
        }
    };

    return (
        <Step
            heading={`Biographic Information`}
        >
            <img
                src={BackBtn}
                className="btn-back"
                alt={`Back`}
                onClick={() => {
                    if (state.hasOwnProperty('prevEmployerDetails')) {
                        history.push(prevStep)
                    } else {
                        history.push('/start/11');
                    }
                }}
            />
            <MDBContainer>
                <MDBRow center>
                    <MDBCol sm={`10`} md={`8`}>

                        <h4 className={`text-center mb-2`}>Are you Hispanic or Latino?</h4>

                        <MDBRow center className={`mb-3`}>
                            <FormControlLabel
                                className={`mb-0`}
                                control={
                                    <CustomCheckBox
                                        id={`h  ispanic`}
                                        checked={state.bioGraphicInfo.hispanicOrLatino || false}
                                        onChange={e => onChange(e, "hispanicOrLatino", true)}
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
                                        id={`noHispanic`}
                                        checked={state.bioGraphicInfo.hispanicOrLatino === false || false}
                                        onChange={e => onChange(e, "hispanicOrLatino", false)}
                                        color="primary"
                                        inputProps={{'aria-label': 'secondary checkbox'}}
                                    />
                                }
                                label={(<span className={`labelClass`}>No</span>)}
                            />
                        </MDBRow>

                        {(state.bioGraphicInfo.hispanicOrLatino === false) && <React.Fragment>
                            <h4 className={`text-center mb-2`}>What race are you? (Select all that apply)</h4>

                            <MDBRow center className={`mb-2`}>
                                {raceValues.map((item, index) => {
                                    return <FormControlLabel
                                        className={`mb-0`}
                                        key={`raceValues- ${index}`}
                                        control={
                                            <CustomCheckBox
                                                id={`${item.value}-${index}`}
                                                checked={state.bioGraphicInfo.race.includes(item.value) || false}
                                                onChange={e => onChange(e, "race", item.value)}
                                                color="primary"
                                                inputProps={{'aria-label': 'secondary checkbox'}}
                                            />
                                        }
                                        label={(<span className={`labelClass`}>{item.label}</span>)}
                                    />
                                })}
                            </MDBRow>
                        </React.Fragment>}

                        <MDBRow center className={`mb-2`}>
                            <MDBCol>
                                <TextField
                                    label="Height (Feet)"
                                    error={!!errorMsg.feet}
                                    helperText={errorMsg.feet}
                                    type="number"
                                    id={`feet`}
                                    autoComplete="off"
                                    name="number"
                                    placeholder={`Your Height(Feet)`}
                                    value={state.bioGraphicInfo.feet || ''}
                                    classes={{root: "custom-text-input-small mr-2"}}
                                    onChange={e => onChange(e, 'feet', e.target.value)}
                                    onBlur={e => onChange(e, 'feet', e.target.value)}
                                    required
                                />
                                <TextField
                                    label="Height (Inch)"
                                    error={!!errorMsg.inch}
                                    helperText={errorMsg.inch}
                                    type="number"
                                    id={`inch`}
                                    autoComplete="off"
                                    name="inch"
                                    classes={{root: "custom-text-input-small"}}
                                    placeholder={`Your Height(inch)`}
                                    value={state.bioGraphicInfo.inch || ''}
                                    onChange={e => onChange(e, 'inch', e.target.value)}
                                    onBlur={e => onChange(e, 'inch', e.target.value)}
                                    required
                                />
                            </MDBCol>
                            <MDBCol>
                                <TextField
                                    label="How much do you weigh (pounds)?"
                                    error={!!errorMsg.weight}
                                    helperText={errorMsg.weight}
                                    type="text"
                                    id={`weight`}
                                    autoComplete="off"
                                    name="weight"
                                    classes={{root: "custom-text-input"}}
                                    placeholder={`Your Weight(pound)`}
                                    value={state.bioGraphicInfo.weight || ''}
                                    onChange={e => onChange(e, 'weight', e.target.value)}
                                    onBlur={e => onChange(e, 'weight', e.target.value)}
                                    required
                                />
                            </MDBCol>
                        </MDBRow>

                        <h4 className={`text-center mb-2`}>What is your Eye Color?</h4>

                        <MDBRow center className={`mb-2`}>
                            {eyeColorValues.map((item, index) =>
                                <FormControlLabel
                                    className={`mb-0`}
                                    key={`eyeColor- ${index}`}
                                    control={
                                        <CustomCheckBox
                                            id={`eyeColor-${item.value}-${index}`}
                                            checked={state.bioGraphicInfo.eyeColor === item.value || false}
                                            onChange={e => onChange(e, "eyeColor", item.value)}
                                            color="primary"
                                            inputProps={{'aria-label': 'secondary checkbox'}}
                                        />
                                    }
                                    label={(<span className={`labelClass`}>{item.label}</span>)}
                                />
                            )}
                        </MDBRow>

                        <h4 className={`text-center mb-2`}>What is your Hair Color?</h4>

                        <MDBRow center className={`mb-2`}>
                            {hairColorValues.map((item, index) =>
                                <FormControlLabel
                                    className={`mb-0`}
                                    key={`hairColor- ${index}`}
                                    control={
                                        <CustomCheckBox
                                            id={`hairColor-${item.value}-${index}`}
                                            checked={state.bioGraphicInfo.hairColor === item.value || false}
                                            onChange={e => onChange(e, "hairColor", item.value)}
                                            color="primary"
                                            inputProps={{'aria-label': 'secondary checkbox'}}
                                        />
                                    }
                                    label={(<span className={`labelClass`}>{item.label}</span>)}
                                />
                            )}
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
