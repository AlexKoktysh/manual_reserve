import { Button } from "@mui/material";

export const ButtonComponent = ({ title = "Сохранить", disabled, id, submit }) => {
    return (
        <Button
            size="small"
            variant="contained"
            disabled={disabled}
            onClick={() => submit(id)}
        >{title}</Button>
    );
};