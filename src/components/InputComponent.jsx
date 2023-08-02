import { useState } from "react";
import { TextField } from "@mui/material";

export const InputComponent = ({ defaulValue, onChangeField, id }) => {
    const [value, setValue] = useState(defaulValue);
    const onChange = (value) => {
        setValue(value);
        onChangeField(id, value)
    };

    return (
        <TextField
            sx={{ marginY: "20px", width: "100%" }}
            label="Количество"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            size="small"
        />
    );
};