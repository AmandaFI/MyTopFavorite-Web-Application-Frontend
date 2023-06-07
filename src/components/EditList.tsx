import { Box, Stack, TextField } from "@mui/material";
import Navbar from "./Navbar";
import Sidebar, { sidebarVersionType } from "./Sidebar";
import { useLocation, useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import React, { useEffect, useState, useRef } from "react";
import theme from "../theme";
import Typography from "@mui/material/Typography";
import { ListMovieType, MOVIES } from "./Feed";
import { styled } from "@mui/system";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import { posterInitialUrl, responseResultType, searchMovieByTitle } from "../services/tmdbApi";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@mui/material/Paper";
import Modal from "@mui/material/Modal";
import { Link } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import { completeListType, getSingleList, listItemType } from "../services/api";

const Icons = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
}));

const buttonStyle = {
  bgcolor: theme.palette.secondary.main,
  color: "white",
  mr: 1,
};

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

const EditList = () => {
  const [apiResults, setApiResults] = useState(MOVIES);
  const [listInEdit, setListInEdit] = useState<completeListType | null>(null);
  const [itemInEdit, setItemInEdit] = useState<listItemType | null>(null);

  const [openSearchItemModal, setOpenSearchItemModal] = useState(false);
  const searchTitle = useRef<HTMLInputElement | null>(null);
  const [chosenItem, setChosenItem] = useState<responseResultType | null>(null);
  const chosenItemUsertext = useRef<HTMLInputElement | null>(null);
  const [tmdbApiResults, setTmdbApiResults] = useState<responseResultType[]>([]);

  const { id } = useParams();

  useEffect(() => {
    getSingleList(Number(id))
      .then((response) => setListInEdit(response.data))
      .catch((error) => console.log(error));
  }, []);

  const handleItemEditOnClick = (item: listItemType) => (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setItemInEdit(item);
  };

  const handleCancelEditOnClick = (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setItemInEdit(null);
  };

  const handleSearchItemClick = (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const title = searchTitle!.current!.value.trim();
    console.log(title);
    if (title !== "") {
      searchMovie(title);
    }
  };

  const searchMovie = (title: string) => {
    searchMovieByTitle(title)
      .then((response) => {
        setTmdbApiResults(response.data.results.map((item) => item));
      })
      .catch((error) => console.log(error));
  };

  const handleChoseItemOnClick = (item: responseResultType) => (_e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    searchTitle!.current!.value = item.original_title;
    setChosenItem(item);
  };

  const handleAddItemOnClick = (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // if (chosenItem !== null) {
    //   const replaceItem: ListMovieType = {
    //     id: itemInEdit!.id,
    //     rank: itemInEdit!.rank,
    //     title: (chosenItem as responseResultType).title,
    //     user_comment: chosenItemUsertext!.current!.value,
    //     extraInfo: (chosenItem as responseResultType).release_date,
    //     posterUrl: `https://image.tmdb.org/t/p/w500/${(chosenItem as responseResultType).poster_path}`,
    //   };
    //   setItemInEdit(replaceItem);
    //   setOpenSearchItemModal(false);
    // }
  };

  const handleOpenModalOnClick = (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // setOpenSearchItemModal(true);
  };

  const handleUserCommentOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // setItemInEdit((previousItems) => {
    //   return { ...(previousItems as ListMovieType), user_comment: e.target.value };
    // });
  };

  const handleSaveChangesOnClick = (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // setListInEdit((previousItems) => previousItems.map((item) => (item.id === itemInEdit?.id ? itemInEdit : item)));
    // setItemInEdit(null);
  };

  const handleSaveEditedListOnClick = (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // setApiResults(listInEdit);
  };

  const handleRemoveItemOnClick = (itemId: number) => (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // if (listInEdit.length < 4) {
    //   window.alert("Uma lista precisa ter no mínimo 3 items.");
    // } else setListInEdit((previousItems) => previousItems.filter((item) => item.id !== itemId));
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
                    {listInEdit?.title}
                  </Typography>
                  <Box sx={{ mt: 2, mr: 2 }} alignItems="center" justifyContent="center">
                    {listInEdit?.category.name}
                  </Box>
                </Icons>
                <CardContent>
                  {listInEdit?.items.map((movie) => {
                    if (movie.id === itemInEdit?.id)
                      return (
                        <Card sx={{ display: "flex", mb: 2 }} key={movie.id}>
                          <Box sx={{ display: "flex", flexDirection: "column", flex: 5 }}>
                            <CardContent sx={{ flex: "1 0 auto" }}>
                              <Stack direction="row" spacing={2}>
                                <Typography component="div" variant="h3">
                                  {itemInEdit?.rank}
                                </Typography>
                                <Stack direction="column">
                                  <Typography component="div" variant="h5">
                                    {movie.title}
                                  </Typography>
                                  <Typography
                                    variant="subtitle1"
                                    color="text.secondary"
                                    component="div"
                                    className="view"
                                  >
                                    {itemInEdit.details}
                                  </Typography>
                                </Stack>
                              </Stack>

                              <Stack direction="column">
                                <TextField
                                  id="outlined-multiline-static"
                                  multiline
                                  rows={4}
                                  value={itemInEdit.userComment}
                                  onChange={handleUserCommentOnChange}
                                />
                                <Stack direction="row" sx={{ display: "flex", justiyContent: "space-between" }}>
                                  <Button
                                    size="small"
                                    sx={{
                                      bgcolor: theme.palette.secondary.main,
                                      color: "white",
                                      mt: 1,
                                      mr: 1,
                                    }}
                                    onClick={handleSaveChangesOnClick}
                                  >
                                    Salvar
                                  </Button>
                                  <Button
                                    size="small"
                                    sx={{
                                      bgcolor: theme.palette.secondary.main,
                                      color: "white",
                                      mt: 1,
                                      mr: 1,
                                    }}
                                    onClick={handleOpenModalOnClick}
                                  >
                                    Substituir
                                  </Button>
                                  <Button
                                    size="small"
                                    sx={{
                                      bgcolor: theme.palette.secondary.main,
                                      color: "white",
                                      mt: 1,
                                      mr: 1,
                                    }}
                                    onClick={handleCancelEditOnClick}
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
                            src={`${posterInitialUrl}${itemInEdit.imageUrl}`}
                            alt="Live from space album cover"
                          />
                        </Card>
                      );
                    else
                      return (
                        <Card sx={{ display: "flex", mb: 2 }} key={movie.id}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              flex: 5,
                              justiyContent: "space-between",
                            }}
                          >
                            <CardContent sx={{ flex: "1 0 auto" }}>
                              <Stack direction="row" spacing={2}>
                                <Typography component="div" variant="h3">
                                  {movie.rank}
                                </Typography>
                                <Stack direction="column">
                                  <Typography component="div" variant="h5">
                                    {movie.title}
                                  </Typography>
                                  <Typography
                                    variant="subtitle1"
                                    color="text.secondary"
                                    component="div"
                                    className="view"
                                  >
                                    {movie.details}
                                  </Typography>
                                </Stack>
                              </Stack>

                              <Stack direction="column" sx={{ display: "flex", justiyContent: "space-between" }}>
                                <Typography component="div">{movie.userComment}</Typography>
                                <Stack direction="row" sx={{ display: "flex", justiyContent: "space-between" }}>
                                  <Button
                                    size="small"
                                    sx={{
                                      mb: 0,
                                      mt: 1,
                                      mr: 1,
                                      bgcolor: theme.palette.secondary.main,
                                      color: "white",
                                    }}
                                    onClick={handleItemEditOnClick(movie)}
                                  >
                                    Editar
                                  </Button>
                                  <Button
                                    size="small"
                                    sx={{ mt: 1, bgcolor: theme.palette.secondary.main, color: "white" }}
                                    onClick={handleRemoveItemOnClick(movie.id)}
                                  >
                                    Remover
                                  </Button>
                                </Stack>
                              </Stack>
                            </CardContent>
                          </Box>
                          <CardMedia
                            component="img"
                            sx={{ width: 151, flex: 1 }}
                            src={`${posterInitialUrl}${movie.imageUrl}`}
                            alt="Live from space album cover"
                          />
                        </Card>
                      );
                  })}
                </CardContent>
                <CardActions>
                  <Link to="/manage-lists" style={{ textDecoration: "none" }}>
                    <Button
                      size="small"
                      sx={{ bgcolor: theme.palette.secondary.main, color: "white" }}
                      onClick={handleSaveEditedListOnClick}
                    >
                      Salvar
                    </Button>
                  </Link>

                  <Link to="/manage-lists" style={{ textDecoration: "none" }}>
                    <Button size="small" sx={{ bgcolor: theme.palette.secondary.main, color: "white" }}>
                      Cancelar
                    </Button>
                  </Link>
                </CardActions>
              </Card>
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
                  <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Procurar item" inputRef={searchTitle} />
                  <IconButton onClick={handleSearchItemClick} type="button" sx={{ p: "10px" }} aria-label="search">
                    <SearchIcon />
                  </IconButton>
                </Paper>
                <List sx={{ overflow: "auto", maxHeight: 300 }}>
                  {tmdbApiResults.map((item, index) => (
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
                  Escolher
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

export default EditList;
