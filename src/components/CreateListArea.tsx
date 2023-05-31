import React, { useEffect, useState, useRef } from "react";
import { Box, Stack } from "@mui/material";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { styled } from "@mui/system";
import { responseResultType, searchMovieByTitle } from "../services/tmdbApi";
import Container from "@mui/material/Container";
import theme from "../theme";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";

const style = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: "50%",
	bgcolor: "background.paper",
	borderRadius: "5px",
	p: 4,
};

const buttonStyle = {
	bgcolor: theme.palette.secondary.main,
	color: "white",
	mr: 1,
};

const Icons = styled(Box)(() => ({
	display: "flex",
	justifyContent: "space-between",
}));

export type CreateListPropsType = {
	listTitle: string;
	listCategory: string;
};

const CreateListArea = () => {
	const [listTitle, setListTitle] = useState("teste");
	const [listCategory, setListCategory] = useState("teste");
	const location = useLocation();

	useEffect(() => {
		setListTitle(location.state !== null ? location.state.listTitle : "Sem Título");
		setListCategory(location.state !== null ? location.state.listCategory : "Sem Categoria");
	}, []);

	const [openSearchItemModal, setOpenSearchItemModal] = useState(false);
	const [addedItems, setAddedItems] = useState<responseResultType[]>([]);
	const searchTitle = useRef<HTMLInputElement | null>(null);
	const [chosenItem, setChosenItem] = useState<responseResultType | boolean>(false);
	const chosenItemUsertext = useRef<HTMLInputElement | null>(null);
	const [apiResults, setApiResults] = useState<responseResultType[]>([]);

	const [replaceItemId, setReplaceItemId] = useState<number | null>(null);
	const [itemInEdit, setItemInEdit] = useState<responseResultType | null>(null);

	// FAZER A FUNÇAÕ DE PROCURAR COM ENTER
	const handleItemSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		// const title = searchTitle!.current!.value.trim();
		// console.log(title);
		// if (e.key === "Enter" && title !== "") {
		// 	console.log(e.key);
		// 	// searchMovie(title);
		// }

		console.log(e.key);
	};

	const handleSearchItemClick = (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		const title = searchTitle!.current!.value.trim();
		if (title !== "") {
			searchMovie(title);
		}
	};

	const searchMovie = (title: string) => {
		searchMovieByTitle(title)
			.then((response) => {
				setApiResults(response.data.results.map((item) => item));
			})
			.catch((error) => console.log(error));
	};

	const handleChoseItemOnClick = (item: responseResultType) => (_e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
		searchTitle!.current!.value = item.original_title;
		setChosenItem(item);
	};

	const handleAddItemOnClick = (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		if (replaceItemId === null) {
			setAddedItems((previousItems) => [
				...previousItems,
				{ ...(chosenItem as responseResultType), user_input_text: chosenItemUsertext!.current!.value },
			]);
		} else {
			setAddedItems((previousItems) =>
				previousItems.map((item, index) =>
					index === replaceItemId
						? { ...(chosenItem as responseResultType), user_input_text: chosenItemUsertext!.current!.value }
						: item
				)
			);
			setReplaceItemId(null);
		}
		setOpenSearchItemModal(false);
	};

	const handleReplaceItemOnClick = (replaceIndex: number) => (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		setReplaceItemId(replaceIndex);
		setOpenSearchItemModal(true);
	};

	const handleRemoveItemOnClick =
		(removedItemIndex: number) => (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
			setAddedItems((previousItems) => previousItems.filter((_item, index) => index !== removedItemIndex));
		};

	const handleEditItemOnClick =
		(editItem: responseResultType) => (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
			setItemInEdit(editItem);
		};

	const handleUserCommentOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setItemInEdit((previousItem) => {
			return { ...(previousItem as responseResultType), user_input_text: e.target.value };
		});
	};

	const handleSaveItemEditedOnClick = (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		setAddedItems((previousItems) =>
			previousItems.map((item) => (item.id === itemInEdit!.id ? (itemInEdit as responseResultType) : item))
		);
		setItemInEdit(null);
	};

	const handleCancelEditionOnClick = (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		setItemInEdit(null);
	};

	return (
		<>
			<Box sx={{ display: "flex", flex: 10, bgcolor: theme.palette.primary.dark }}>
				<Container maxWidth="md">
					<Box sx={{ display: "flex" }}>
						<Stack direction="column" display={"flex"} flex={8} minHeight={"100vh"}>
							<Card sx={{ minWidth: 275, mt: 3, bgcolor: "white" }}>
								<Icons>
									<Box>
										<Avatar sx={{ mt: 2, ml: 2 }}>AI</Avatar>
										<Typography sx={{ ml: 2, mb: 2 }}>username</Typography>
									</Box>
									<Typography variant="h5" m={2}>
										{listTitle}
									</Typography>
									<Box sx={{ mt: 2, mr: 2 }} alignItems="center" justifyContent="center">
										{listCategory}
									</Box>
								</Icons>

								<CardContent>
									{addedItems.map((item, index) => {
										if (item.id === itemInEdit?.id)
											return (
												<Card sx={{ display: "flex", mb: 2 }} key={index}>
													<Box sx={{ display: "flex", flexDirection: "column", flex: 5 }}>
														<CardContent sx={{ flex: "1 0 auto" }}>
															<Stack direction="row" spacing={2}>
																<Typography component="div" variant="h3">
																	#{index + 1}
																</Typography>
																<Stack direction="column">
																	<Typography component="div" variant="h5">
																		{item.original_title}
																	</Typography>
																	<Typography variant="subtitle1" color="text.secondary" component="div">
																		{item.release_date}
																	</Typography>
																</Stack>
															</Stack>
															<Stack direction="column">
																<TextField
																	id="outlined-multiline-static"
																	multiline
																	rows={4}
																	value={itemInEdit!.user_input_text}
																	onChange={handleUserCommentOnChange}
																/>
																<Stack direction="row">
																	<Button
																		size="small"
																		sx={{ bgcolor: theme.palette.secondary.main, color: "white" }}
																		onClick={handleSaveItemEditedOnClick}
																	>
																		Salvar
																	</Button>
																	<Button
																		size="small"
																		sx={{ bgcolor: theme.palette.secondary.main, color: "white" }}
																		onClick={handleCancelEditionOnClick}
																	>
																		Cancelar
																	</Button>
																</Stack>
															</Stack>
														</CardContent>
													</Box>
													<CardMedia
														component="img"
														sx={{ width: 151, flex: 1 }}
														// image={item.poster_path}
														alt="Poster do filme"
														src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
													/>
												</Card>
											);
										else
											return (
												<Card sx={{ display: "flex", mb: 2 }} key={index}>
													<Box sx={{ display: "flex", flexDirection: "column", flex: 5 }}>
														<CardContent sx={{ flex: "1 0 auto" }}>
															<Stack direction="row" spacing={2}>
																<Typography component="div" variant="h3">
																	#{index + 1}
																</Typography>
																<Stack direction="column">
																	<Typography component="div" variant="h5">
																		{item.original_title}
																	</Typography>
																	<Typography variant="subtitle1" color="text.secondary" component="div">
																		{item.release_date}
																	</Typography>
																</Stack>
															</Stack>
															<Typography component="div">{item.user_input_text}</Typography>
															<Stack direction="row" spacing={1}>
																<Button
																	size="small"
																	sx={{ bgcolor: theme.palette.secondary.main, color: "white" }}
																	onClick={handleEditItemOnClick(item)}
																>
																	Editar
																</Button>
																<Button
																	size="small"
																	sx={{ bgcolor: theme.palette.secondary.main, color: "white" }}
																	onClick={handleReplaceItemOnClick(index)}
																>
																	Substituir
																</Button>
																<Button
																	size="small"
																	sx={{ bgcolor: theme.palette.secondary.main, color: "white" }}
																	onClick={handleRemoveItemOnClick(index)}
																>
																	Remover
																</Button>
															</Stack>
														</CardContent>
													</Box>
													<CardMedia
														component="img"
														sx={{ width: 151, flex: 1 }}
														// image={item.poster_path}
														alt="Poster do filme"
														src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
													/>
												</Card>
											);
									})}
								</CardContent>
							</Card>
							<Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
								<Button sx={buttonStyle} onClick={(_e) => setOpenSearchItemModal(true)}>
									Adicionar
								</Button>
								<Button sx={buttonStyle}>Compartilhar</Button>
								<Link to="/userarea" style={{ textDecoration: "none", color: "black" }}>
									<Button sx={buttonStyle}>Cancelar</Button>
								</Link>
							</Box>
						</Stack>
					</Box>
					<Modal
						open={openSearchItemModal}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={style} component="form">
							<Stack direction="column" display={"flex"} spacing={2}>
								<Typography variant="h5" component="div">
									Adicione um novo item!
								</Typography>
								{/* <TextField required id="outlined-required" label="Buscar item" /> */}
								<Paper sx={{ p: "2px 4px", display: "flex", alignItems: "center" }}>
									<InputBase
										sx={{ ml: 1, flex: 1 }}
										placeholder="Procurar item"
										inputRef={searchTitle}
										onKeyDown={handleItemSearchKeyDown}
									/>
									<IconButton onClick={handleSearchItemClick} type="button" sx={{ p: "10px" }} aria-label="search">
										<SearchIcon />
									</IconButton>
								</Paper>
								<List sx={{ overflow: "auto", maxHeight: 300 }}>
									{apiResults.map((item, index) => (
										<ListItem disablePadding onClick={handleChoseItemOnClick(item)} key={index}>
											<ListItemButton>
												<ListItemText primary={item.original_title} />
											</ListItemButton>
										</ListItem>
									))}
								</List>
								<TextField
									id="outlined-multiline-static"
									label="Opinião"
									multiline
									rows={4}
									inputRef={chosenItemUsertext}
								/>
								<Button sx={buttonStyle} onClick={handleAddItemOnClick}>
									Adicionar
								</Button>
								<Button sx={buttonStyle} onClick={() => setOpenSearchItemModal(false)}>
									Cancelar
								</Button>
							</Stack>
						</Box>
					</Modal>
				</Container>
			</Box>
		</>
	);
};

export default CreateListArea;
