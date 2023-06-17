import * as React from "react";
import { useContext, useState } from "react";
import theme from "../theme";
import { userType, logout, searchUsersByName } from "../services/api";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import { stringToColor } from "../styleHelpers";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { styled } from "@mui/system";
import Typography from "@mui/material/Typography";
import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { InputBase } from "@mui/material";
import { TopicSharp } from "@mui/icons-material";
import SliderValueLabel from "@mui/material/Slider/SliderValueLabel";

const stringAvatar = (name: string) => {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[0][1]}`,
  };
};

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});

const Search = styled("div")(() => ({
  backgroundColor: "white",
  padding: "0 10px",
  borderRadius: "8px",
  width: "40%",
}));

const Icons = styled(Box)(() => ({
  background: "",
}));

export type navbarPropsType = {
  setLoggedUser: React.Dispatch<React.SetStateAction<userType | null>>;
};

const Navbar = (props: navbarPropsType) => {
  const [menuStatus, setMenuStatus] = useState(false);
  const [open, setOpen] = useState(false);
  const [usersFound, setUsersFound] = useState<Array<userType>>([]);
  const [searchedUser, setSearchedUser] = useState("");
  const navigate = useNavigate();
  const loggedUser = useContext(UserContext);

  const handleLogoutOnCLick = () => {
    logout()
      .then(() => props.setLoggedUser(null))
      .catch((error) => console.log(error));
  };

  const handleInputOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setSearchedUser(value);
    if (value.length > 0 && value.length % 2 === 0) {
      searchUsersByName(value)
        .then((response) => setUsersFound(response.data))
        .catch((error) => console.log(error));
    }
  };

  const handleSelectUserOnChange = (_e: React.SyntheticEvent<Element, Event>, value: userType | null) => {
    navigate(`/user-profile/${value!.id}`);
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: theme.palette.primary.main }}>
      <StyledToolbar>
        <Typography variant="h6" onClick={() => navigate("/feed")}>
          My Top Favorite
        </Typography>
        {/* <Search> */}
        {/* <InputBase placeholder="Procurar usuário" type="search"></InputBase> */}
        <Autocomplete
          id="combo-box-search-user"
          sx={{ width: "40%", backgroundColor: "white" }}
          open={open}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          onChange={handleSelectUserOnChange}
          filterOptions={(x) => x}
          isOptionEqualToValue={(option, value) => option.name === value.name}
          getOptionLabel={(option) => option.name}
          options={usersFound}
          renderInput={(params) => <TextField onChange={handleInputOnChange} value={searchedUser} {...params} />}
        />
        {/* </Search> */}
        <Icons onClick={(_e) => setMenuStatus(true)}>
          <Avatar {...stringAvatar(loggedUser!.name)} />
        </Icons>
      </StyledToolbar>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        open={menuStatus}
        onClose={(_e) => setMenuStatus(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleLogoutOnCLick}>Sair</MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Navbar;
