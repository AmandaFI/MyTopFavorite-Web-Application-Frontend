import { useState } from "react";
import * as React from "react";
import { Routes, Route } from "react-router-dom";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import CreateListArea from "./components/CreateListArea";
import EditList from "./components/EditList";
import { loggedUserType } from "./services/api";
import Navbar from "./components/Navbar";
import Sidebar from "./components/sidebar";
import { Box, Stack } from "@mui/material";
import Feed from "./components/Feed";
import ManageLists from "./components/ManageLists";

export const USER = {
	name: "Amanda FI",
	email: "amanda@ia5",
	nLIst: 11,
	follows: 100,
	followers: 50,
	createdAt: "05/2023",
};

export type userViewType = "feed" | "userArea" | "listCreation" | "listEdition";

const App = () => {
	const [loggedUser, setLoggedUser] = useState<loggedUserType | null>(null);
	const [currentUserView, setCurrentUserView] = useState<userViewType>("feed");

	if (loggedUser === null) return <SignIn {...{ setLoggedUser }} />;
	else {
		let currentUserViewComponent;

		switch (currentUserView) {
			case "feed":
				currentUserViewComponent = <Feed />;
				break;
			case "userArea":
				currentUserViewComponent = <ManageLists />;
				break;
			case "listCreation":
				currentUserViewComponent = <CreateListArea />;
				break;
			case "listEdition":
				currentUserViewComponent = <EditList />;
				break;
			default:
				const _exhaustiveCheck: never = currentUserView;
		}

		return (
			<>
				<Box>
					<Navbar />
					<Stack direction="row" justifyContent={"space-between"}>
						<Sidebar {...{ setCurrentUserView, loggedUser }} />
						{currentUserViewComponent}
					</Stack>
				</Box>
			</>
		);
	}
};

export default App;
