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

export default function Step7(props) {
    const {state, prevStep, nextStep, history} = props;
    const [errorMsg, setErrorMsg] = useState({});
    const [mapLocation, setMapLocation] = useState(props.employerDetails_latlng);

    useEffect(() => {
        if (state.employerDetails_latlng) {
            setMapLocation(props.state.employerDetails_latlng);
        }
    }, []);

    useEffect(() => {
        setMapLocation(props.state.employerDetails_latlng);
    }, [props.state]);

    const onChange = (e, fieldName, value) => {
        let updatedState = {...state};
        let errors = {...errorMsg};
        switch (fieldName) {
            case 'employed':
                updatedState[fieldName] = value;
                if (value) {
                    updatedState['employerDetails'] = {};
                } else {
                    delete updatedState.employerDetails;
                    updatedState.employerDetails_latlng = null;
                    errors = {};
                }
                setErrorMsg(errors);
                break;
            case 'address':
                updatedState.employerDetails['residence'] = {
                    ...updatedState.employerDetails.residence,
                    ...value
                };
                updatedState['employerDetails_latlng'] = value.latLng;
                setErrorMsg(fieldValidator('street', updatedState.employerDetails.residence, 'required', errors).error);
                break;
            case 'name':
            case 'startDate':
            case 'occupation':
                updatedState.employerDetails[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.employerDetails, 'required', errors).error);
                break;
            default:
                break;
        }
        props.onChangeState(updatedState);
    };


    const onNext = () => {
        let errors = {};
        let newForm;

        if (state.employed) {
            errors = fieldValidator('name', state.employerDetails, 'required', errors).error;
            errors = fieldValidator('street', state.employerDetails.residence, 'required', errors).error;
            errors = fieldValidator('startDate', state.employerDetails, 'required', errors).error;
            newForm = fieldValidator('occupation', state.employerDetails, 'required', errors);

            let diff = new Date() - new Date(state.employerDetails.startDate);
            let diffYears = Math.floor(Math.round((diff) / (1000 * 60 * 60 * 24)) / 365);
            if (diffYears < 5) {
                if (!state.hasOwnProperty(`prevEmployerDetails`)) {
                    props.onChangeState({...state, prevEmployerDetails: {}});
                }
            } else {
                let updatedState = {...state};
                delete updatedState.prevEmployerDetails;
                props.onChangeState(updatedState);
            }

            if (newForm.isValid) {
                if (diffYears < 5) {
                    props.history.push(nextStep);
                } else {
                    props.history.push('/start/13');
                }
            } else {
                setErrorMsg(newForm.error);
            }
        } else {
            props.history.push('/start/13');
        }
    };

    return (
        <Step
            heading={`Employment Details`}
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

                        <h4 className={`text-center mb-2`}>Have you been employed in last 5 years?</h4>

                        <MDBRow center className={`mb-2`}>
                            <FormControlLabel
                                className={`mb-0`}
                                control={
                                    <CustomCheckBox
                                        id={`employedYes`}
                                        checked={state.employed || false}
                                        onChange={e => onChange(e, "employed", true)}
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
                                        id={`employedNo`}
                                        checked={state.employed === false || false}
                                        onChange={e => onChange(e, "employed", false)}
                                        color="primary"
                                        inputProps={{'aria-label': 'secondary checkbox'}}
                                    />
                                }
                                label={(<span className={`labelClass`}>No</span>)}
                            />
                        </MDBRow>

                        {state.employed && <React.Fragment>
                            <MDBRow center className={`mb-2`}>
                                <MDBCol>
                                    <TextField
                                        label="What is your Employer's Name?"
                                        type="text"
                                        id={`employerName`}
                                        name="employerName"
                                        error={!!errorMsg.name}
                                        helperText={errorMsg.name}
                                        value={state.employerDetails.name || ''}
                                        classes={{root: "custom-text-input"}}
                                        placeholder={`Employer Name`}
                                        onChange={e => onChange(e, 'name', e.target.value)}
                                        onBlur={e => onChange(e, 'name', e.target.value)}
                                        required
                                    />
                                </MDBCol>
                                <MDBCol>
                                    <TextField
                                        label="Occupation"
                                        error={!!errorMsg.occupation}
                                        helperText={errorMsg.occupation}
                                        type="text"
                                        id={`occupation`}
                                        autoComplete="off"
                                        name="occupation"
                                        placeholder={`Your Occupation`}
                                        classes={{root: "custom-text-input"}}
                                        value={state.employerDetails.occupation || ''}
                                        onChange={e => onChange(e, 'occupation', e.target.value)}
                                        onBlur={e => onChange(e, 'occupation', e.target.value)}
                                        required
                                    />
                                </MDBCol>
                            </MDBRow>

                            <h4 className="text-center mb-2 mt-4">
                                Employer's address
                            </h4>

                            <MDBRow
                                style={{
                                    display: state.employerDetails_latlng ? "block" : "none",
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
                                        initialValue={(state.employerDetails.residence && state.employerDetails.residence.street) || ''}
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
                                        value={state.employerDetails.startDate || null}
                                        autoOk={true}
                                        disableFuture={true}
                                        classes={{root: "custom-text-input"}}
                                        placeholder={`Date of Joining`}
                                        onChange={e => onChange(e, 'startDate', e.toLocaleDateString())}
                                    />
                                </MDBCol>
                                <MDBCol>
                                    <DatePicker
                                        label="End Date? (Present)"
                                        variant="inline"
                                        id={`endDate`}
                                        name="endDate"
                                        format="dd/MM/yyyy"
                                        classes={{root: "custom-text-input"}}
                                        disabled={true}
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
