import React from "react";
import {withStyles} from "@material-ui/core/styles";
import {Checkbox} from "@material-ui/core";
import { blue } from '@material-ui/core/colors';

const CustomCheckBox = withStyles({
    root: {
        color: 'gray',
        '&$checked': {
            color: blue[600],
        },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />);

export default CustomCheckBox;
