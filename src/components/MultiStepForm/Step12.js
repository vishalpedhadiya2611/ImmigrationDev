import React, {useEffect, useState} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBInput, MDBRow,} from "mdbreact";
import Step from "./Step";
import BackBtn from "../../assets/back-btn.png";
import {fieldValidator} from "./validator";
import TextField from "@material-ui/core/TextField";
import {DatePicker} from "@material-ui/pickers";
import CustomCheckBox from "../../shared/utility";
import {FormControlLabel} from "@material-ui/core";
import Map from "./Map";
import GooglePlacesAutocomplete, {geocodeByAddress} from "react-google-places-autocomplete";

export default function Step12(props) {
    const {state, prevStep, nextStep, history} = props;
    const [errorMsg, setErrorMsg] = useState({});
    const [mapLocation, setMapLocation] = useState(props.prevEmployerDetails_latlng);

    useEffect(() => {
        if (state.prevEmployerDetails_latlng) {
            setMapLocation(props.state.prevEmployerDetails_latlng);
        }
    }, []);

    useEffect(() => {
        setMapLocation(props.state.prevEmployerDetails_latlng);
    }, [props.state]);

    const onChange = (e, fieldName, value) => {
        let updatedState = {...state};
        let errors = {...errorMsg};

        switch (fieldName) {
            case 'dontHavePrevPosition':
                updatedState.dontHavePrevPosition = !updatedState.dontHavePrevPosition;
                updatedState.prevEmployerDetails = {};
                updatedState.prevEmployerDetails_latlng = null;
                errors = {};
                setErrorMsg(errors);
                break;
            case 'address':
                updatedState.prevEmployerDetails['residence'] = {
                    ...updatedState.prevEmployerDetails.residence,
                    ...value
                };
                updatedState['prevEmployerDetails_latlng'] = value.latLng;
                setErrorMsg(fieldValidator('street', updatedState.prevEmployerDetails.residence, 'required', errors).error);
                break;
            case 'name':
            case 'startDate':
            case 'endDate':
            case 'occupation':
                updatedState.prevEmployerDetails[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.prevEmployerDetails, 'required', errors).error);
                break;
            default:
                break;
        }
        props.onChangeState(updatedState);
    };


    const onNext = () => {
        let errors = {};
        let newForm;

        if (!state.dontHavePrevPosition) {
            errors = fieldValidator('name', state.prevEmployerDetails, 'required', errors).error;
            errors = fieldValidator('street', state.prevEmployerDetails.residence, 'required', errors).error;
            errors = fieldValidator('startDate', state.prevEmployerDetails, 'required', errors).error;
            errors = fieldValidator('endDate', state.prevEmployerDetails, 'required', errors).error;
            newForm = fieldValidator('occupation', state.prevEmployerDetails, 'required', errors);

            if (newForm.isValid) {
                props.history.push(nextStep);
            } else {
                setErrorMsg(newForm.error)
            }
        } else {
            props.history.push(nextStep);
        }
    };

    return (
        <Step
            heading={`Because you did not have the same position over the last 5 years, I have to ask where were you  previously employed?`}
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

                        {state.hasOwnProperty('prevEmployerDetails') ? <React.Fragment>

                            <MDBRow center className={`mb-2`}>
                                <FormControlLabel
                                    className={`mb-0`}
                                    control={
                                        <CustomCheckBox
                                            id={`prevPositionToggle`}
                                            checked={state.dontHavePrevPosition || false}
                                            onChange={e => onChange(e, "dontHavePrevPosition", true)}
                                            color="primary"
                                            inputProps={{'aria-label': 'secondary checkbox'}}
                                        />
                                    }
                                    label={(<span className={`labelClass`}>I did not have any previous position</span>)}
                                />
                            </MDBRow>

                            {!state.dontHavePrevPosition && <React.Fragment>
                                <MDBRow center className={`mb-2`}>
                                    <MDBCol>
                                        <TextField
                                            label="Previous Employer's Name?"
                                            type="text"
                                            id={`employerName`}
                                            name="employerName"
                                            error={!!errorMsg.name}
                                            helperText={errorMsg.name}
                                            value={state.prevEmployerDetails.name || ''}
                                            classes={{root: "custom-text-input"}}
                                            placeholder={`Previous Employer Name`}
                                            onChange={e => onChange(e, 'name', e.target.value)}
                                            onBlur={e => onChange(e, 'name', e.target.value)}
                                            required
                                        />
                                    </MDBCol>
                                    <MDBCol>
                                        <TextField
                                            label="Previous Occupation"
                                            error={!!errorMsg.occupation}
                                            helperText={errorMsg.occupation}
                                            type="text"
                                            id={`occupation`}
                                            autoComplete="off"
                                            name="occupation"
                                            placeholder={`Your Occupation`}
                                            classes={{root: "custom-text-input"}}
                                            value={state.prevEmployerDetails.occupation || ''}
                                            onChange={e => onChange(e, 'occupation', e.target.value)}
                                            onBlur={e => onChange(e, 'occupation', e.target.value)}
                                            required
                                        />
                                    </MDBCol>
                                </MDBRow>

                                <h4 className="text-center mb-2 mt-4">
                                    Previous employer's address
                                </h4>

                                <MDBRow
                                    style={{
                                        display: state.prevEmployerDetails_latlng ? "block" : "none",
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
                                            initialValue={(state.prevEmployerDetails.residence && state.prevEmployerDetails.residence.street) || ''}
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

                                <MDBRow center className={`mb-2`}>
                                    <MDBCol>
                                        <DatePicker
                                            label="Joined From?"
                                            variant="inline"
                                            id={`startDate`}
                                            name="startDate"
                                            format="dd/MM/yyyy"
                                            error={!!errorMsg.startDate}
                                            helperText={errorMsg.startDate}
                                            value={state.prevEmployerDetails.startDate || null}
                                            autoOk={true}
                                            disableFuture={true}
                                            classes={{root: "custom-text-input"}}
                                            placeholder={`Date of Joining`}
                                            onChange={e => onChange(e, 'startDate', e.toLocaleDateString())}
                                        />
                                    </MDBCol>
                                    <MDBCol>
                                        <DatePicker
                                            label="End Date?"
                                            variant="inline"
                                            id={`endDate`}
                                            name="endDate"
                                            format="dd/MM/yyyy"
                                            error={!!errorMsg.endDate}
                                            helperText={errorMsg.endDate}
                                            value={state.prevEmployerDetails.endDate || null}
                                            autoOk={true}
                                            disableFuture={true}
                                            classes={{root: "custom-text-input"}}
                                            placeholder={`Job End Date`}
                                            onChange={e => onChange(e, 'endDate', e.toLocaleDateString())}
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

                        </React.Fragment> : <h4 className="text-center mb-2">
                            Please enter current employer details to fill in previous employer details. Please Go Back!
                        </h4>}

                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </Step>
    );
}
