import CloseIcon from "@mui/icons-material/Close";
import { Button, DialogContentText } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import * as React from "react";
import Draggable from "react-draggable";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function PaperComponent(props) {
  return (
    <Draggable
      handle='#draggable-dialog-title'
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function UserDialogComponent({
  message,
  openDialogText,
  openDialogIcon,
  openedDialogTitle,
  agreeActionText,
  agreeActionFunc,
  openDialogClickHandler = null,
  closeDialogClickHandler = null,
  desAgreeActionText = "",
  desAgreeActionFunc,
  className = "",
  containerClassname = "",
  disabled = false,
  color = "",
  title = "",
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const handleClickOpen = () => {
    if (openDialogClickHandler !== null) {
      openDialogClickHandler();
    }
    setOpen(true);
  };
  const handleClose = () => {
    if (closeDialogClickHandler !== null) {
      closeDialogClickHandler();
    }
    setOpen(false);
  };

  const AgreeCallback = (e, agreeFunc) => {
    agreeFunc(e, value);
    handleClose();
  };
  const DesAgreeCallback = (e, desAgreeFunc) => {
    desAgreeFunc();
    setValue("");
    setOpen(false);
  };

  return (
    <div className={containerClassname}>
      {color === "" ? (
        <Button
          title={title}
          variant='contained'
          onClick={handleClickOpen}
          className={className}
          size='small'
          disabled={disabled}
          endIcon={openDialogIcon}
        >
          {openDialogText}
        </Button>
      ) : (
        <Button
          title={title}
          variant='contained'
          onClick={handleClickOpen}
          className={className}
          size='small'
          color={color}
          disabled={disabled}
          endIcon={openDialogIcon}
        >
          {openDialogText}
        </Button>
      )}
      <BootstrapDialog
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby='draggable-dialog-title'
        open={open}
      >
        <BootstrapDialogTitle
          style={{ cursor: "move" }}
          id='draggable-dialog-title'
          onClose={handleClose}
        >
          {openedDialogTitle}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={(e) => AgreeCallback(e, agreeActionFunc)}
            children={agreeActionText}
          />
          <Button
            autoFocus
            onClick={(e) => DesAgreeCallback(e, desAgreeActionFunc)}
            className={desAgreeActionText === "" ? "d-none" : "button"}
            children={desAgreeActionText}
          />
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
