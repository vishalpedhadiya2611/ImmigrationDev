import React, {useEffect, useState} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBInput, MDBRow,} from "mdbreact";
import Step from "./Step";
import BackBtn from "../../assets/back-btn.png";
import {fieldValidator} from "./validator";
import TextField from "@material-ui/core/TextField";
import GooglePlacesAutocomplete, {geocodeByAddress} from "react-google-places-autocomplete";
import Map from "./Map";
import CustomCheckBox from "../../shared/utility";
import {FormControlLabel} from "@material-ui/core";

const Step4 = props => {
    const {state, prevStep, nextStep, history} = props;
    const [errorMsg, setErrorMsg] = useState({});
    const [mapLocation, setMapLocation] = useState(props.mailAddr_latlng)

    useEffect(() => {
        if (state.mailAddr_latlng) {
            setMapLocation(props.state.mailAddr_latlng);
        }
    }, []);

    useEffect(() => {
        setMapLocation(props.state.mailAddr_latlng);
    }, [props.state]);

    const onChange = (e, fieldName, value) => {
        let updatedState = {...state};
        let errors = {...errorMsg};

        switch (fieldName) {
            case 'inCareOfName':
                updatedState.inCareOfName = !updatedState.inCareOfName;
                delete updatedState.mailAddress.name;
                setErrorMsg({});
                break;
            case 'name':
                updatedState.mailAddress['name'] = value;
                setErrorMsg(fieldValidator('name', updatedState.mailAddress, 'requiredWithSpace', errors).error);
                break;
            case 'address':
                updatedState['mailAddress'] = {
                    ...updatedState.mailAddress,
                    ...value
                };
                updatedState['mailAddr_latlng'] = value.latLng;
                setErrorMsg(fieldValidator('street', updatedState.mailAddress, 'required', errors).error);
                break;
            default:
                break;
        }
        props.onChangeState(updatedState);
    };


    const onNext = () => {
        let errors = {};
        if (state.inCareOfName) {
            errors = fieldValidator('name', state.mailAddress, 'requiredWithSpace', errors).error;
        }
        let newForm = fieldValidator('street', state.mailAddress, 'required', errors);

        if (newForm.isValid) {
            props.history.push(nextStep);
        } else {
            setErrorMsg(newForm.error);
        }
    };

    return (
        <Step heading={`What's your mailing address`}>
            <img
                src={BackBtn}
                className="btn-back"
                alt={`Back`}
                onClick={() => history.push(prevStep)}
            />
            <MDBContainer>
                <MDBRow center>
                    <MDBCol sm={`10`} md={`8`}>
                        <MDBRow center className={`mb-3`}>
                            <MDBCol>
                                <FormControlLabel
                                    className={`mb-0`}
                                    control={
                                        <CustomCheckBox
                                            id={`inCareOfName`}
                                            checked={state.inCareOfName || null}
                                            onChange={e => onChange(e, "inCareOfName", true)}
                                            color="primary"
                                            inputProps={{'aria-label': 'secondary checkbox'}}
                                        />
                                    }
                                    label={(<span className={`labelClass`}>Want to specify in care of name?</span>)}
                                />
                            </MDBCol>
                            {state.inCareOfName && <MDBCol>
                                <TextField
                                    label="In Care of Name"
                                    error={!!errorMsg.name}
                                    helperText={errorMsg.name}
                                    type="text"
                                    autoComplete="off"
                                    id={`mailName`}
                                    name="mailName"
                                    placeholder={`Mail Address Name`}
                                    classes={{root: "custom-text-input"}}
                                    value={state.mailAddress.name || ''}
                                    onChange={e => onChange(e, 'name', e.target.value)}
                                    onBlur={e => onChange(e, 'name', e.target.value)}
                                    required
                                />
                            </MDBCol>}
                        </MDBRow>

                        <MDBRow
                            style={{
                                display: state.mailAddr_latlng ? "block" : "none",
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
                                    initialValue={(state.mailAddress && state.mailAddress.street) || ''}
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
export default Step4;
