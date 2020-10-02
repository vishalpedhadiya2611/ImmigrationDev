import React, {useEffect} from "react";
import {MDBBtn,MDBContainer, MDBRow} from "mdbreact";

export default function ThankYou(props) {
    useEffect(() => {
        try {
            if (window.gtag) {
                window.gtag("event", "conversion", {
                    send_to: "AW-668502602/QgIiCNu_g9ABEMqU4r4C",
                });
            }
        } catch (e) {
        }
    });
	
	const onHome = () => {
        props.history.push(props.nextStep);
    };
	
    return (
		 <MDBContainer>
			<MDBRow center></MDBRow>
			<MDBRow center className="d-flex flex-column align-items-center">
				<h2 className="text-center pt-4">
					Thank You, We've received your application and it will be processed and
					submitted to the SBA for Review.
				</h2>
				<MDBBtn
					color="pink"
					rounded
					type="button"
					className="z-depth-1a"
					onClick={() => onHome()}
				>
					Home
				</MDBBtn>
			</MDBRow>
		</MDBContainer>
    );
}
