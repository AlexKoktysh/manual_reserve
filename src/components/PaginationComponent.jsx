import Pagination from "@mui/material/Pagination";

export const PaginationComponent = (props) => {
    const { pagination, totalRecords, openModal } = props;
    const change = (value) => {
        openModal(value);
    };

    return (
        <Pagination
            count={Math.ceil(totalRecords / pagination.pageSize)}
            color="primary"
            onChange={(event, value) => change(value)}
            page={pagination.page}
        />
    );
};