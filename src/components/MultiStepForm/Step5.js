import React, {useEffect, useState} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBInput, MDBRow,} from "mdbreact";
import Step from "./Step";
import BackBtn from "../../assets/back-btn.png";
import {fieldValidator} from "./validator";
import GooglePlacesAutocomplete, {geocodeByAddress} from "react-google-places-autocomplete";
import Map from "./Map";
import CustomCheckBox from "../../shared/utility";
import {FormControlLabel} from "@material-ui/core";
import {DatePicker} from "@material-ui/pickers";

const Step5 = props => {
    const {state, prevStep, nextStep, history} = props;
    const [errorMsg, setErrorMsg] = useState({});
    const [mapLocation, setMapLocation] = useState(props.physAddress_latlng)

    useEffect(() => {
        if (state.physAddress_latlng) {
            setMapLocation(props.state.physAddress_latlng);
        }
    }, []);

    useEffect(() => {
        setMapLocation(props.state.physAddress_latlng);
    }, [props.state]);

    const onChange = (e, fieldName, value) => {
        let updatedState = {...state};
        let errors = {...errorMsg};

        switch (fieldName) {
            case 'isSame':
                updatedState.physAddressSame = value;
                updatedState.physAddress = {};
                updatedState.physAddress_latlng = null;
                setErrorMsg({});
                break;
            case 'address':
                updatedState['physAddress'] = {
                    ...updatedState.physAddress,
                    ...value
                };
                updatedState['physAddress_latlng'] = value.latLng;
                setErrorMsg(fieldValidator('street', updatedState.physAddress, 'required', errors).error);
                break;
            case 'dateFrom':
                updatedState.physAddress[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.physAddress, 'required', errors).error);
                break;
            default:
                break;
        }
        props.onChangeState(updatedState);
    };


    const onNext = () => {
        let errors = {};
        let newForm = {isValid: true, error: {}};
        if (!state.physAddressSame) {
            errors = fieldValidator('dateFrom', state.physAddress, 'required', errors).error;
            newForm = fieldValidator('street', state.physAddress, 'requiredWithSpace', errors);

            let diff = new Date() - new Date(state.physAddress.dateFrom);
            let diffYears = Math.floor(Math.round((diff) / (1000 * 60 * 60 * 24)) / 365);

            if (newForm.isValid) {
                if (diffYears < 5) {
                    props.history.push(nextStep);
                } else {
                    props.history.push('/start/7');
                }
            } else {
                setErrorMsg(newForm.error);
            }
        } else {
            props.history.push('/start/7');
        }
    };

    return (
        <Step heading={`What's your physical address`}>
            <img
                src={BackBtn}
                className="btn-back"
                alt={`Back`}
                onClick={() => history.push(prevStep)}
            />
            <MDBContainer>
                <MDBRow center>
                    <MDBCol sm={`10`} md={`8`}>
                        <h4 className="text-center mb-2">
                            Is your physical address the same as your mailing address?
                        </h4>
                        <MDBRow center className={`mb-2`}>
                            <FormControlLabel
                                className={`mb-0`}
                                control={
                                    <CustomCheckBox
                                        id={`isSameYes`}
                                        checked={state.physAddressSame || null}
                                        onChange={e => onChange(e, "isSame", true)}
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
                                        id={`isSameNo`}
                                        checked={state.physAddressSame === false || null}
                                        onChange={e => onChange(e, "isSame", false)}
                                        color="primary"
                                        inputProps={{'aria-label': 'secondary checkbox'}}
                                    />
                                }
                                label={(<span className={`labelClass`}>No</span>)}
                            />
                        </MDBRow>


                        {!state.physAddressSame && <React.Fragment>
                            <MDBRow
                                style={{
                                    display: state.physAddress_latlng ? "block" : "none",
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
                                        initialValue={(state.physAddress && state.physAddress.street) || ''}
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
                                        label="Date From?"
                                        variant="inline"
                                        id="physAddrFrom"
                                        name={`physAddrFrom`}
                                        disableFuture={true}
                                        format="dd/MM/yyyy"
                                        error={!!errorMsg.dateFrom}
                                        disabled={state.physAddressSame}
                                        helperText={errorMsg.dateFrom}
                                        value={state.physAddress.dateFrom || null}
                                        autoOk={true}
                                        classes={{root: "custom-text-input"}}
                                        placeholder={`When did you move to this address?`}
                                        onChange={e => onChange(e, 'dateFrom', e.toLocaleDateString())}
                                        required
                                    />
                                </MDBCol>
                                <MDBCol>
                                    <DatePicker
                                        label="Date To (Present)"
                                        variant="inline"
                                        id="physAddrTo"
                                        name={`physAddrTo`}
                                        format="dd/MM/yyyy"
                                        autoOk={true}
                                        disabled={true}
                                        classes={{root: "custom-text-input"}}
                                    />
                                </MDBCol>
                            </MDBRow>

                        </React.Fragment>}

                        <MDBRow center className="d-flex flex-column align-items-center">
                            {Object.keys(errorMsg).length > 0 && (
                                <div className="text-danger mb-2">Please Fill the required fields</div>
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
export default Step5;
