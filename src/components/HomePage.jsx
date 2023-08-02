import { TableComponent } from "./TableComponent";
import { Box } from "@mui/material";
import UserDialogComponent from "./UserDialogComponent";
import { useEffect, useState } from "react";

export const HomePage = (props) => {
    const [disabled, setDisabled] = useState(true);
    const close = () => {};
    useEffect(() => {
        let items = [];
        for (const key in props.rowSelection) {
            const selectedRows = props.rows.find((row) => (row.position - 1) === Number(key));
            items.push(selectedRows);
        }
        setDisabled(!(items.length > 0));
    }, [props.rowSelection, props.rows]);

    return (
        <Box style={{ height: 1000, width: '100%', overflowY: 'auto' }}>
            <TableComponent {...props} />
            <UserDialogComponent
                disabled={!props.editFields.length}
                openDialogText="Сохранить все"
                agreeActionFunc={props.submit}
                agreeActionText='Сохранить все'
                openedDialogTitle='Сохранение товарных позиций'
                desAgreeActionText="Отмена"
                desAgreeActionFunc={close}
                message="По кнопке «Сохранить все», будут сохранены все отредактированные записи, по кнопке «Сохранить» только 1 запись. Вы действительно хотите сохранить все изменения?"
            />
            <UserDialogComponent
                disabled={disabled}
                openDialogText="Удалить все"
                agreeActionFunc={props.remove}
                agreeActionText='Удалить все'
                openedDialogTitle='Удаление товарных позиций'
                desAgreeActionText="Отмена"
                desAgreeActionFunc={close}
                message="Вы действительно хотите удалить все выбранные записи?"
            />
        </Box>
    );
};