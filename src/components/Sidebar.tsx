import React, { useContext } from "react";
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
import { UserContext } from "../App";
import { Link } from "react-router-dom";
import { stringToColor } from "../styleHelpers";

const Sidebar = () => {
  const loggedUser = useContext(UserContext);

  return (
    <Box
      flex={2}
      sx={{
        display: { xs: "none", sm: "none", md: "flex" },
        py: 2,
        alignContent: "center",
        justifyContent: "center",
        bgcolor: theme.palette.primary.light,
        minHeight: "100vh",
      }}
    >
      <Box position="fixed" sx={{ display: "flex" }}>
        <Stack direction="column" spacing={1} alignItems={"center"}>
          <Avatar sx={{ bgcolor: stringToColor(loggedUser!.name), width: 160, height: 160 }}></Avatar>
          <Stack sx={{ display: "flex", direction: "row", alignItems: "center" }}>
            <Typography variant="h5">{loggedUser!.name}</Typography>
            <Typography>{loggedUser!.email}</Typography>
          </Stack>
          <List sx={{ mb: 3 }}>
            <Divider sx={{ my: 2 }}></Divider>

            <ListItem disablePadding>
              <ListItemIcon>
                <EventIcon />
              </ListItemIcon>
              <ListItemText primary={`Desde ${loggedUser!.createdAt.split(":")[0].split("T")[0]}`} />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon>
                <FormatListNumberedIcon />
              </ListItemIcon>
              <ListItemText primary={`${loggedUser!.listCount} Listas`} />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary={`${loggedUser!.followersCount} Seguidores `} />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary={`${loggedUser!.followedUsersCount} Seguindo `} />
            </ListItem>
            <Divider sx={{ mt: 2 }}></Divider>
          </List>
          <List>
            <ListItem disablePadding>
              <Link to="/feed" style={{ textDecoration: "none", color: "black" }}>
                <ListItemButton>
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Feed" />
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem disablePadding>
              <Link to="/manage-lists" style={{ textDecoration: "none", color: "black" }}>
                <ListItemButton>
                  <ListItemIcon>
                    <FormatListNumberedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Minhas Listas" />
                </ListItemButton>
              </Link>
            </ListItem>
          </List>
        </Stack>
      </Box>
    </Box>
  );
};

export default Sidebar;
