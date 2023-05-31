import Box from "@mui/material/Box";
import * as React from "react";
import { useState } from "react";
import { Stack } from "@mui/material";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import IconButton from "@mui/material/IconButton";
import theme from "../theme";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { USER } from "../App";

const style = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	borderRadius: "5px",
	p: 4,
};

type cardType = { itemId: number; category: string; title: string; date: string; apiId: number };

const CARDS = [
	{ itemId: 1, category: "Filmes", title: "Top 5 Filmes de Ação", date: "06/05/2023", apiId: 1 },
	{ itemId: 2, category: "Filmes", title: "Top 10 FIlmes Favoritos", date: "06/05/2023", apiId: 2 },
	{ itemId: 3, category: "Filmes", title: "Top 5 Filmes de Ação", date: "06/05/2023", apiId: 3 },
	{ itemId: 4, category: "Filmes", title: "Top 10 FIlmes Favoritos", date: "06/05/2023", apiId: 4 },
	{ itemId: 5, category: "Filmes", title: "Top 5 Filmes de Ação", date: "06/05/2023", apiId: 5 },
	{ itemId: 6, category: "Filmes", title: "Top 10 FIlmes Favoritos", date: "06/05/2023", apiId: 6 },
	{ itemId: 7, category: "Filmes", title: "Top 5 Filmes de Ação", date: "06/05/2023", apiId: 7 },
	{ itemId: 8, category: "Filmes", title: "Top 10 FIlmes Favoritos", date: "06/05/2023", apiId: 8 },
	{ itemId: 9, category: "Filmes", title: "Top 5 Filmes de Ação", date: "06/05/2023", apiId: 1 },
	{ itemId: 10, category: "Filmes", title: "Top 10 FIlmes Favoritos", date: "06/05/2023", apiId: 2 },
	{ itemId: 11, category: "Filmes", title: "Top 5 Filmes de Ação", date: "06/05/2023", apiId: 3 },
	{ itemId: 12, category: "Filmes", title: "Top 10 FIlmes Favoritos", date: "06/05/2023", apiId: 4 },
	{ itemId: 13, category: "Filmes", title: "Top 5 Filmes de Ação", date: "06/05/2023", apiId: 5 },
	{ itemId: 14, category: "Filmes", title: "Top 10 FIlmes Favoritos", date: "06/05/2023", apiId: 6 },
	{ itemId: 15, category: "Filmes", title: "Top 5 Filmes de Ação", date: "06/05/2023", apiId: 7 },
	{ itemId: 16, category: "Filmes", title: "Top 10 FIlmes Favoritos", date: "06/05/2023", apiId: 8 },
];

const ManageLists = () => {
	const [userLists, setUserLists] = useState(CARDS);
	const [openNewListForm, setOpenNewListForm] = useState(false);
	const listCategories = ["Filmes"];
	const [listTitle, setListTitle] = useState("");
	const [listCategory, setListCategory] = useState(listCategories[0]);

	const handleListTitleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setListTitle(e.target.value);
	};

	const handleListCategoryOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setListCategory(e.target.value);
	};

	const handleDeleteListOnClick = (listId: number) => (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		setUserLists((previousItems) => previousItems.filter((item) => item.itemId !== listId));
	};

	return (
		<>
			<Box sx={{ display: "flex", flex: 10 }}>
				<Stack direction="column" display={"flex"} flex={8} minHeight={"100vh"}>
					<Box flex={8} bgcolor={theme.palette.secondary.main} maxHeight={"25%"}>
						<Typography
							variant="h3"
							sx={{
								alignContent: "center",
								justifyContent: "center",
								display: "flex",
								p: 5,
								color: "white",
							}}
						>
							Bem-vindo {USER.name}
						</Typography>
					</Box>
					<Box
						sx={{
							display: "flex",
							flex: 8,
							p: 1,
							bgcolor: theme.palette.primary.dark,
							flexWrap: "wrap",
						}}
					>
						<Card sx={{ minWidth: 275, m: 1, maxHeight: "40%" }}>
							<CardContent sx={{ mb: 6 }}>
								<IconButton size="large" onClick={(_e) => setOpenNewListForm(true)}>
									<AddCircleOutlineIcon fontSize="large" sx={{ mr: 1 }} />
									Nova Lista
								</IconButton>
							</CardContent>
						</Card>
						<Modal
							open={openNewListForm}
							aria-labelledby="modal-modal-title"
							aria-describedby="modal-modal-description"
						>
							<Box sx={style} component="form">
								<Stack direction="column" display={"flex"} spacing={2}>
									<Typography variant="h5" component="div">
										Crie uma nova lista!
									</Typography>
									<TextField
										required
										id="outlined-required"
										label="Título"
										value={listTitle}
										onChange={handleListTitleOnChange}
									/>
									<TextField
										id="outlined-select-currency"
										select
										defaultValue={listCategories[0]}
										required
										label="Categoria"
										value={listCategory}
										onChange={handleListCategoryOnChange}
									>
										{listCategories.map((category, index) => (
											<MenuItem key={index} value={category}>
												{category}
											</MenuItem>
										))}
									</TextField>
									{/* <TextField id="outlined-select-currency" select required label="Quantidade de Itens">
										{[...Array(8).keys()].map((n, index) => (
											<MenuItem key={index} value={n + 3}>
												{n + 3}
											</MenuItem>
										))}
									</TextField> */}
									<Link
										to="/createlistarea"
										state={{
											listTitle: listTitle,
											listCategory: listCategory,
										}}
										//verificar se tittle não é null
										style={{ textDecoration: "none", color: "white" }}
									>
										<Button
											sx={{
												bgcolor: theme.palette.secondary.main,
												color: "white",
												display: "flex",
											}}
											disabled={listTitle === ""}
											onClick={(_e) => {
												setOpenNewListForm(false);
											}}
											fullWidth={true}
										>
											Criar
										</Button>
									</Link>
									<Button
										sx={{
											bgcolor: theme.palette.secondary.main,
											color: "white",
										}}
										onClick={(_e) => {
											setOpenNewListForm(false);
										}}
									>
										Cancelar
									</Button>
								</Stack>
							</Box>
						</Modal>
						{userLists.map((card) => (
							<Card
								sx={{
									minWidth: 275,
									maxWidth: 200,
									m: 1,
									maxHeight: "40%",
									display: "flex",
									flexDirection: "column",
								}}
								key={card.apiId}
							>
								<CardContent sx={{ mb: 6 }}>
									<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
										{card.category}
									</Typography>
									<Typography variant="h5" component="div">
										{card.title}
									</Typography>
									<Typography sx={{ mb: 1.5 }} color="text.secondary">
										{card.date}
									</Typography>
								</CardContent>
								<CardActions disableSpacing sx={{ mt: "auto" }}>
									<Stack direction="row" display="flex" justifyContent="end">
										<Link
											to="/editlist"
											state={{
												listId: card.itemId,
											}}
											//verificar se tittle não é null
											style={{ textDecoration: "none", color: "white" }}
										>
											<Button size="small">Editar</Button>
										</Link>
										<Button size="small" onClick={handleDeleteListOnClick(card.itemId)}>
											Deletar
										</Button>
									</Stack>
								</CardActions>
							</Card>
						))}
					</Box>
				</Stack>
			</Box>
		</>
	);
};

export default ManageLists;
