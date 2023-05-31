import React from "react";
import theme from "../theme";
import { Box } from "@mui/material";
import { Divider, Stack } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { userViewType } from "../App";
import { loggedUserType } from "../services/api";

export type sidebarVersionType = "userInfo" | "createList" | "searchUser";

export type sidebarPropsType = {
	setCurrentUserView: React.Dispatch<React.SetStateAction<userViewType>>;
	loggedUser: loggedUserType;
};

const Sidebar = (props: sidebarPropsType) => {
	const handleMyListsListButtonOnClick = (_e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		props.setCurrentUserView("userArea");
	};

	const handleFeedListButtonOnClick = (_e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		props.setCurrentUserView("feed");
	};

	return (
		<Box
			flex={2}
			sx={{
				display: { xs: "none", sm: "none", md: "flex" },
				py: 2,
				alignContent: "center",
				justifyContent: "center",
				bgcolor: theme.palette.primary.light,
			}}
		>
			<Box position="fixed" sx={{ display: "flex" }}>
				<Stack direction="column" spacing={1} alignItems={"center"}>
					<Avatar sx={{ bgcolor: "grey", width: 160, height: 160 }}>OP</Avatar>
					<Box>
						<Typography variant="h5">{props.loggedUser.name}</Typography>
						<Typography>{props.loggedUser.email}</Typography>
					</Box>
					<List sx={{ mb: 3 }}>
						<Divider sx={{ my: 2 }}></Divider>

						<ListItem disablePadding>
							<ListItemIcon>
								<EventIcon />
							</ListItemIcon>
							<ListItemText primary={props.loggedUser.created_at} />
						</ListItem>
						<ListItem disablePadding>
							<ListItemIcon>
								<FormatListNumberedIcon />
							</ListItemIcon>
							<ListItemText primary={props.loggedUser.list_count} />
						</ListItem>
						<ListItem disablePadding>
							<ListItemIcon>
								<PeopleIcon />
							</ListItemIcon>
							<ListItemText primary={props.loggedUser.followers_count} />
						</ListItem>
						<ListItem disablePadding>
							<ListItemIcon>
								<PeopleIcon />
							</ListItemIcon>
							<ListItemText primary={props.loggedUser.followed_users_count} />
						</ListItem>
						<Divider sx={{ mt: 2 }}></Divider>
					</List>
					<List>
						<ListItem disablePadding>
							<ListItemButton onClick={handleFeedListButtonOnClick}>
								<ListItemIcon>
									<HomeIcon />
								</ListItemIcon>
								<ListItemText primary="Feed" />
							</ListItemButton>
						</ListItem>
						<ListItem disablePadding>
							<ListItemButton onClick={handleMyListsListButtonOnClick}>
								<ListItemIcon>
									<FormatListNumberedIcon />
								</ListItemIcon>
								<ListItemText primary="Minhas Listas" />
							</ListItemButton>
						</ListItem>
					</List>
				</Stack>
			</Box>
		</Box>
	);
};

export default Sidebar;
