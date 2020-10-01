import React, {Component} from "react";
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {Redirect, Route, Switch} from "react-router-dom";
import axios from "axios";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Step6 from "./Step6";
import Step7 from "./Step7";
import Step8 from "./Step8";
import Step9 from "./Step9";
import Step10 from "./Step10";
import Step11 from "./Step11";
import Step12 from "./Step12";
import Step13 from "./Step13";
import Step14 from "./Step14";
import Step15 from "./Step15";
import Step16 from "./Step16";
import Step17 from "./Step17";
import Step18 from "./Step18";
import Step19 from "./Step19";
import Step20 from "./Step20";
import Step21 from "./Step21";
import Step22 from "./Step22";
import Step23 from "./Step23";
import Step24 from "./Step24";
import Step25 from "./Step25";
import Step26 from "./Step26";
import Step27 from "./Step27";
import Step28 from "./Step28";
import Step29 from "./Step29";
import Step30 from "./Step30";
import Step31 from "./Step31";
import Step32 from "./Step32";
import Step33 from "./Step33";
import Step34 from "./Step34";
import Step35 from "./Step35";
import Step36 from "./Step36";
// import AllOptions from "./AllOptions";
import ThankYou from "./ThankYou";
import Decline from "./Decline";

export default class MultiStepForm extends Component {
    state = {
        // step1
        reqFor: "",
        // reqForSub: "",
        // adoptRelated: false,
        // adoptCiti: false,

        //step 2
        arNumber: "",
        dontHaveARN: false,
        dontHaveUSCIS: false,
        uscisOAN: "",
        dontHaveUSSS: false,
        usssNumber: "",
        fname: "",
        lname: "",
        mName: "",

        //step3
        isPrevNames: false,
        prevfname: "",
        prevlname: "",
        prevmName: "",
        city: "",
        country: "",
        gender: "",

        // step4
        mailAddress: {},

        // step5
        physAddressSame: false,
        physAddress: {},

        // step6
        prevPhysAddr: {},

        // step7
        maritalInfo: {},
        spouseDetails: {},
        formerSpouseDetails: {},

        // step8
        dontKnowMother: false,
        mothersDetails: {},

        // step9
        dontKnowFather: false,
        fathersDetails: {},

        // step10
        residenceType: "",

        // step11
        employed: false,
        dontHavePrevPosition: false,

        // step12
        bioGraphicInfo: {hispanicOrLatino: true},

        // step13

        // step14:
        beneficiaryInfo: {
            currentAddress: {},
            contactInfo: {},
            maritalInfo: {},
            entryInfo: {},
            employerInfo: {},
            immigrationProceedingInfo: {}
        },
        //step 20
        childInfoCountryList: [],
        employerCountry: {},
        isEmployed: false,
        docIssuanceCountry: {},
    };

    /*handleChangeField = (e = {}, name, value) => {
        this.setState(
            {
                [name]: value,
            },
            () => console.log(this.state)
        );
    };*/

    handleChangeState = newState => {
        this.setState(newState);
    }

