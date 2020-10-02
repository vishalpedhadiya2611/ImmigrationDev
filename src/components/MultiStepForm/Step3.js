import React, {useEffect, useState} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBInput, MDBRow} from "mdbreact";
import Step from "./Step";
import BackBtn from "../../assets/back-btn.png";
import {fieldValidator} from "./validator";
import {DatePicker} from "@material-ui/pickers";
import CustomCheckBox from "../../shared/utility";
import {FormControlLabel} from "@material-ui/core";
import Map from "./Map";
import GooglePlacesAutocomplete, {geocodeByAddress} from "react-google-places-autocomplete";

const Step3 = props => {
    const {state, prevStep, nextStep, history} = props;
    const [errorMsg, setErrorMsg] = useState({});
    const [mapLocation, setMapLocation] = useState(props.born_latlng)

    useEffect(() => {
        if (state.born_latlng) {
            setMapLocation(props.state.born_latlng);
        }
    }, []);

    useEffect(() => {
        setMapLocation(props.state.born_latlng);
    }, [props.state]);

    const onChange = (e, fieldName, value) => {
        let updatedState = {...state};
        let errors = {...errorMsg};
        switch (fieldName) {
            case 'address':
                updatedState['bornAddress'] = {
                    ...updatedState.bornAddress,
                    ...value
                };
                updatedState['born_latlng'] = value.latLng;
                setErrorMsg(fieldValidator('street', updatedState.bornAddress, 'required', errors).error);
                break;
            case 'dateOfBirth':
                updatedState.dateOfBirth = value;
                setErrorMsg(fieldValidator(fieldName, updatedState, 'required', errorMsg).error);
                break;
            case 'gender':
                updatedState.gender = value;
                setErrorMsg(fieldValidator('gender', updatedState, 'required', errors).error);
                break;
            default:
                break;
        }
        props.onChangeState(updatedState);
    };


    const onNext = () => {
        let errors = {};
        errors = fieldValidator('street', state.bornAddress, 'required', errors).error;
        errors = fieldValidator('dateOfBirth', state, 'required', errors).error;
        let newForm = fieldValidator('gender', state, 'required', errors);

        if (newForm.isValid) {
            props.history.push(nextStep);
        } else {
            setErrorMsg(newForm.error);
        }

    };

    return (
        <Step
            heading={`Great to meet you ${state.fname}! Let us know some more information about you!`}
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

                        <MDBRow center className={`mb-3`}>
                            <MDBCol>
                                <DatePicker
                                    id="dob"
                                    label="Date of Birth"
                                    variant="inline"
                                    name={`dob`}
                                    disableFuture={true}
                                    format="dd/MM/yyyy"
                                    error={!!errorMsg.dateOfBirth}
                                    helperText={errorMsg.dateOfBirth}
                                    value={state.dateOfBirth || null}
                                    autoOk={true}
                                    classes={{root: "custom-text-input"}}
                                    placeholder={`Date of Birth`}
                                    onChange={e => onChange(e, 'dateOfBirth', e.toLocaleDateString())}
                                    required
                                />
                            </MDBCol>
                            <MDBCol>
                                <h4 className={`text-center`}>Gender</h4>
                                <MDBRow center>
                                    <FormControlLabel
                                        className={`mb-0`}
                                        control={
                                            <CustomCheckBox
                                                id={`genderMale`}
                                                checked={state.gender === "Male" || false}
                                                onChange={e => onChange(e, "gender", "Male")}
                                                color="primary"
                                                inputProps={{'aria-label': 'secondary checkbox'}}
                                            />
                                        }
                                        label={(<span className={`labelClass`}>Male</span>)}
                                    />
                                    <FormControlLabel
                                        className={`mb-0`}
                                        control={
                                            <CustomCheckBox
                                                id={`genderFemale`}
                                                checked={state.gender === "Female" || false}
                                                onChange={e => onChange(e, "gender", "Female")}
                                                color="primary"
                                                inputProps={{'aria-label': 'secondary checkbox'}}
                                            />
                                        }
                                        label={(<span className={`labelClass`}>Female</span>)}
                                    />
                                </MDBRow>
                            </MDBCol>
                        </MDBRow>

                        <h4 className="mb-2 text-center">
                            City and country of born
                        </h4>

                        <MDBRow
                            style={{
                                display: state.born_latlng ? "block" : "none",
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
                                    initialValue={(state.bornAddress && state.bornAddress.street) || ''}
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
export default Step3;
