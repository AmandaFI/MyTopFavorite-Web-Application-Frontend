import * as React from "react";
import { useContext, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { styled } from "@mui/system";
import Typography from "@mui/material/Typography";
import theme from "../theme";
import { Box } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { InputBase } from "@mui/material";
import { loggedUserType } from "../services/api";
import { UserContext } from "../App";

const stringToColor = (string: string) => {
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
	setLoggedUser: React.Dispatch<React.SetStateAction<loggedUserType | null>>;
}

const Navbar = (props: navbarPropsType) => {
	const [menuStatus, setMenuStatus] = useState(false);

	const handleLogoutOnCLick = () => {
		props.setLoggedUser(null);
	}
	const loggedUser = useContext(UserContext)

	return (
		<AppBar position="sticky" sx={{ bgcolor: theme.palette.primary.main }}>
			<StyledToolbar>
				<Typography variant="h6">My Top Favorite</Typography>
				<Search>
					<InputBase placeholder="Procurar usuário" type="search"></InputBase>
				</Search>
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
