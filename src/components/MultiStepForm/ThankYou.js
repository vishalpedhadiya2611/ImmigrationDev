import React, {useEffect} from "react";

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
    return (
        <h2 className="text-center pt-4">
            Thank You, We've received your application and it will be processed and
            submitted to the SBA for Review.
        </h2>
    );
}
