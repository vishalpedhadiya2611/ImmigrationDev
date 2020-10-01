import React, {useEffect, useState} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBInput, MDBRow,} from "mdbreact";
import Step from "./Step";
import BackBtn from "../../assets/back-btn.png";
import {fieldValidator} from "./validator";
import GooglePlacesAutocomplete, {geocodeByAddress} from "react-google-places-autocomplete";
import Map from "./Map";

const Step35= props => {
    const {state, prevStep, nextStep, history} = props;
    const [errorMsg, setErrorMsg] = useState({});
    const [mapLocation, setMapLocation] = useState(state.preparerMailAddr_latlng || '');

    useEffect(() => {
        if (props.state.preparerMailAddr_latlng) {
            setMapLocation(props.state.preparerMailAddr_latlng);
        }
    }, []);

    useEffect(() => {
        setMapLocation(props.state.preparerMailAddr_latlng);
    }, [props.state]);

    const onChange = (e, fieldName, value) => {
        let updatedState = {...state};
        let errors = {...errorMsg};

        switch (fieldName) {
            case 'address':
                updatedState['preparerMailAddr'] = value;
                updatedState['preparerMailAddr_latlng'] = value.latLng;
                setErrorMsg(fieldValidator('street', updatedState.preparerMailAddr, 'required', errors).error);
                break;
            default:
                break;
        }
        props.onChangeState(updatedState);
    };

    const onNext = () => {
        let errors = {...errorMsg};
        let newForm = fieldValidator('street', state.preparerMailAddr, 'required', errors);

        if (newForm.isValid) {
            props.history.push(nextStep);
        } else {
            setErrorMsg(newForm.error);
        }
    };

    return (
        <Step heading={`Preparer's Mailing Address`}>
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
                                display: state.preparerMailAddr_latlng ? "block" : "none",
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
                                                name="streetAddr"
                                                required
                                                containerClass="mb-0"
                                                {...props}
                                            />
                                        </div>
                                    )}
                                    initialValue={(state.preparerMailAddr && state.preparerMailAddr.street) || ''}
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
                                <div className="text-danger mb-2">
                                    Please Input the Address details
                                </div>
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

export default Step35;
