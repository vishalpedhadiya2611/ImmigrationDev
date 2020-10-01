import React, {useEffect, useState} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBInput, MDBRow,} from "mdbreact";
import Step from "./Step";
import BackBtn from "../../assets/back-btn.png";
import {fieldValidator} from "./validator";
import TextField from "@material-ui/core/TextField";
import {DatePicker} from "@material-ui/pickers";
import {COUNTRY_LIST} from "../../shared/referenceData";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CustomCheckBox from "../../shared/utility";
import {FormControlLabel} from "@material-ui/core";
import Map from "./Map";
import GooglePlacesAutocomplete, {geocodeByAddress} from "react-google-places-autocomplete";

export default function Step7(props) {
    const {state, prevStep, nextStep, history} = props;
    const [errorMsg, setErrorMsg] = useState({});
    const [mapLocation, setMapLocation] = useState(props.mothersDetails_latlng);

    useEffect(() => {
        if (state.mothersDetails_latlng) {
            setMapLocation(props.state.mothersDetails_latlng);
        }
    }, []);

    useEffect(() => {
        setMapLocation(props.state.mothersDetails_latlng);
    }, [props.state]);

    const onChange = (e, fieldName, value) => {
        let updatedState = {...state};
        let errors = {...errorMsg};
        switch (fieldName) {
            case 'dontKnowMother':
                updatedState.dontKnowMother = !updatedState.dontKnowMother;
                updatedState.mothersDetails = {};
                updatedState.mothersDetails_latlng = null;
                setErrorMsg({});
                break;
            case 'address':
                updatedState.mothersDetails['residence'] = {
                    ...updatedState.mothersDetails.residence,
                    ...value
                };
                updatedState['mothersDetails_latlng'] = value.latLng;
                setErrorMsg(fieldValidator('street', updatedState.mothersDetails.residence, 'required', errors).error);
                break;
            case 'firstName':
            case 'lastName':
            case 'middleName':
                updatedState.mothersDetails[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.mothersDetails, 'requiredWithSpace', errors).error);
                break;
            case 'countryBorn':
                updatedState.mothersDetails[fieldName] = value.code;
                updatedState.mothersCountryOfBorn = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.mothersDetails, 'required', errors).error);
                break;
            case 'dob':
                updatedState.mothersDetails[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.mothersDetails, 'required', errors).error);
                break;
            default:
                break;
        }
        props.onChangeState(updatedState);
    };


    const onNext = () => {
        let errors = {};
        let newForm = {isValid: true, error: {}};

        if (!state.dontKnowMother) {
            errors = fieldValidator('firstName', state.mothersDetails, 'requiredWithSpace', errors).error;
            errors = fieldValidator('lastName', state.mothersDetails, 'requiredWithSpace', errors).error;
            errors = fieldValidator('middleName', state.mothersDetails, 'requiredWithSpace', errors).error;
            errors = fieldValidator('countryBorn', state.mothersDetails, 'required', errors).error;
            errors = fieldValidator('street', state.mothersDetails.residence, 'required', errors).error;
            newForm = fieldValidator('dob', state.mothersDetails, 'required', errors);
        }

        if (newForm.isValid) {
            props.history.push(nextStep);
        } else {
            setErrorMsg(newForm.error);
        }
    };

    return (
        <Step
            heading={`Parental Information (Mother)`}
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

                        <MDBRow center className={`mb-2`}>
                            <FormControlLabel
                                className={`mb-0`}
                                control={
                                    <CustomCheckBox
                                        id={`dontKnowMother`}
                                        checked={state.dontKnowMother || null}
                                        onChange={e => onChange(e, "dontKnowMother", e.target.checked)}
                                        color="primary"
                                        inputProps={{'aria-label': 'secondary checkbox'}}
                                    />
                                }
                                label={(<span className={`labelClass`}>I did not know my mother.</span>)}
                            />
                        </MDBRow>

                        {!state.dontKnowMother && <React.Fragment>
                            <MDBRow center className={`mb-4`}>
                                <MDBCol lg={`4`}>
                                    <TextField
                                        error={!!errorMsg.firstName}
                                        helperText={errorMsg.firstName}
                                        label="Mother's First Name"
                                        type="text"
                                        id={`firstName`}
                                        name="firstName"
                                        value={state.mothersDetails.firstName || ''}
                                        placeholder={`Mother's First Name`}
                                        onChange={e => onChange(e, 'firstName', e.target.value)}
                                        onBlur={e => onChange(e, 'firstName', e.target.value)}
                                        required
                                    />
                                </MDBCol>
                                <MDBCol lg={`4`}>
                                    <TextField
                                        error={!!errorMsg.middleName}
                                        helperText={errorMsg.middleName}
                                        label="Mother's Middle Name"
                                        type="text"
                                        id={`middleName`}
                                        name="middleName"
                                        value={state.mothersDetails.middleName || ''}
                                        placeholder={`Mother's Middle Name`}
                                        onChange={e => onChange(e, 'middleName', e.target.value)}
                                        onBlur={e => onChange(e, 'middleName', e.target.value)}
                                        required
                                    />
                                </MDBCol>
                                <MDBCol lg={`4`}>
                                    <TextField
                                        error={!!errorMsg.lastName}
                                        helperText={errorMsg.lastName}
                                        label="Mother's Last Name"
                                        type="text"
                                        id={`lastName`}
                                        name="lastName"
                                        value={state.mothersDetails.lastName || ''}
                                        placeholder={`Mother's Last Name`}
                                        onChange={e => onChange(e, 'lastName', e.target.value)}
                                        onBlur={e => onChange(e, 'lastName', e.target.value)}
                                        required
                                    />
                                </MDBCol>
                            </MDBRow>

                            <MDBRow center className={`mb-2`}>
                                <MDBCol>
                                    <DatePicker
                                        variant="inline"
                                        error={!!errorMsg.dob}
                                        helperText={errorMsg.dob}
                                        label="Mother's Date of Birth"
                                        id={`dob`}
                                        format="dd/MM/yyyy"
                                        name="dob"
                                        value={state.mothersDetails.dob || null}
                                        autoOk={true}
                                        disableFuture={true}
                                        classes={{root: "custom-text-input"}}
                                        onChange={e => onChange(e, 'dob', e.toLocaleDateString())}
                                    />
                                </MDBCol>
                                <MDBCol>
                                    <Autocomplete
                                        options={COUNTRY_LIST}
                                        autoHighlight={true}
                                        disableClearable={true}
                                        value={state.mothersCountryOfBorn || null}
                                        blurOnSelect={true}
                                        id="countryBorn"
                                        placeholder={"Select Country"}
                                        onChange={(e, value) => onChange(e, 'countryBorn', value)}
                                        getOptionLabel={option => option.label || ''}
                                        renderInput={params => (
                                            <TextField
                                                {...params}
                                                label="Country of Birth"
                                                classes={{root: "custom-text-input"}}
                                                error={!!errorMsg.countryBorn}
                                                helperText={errorMsg.countryBorn}
                                                inputProps={{
                                                    ...params.inputProps
                                                }}
                                            />
                                        )}
                                    />
                                </MDBCol>
                            </MDBRow>

                            <h4 className="text-center mb-2 mt-2">
                                Residence
                            </h4>

                            <MDBRow
                                style={{
                                    display: state.mothersDetails_latlng ? "block" : "none",
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
                                        initialValue={(state.mothersDetails.residence && state.mothersDetails.residence.street) || ''}
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

                        <MDBRow center className="d-flex flex-column align-items-center">
                            {errorMsg && Object.keys(errorMsg).length > 0 && (
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
