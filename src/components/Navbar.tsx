import * as React from "react";
import { useState } from "react";
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
		children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
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

const Navbar = () => {
	const [menuStatus, setMenuStatus] = useState(false);

	return (
		<AppBar position="sticky" sx={{ bgcolor: theme.palette.primary.main }}>
			<StyledToolbar>
				<Typography variant="h6">My Top Favorite</Typography>
				<Search>
					<InputBase placeholder="Procurar usuário"></InputBase>
				</Search>
				<Icons onClick={(_e) => setMenuStatus(true)}>
					<Avatar {...stringAvatar("Amanda FIaquinta")} />
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
				<MenuItem>Minha Conta</MenuItem>
				<MenuItem>Sair</MenuItem>
			</Menu>
		</AppBar>
	);
};

export default Navbar;
