import styled from "@emotion/styled";
import { Box } from "@mui/material";
import theme from "./theme";

export const Icons = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
}));

export const buttonStyle = {
  bgcolor: theme.palette.secondary.main,
  color: "white",
  mr: 1,
};