    submitData() {
        const data = {
            reqFor: this.state.reqFor,
            reqForSub: this.state.reqForSub,
            adoptRelated: this.state.adoptRelated,
            adoptCiti: this.state.adoptCiti,
            arNumber: this.state.arNumber,
            dontHaveARN: this.state.dontHaveARN,
            dontHaveUSCIS: this.state.dontHaveUSCIS,
            uscisOAN: this.state.uscisOAN,
            dontHaveUSSS: this.state.dontHaveUSSS,
            usssNumber: this.state.usssNumber,
            fname: this.state.fname,
            lname: this.state.lname,
            mName: this.state.mName,
            isPrevNames: this.state.isPrevNames,
            prevfname: this.state.prevfname,
            prevlname: this.state.prevlname,
            prevmName: this.state.prevmName,
            city: this.state.city,
            country: this.state.country,
            gender: this.state.gender,
            mailAddress: this.state.mailAddress,
            physAddress: this.state.physAddress,
            maritalInfo: this.state.maritalInfo,
            spouseDetails: this.state.spouseDetails,
            formerSpouseDetails: this.state.spouseDetails,
            mothersDetails: this.state.mothersDetails,
            dontKnowMother: this.state.dontKnowMother,
            dontKnowFather: this.state.dontKnowFather,
            fathersDetails: this.state.fathersDetails,
            residenceType: this.state.residenceType,
            employed: this.state.employed,
            bioGraphicInfo: this.state.bioGraphicInfo,
            beneficiaryInfo: this.state.beneficiaryInfo,

            Part5Line3DayTimePhoneNumber: this.state.teleNumber,
            Part5Line4MobileNumber: this.state.mobileNumber,
            Part5Line5Email: this.state.email,

            Part6Line1Checkbox: this.state.understandEnglish,
            Part6Line1Language: this.state.language,
            Part6Line2: this.state.interpreterNeeded,
            Part6LineRepresentativeName: '',

            Part7Line1aInterpreterFamilyName: this.state.interpreterLastName,
            Part7Line1bInterpreterGivenName: this.state.interpreterFirstName,
            Part7Line1bInterpreterBusinessorOrg: this.state.interpreterOrg,

            Part7Line3StreetNumberName: this.state.interpreterMailAddr && this.state.interpreterMailAddr.street,
            Part7Line3Unit: '',
            Part7Line3ZipCode: this.state.interpreterMailAddr && this.state.interpreterMailAddr.zipCode,
            Partine7Line3Country: this.state.interpreterMailAddr && this.state.interpreterMailAddr.country,

            Part7Line53DayTimePhone: this.state.interpreterMailAddr && this.state.interpreterMailAddr.interpreterTeleNumber,
            Part7Line5Email: this.state.interpreterMailAddr && this.state.interpreterMailAddr.interpreterEmail,
            Part7LineNameofLanguage: this.state.interpreterMailAddr && this.state.interpreterMailAddr.interpreterEmail,

            Part8Line1aPreparerFamilyName: this.state.preparerLastName,
            Part8Line1bPreparerGivenName: this.state.preparerFirstName,
            Part8Line2Bussinessname: this.state.preparerOrg,
            Part8Line3StreetNumberName: this.state.preparerMailAddr && this.state.preparerMailAddr.street,
            Part8Line3State: '',
            Part8Line3Zipcode: this.state.preparerMailAddr && this.state.preparerMailAddr.zipCode,
            Part8Line3Country: this.state.preparerMailAddr && this.state.preparerMailAddr.country,

            Part8Line4InterpreterDayTime: this.state.preparerTeleNumber,
            Part8Line4DayTimePhoneNumber: this.state.preparerMobileNumber,
            Part8Line6Email: this.state.preparerEmail,
        };

        if (this.state.residenceType === "usCitizen") data['usCitizen'] = this.state.usCitizen;
        if (this.state.residenceType === "lawfulPR") data['lawfulPR'] = this.state.lawfulPR;

        if (this.state.employed) data['employerDetails'] = this.state.employerDetails;
        if (this.state.hasOwnProperty('prevEmployerDetails')) data['prevEmployerDetails'] = this.state.prevEmployerDetails;

        console.log("Body: ", JSON.stringify(data));
        /*axios
            .post("https://hooks.zapier.com/hooks/catch/1712527/o5y1jta/", data)
            .then((response) => console.log(response))
            .finally(() => console.log("Data Sent", {data: data}));*/
    }

