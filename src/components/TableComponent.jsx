import MaterialReactTable from "material-react-table";
import { MRT_Localization_RU } from "material-react-table/locales/ru";
import { PaginationComponent } from "./PaginationComponent";

export const TableComponent = (props) => {
    const {
        totalRecords,
        pagination,
        setPagination,
        sorting,
        setSorting,
        columnFilters,
        setColumnFilters,
        globalFilter,
        setGlobalFilter,
        loading,
        columns,
        rows,
        rowSelection,
        setRowSelection,
        openModal,
    } = props;

    return (
        <MaterialReactTable
            columns={columns}
            data={rows}
            enableRowSelection
            getRowId={(row) => row.id}
            onRowSelectionChange={setRowSelection}
            initialState={{ density: 'compact' }}
            state={{
                pagination,
                sorting,
                columnFilters,
                globalFilter,
                showSkeletons: loading,
                rowSelection,
            }}
            onPaginationChange={setPagination}
            onSortingChange={setSorting}
            onColumnFiltersChange={setColumnFilters}
            onGlobalFilterChange={setGlobalFilter}
            rowCount={totalRecords}
            localization={MRT_Localization_RU}
            defaultColumn={{
                minSize: 40,
                maxSize: 300,
                size: 250,
            }}
            muiTablePaginationProps={{
                rowsPerPageOptions: [5, 10, 20],
                width: "100%",
                className: "pagination",
                ActionsComponent: () => PaginationComponent({ setPagination, pagination, totalRecords, openModal })
            }}
        />
    );
};