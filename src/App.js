import { useState, useEffect } from "react";
import { HomePage } from "./components/HomePage";
import { Box, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogContentText } from "@mui/material";
import { getDate, editDate, deleteDate } from "./api";
import { InputComponent } from "./components/InputComponent";
import { ButtonComponent } from "./components/ButtonComponent";
import UserDialogComponent from "./components/UserDialogComponent";

export const App = () => {
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    page: 1,
    pageSize: 10,
    pageCount: Math.ceil(totalRecords / 10) || 0,
  });
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  const [allert, setAllert] = useState("");
  const [editFields, setEditFields] = useState([]);
  const [open, setOpen] = useState(false);

  const fetchDate = async (params) => {
    sessionStorage.removeItem("editFields");
    setLoading(true);
    const data = await getDate(params);
    setLoading(false);
    if (data.error) return setAllert(data.error["ajax-errors"]);
    const { columns, rows, totalRecords } = data;
    const custom_rows = rows.map((el) => ({
      ...el,
      "edit_remainder": (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <InputComponent defaulValue="" id={el.edit_remainder} onChangeField={onChangeField} />
          <ButtonComponent disabled={true}  />
        </Box>
      ),
    }));
    setRows(custom_rows);
    setColumns(columns);
    setTotalRecords(totalRecords);
  };
  const onChangeField = (id, value) => {
    setEditFields((prev) => {
      const find = prev?.find((el) => el.id === id);
      if (!find)
        return [
          ...prev,
          { id, value: Number(value) },
        ];
      const res = prev?.map((el) => {
        if (el.id === id) {
          return { id, value: Number(value) };
        }
        return el;
      });
      return res;
    });
  };
  const saveField = async (id) => {
    setLoading(true);
    const items = JSON.parse(sessionStorage.getItem("editFields"));
    const find = items.find((el) => el.id === id);
    let params = {};
    if (id) {
      params = {
        fields: [find],
        filters: columnFilters,
        sorting,
        take: pagination.pageSize,
        skip: pagination.pageSize * (pagination.page - 1),
        searchText: globalFilter,
      };
    } else {
      params = {
        fields: items,
        filters: columnFilters,
        sorting,
        take: pagination.pageSize,
        skip: pagination.pageSize * (pagination.page - 1),
        searchText: globalFilter,
      };
    }
    setEditFields([]);
    setRows([]);
    const data = await editDate(params);
    sessionStorage.removeItem("editFields");
    setLoading(false);
    if (data.error) return setAllert(data.error["ajax-errors"]);
    const { columns, rows, totalRecords } = data;
    const custom_rows = rows.map((el) => ({
      ...el,
      "edit_remainder": (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <InputComponent defaulValue="" id={el.edit_remainder} onChangeField={onChangeField} />
          <ButtonComponent disabled={true} />
        </Box>
      ),
    }));
    setRows(custom_rows);
    setColumns(columns);
    setTotalRecords(totalRecords);
  };
  const remove = async () => {
    const items = [];
    for (const key in rowSelection) {
      const selectedRows = rows.find((row) => (row.position - 1) === Number(key));
      items.push({ id: selectedRows.edit_remainder.props.children[0].props.id });
    }
    const params = {
      fields: items,
      filters: columnFilters,
      sorting,
      take: pagination.pageSize,
      skip: pagination.pageSize * (pagination.page - 1),
      searchText: globalFilter,
    };
    setEditFields([]);
    setRows([]);
    setRowSelection({});
    const data = await deleteDate(params);
    setLoading(false);
    if (data.error) return setAllert(data.error["ajax-errors"]);
    const { columns, rows: rows_server, totalRecords } = data;
    const custom_rows = rows_server?.map((el) => ({
      ...el,
      "edit_remainder": (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <InputComponent defaulValue="" id={el.edit_remainder} onChangeField={onChangeField} />
          <ButtonComponent disabled={true} />
        </Box>
      ),
    }));
    setRows(custom_rows);
    setColumns(columns);
    setTotalRecords(totalRecords);
  };

  useEffect(() => {
    const items = JSON.parse(sessionStorage.getItem("editFields"));
    fetchDate({
      fields: items,
      filters: columnFilters,
      sorting,
      take: pagination.pageSize,
      skip: pagination.pageSize * (pagination.page - 1),
      searchText: globalFilter,
    });
  }, [
    pagination.pageSize,
    pagination.page,
    sorting,
    columnFilters,
    globalFilter,
  ]);

  useEffect(() => {
    sessionStorage.setItem("editFields", JSON.stringify([...editFields]));
    const custom_rows = rows.map((el) => {
      const find = editFields.find((element) => el.edit_remainder.props.children[0].props.id === element.id);
      return {
        ...el,
        "edit_remainder": (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <InputComponent
              defaulValue={!find ? el.edit_remainder.props.children[0].props.value : find.value}
              id={!find ? el.edit_remainder.props.children[0].props.id : find.id}
              onChangeField={onChangeField}
            />
            <UserDialogComponent
              disabled={!find}
              openDialogText="Сохранить"
              agreeActionFunc={() => saveField(!find ? el.edit_remainder.props.children[0].props.id : find.id)}
              agreeActionText='Сохранить одну'
              openedDialogTitle='Сохранение товарной позиции'
              desAgreeActionText="Нет, сохранить все"
              desAgreeActionFunc={saveField}
              message="По кнопке «Сохранить все», будут сохранены все отредактированные записи, по кнопке «Сохранить» только 1 запись. Вы действительно хотите сохранить только одну запись? Все остальные изминения будут утеряны."
            />
          </Box>
        ),
      }
    }); 
    setRows(custom_rows);
  }, [editFields]);

  const openModal = (value) => {
    const items = JSON.parse(sessionStorage.getItem("editFields"));
    if (items?.length) {
      sessionStorage.setItem("pageIndex", value - 1);
      sessionStorage.setItem("page", value);
      return setOpen(true);
    }
    setPagination((prev) => {
      return {...prev, pageIndex: value - 1, page: value};
    });
  };
  const closeModal = () => {
    const pageIndex = JSON.parse(sessionStorage.getItem("pageIndex"));
    const page = JSON.parse(sessionStorage.getItem("page"));
    sessionStorage.setItem("editFields", JSON.stringify([]))
    setPagination((prev) => {
      return {...prev, pageIndex, page };
    });
    sessionStorage.removeItem("pageIndex");
    sessionStorage.removeItem("page");
    setOpen(false);
  };
  const saveModal = () => {
    const pageIndex = JSON.parse(sessionStorage.getItem("pageIndex"));
    const page = JSON.parse(sessionStorage.getItem("page"));
    setPagination((prev) => {
      return {...prev, pageIndex, page };
    });
    sessionStorage.removeItem("pageIndex");
    sessionStorage.removeItem("page");
    setOpen(false);
  };

  if (allert) {
    return <Alert severity="error">{allert}</Alert>;
  }

  return (
    <>
      <HomePage
        loading={loading}
        setLoading={setLoading}
        columns={columns}
        rows={rows}
        totalRecords={totalRecords}
        setTotalRecords={setTotalRecords}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        submit={saveField}
        remove={remove}
        editFields={editFields}
        openModal={openModal}
      />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Вы хотите сохранить внесенные изменения?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            В случае отказа все внесенные изменения не будут сохранены.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={saveModal}>Сохранить</Button>
          <Button autoFocus onClick={closeModal}>
            Не сохранять
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};