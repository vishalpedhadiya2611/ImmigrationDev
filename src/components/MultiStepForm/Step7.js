import React, {useEffect, useState} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBFormInline, MDBInput, MDBRow,} from "mdbreact";
import Step from "./Step";
import BackBtn from "../../assets/back-btn.png";
import {fieldValidator} from "./validator";
import {DatePicker} from "@material-ui/pickers";
import TextField from "@material-ui/core/TextField";
import CustomCheckBox from "../../shared/utility";
import {FormControlLabel} from "@material-ui/core";
import Map from "./Map";
import GooglePlacesAutocomplete, {geocodeByAddress} from "react-google-places-autocomplete";

export default function Step7(props) {
    const {state, prevStep, nextStep, history} = props;
    const [errorMsg, setErrorMsg] = useState({});
    const [isFormerSpouse, setIsFormerSpouse] = useState(false);
    const [mapLocation, setMapLocation] = useState(props.state.marriagePlace_latlng);

    useEffect(() => {
        if (state.marriagePlace_latlng) {
            setMapLocation(props.state.marriagePlace_latlng);
        }
    }, []);

    useEffect(() => {
        setMapLocation(props.state.marriagePlace_latlng);
    }, [props.state]);

    const [label, setLabel] = useState('');

    const onChange = (e, fieldName, value) => {
        let updatedState = {...state};
        let errors = {...errorMsg};
        switch (fieldName) {
            case 'status':
                updatedState.maritalInfo['status'] = value;
                if (value === 'divorced') {
                    setLabel('Date of your Marriage end');
                } else if (value === 'widowed') {
                    setLabel('Date of your Spouse passed');
                } else if (value === 'annulled') {
                    setLabel('Date of your Marriage annulled');
                } else if (value === 'separated') {
                    setLabel('Date of your Marriage separation');
                }
                delete updatedState.maritalInfo.dateOfMarriage;
                delete updatedState.maritalInfo.marriagePlace;
                delete updatedState.marriagePlace_latlng;
                delete updatedState.spouseDetails.firstName;
                delete updatedState.spouseDetails.lastName;
                delete updatedState.spouseDetails.middleName;
                delete updatedState.spouseDetails.dateOfMarriageEnd;
                errors = {};
                setErrorMsg(fieldValidator('status', updatedState.maritalInfo, 'required', errors).error);
                break;
            case 'dateOfMarriage':
            case 'marriageCount':
                updatedState.maritalInfo[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.maritalInfo, 'required', errors).error);
                break;
            case 'address':
                updatedState.maritalInfo['marriagePlace'] = {
                    ...updatedState.maritalInfo.marriagePlace,
                    ...value
                };
                updatedState['marriagePlace_latlng'] = value.latLng;
                setErrorMsg(fieldValidator('street', updatedState.maritalInfo.marriagePlace, 'required', errors).error);
                break;
            case 'dateOfMarriageEnd':
                updatedState.spouseDetails['dateOfMarriageEnd'] = value;
                setErrorMsg(fieldValidator('dateOfMarriageEnd', updatedState.spouseDetails, 'required', errors).error);
                break;
            case 'firstName':
            case 'lastName':
            case 'middleName':
                updatedState.spouseDetails[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.spouseDetails, 'requiredChar', errors).error);
                break;
            case 'isFormerSpouse':
                setIsFormerSpouse(!isFormerSpouse);
                delete updatedState.formerSpouseDetails.formerFirstName;
                delete updatedState.formerSpouseDetails.formerLastName;
                delete updatedState.formerSpouseDetails.formerMiddleName;
                delete updatedState.formerSpouseDetails.dateOfMarriageEnd2;
                delete errors.formerFirstName;
                delete errors.formerLastName;
                delete errors.formerMiddleName;
                delete errors.dateOfMarriageEnd2;
                setErrorMsg(errors);
                break;
            case 'dateOfMarriageEnd2':
                updatedState.formerSpouseDetails['dateOfMarriageEnd2'] = value;
                setErrorMsg(fieldValidator('dateOfMarriageEnd2', updatedState.formerSpouseDetails, 'required', errors).error);
                break;
            case 'formerFirstName':
            case 'formerLastName':
            case 'formerMiddleName':
                updatedState.formerSpouseDetails[fieldName] = value;
                setErrorMsg(fieldValidator(fieldName, updatedState.formerSpouseDetails, 'requiredChar', errors).error);
                break;
            default:
                break;
        }
        props.onChangeState(updatedState);
    };


    const onNext = () => {
        let errors = {};
        let newForm = {};

        newForm = fieldValidator('status', state.maritalInfo, 'required', errors);

        if (state.maritalInfo.status === "married") {
            errors = fieldValidator('status', state.maritalInfo, 'required', newForm.error).error;
            errors = fieldValidator('dateOfMarriage', state.maritalInfo, 'required', errors).error;
            newForm = fieldValidator('street', state.maritalInfo.marriagePlace, 'required', errors);
        } else if (state.maritalInfo.status === "divorced"
            || state.maritalInfo.status === "widowed"
            || state.maritalInfo.status === "annulled"
            || state.maritalInfo.status === "separated") {
            errors = fieldValidator('firstName', state.spouseDetails, 'requiredChar', newForm.error).error;
            errors = fieldValidator('lastName', state.spouseDetails, 'requiredChar', errors).error;
            errors = fieldValidator('middleName', state.spouseDetails, 'requiredChar', errors).error;
            newForm = fieldValidator('dateOfMarriageEnd', state.spouseDetails, 'required', errors);
            if (isFormerSpouse) {
                errors = fieldValidator('formerFirstName', state.formerSpouseDetails, 'requiredChar', newForm.error).error;
                errors = fieldValidator('formerLastName', state.formerSpouseDetails, 'requiredChar', errors).error;
                errors = fieldValidator('formerMiddleName', state.formerSpouseDetails, 'requiredChar', errors).error;
                newForm = fieldValidator('dateOfMarriageEnd2', state.formerSpouseDetails, 'required', errors);
            }
        } else {
            newForm = fieldValidator('status', state.maritalInfo, 'required', newForm.error);
        }

        if (newForm.isValid) {
            props.history.push(nextStep);
        } else {
            setErrorMsg(newForm.error);
        }
    };

    return (
        <Step
            heading={`Marital Information`}
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
                            <TextField
                                error={!!errorMsg.marriageCount}
                                helperText={errorMsg.marriageCount}
                                label="How Many times Beneficiary is married?"
                                type="number"
                                id={`marriageCount`}
                                name="marriageCount"
                                value={state.maritalInfo.marriageCount || ''}
                                placeholder={`Marriage Count`}
                                classes={{root: "custom-text-input"}}
                                onChange={e => onChange(e, 'marriageCount', e.target.value)}
                                onBlur={e => onChange(e, 'marriageCount', e.target.value)}
                                required
                            />
                        </MDBRow>

                        <MDBRow center className={`mb-2`}>
                            <FormControlLabel
                                className={`mb-0`}
                                control={
                                    <CustomCheckBox
                                        id={`single`}
                                        checked={state.maritalInfo.status === "single" || null}
                                        onChange={e => onChange(e, "status", 'single')}
                                        color="primary"
                                        inputProps={{'aria-label': 'secondary checkbox'}}
                                    />
                                }
                                label={(<span className={`labelClass`}>Single</span>)}
                            />
                            <FormControlLabel
                                className={`mb-0`}
                                control={
                                    <CustomCheckBox
                                        id={`neverMarried`}
                                        checked={state.maritalInfo.status === "neverMarried" || null}
                                        onChange={e => onChange(e, "status", 'neverMarried')}
                                        color="primary"
                                        inputProps={{'aria-label': 'secondary checkbox'}}
                                    />
                                }
                                label={(<span className={`labelClass`}>Never Married</span>)}
                            />
                            <FormControlLabel
                                className={`mb-0`}
                                control={
                                    <CustomCheckBox
                                        id={`married`}
                                        checked={state.maritalInfo.status === "married" || null}
                                        onChange={e => onChange(e, "status", 'married')}
                                        color="primary"
                                        inputProps={{'aria-label': 'secondary checkbox'}}
                                    />
                                }
                                label={(<span className={`labelClass`}>Married</span>)}
                            />
                            <FormControlLabel
                                className={`mb-0`}
                                control={
                                    <CustomCheckBox
                                        id={`divorced`}
                                        checked={state.maritalInfo.status === "divorced" || null}
                                        onChange={e => onChange(e, "status", 'divorced')}
                                        color="primary"
                                        inputProps={{'aria-label': 'secondary checkbox'}}
                                    />
                                }
                                label={(<span className={`labelClass`}>Divorced</span>)}
                            />
                        </MDBRow>
                        <MDBRow center className={`mb-2`}>
                            <FormControlLabel
                                className={`mb-0`}
                                control={
                                    <CustomCheckBox
                                        id={`widowed`}
                                        checked={state.maritalInfo.status === "widowed" || null}
                                        onChange={e => onChange(e, "status", 'widowed')}
                                        color="primary"
                                        inputProps={{'aria-label': 'secondary checkbox'}}
                                    />
                                }
                                label={(<span className={`labelClass`}>Widowed</span>)}
                            />
                            <FormControlLabel
                                className={`mb-0`}
                                control={
                                    <CustomCheckBox
                                        id={`separated`}
                                        checked={state.maritalInfo.status === "separated" || null}
                                        onChange={e => onChange(e, "status", 'separated')}
                                        color="primary"
                                        inputProps={{'aria-label': 'secondary checkbox'}}
                                    />
                                }
                                label={(<span className={`labelClass`}>Separated</span>)}
                            />
                            <FormControlLabel
                                className={`mb-0`}
                                control={
                                    <CustomCheckBox
                                        id={`annulled`}
                                        checked={state.maritalInfo.status === "annulled" || null}
                                        onChange={e => onChange(e, "status", 'annulled')}
                                        color="primary"
                                        inputProps={{'aria-label': 'secondary checkbox'}}
                                    />
                                }
                                label={(<span className={`labelClass`}>Annulled</span>)}
                            />
                        </MDBRow>

                        {state.maritalInfo.status === "married" && <React.Fragment>
                            <MDBRow center className={`mb-2`}>
                                <MDBFormInline className={`justify-content-center`}>
                                    <MDBCol>
                                        <h5 className={`text-center`}>Date of current marriage: </h5>
                                    </MDBCol>
                                    <MDBCol>
                                        <DatePicker
                                            variant="inline"
                                            id="dateOfMarriage"
                                            label="Date of Marriage?"
                                            classes={{root: "custom-text-input"}}
                                            format="dd/MM/yyyy"
                                            autoOk={true}
                                            disableFuture={true}
                                            error={!!errorMsg.dateOfMarriage}
                                            helperText={errorMsg.dateOfMarriage}
                                            value={state.maritalInfo.dateOfMarriage || null}
                                            onChange={e => onChange(e, 'dateOfMarriage', e.toLocaleDateString())}
                                            onBlur={e => onChange(e, 'dateOfMarriage', e.target.value)}
                                        />
                                    </MDBCol>
                                </MDBFormInline>
                            </MDBRow>

                            <h5 className={`text-center mb-2 mt-2`}>Place of your current Marriage</h5>

                            <MDBRow
                                style={{
                                    display: state.marriagePlace_latlng ? "block" : "none",
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
                                        renderInput={props => (
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
                                        initialValue={(state.maritalInfo.marriagePlace && state.maritalInfo.marriagePlace.street) || ''}
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

                            {/*<MDBRow center className={`mb-2`}>
                                <MDBCol>
                                    <TextField
                                        label="City or Town"
                                        error={!!errorMsg.city}
                                        helperText={errorMsg.city}
                                        autoComplete="off"
                                        type="text"
                                        id={`maritalCity`}
                                        name="maritalCity"
                                        placeholder={`City`}
                                        classes={{root: "custom-text-input"}}
                                        value={state.maritalInfo.city || ''}
                                        onChange={e => onChange(e, 'city', e.target.value)}
                                        onBlur={e => onChange(e, 'city', e.target.value)}
                                    />
                                </MDBCol>
                                <MDBCol>
                                    <TextField
                                        label="State"
                                        error={!!errorMsg.state}
                                        helperText={errorMsg.state}
                                        autoComplete="off"
                                        type="text"
                                        id={`maritalState`}
                                        name="maritalState"
                                        placeholder={`State`}
                                        classes={{root: "custom-text-input"}}
                                        value={state.maritalInfo.state || ''}
                                        onChange={e => onChange(e, 'state', e.target.value)}
                                        onBlur={e => onChange(e, 'state', e.target.value)}
                                    />
                                </MDBCol>
                            </MDBRow>

                            <MDBRow center className={`mb-2`}>
                                <MDBCol>
                                    <TextField
                                        label="Province"
                                        error={!!errorMsg.province}
                                        helperText={errorMsg.province}
                                        autoComplete="off"
                                        type="text"
                                        id={`maritalProvince`}
                                        name="maritalProvince"
                                        placeholder={`Province Details`}
                                        classes={{root: "custom-text-input"}}
                                        value={state.maritalInfo.province || ''}
                                        onChange={e => onChange(e, 'province', e.target.value)}
                                        onBlur={e => onChange(e, 'province', e.target.value)}
                                    />
                                </MDBCol>
                                <MDBCol>
                                    <Autocomplete
                                        options={COUNTRY_LIST}
                                        autoHighlight={true}
                                        disableClearable={true}
                                        value={state.currentMaritalCountry || null}
                                        blurOnSelect={true}
                                        id="maritalCountry"
                                        placeholder={"Select Country"}
                                        onChange={(e, value) => onChange(e, 'country', value)}
                                        getOptionLabel={option => option.label || ''}
                                        renderInput={params => (
                                            <TextField
                                                {...params}
                                                label="In What Country Were you Married?"
                                                classes={{root: "custom-text-input"}}
                                                error={!!errorMsg.country}
                                                helperText={errorMsg.country}
                                                inputProps={{
                                                    ...params.inputProps
                                                }}
                                            />
                                        )}
                                    />
                                </MDBCol>
                            </MDBRow>*/}
                        </React.Fragment>}

                        {(state.maritalInfo.status === "divorced"
                            || state.maritalInfo.status === "widowed"
                            || state.maritalInfo.status === "annulled"
                            || state.maritalInfo.status === "separated")
                        && <React.Fragment>
                            <MDBRow center className={`mb-2`}>
                                <MDBCol>
                                    <TextField
                                        label="Spouse First Name"
                                        error={!!errorMsg.firstName}
                                        helperText={errorMsg.firstName}
                                        type="text"
                                        id={`spouseFName1`}
                                        name="spouseFName1"
                                        classes={{root: "custom-text-input"}}
                                        placeholder={`First Name`}
                                        value={state.spouseDetails.firstName || ''}
                                        onChange={e => onChange(e, 'firstName', e.target.value)}
                                        onBlur={e => onChange(e, 'firstName', e.target.value)}
                                        required
                                    />
                                </MDBCol>
                                <MDBCol>
                                    <TextField
                                        label="Spouse Last Name"
                                        error={!!errorMsg.lastName}
                                        helperText={errorMsg.lastName}
                                        type="text"
                                        id={`spouseLName1`}
                                        name="spouseLName1"
                                        classes={{root: "custom-text-input"}}
                                        placeholder={`Last Name`}
                                        value={state.spouseDetails.lastName || ''}
                                        onChange={e => onChange(e, 'lastName', e.target.value)}
                                        onBlur={e => onChange(e, 'lastName', e.target.value)}
                                        required
                                    />
                                </MDBCol>
                            </MDBRow>
                            <MDBRow center className={`mb-2`}>
                                <MDBCol>
                                    <TextField
                                        label="Spouse Middle Name"
                                        error={!!errorMsg.middleName}
                                        helperText={errorMsg.middleName}
                                        type="text"
                                        id={`spouseMName1`}
                                        name="spouseMName1"
                                        classes={{root: "custom-text-input"}}
                                        placeholder={`Middle Name`}
                                        value={state.spouseDetails.middleName || ''}
                                        onChange={e => onChange(e, 'middleName', e.target.value)}
                                        onBlur={e => onChange(e, 'middleName', e.target.value)}
                                        required
                                    />
                                </MDBCol>
                                <MDBCol>
                                    <DatePicker
                                        variant="inline"
                                        id="dateOfMarriageEnd"
                                        label={label}
                                        classes={{root: "custom-text-input"}}
                                        format="dd/MM/yyyy"
                                        autoOk={true}
                                        disableFuture={true}
                                        error={!!errorMsg.dateOfMarriageEnd}
                                        helperText={errorMsg.dateOfMarriageEnd}
                                        value={state.spouseDetails.dateOfMarriageEnd || null}
                                        onChange={e => onChange(e, 'dateOfMarriageEnd', e.toLocaleDateString())}
                                    />
                                </MDBCol>
                            </MDBRow>

                            <MDBRow center className={`mb-2`}>
                                <FormControlLabel
                                    className={`mb-0`}
                                    control={
                                        <CustomCheckBox
                                            id={`isFormerSpouse`}
                                            checked={isFormerSpouse || null}
                                            onChange={e => onChange(e, "isFormerSpouse", e.target.checked)}
                                            color="primary"
                                            inputProps={{'aria-label': 'secondary checkbox'}}
                                        />
                                    }
                                    label={(<span className={`labelClass`}>Do you have former spouse?</span>)}
                                />
                            </MDBRow>

                            {isFormerSpouse && <React.Fragment>
                                <MDBRow center className={`mb-2`}>
                                    <MDBCol>
                                        <TextField
                                            label="Former Spouse First Name"
                                            error={!!errorMsg.formerFirstName}
                                            helperText={errorMsg.formerFirstName}
                                            type="text"
                                            id={`spouseFName2`}
                                            name="spouseFName2"
                                            classes={{root: "custom-text-input"}}
                                            placeholder={`First Name`}
                                            value={state.formerSpouseDetails.formerFirstName || ''}
                                            onChange={e => onChange(e, 'formerFirstName', e.target.value)}
                                            onBlur={e => onChange(e, 'formerFirstName', e.target.value)}
                                            required
                                        />
                                    </MDBCol>
                                    <MDBCol>
                                        <TextField
                                            label="Former Spouse Last Name"
                                            error={!!errorMsg.formerLastName}
                                            helperText={errorMsg.formerLastName}
                                            type="text"
                                            id={`spouseLName2`}
                                            name="spouseLName2"
                                            classes={{root: "custom-text-input"}}
                                            placeholder={`Last Name`}
                                            value={state.formerSpouseDetails.formerLastName || ''}
                                            onChange={e => onChange(e, 'formerLastName', e.target.value)}
                                            onBlur={e => onChange(e, 'formerLastName', e.target.value)}
                                            required
                                        />
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow center className={`mb-2`}>
                                    <MDBCol>
                                        <TextField
                                            label="Former Spouse Middle Name"
                                            error={!!errorMsg.formerMiddleName}
                                            helperText={errorMsg.formerMiddleName}
                                            type="text"
                                            id={`spouseMName2`}
                                            name="spouseMName2"
                                            classes={{root: "custom-text-input"}}
                                            placeholder={`Middle Name`}
                                            value={state.formerSpouseDetails.formerMiddleName || ''}
                                            onChange={e => onChange(e, 'formerMiddleName', e.target.value)}
                                            onBlur={e => onChange(e, 'formerMiddleName', e.target.value)}
                                            required
                                        />
                                    </MDBCol>
                                    <MDBCol>
                                        <DatePicker
                                            variant="inline"
                                            id="dateOfMarriageEnd2"
                                            label="Date of Marriage End?"
                                            classes={{root: "custom-text-input"}}
                                            format="dd/MM/yyyy"
                                            autoOk={true}
                                            disableFuture={true}
                                            error={!!errorMsg.dateOfMarriageEnd2}
                                            helperText={errorMsg.dateOfMarriageEnd2}
                                            value={state.formerSpouseDetails.dateOfMarriageEnd2 || null}
                                            onChange={e => onChange(e, 'dateOfMarriageEnd2', e.toLocaleDateString())}
                                        />
                                    </MDBCol>
                                </MDBRow>
                            </React.Fragment>}
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

/*const normalizeInput = (str) => {
    let number = str.replace(/,/g, "").replace(/\$/g, "");
    let result = parseFloat(number);
    return isNaN(result) ? str : `$${result.toLocaleString()}`;
};*/
