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

export default function Step22(props) {
    const {state, prevStep, nextStep, history} = props;
    const [errorMsg, setErrorMsg] = useState({});
    const [mapLocation, setMapLocation] = useState(props.state.beneficiaryEmployer_latlng);

    useEffect(() => {
        if (state.beneficiaryEmployer_latlng) {
            setMapLocation(props.state.beneficiaryEmployer_latlng);
        }
    }, []);

    useEffect(() => {
        setMapLocation(props.state.beneficiaryEmployer_latlng);
    }, [props.state]);

    const employerInfo = state.beneficiaryInfo.employerInfo;

    const onChange = (e, fieldName, value) => {
        let updatedState = {...state};
        let errors = {...errorMsg};
        switch (fieldName) {
            case 'isEmployed':
                if (!value) {
                    updatedState.beneficiaryInfo.employerInfo = {
                        employerName: "unemployed"
                    };
                } else {
                    updatedState.beneficiaryInfo.employerInfo = {};
                    updatedState.beneficiaryEmployer_latlng = null;
                }
                updatedState.isEmployed = value;
                errors = {};
                setErrorMsg(errors);
                break;
            case 'employerName':
                updatedState.beneficiaryInfo.employerInfo[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.beneficiaryInfo.employerInfo, 'requiredWithSpace', errors).error);
                break;
            case 'employmentStartDate':
                updatedState.beneficiaryInfo.employerInfo[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.beneficiaryInfo.employerInfo, 'required', errors).error);
                break;
            case 'address':
                updatedState.beneficiaryInfo.employerInfo['address'] = {
                    ...updatedState.beneficiaryInfo.employerInfo.address,
                    ...value
                };
                updatedState['beneficiaryEmployer_latlng'] = value.latLng;
                setErrorMsg(fieldValidator('street', updatedState.beneficiaryInfo.employerInfo.address, 'required', errors).error);
                break;
            default:
                break;
        }
        props.onChangeState(updatedState);
    };

    const onNext = () => {
        let errors = {};
        let newForm = {isValid: true, error: {}};
        const beneficiaryInfo = state.beneficiaryInfo;

        if (state.isEmployed) {
            errors = fieldValidator('employerName', beneficiaryInfo.employerInfo, 'requiredWithSpace', newForm.error).error;
            errors = fieldValidator('street', beneficiaryInfo.employerInfo.address, 'required', errors).error;
            newForm = fieldValidator('employmentStartDate', beneficiaryInfo.employerInfo, 'required', errors);
        }

        if (newForm.isValid) {
            props.history.push(nextStep);
        } else {
            setErrorMsg(newForm.error);
        }
    };

    return (
        <Step heading={`Immigration Relative's Employment Info`}>
            <img
                src={BackBtn}
                className="btn-back"
                alt={`Back`}
                onClick={() => history.push(prevStep)}
            />
            <MDBContainer>
                <MDBRow center>
                    <MDBCol sm={`10`} md={`8`}>

                        <h4 className={`text-center mb-2`}>Is your immigrating relative employed?</h4>

                        <MDBRow center className={`mb-2`}>
                            <FormControlLabel
                                className={`mb-0 mt-2`}
                                control={
                                    <CustomCheckBox
                                        id={`isEmployedYes`}
                                        checked={state.isEmployed || false}
                                        onChange={e => onChange(e, 'isEmployed', true)}
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
                                        id={`isEmployedNo`}
                                        checked={state.isEmployed === false || false}
                                        onChange={e => onChange(e, 'isEmployed', false)}
                                        color="primary"
                                        inputProps={{'aria-label': 'secondary checkbox'}}
                                    />
                                }
                                label={(<span className={`labelClass`}>No</span>)}
                            />
                        </MDBRow>

                        {state.isEmployed && <React.Fragment>
                            <MDBRow center className={`mb-2`}>
                                <MDBCol>
                                    <TextField
                                        label="Immigrating Relative's Employer Name?"
                                        type="text"
                                        id={`employerName`}
                                        name="employerName"
                                        error={!!errorMsg.employerName}
                                        helperText={errorMsg.employerName}
                                        value={employerInfo.employerName || ''}
                                        placeholder={`Employer's Name`}
                                        classes={{root: "custom-text-input"}}
                                        onChange={e => onChange(e, 'employerName', e.target.value)}
                                        onBlur={e => onChange(e, 'employerName', e.target.value)}
                                        required
                                    />
                                </MDBCol>
                                <MDBCol>
                                    <DatePicker
                                        label="Date Employment Began"
                                        variant="inline"
                                        id={`employmentStartDate`}
                                        name={`employmentStartDate`}
                                        format="dd/MM/yyyy"
                                        error={!!errorMsg.employmentStartDate}
                                        helperText={errorMsg.employmentStartDate}
                                        value={employerInfo.employmentStartDate || null}
                                        autoOk={true}
                                        disableFuture={true}
                                        classes={{root: "custom-text-input"}}
                                        placeholder={`Employment Start Date`}
                                        onChange={e => onChange(e, 'employmentStartDate', e.toLocaleDateString())}
                                        required
                                    />
                                </MDBCol>
                            </MDBRow>

                            <h4 className="text-center mb-2 mt-2">
                                Employer's address
                            </h4>

                            <MDBRow
                                style={{
                                    display: state.beneficiaryEmployer_latlng ? "block" : "none",
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
                                        initialValue={(state.beneficiaryInfo.employerInfo.address && state.beneficiaryInfo.employerInfo.address.street) || ''}
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