    renderStep = (props) => {
        const {history} = props;
        const {path, params} = props.match;
        if (params.step === "thankyou") {
            this.submitData();
            return <ThankYou/>;
        } else if (params.step === "decline") {
            return <Decline/>;
        }
        const step = parseInt(params.step);
        const currentPath = `/${path.split("/")[1]}`;
        switch (step) {
            case 1:
                return (
                    <Step1
                        history={history}
                        nextStep={`${currentPath}/2`}
                        state={this.state}
                        onChangeState={this.handleChangeState}
                    />
                );
            case 2:
                return (
                    <Step2
                        history={history}
                        prevStep={`${currentPath}/1`}
                        nextStep={`${currentPath}/3`}
                        state={this.state}
                        onChangeState={this.handleChangeState}
                    />
                );
            case 3:
                return (
                    <Step3
                        history={history}
                        prevStep={`${currentPath}/2`}
                        nextStep={`${currentPath}/4`}
                        state={this.state}
                        onChangeState={this.handleChangeState}
                    />
                );
            case 4:
                return (
                    <Step4
                        history={history}
                        prevStep={`${currentPath}/3`}
                        nextStep={`${currentPath}/5`}
                        state={this.state}
                        onChangeState={this.handleChangeState}
                    />
                );
            case 5:
                return (
                    <Step5
                        history={history}
                        prevStep={`${currentPath}/4`}
                        nextStep={`${currentPath}/6`}
                        state={this.state}
                        onChangeState={this.handleChangeState}
                    />
                );
            case 6:
                return (
                    <Step6
                        history={history}
                        prevStep={`${currentPath}/5`}
                        nextStep={`${currentPath}/7`}
                        state={this.state}
                        onChangeState={this.handleChangeState}
                    />
                );
            case 7:
                return (
                    <Step7
                        history={history}
                        prevStep={`${currentPath}/5`}
                        nextStep={`${currentPath}/8`}
                        state={this.state}
                        onChangeState={this.handleChangeState}
                    />
                );
            case 8:
                return (
                    <Step8
                        history={history}
                        prevStep={`${currentPath}/7`}
                        nextStep={`${currentPath}/9`}
                        state={this.state}
                        onChangeState={this.handleChangeState}
                    />
                );
            case 9:
                return (
                    <Step9
                        history={history}
                        prevStep={`${currentPath}/8`}
                        nextStep={`${currentPath}/10`}
                        state={this.state}
                        onChangeState={this.handleChangeState}
                    />
                );
            case 10:
                return (
                    <Step10
                        history={history}
                        prevStep={`${currentPath}/9`}
                        nextStep={`${currentPath}/11`}
                        state={this.state}
                        onChangeState={this.handleChangeState}
                    />
                );
            case 11:
                return (
                    <Step11
                        history={history}
                        prevStep={`${currentPath}/10`}
                        nextStep={`${currentPath}/12`}
                        state={this.state}
                        onChangeState={this.handleChangeState}
                    />
                );
            case 12:
                return (
                    <Step12
                        history={history}
                        prevStep={`${currentPath}/11`}
                        nextStep={`${currentPath}/13`}
                        state={this.state}
                        onChangeState={this.handleChangeState}
                    />
                );
            case 13:
                return (
                    <Step13
                        history={history}
                        prevStep={`${currentPath}/12`}
                        nextStep={`${currentPath}/14`}
                        state={this.state}
                        onChangeState={this.handleChangeState}
                    />
                );
            case 14:
                return (
                    <Step14
                        history={history}
                        prevStep={`${currentPath}/13`}
                        nextStep={`${currentPath}/15`}
                        state={this.state}
                        onChangeState={this.handleChangeState}
                    />
                );
            case 15:
                return (
                    <Step15
                        history={history}
                        prevStep={`${currentPath}/14`}
                        nextStep={`${currentPath}/16`}
                        state={this.state}
                        onChangeState={this.handleChangeState}
                    />
                );
            case 16:
                return (
                    <Step16
                        history={history}
                        prevStep={`${currentPath}/15`}
                        nextStep={`${currentPath}/17`}
                        state={this.state}
                        onChangeState={this.handleChangeState}
                    />
                );
            case 17:
                return (
                    <Step17
                        history={history}
                        prevStep={`${currentPath}/16`}
                        nextStep={`${currentPath}/18`}
                        state={this.state}
                        onChangeState={this.handleChangeState}
                    />
                );
            case 18:
                return (
                    <Step18
                        history={history}
                        prevStep={`${currentPath}/17`}
                        nextStep={`${currentPath}/19`}
                        state={this.state}
                        onChangeState={this.handleChangeState}
                    />
                );
            case 19:
                return (
                    <Step19
                        history={history}
                        prevStep={`${currentPath}/18`}
                        nextStep={`${currentPath}/20`}
                        state={this.state}
                        onChangeState={this.handleChangeState}
                    />
                );

            case 20:
                return (
                    <Step20
                        history={history}
                        prevStep={`${currentPath}/19`}
                        nextStep={`${currentPath}/21`}
                        state={this.state}
                        onChangeState={this.handleChangeState}
                    />
                );
            case 21:
                return (
                    <Step21
                        history={history}
                        prevStep={`${currentPath}/20`}
                        nextStep={`${currentPath}/22`}
                        state={this.state}
                        onChangeState={this.handleChangeState}
                    />
                );
            case 22:
                return (
                    <Step22
                        history={history}
                        prevStep={`${currentPath}/21`}
                        nextStep={`${currentPath}/23`}
                        state={this.state}
                        onChangeState={this.handleChangeState}
                    />
                );
            case 23:
                return (
                    <Step23
                        history={history}
                        prevStep={`${currentPath}/22`}
                        nextStep={`${currentPath}/24`}
                        state={this.state}
                        onChangeState={this.handleChangeState}
                    />
                );
            case 24:
                return (
                    <Step24
                        history={history}
                        prevStep={`${currentPath}/23`}
                        nextStep={`${currentPath}/25`}
                        state={this.state}
                        onChangeState={this.handleChangeState}
                    />
                );
            case 25:
                return (
                    <Step25
                        history={history}
                        prevStep={`${currentPath}/24`}
                        nextStep={`${currentPath}/26`}
                        state={this.state}
                        onChangeState={this.handleChangeState}
                    />
                );
            case 26:
                return (
                    <Step26
                        history={history}
                        prevStep={`${currentPath}/25`}
                        nextStep={`${currentPath}/27`}
                        state={this.state}
                        onChangeState={this.handleChangeState}
                    />
                );
            case 27:
                return (
                    <Step27
                        history={history}
                        prevStep={`${currentPath}/26`}
                        nextStep={`${currentPath}/28`}
                        state={this.state}
                        onChangeState={this.handleChangeState}
                    />
                );
            case 28:
                return (
                    <Step28
                        history={history}
                        prevStep={`${currentPath}/27`}
                        nextStep={`${currentPath}/29`}
                        state={this.state}
                        onChangeState={this.handleChangeState}
                    />
                );
            case 29:
                return (
                    <Step29
                        history={history}
                        prevStep={`${currentPath}/28`}
                        nextStep={`${currentPath}/30`}
                        state={this.state}
                        onChangeState={this.handleChangeState}
                    />
                );
            case 30:
                return (
                    <Step30
                        history={history}
                        prevStep={`${currentPath}/29`}
                        nextStep={`${currentPath}/31`}
                        state={this.state}
                        onChangeState={this.handleChangeState}
                    />
                );
            case 31:
                return (
                    <Step31
                        history={history}
                        prevStep={`${currentPath}/30`}
                        nextStep={`${currentPath}/32`}
                        state={this.state}
                        onChangeState={this.handleChangeState}
                    />
                );
            case 32:
                return (
                    <Step32
                        history={history}
                        prevStep={`${currentPath}/31`}
                        nextStep={`${currentPath}/33`}
                        state={this.state}
                        onChangeState={this.handleChangeState}
                    />
                );
            case 33:
                return (
                    <Step33
                        history={history}
                        prevStep={`${currentPath}/32`}
                        nextStep={`${currentPath}/34`}
                        state={this.state}
                        onChangeState={this.handleChangeState}
                    />
                );
            case 34:
                return (
                    <Step34
                        history={history}
                        prevStep={`${currentPath}/33`}
                        nextStep={`${currentPath}/35`}
                        state={this.state}
                        onChangeState={this.handleChangeState}
                    />
                );
            case 35:
                return (
                    <Step35
                        history={history}
                        prevStep={`${currentPath}/34`}
                        nextStep={`${currentPath}/36`}
                        state={this.state}
                        onChangeState={this.handleChangeState}
                    />
                );
            case 36:
                return (
                    <Step36
                        history={history}
                        prevStep={`${currentPath}/35`}
                        nextStep={`${currentPath}/thankyou`}
                        state={this.state}
                        onChangeState={this.handleChangeState}
                    />
                );
            default:
                return <div>invalid step</div>;
        }
    };

    render() {
        const {path} = this.props.match;
        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Switch>
                    <Route
                        path="/start"
                        exact
                        render={() => <Redirect to={`${path}/1`}/>}
                    />
                    <Route path={`${path}/:step`} render={(props) => <>
                        {this.renderStep(props)}
                        {/*<div style={{position: 'fixed', bottom: '0px', padding: 10, width: '100%'}}>
                            <small style={{display: 'flex', justifyContent: 'center'}}>SBA
                                Disasters Pros is in no way shape or form affiliated with the U.S. Government or the
                                Small Business
                                Administration</small>
                        </div>*/}
                    </>}/>
                </Switch>
            </MuiPickersUtilsProvider>
        );
    }
}
