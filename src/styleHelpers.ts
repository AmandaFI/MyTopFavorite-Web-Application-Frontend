import styled from "@emotion/styled";
import { Box } from "@mui/material";
import theme from "./theme";
import { ToastOptions } from "react-toastify";

export const Icons = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
}));

export const buttonStyle = {
  bgcolor: theme.palette.primary.main,
  color: "white",
  mr: 1,
};

export const stringAvatar = (name: string) => {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[0][1]}`,
  };
};

export const modalBoxStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  borderRadius: "5px",
  p: 4,
};

export const stringToColor = (string: string) => {
  let hash = 0;
  let i;
  let color = "#";

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
};

export const baseToast: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
}