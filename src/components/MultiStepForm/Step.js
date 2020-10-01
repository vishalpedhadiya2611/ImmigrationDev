import React from "react";
import {MDBContainer} from "mdbreact";
import {Fade} from "react-reveal";

export default function Step(props) {
    const {heading, children} = props;
    return (
        <div className="d-flex justify-content-center main-content">
            <MDBContainer className="m-4">
                <Fade>
                    <h3 className="text-center">{heading}</h3>
                    {children}
                </Fade>
            </MDBContainer>
        </div>
    );
}
