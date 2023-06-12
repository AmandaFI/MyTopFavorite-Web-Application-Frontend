import { Box, Stack, TextField } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import React, { useEffect, useState, useRef, useContext } from "react";
import theme from "../theme";
import Typography from "@mui/material/Typography";
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
import { completeListType, deleteItem, getSingleList, simplifiedListItemType, updateItem } from "../services/api";
import { UserContext } from "../App";
import { Icons, buttonStyle } from "../helpers";

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
  const [listInEdit, setListInEdit] = useState<completeListType | null>(null);
  const [itemInEdit, setItemInEdit] = useState<simplifiedListItemType | null>(null);

  const [openSearchItemModal, setOpenSearchItemModal] = useState(false);
  const searchTitle = useRef<HTMLInputElement | null>(null);
  const [chosenItem, setChosenItem] = useState<responseResultType | null>(null);
  const chosenItemUsertext = useRef<HTMLInputElement | null>(null);
  const [tmdbApiResults, setTmdbApiResults] = useState<responseResultType[]>([]);

  const loggedUser = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    getSingleList(Number(id))
      .then((response) => setListInEdit(response.data))
      .catch((error) => console.log(error));
  }, []);

  const handleSearchItemClick = (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const title = searchTitle!.current!.value.trim();
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

  const listItemTypeFormatter = (item: simplifiedListItemType) => {
    return {
      id: item.id,
      externalApiIdentifier: item.externalApiIdentifier,
      imageUrl: item.imageUrl,
      details: item.details,
      rank: item.rank,
      title: item.title,
      userComment: item.userComment,
    };
  };

  const handleAddItemOnClick = (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (chosenItem !== null) {
      const newItem: simplifiedListItemType = {
        id: itemInEdit!.id,
        externalApiIdentifier: String(chosenItem.id),
        imageUrl: chosenItem.poster_path,
        details: chosenItem.release_date,
        rank: itemInEdit!.rank,
        title: chosenItem.original_title,
        userComment: chosenItemUsertext!.current!.value,
      };
      updateItem(newItem)
        .then((response) => {
          setListInEdit((previousList) => {
            return {
              ...previousList!,
              items: previousList!.items.map((item) =>
                item.id === newItem.id ? listItemTypeFormatter(response.data) : item
              ),
            };
          });
          setItemInEdit(null);
          setOpenSearchItemModal(false);
        })
        .catch((error) => console.log(error));
    }
  };

  const handleUserCommentOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setItemInEdit((previousItem) => {
      return { ...previousItem!, userComment: e.target.value };
    });
  };

  const handleSaveChangesOnClick = (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    updateItem(itemInEdit!)
      .then((_response) => {
        setListInEdit((previousList) => {
          return {
            ...previousList!,
            items: previousList!.items.map((item) => (item.id === itemInEdit!.id ? itemInEdit! : item)),
          };
        });
        setItemInEdit(null);
      })
      .catch((error) => console.log(error));
  };

  const handleRemoveItemOnClick = (itemId: number) => (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (listInEdit!.items.length < 4) {
      window.alert("Lista precisa ter no mínimo 3 items.");
    } else {
      deleteItem(itemId)
        .then((_response) => {
          setListInEdit((previousList) => {
            return { ...previousList!, items: previousList!.items.filter((item) => Number(item.id) !== itemId) };
          });
        })
        .catch((error) => console.log(error));
    }
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
                    <Avatar sx={{ mt: 2, ml: 2 }}>{`${loggedUser?.name[0]}${loggedUser!.name[1]}`}</Avatar>
                    <Typography sx={{ ml: 2, mb: 2 }}>{loggedUser?.name}</Typography>
                  </Box>
                  <Typography variant="h5" m={2}>
                    {listInEdit?.title}
                  </Typography>
                  <Box sx={{ mt: 2, mr: 2 }} alignItems="center" justifyContent="center">
                    {listInEdit?.category.name}
                  </Box>
                </Icons>
                <CardContent>
                  {listInEdit?.items.map((item) => {
                    if (item.id === itemInEdit?.id)
                      return (
                        <Card sx={{ display: "flex", mb: 2 }} key={item.id}>
                          <Box sx={{ display: "flex", flexDirection: "column", flex: 5 }}>
                            <CardContent sx={{ flex: "1 0 auto" }}>
                              <Stack direction="row" spacing={2}>
                                <Typography component="div" variant="h3">
                                  {itemInEdit?.rank}
                                </Typography>
                                <Stack direction="column">
                                  <Typography component="div" variant="h5">
                                    {item.title}
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
                                    onClick={(_e) => setOpenSearchItemModal(true)}
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
                                    onClick={(_e) => setItemInEdit(null)}
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
                        <Card sx={{ display: "flex", mb: 2 }} key={item.id}>
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
                                  {item.rank}
                                </Typography>
                                <Stack direction="column">
                                  <Typography component="div" variant="h5">
                                    {item.title}
                                  </Typography>
                                  <Typography
                                    variant="subtitle1"
                                    color="text.secondary"
                                    component="div"
                                    className="view"
                                  >
                                    {item.details}
                                  </Typography>
                                </Stack>
                              </Stack>

                              <Stack direction="column" sx={{ display: "flex", justiyContent: "space-between" }}>
                                <Typography component="div">{item.userComment}</Typography>
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
                                    onClick={(_e) => setItemInEdit(item)}
                                  >
                                    Editar
                                  </Button>
                                  <Button
                                    size="small"
                                    sx={{ mt: 1, bgcolor: theme.palette.secondary.main, color: "white" }}
                                    onClick={handleRemoveItemOnClick(item.id)}
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
                            src={`${posterInitialUrl}${item.imageUrl}`}
                            alt="Live from space album cover"
                          />
                        </Card>
                      );
                  })}
                </CardContent>
                <CardActions>
                  {/* <Link to="/manage-lists" style={{ textDecoration: "none" }}>
                    <Button
                      size="small"
                      sx={{ bgcolor: theme.palette.secondary.main, color: "white" }}
                      onClick={handleSaveEditedListOnClick}
                    >
                      Salvar
                    </Button>
                  </Link> */}

                  <Link to="/manage-lists" style={{ textDecoration: "none" }}>
                    <Button
                      size="small"
                      sx={{ bgcolor: theme.palette.secondary.main, color: "white" }}
                      onClick={(e) => navigate("/manage-lists")}
                    >
                      Voltar
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
