import React, {useEffect, useState} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBFormInline, MDBInput, MDBRow} from "mdbreact";
import Step from "./Step";
import BackBtn from "../../assets/back-btn.png";
import {fieldValidator} from "./validator";
import TextField from "@material-ui/core/TextField";
import {DatePicker} from "@material-ui/pickers";
import CustomCheckBox from "../../shared/utility";
import {FormControlLabel} from "@material-ui/core";
import Map from "./Map";
import GooglePlacesAutocomplete, {geocodeByAddress} from "react-google-places-autocomplete";

const MARITAL_STATUS = [
    {value: 'single', label: 'Single'},
    {value: 'married', label: 'Married'},
    {value: 'neverMarried', label: 'Never Married'},
    {value: 'divorced', label: 'Divorced'},
    {value: 'widowed', label: 'Widowed'},
    {value: 'separated', label: 'Separated'},
    {value: 'annulled', label: 'Annulled'}
];

export default function Step18(props) {
    const {state, prevStep, nextStep, history} = props;
    const [errorMsg, setErrorMsg] = useState({});
    const [mapLocation, setMapLocation] = useState(props.beneficiaryMaritalPlace_latlng);

    useEffect(() => {
        if (state.beneficiaryMaritalPlace_latlng) {
            setMapLocation(props.state.beneficiaryMaritalPlace_latlng);
        }
    }, []);

    useEffect(() => {
        setMapLocation(props.state.beneficiaryMaritalPlace_latlng);
    }, [props.state]);

    const onChange = (e, fieldName, value) => {
        let updatedState = {...state};
        let errors = {...errorMsg};
        switch (fieldName) {
            case 'status':
                updatedState.beneficiaryInfo.maritalInfo[fieldName] = value;
                if (value !== "separated" || value !== "married") {
                    delete updatedState.beneficiaryInfo.maritalInfo.dateOfMarriage;
                    delete updatedState.beneficiaryInfo.maritalInfo.city;
                    delete updatedState.beneficiaryInfo.maritalInfo.spouseDetails;
                    delete updatedState.beneficiaryInfo.maritalInfo.marriagePlace;
                }

                if (value === "separated" || value === "married") {
                    updatedState.beneficiaryInfo.maritalInfo['spouseDetails'] = {};
                }

                if (value !== "widowed" || value !== "divorced" || value !== "annulled") {
                    delete updatedState.beneficiaryInfo.maritalInfo.formerSpouseDetails;
                    delete updatedState.beneficiaryInfo.maritalInfo.dateOfMarriageEnd;
                    delete errors.dateOfMarriageEnd;

                }

                if (value === "widowed" || value === "divorced" || value === "annulled") {
                    updatedState.beneficiaryInfo.maritalInfo['formerSpouseDetails'] = {};
                }
                setErrorMsg(fieldValidator(fieldName, updatedState.beneficiaryInfo.maritalInfo, 'required', {}).error);
                break;
            case 'currentlyMarried':
                updatedState.beneficiaryInfo.maritalInfo[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.beneficiaryInfo.maritalInfo, 'requiredBool', errors).error);
                break;
            case 'fname':
            case 'mName':
            case 'lname':
                updatedState.beneficiaryInfo.maritalInfo.formerSpouseDetails[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.beneficiaryInfo.maritalInfo.formerSpouseDetails, 'requiredChar', errors).error);
                break;
            case 'dateOfMarriageEnd':
            case 'dateOfMarriage':
                updatedState.beneficiaryInfo.maritalInfo[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.beneficiaryInfo.maritalInfo, 'required', errors).error);
                break;
            case 'marriageCount':
                updatedState.beneficiaryInfo.maritalInfo[fieldName] = value;
                if (value > 1) {
                    updatedState.beneficiaryInfo.maritalInfo['prevSpouseDetails'] = {}
                } else {
                    delete updatedState.beneficiaryInfo.maritalInfo.prevSpouseDetails;
                }
                setErrorMsg(fieldValidator(fieldName, updatedState.beneficiaryInfo.maritalInfo, 'required', errors).error);
                break;
            case 'address':
                updatedState.beneficiaryInfo.maritalInfo['marriagePlace'] = {
                    ...updatedState.beneficiaryInfo.maritalInfo.marriagePlace,
                    ...value
                };
                updatedState['beneficiaryMaritalPlace_latlng'] = value.latLng;
                setErrorMsg(fieldValidator('street', updatedState.beneficiaryInfo.maritalInfo.marriagePlace, 'required', errors).error);
                break;
            default:
                break;
        }
        props.onChangeState(updatedState);
    };

    const onNext = () => {
        let errors = {};
        let newForm = {};
        let isSpouseInfoReq = false;
        let isSingle = false;

        errors = fieldValidator('status', state.beneficiaryInfo.maritalInfo, 'required', errors).error;
        errors = fieldValidator('currentlyMarried', state.beneficiaryInfo.maritalInfo, 'requiredBool', errors).error;
        newForm = fieldValidator('marriageCount', state.beneficiaryInfo.maritalInfo, 'required', errors);

        if (state.beneficiaryInfo.maritalInfo.status === "single" ||
            state.beneficiaryInfo.maritalInfo.status === "neverMarried") {
            isSingle = true;
        }

        if (state.beneficiaryInfo.maritalInfo.status === "married" ||
            state.beneficiaryInfo.maritalInfo.status === "separated") {
            newForm = fieldValidator('street', state.beneficiaryInfo.maritalInfo.marriagePlace, 'required', errors);
            isSpouseInfoReq = true;
        }

        if (state.beneficiaryInfo.maritalInfo.status === "divorced" ||
            state.beneficiaryInfo.maritalInfo.status === "widowed" ||
            state.beneficiaryInfo.maritalInfo.status === "annulled") {
            errors = fieldValidator('fname', state.beneficiaryInfo.maritalInfo.formerSpouseDetails, 'requiredChar', newForm.error).error;
            errors = fieldValidator('lname', state.beneficiaryInfo.maritalInfo.formerSpouseDetails, 'requiredChar', errors).error;
            errors = fieldValidator('mName', state.beneficiaryInfo.maritalInfo.formerSpouseDetails, 'requiredChar', errors).error;
            newForm = fieldValidator('dateOfMarriageEnd', state.beneficiaryInfo.maritalInfo, 'required', errors);
        }

        if (newForm.isValid) {
            if (isSingle) {
                props.history.push('/start/21');
            } else if (isSpouseInfoReq) {
                props.history.push(nextStep);
            } else {
                props.history.push('/start/20');
            }
        } else {
            setErrorMsg(newForm.error);
        }

    };

    return (
        <Step
            heading={`Beneficiary's marital information!`}
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

                        <h4 className="text-center mb-2">
                            Has the beneficiary ever been or currently Married?
                        </h4>

                        <MDBRow center className={`mb-2`}>
                            <FormControlLabel
                                className={`mb-0 mt-2`}
                                control={
                                    <CustomCheckBox
                                        id={`marriedYes`}
                                        checked={state.beneficiaryInfo.maritalInfo.currentlyMarried || false}
                                        onChange={e => onChange(e, "currentlyMarried", true)}
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
                                        id={`marriedNo`}
                                        checked={state.beneficiaryInfo.maritalInfo.currentlyMarried === false || false}
                                        onChange={e => onChange(e, "currentlyMarried", false)}
                                        color="primary"
                                        inputProps={{'aria-label': 'secondary checkbox'}}
                                    />
                                }
                                label={(<span className={`labelClass`}>No</span>)}
                            />
                        </MDBRow>

                        <MDBRow center className={`mb-2`}>
                            <TextField
                                error={!!errorMsg.marriageCount}
                                helperText={errorMsg.marriageCount}
                                label="How Many times Beneficiary is married?"
                                type="number"
                                id={`marriageCount`}
                                name="marriageCount"
                                value={state.beneficiaryInfo.maritalInfo.marriageCount || ''}
                                placeholder={`Marriage Count`}
                                classes={{root: "custom-text-input"}}
                                onChange={e => onChange(e, 'marriageCount', e.target.value)}
                                onBlur={e => onChange(e, 'marriageCount', e.target.value)}
                                required
                            />
                        </MDBRow>

                        <MDBRow center className={`mb-2`}>
                            <MDBFormInline className={`inline-components`}>
                                {MARITAL_STATUS.map((item, index) =>
                                    <FormControlLabel
                                        className={`mb-0 mt-2`}
                                        key={`maritalStatus-${index}`}
                                        control={
                                            <CustomCheckBox
                                                id={`${item.value}-${index}`}
                                                checked={state.beneficiaryInfo.maritalInfo.status === item.value || false}
                                                onChange={e => onChange(e, 'status', item.value)}
                                                color="primary"
                                                inputProps={{'aria-label': 'secondary checkbox'}}
                                            />
                                        }
                                        label={(<span className={`labelClass`}>{item.label}</span>)}
                                    />
                                )}
                            </MDBFormInline>
                        </MDBRow>

                        {(state.beneficiaryInfo.maritalInfo.status === "married" ||
                            state.beneficiaryInfo.maritalInfo.status === "separated") && <React.Fragment>

                            <h4 className={`mb-2 text-center`}>Place of Marriage</h4>

                            <MDBRow center className={`mb-2`}>
                                <DatePicker
                                    variant="inline"
                                    id="dateOfMarriage"
                                    label="Date of Marriage?"
                                    classes={{root: "custom-text-input"}}
                                    format="dd/MM/yyyy"
                                    autoOk={true}
                                    disableFuture={true}
                                    required
                                    error={!!errorMsg.dateOfMarriage}
                                    helperText={errorMsg.dateOfMarriage}
                                    value={state.beneficiaryInfo.maritalInfo.dateOfMarriage || null}
                                    onChange={e => onChange(e, 'dateOfMarriage', e.toLocaleDateString())}
                                />
                            </MDBRow>

                            <MDBRow
                                style={{
                                    display: state.beneficiaryMaritalPlace_latlng ? "block" : "none",
                                }}
                            >
                                <Map
                                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAhYZg5rq82zGh1bt8hBWs5tTSOROJcMhU&libraries=places"
                                    loadingElement={<div style={{height: `200px`}}/>}
                                    mapLocation={mapLocation}
                                    containerElement={
                                        <div
                                            className="google-map-container"
                                            style={{height: `200px`, width: "100%"}}
                                        />
                                    }
                                    mapElement={<div style={{height: `200px`}}/>}
                                />
                            </MDBRow>

                            <MDBRow center>
                                <MDBCol>
                                    <GooglePlacesAutocomplete
                                        renderInput={(props) => (
                                            <div className="custom-wrapper">
                                                <MDBInput
                                                    label="Street Address, City, State"
                                                    icon="map-marker-alt"
                                                    group
                                                    error={errorMsg.street}
                                                    type="text"
                                                    validate={true}
                                                    name="streetAddress"
                                                    required
                                                    containerClass="mb-0"
                                                    {...props}
                                                />
                                            </div>
                                        )}
                                        initialValue={(state.beneficiaryInfo.maritalInfo.marriagePlace && state.beneficiaryInfo.maritalInfo.marriagePlace.street) || ''}
                                        onSelect={({description}) => {
                                            geocodeByAddress(description).then((result) => {
                                                let state = "N/A";
                                                let city = "N/A";
                                                let zipCode = "N/A";
                                                for (let component in result[0]["address_components"]) {
                                                    for (let i in result[0]["address_components"][component]["types"]) {
                                                        if (
                                                            result[0]["address_components"][component]["types"][i] === "postal_code") {
                                                            zipCode =
                                                                result[0]["address_components"][component]["long_name"];
                                                        }

                                                        if (result[0]["address_components"][component]["types"][i] === "administrative_area_level_1") {
                                                            state = result[0]["address_components"][component]["short_name"];
                                                            city = result[0]["address_components"][1]["long_name"];
                                                        }
                                                    }
                                                }
                                                let country;
                                                result[0].address_components.forEach((item) => {
                                                    if(item.types.includes('country')){
                                                        country = item.long_name;
                                                    }
                                                });
                                                const {lat, lng} = result[0].geometry.location;
                                                const latLng = {
                                                    lat: lat(),
                                                    lng: lng(),
                                                };
                                                let addressObj = {
                                                    street: description,
                                                    state: state,
                                                    city: city,
                                                    zipCode: zipCode,
                                                    latLng: latLng,
                                                    country: country
                                                }
                                                onChange({}, 'address', addressObj);
                                                setMapLocation(latLng);
                                            });
                                        }}
                                    />
                                </MDBCol>
                            </MDBRow>

                        </React.Fragment>}

                        {(state.beneficiaryInfo.maritalInfo.status === "divorced" ||
                            state.beneficiaryInfo.maritalInfo.status === "widowed" ||
                            state.beneficiaryInfo.maritalInfo.status === "annulled") && <React.Fragment>

                            <h4 className={'text-center mb-2'}>What is your relatives previous/former Spouse's
                                Name?</h4>

                            <MDBRow center className={`mb-2`}>
                                <MDBFormInline className={`inline-components`}>
                                    <MDBCol md={`3`} lg={`4`}>
                                        <TextField
                                            label="First Name"
                                            error={!!errorMsg.fname}
                                            helperText={errorMsg.fname}
                                            type="text"
                                            id={`fname`}
                                            name="fname"
                                            placeholder={`First Name`}
                                            value={state.beneficiaryInfo.maritalInfo.formerSpouseDetails.fname || ''}
                                            onChange={e => onChange(e, 'fname', e.target.value)}
                                            onBlur={e => onChange(e, 'fname', e.target.value)}
                                            required
                                        />
                                    </MDBCol>
                                    <MDBCol md={`3`} lg={`4`}>
                                        <TextField
                                            label="Middle Name"
                                            error={!!errorMsg.mName}
                                            helperText={errorMsg.mName}
                                            type="text"
                                            id={`mName`}
                                            name="mName"
                                            placeholder={`Middle Name`}
                                            value={state.beneficiaryInfo.maritalInfo.formerSpouseDetails.mName || ''}
                                            onChange={e => onChange(e, 'mName', e.target.value)}
                                            onBlur={e => onChange(e, 'mName', e.target.value)}
                                            required
                                        />
                                    </MDBCol>
                                    <MDBCol md={`3`} lg={`4`}>
                                        <TextField
                                            label="Last Name"
                                            error={!!errorMsg.lname}
                                            helperText={errorMsg.lname}
                                            type="text"
                                            id={`lname`}
                                            name="lname"
                                            placeholder={`Last Name`}
                                            value={state.beneficiaryInfo.maritalInfo.formerSpouseDetails.lname || ''}
                                            onChange={e => onChange(e, 'lname', e.target.value)}
                                            onBlur={e => onChange(e, 'lname', e.target.value)}
                                            required
                                        />
                                    </MDBCol>
                                </MDBFormInline>
                            </MDBRow>

                            <MDBRow center className={`mb-2`}>
                                <DatePicker
                                    variant="inline"
                                    id="dateOfMarriageEnd"
                                    label="Date of Marriage End?"
                                    classes={{root: "custom-text-input"}}
                                    format="dd/MM/yyyy"
                                    autoOk={true}
                                    disableFuture={true}
                                    required
                                    error={!!errorMsg.dateOfMarriageEnd}
                                    helperText={errorMsg.dateOfMarriageEnd}
                                    value={state.beneficiaryInfo.maritalInfo.dateOfMarriageEnd || null}
                                    onChange={e => onChange(e, 'dateOfMarriageEnd', e.toLocaleDateString())}
                                />
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
