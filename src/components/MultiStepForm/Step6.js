import 'date-fns';
import React, {useEffect, useState} from "react";
import {DatePicker} from '@material-ui/pickers';
import {MDBBtn, MDBCol, MDBContainer, MDBInput, MDBRow,} from "mdbreact";
import Step from "./Step";
import BackBtn from "../../assets/back-btn.png";
import {fieldValidator} from "./validator";
import Map from "./Map";
import GooglePlacesAutocomplete, {geocodeByAddress} from "react-google-places-autocomplete";


export default function Step6(props) {
    const {state, prevStep, nextStep, history} = props;
    const [errorMsg, setErrorMsg] = useState({});
    const [mapLocation, setMapLocation] = useState(props.prevPhysAddr_latlng)

    useEffect(() => {
        if (state.prevPhysAddress_latlng) {
            setMapLocation(props.state.prevPhysAddr_latlng);
        }
    }, []);

    useEffect(() => {
        setMapLocation(props.state.prevPhysAddr_latlng);
    }, [props.state]);

    const onChange = (e, fieldName, value) => {
        let updatedState = {...state};
        let errors = {...errorMsg};
        switch (fieldName) {
            case 'address':
                updatedState['prevPhysAddr'] = {
                    ...updatedState.prevPhysAddr,
                    ...value
                };
                updatedState['prevPhysAddr_latlng'] = value.latLng;
                setErrorMsg(fieldValidator('street', updatedState.prevPhysAddr, 'required', errors).error);
                break;
            case 'dateFrom':
            case 'dateTo':
                updatedState.prevPhysAddr[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.prevPhysAddr, 'required', errors).error);
                break;

            default:
                break;
        }
        props.onChangeState(updatedState);
    };


    const onNext = () => {
        let errors = {};
        errors = fieldValidator('street', state.prevPhysAddr, 'required', errors).error;
        errors = fieldValidator('dateFrom', state.prevPhysAddr, 'required', errors).error;
        let newForm = fieldValidator('dateTo', state.prevPhysAddr, 'required', errors);

        if (state.prevPhysAddr.street === state.physAddress.street) {
            newForm = {isValid: false, error: {...newForm.error, msg: 'Enter different address!'}}
        }

        if (newForm.isValid) {
            props.history.push(nextStep);
        } else {
            setErrorMsg(newForm.error);
        }
    };

    return (
        <Step heading={`Because you have moved within the last 5 years, I have to ask where did you live previously? `}>
            <img
                src={BackBtn}
                className="btn-back"
                alt={`Back`}
                onClick={() => history.push(prevStep)}
            />
            <MDBContainer>
                <MDBRow center>
                    <MDBCol sm={`10`} md={`8`}>

                        <MDBRow
                            style={{
                                display: state.prevPhysAddr_latlng ? "block" : "none",
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
                                    initialValue={(state.prevPhysAddr && state.prevPhysAddr.street) || ''}
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
                                    helperText={errorMsg.dateFrom}
                                    value={state.prevPhysAddr.dateFrom || null}
                                    autoOk={true}
                                    classes={{root: "custom-text-input"}}
                                    placeholder={`When did you move to this address?`}
                                    onChange={e => onChange(e, 'dateFrom', e.toLocaleDateString())}
                                    required
                                />
                            </MDBCol>
                            <MDBCol>
                                <DatePicker
                                    label="Date To?"
                                    variant="inline"
                                    id="physAddrTo"
                                    name={`physAddrTo`}
                                    format="dd/MM/yyyy"
                                    error={!!errorMsg.dateTo}
                                    helperText={errorMsg.dateTo}
                                    value={state.prevPhysAddr.dateTo || null}
                                    autoOk={true}
                                    disableFuture={true}
                                    classes={{root: "custom-text-input"}}
                                    placeholder={`When did you leave from this address?`}
                                    onChange={e => onChange(e, 'dateTo', e.toLocaleDateString())}
                                    required
                                />
                            </MDBCol>
                        </MDBRow>

                        <MDBRow center className="d-flex flex-column align-items-center">
                            {Object.keys(errorMsg).length > 0 && (
                                <div className="text-danger mb-2">Please Fill out all the required fields (Make sure not
                                    to enter same address as in mailing address.)</div>
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
