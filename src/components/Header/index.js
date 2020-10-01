import React from "react";
import {MDBNavbar, MDBNavbarBrand, MDBRow, MDBCol} from "mdbreact";
import Logo from "../../assets/logos.png";
import Avatar from "../../assets/Maya-avatar.jpg";

export default function Header() {
    return (
        <MDBNavbar
            color="light"
            dark
            expand="md"
            className="site-header d-flex flex-column align-items-start"
        >
            <MDBNavbarBrand>
                {/* <strong className="white-text">Navbar</strong> */}
                <MDBRow>
                    <MDBCol sm={"5"} md={"3"}>
                        <img src={Logo} alt="" className="logo img-fluid"/>
                    </MDBCol>
                </MDBRow>
            </MDBNavbarBrand>
            <img src={Avatar} alt="" className="avatar"/>
            {/* <div className="my- d-block d-sm-none"></div> */}
        </MDBNavbar>
    );
}
