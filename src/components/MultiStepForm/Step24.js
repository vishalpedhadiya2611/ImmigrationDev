import React, {useEffect, useState} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBInput, MDBRow,} from "mdbreact";
import Step from "./Step";
import BackBtn from "../../assets/back-btn.png";
import {fieldValidator} from "./validator";
import {DatePicker} from "@material-ui/pickers";
import CustomCheckBox from "../../shared/utility";
import {FormControlLabel} from "@material-ui/core";
import Map from "./Map";
import GooglePlacesAutocomplete, {geocodeByAddress} from "react-google-places-autocomplete";

export default function Step24(props) {
    const {state, prevStep, nextStep, history} = props;
    const [errorMsg, setErrorMsg] = useState({});
    const [mapLocation, setMapLocation] = useState(props.state.lastLivedInfo_latlng);

    useEffect(() => {
        if (state.lastLivedInfo_latlng) {
            setMapLocation(props.state.lastLivedInfo_latlng);
        }
    }, []);

    useEffect(() => {
        setMapLocation(props.state.lastLivedInfo_latlng);
    }, [props.state]);

    const beneficiaryInfo = state.beneficiaryInfo;

    const onChange = (e, fieldName, value) => {
        let updatedState = {...state};
        let errors = {...errorMsg};
        switch (fieldName) {
            case 'isFormForSpouse':
                updatedState.beneficiaryInfo[fieldName] = value;
                if (value) {
                    updatedState.beneficiaryInfo['lastLivedInfo'] = {};
                } else {
                    delete updatedState.beneficiaryInfo.lastLivedInfo;
                    updatedState.lastLivedInfo_latlng = null;
                    errors = {};
                }
                setErrorMsg(fieldValidator(fieldName, state.beneficiaryInfo, 'requiredBool', errors).error);
                break;
            case 'dateOfResidingFrom':
            case 'dateOfResidingTo':
                updatedState.beneficiaryInfo.lastLivedInfo[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.beneficiaryInfo.lastLivedInfo, 'required', errors).error);
                break;
            case 'address':
                updatedState.beneficiaryInfo.lastLivedInfo = {
                    ...updatedState.beneficiaryInfo.lastLivedInfo,
                    ...value
                };
                updatedState['lastLivedInfo_latlng'] = value.latLng;
                setErrorMsg(fieldValidator('street', updatedState.beneficiaryInfo.lastLivedInfo, 'required', errors).error);
                break;
            default:
                break;

        }
        props.onChangeState(updatedState);
    };

    const onNext = () => {
        let errors = {};
        let newForm;
        let shortState = state.beneficiaryInfo;

        newForm = fieldValidator('isFormForSpouse', shortState, 'requiredBool', errors);

        if (shortState.isFormForSpouse) {
            errors = fieldValidator('street', shortState.lastLivedInfo, 'required', errors).error;
            errors = fieldValidator('dateOfResidingFrom', shortState.lastLivedInfo, 'required', errors).error;
            newForm = fieldValidator('dateOfResidingTo', shortState.lastLivedInfo, 'required', errors);
        }

        if (newForm.isValid) {
            props.history.push(nextStep);
        } else {
            setErrorMsg(newForm.error);
        }
    };

    return (
        <Step
            heading={`Is this Form for Your Spouse?`}
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
                                        id={`isFormForSpouseYes`}
                                        checked={state.beneficiaryInfo.isFormForSpouse || false}
                                        onChange={e => onChange(e, 'isFormForSpouse', true)}
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
                                        id={`isFormForSpouseNo`}
                                        checked={state.beneficiaryInfo.isFormForSpouse === false || false}
                                        onChange={e => onChange(e, 'isFormForSpouse', false)}
                                        color="primary"
                                        inputProps={{'aria-label': 'secondary checkbox'}}
                                    />
                                }
                                label={(<span className={`labelClass`}>No</span>)}
                            />
                        </MDBRow>

                        {beneficiaryInfo.isFormForSpouse && <React.Fragment>
                            <h4 className="text-center mb-2">Please Provide the last Address you lived Together</h4>

                            <MDBRow
                                style={{
                                    display: state.lastLivedInfo_latlng ? "block" : "none",
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
                                        initialValue={(state.beneficiaryInfo.lastLivedInfo && state.beneficiaryInfo.lastLivedInfo.street) || ''}
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
                                        label="From?"
                                        variant="inline"
                                        id={`dateOfResidingFrom`}
                                        name={`dateOfResidingFrom`}
                                        format="dd/MM/yyyy"
                                        error={!!errorMsg.dateOfResidingFrom}
                                        helperText={errorMsg.dateOfResidingFrom}
                                        value={beneficiaryInfo.lastLivedInfo.dateOfResidingFrom || null}
                                        autoOk={true}
                                        disableFuture={true}
                                        classes={{root: "custom-text-input"}}
                                        placeholder={`When did you started living here?`}
                                        onChange={e => onChange(e, 'dateOfResidingFrom', e.toLocaleDateString())}
                                        required
                                    />
                                </MDBCol>
                                <MDBCol>
                                    <DatePicker
                                        label="To?"
                                        variant="inline"
                                        id={`dateOfResidingTo`}
                                        name={`dateOfResidingTo`}
                                        format="dd/MM/yyyy"
                                        error={!!errorMsg.dateOfResidingTo}
                                        helperText={errorMsg.dateOfResidingTo}
                                        value={beneficiaryInfo.lastLivedInfo.dateOfResidingTo || null}
                                        autoOk={true}
                                        disableFuture={true}
                                        classes={{root: "custom-text-input"}}
                                        placeholder={`Last lived Date?`}
                                        onChange={e => onChange(e, 'dateOfResidingTo', e.toLocaleDateString())}
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
