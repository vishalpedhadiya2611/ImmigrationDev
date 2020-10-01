import React from "react";
import {MDBContainer, MDBTable, MDBTableBody} from "mdbreact";

export default function AllOptions(props) {
    const {state} = props;
    return (
        <MDBContainer>
            <h3 className="my-4">ALL OPTIONS</h3>

            <MDBTable bordered>
                <MDBTableBody>
                    {/* // step1 */}
                    <tr>
                        <td>First Name</td>
                        <td>{state.firstName}</td>
                    </tr>
                    <tr>
                        <td>Last Name</td>
                        <td>{state.lastName}</td>
                    </tr>
                    {/* //step3 */}
                    <tr>
                        <td>Street and Number</td>
                        <td>{state.streetAddress}</td>
                    </tr>
                    <tr>
                        <td>Apt/Unit #</td>
                        <td>{state.aptUnitNo}</td>
                    </tr>
                    <tr>
                        <td>City:</td>
                        <td>{state.city}:</td>
                    </tr>
                    <tr>
                        <td>State</td>
                        <td>{state.state}</td>
                    </tr>
                    <tr>
                        <td>Zip Code</td>
                        <td>{state.zipCode}</td>
                    </tr>
                    {/* <tr>
            <td>Under Constructions</td>
            <td>{state.underConstructions}</td>
          </tr> */}
                    {/* // step4 */}
                    <tr>
                        <td>Are you looking to reduce your payment or take cash out?</td>
                        <td>{state.paymentMethod}</td>
                    </tr>
                    {/* // step5 */}
                    <tr>
                        <td>Did you Ever serve in the armed forces?</td>
                        <td>{state.servedInArmedForces}</td>
                    </tr>
                    {/* // step6 */}
                    <tr>
                        <td>How Much are you currently paying a month?</td>
                        <td>{state.moneyAmount}</td>
                    </tr>
                    {/* // step7 */}
                    <tr>
                        <td>How is this property used?</td>
                        <td>{state.howPropertyUsed}</td>
                    </tr>
                    {/* // step8 */}
                    <tr>
                        <td>Are you married?</td>
                        <td>{state.married}</td>
                    </tr>
                    {/* // step9 */}
                    <tr>
                        <td>Income</td>
                        <td>{state.income}</td>
                    </tr>
                    {/* // step10 */}
                    <tr>
                        <td>Email</td>
                        <td>{state.email}</td>
                    </tr>
                    {/* // step11 */}
                    <tr>
                        <td>Phone</td>
                        <td>{state.phone}</td>
                    </tr>
                    {/* // step12 */}
                    <tr>
                        <td>Date of Birth</td>
                        <td>{state.dob}</td>
                    </tr>
                </MDBTableBody>
            </MDBTable>
        </MDBContainer>
    );
}
