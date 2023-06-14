import React, { useEffect, useState, useRef, useContext, SyntheticEvent } from "react";
import { Box, Checkbox, CircularProgress, FormControlLabel, Stack } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { posterInitialUrl, responseResultType, searchMovieByTitle } from "../services/tmdbApi";
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
import AddIcon from "@mui/icons-material/Add";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import { UserContext } from "../App";
import {
  completeListType,
  deleteItem,
  getSingleList,
  insertItem,
  simplifiedListItemType,
  postListItemType,
  updateItem,
  updateList,
} from "../services/api";
import { Icons, buttonStyle, modalBoxStyle } from "../styleHelpers";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  pt: 2,
  px: 4,
  pb: 3,
};

const CreateListArea = () => {
  const [list, setList] = useState<completeListType | null>(null);
  const { id } = useParams();
  const loggedUser = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (id === undefined) navigate("/manage-lists");
    else {
      getSingleList(+id)
        .then((response) => {
          setList(response.data);
          setTitleBeingEdited(response.data.title);
        })
        .catch((error) => console.log(error));
    }
  }, []);

  const [openSearchItemModal, setOpenSearchItemModal] = useState(false);
  const [addedItems, setAddedItems] = useState<simplifiedListItemType[]>([]);
  const searchTitle = useRef<HTMLInputElement | null>(null);
  const [chosenItem, setChosenItem] = useState<responseResultType | boolean>(false);
  const chosenItemUsertext = useRef<HTMLInputElement | null>(null);
  const [apiResults, setApiResults] = useState<responseResultType[]>([]);
  const [titleBeingEdited, setTitleBeingEdited] = useState("");

  const [itemToBeReplaced, setItemToBeReplaced] = useState<number | null>(null);
  const [itemBeingEdited, setItemBeingEdited] = useState<simplifiedListItemType | null>(null);
  const [rankCount, setRankCount] = useState(0);
  const [publishCheckBox, setPublishCheckBox] = useState(false);
  const [openWarningModal, setOpenWarningModal] = useState(false);

  // FUNÇÃO PROCURAR COM ENTER COM PROBLEMAS
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

  const apiInputListItemTypeFormatter = (item: responseResultType, comment: string) => {
    return {
      externalApiIdentifier: String(item.id),
      imageUrl: item.poster_path,
      details: item.release_date,
      rank: rankCount,
      title: item.original_title,
      userComment: comment,
    };
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
    const newItem: postListItemType = apiInputListItemTypeFormatter(
      chosenItem as responseResultType,
      chosenItemUsertext!.current!.value
    );
    if (itemToBeReplaced === null) {
      insertItem(Number(list?.id), newItem)
        .then((response) => {
          const addedItem = listItemTypeFormatter(response.data);
          setRankCount((previousValue) => previousValue + 1);

          setAddedItems((previousItems) => [...previousItems, addedItem]);
          setOpenSearchItemModal(false);
        })
        .catch((error) => console.log(error));
    } else {
      updateItem({ id: itemToBeReplaced, ...newItem })
        .then((response) => {
          const replacedItem = listItemTypeFormatter(response.data);
          setAddedItems((previousItems) =>
            previousItems.map((item) => (item.id === replacedItem.id ? replacedItem : item))
          );
          setItemToBeReplaced(null);
          setOpenSearchItemModal(false);
        })
        .catch((error) => console.log(error));
    }
  };

  const handleReplaceItemOnClick = (replaceItemId: number) => (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setItemToBeReplaced(replaceItemId);
    setOpenSearchItemModal(true);
  };

  const handleRemoveItemOnClick = (removeItemId: number) => (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    deleteItem(removeItemId)
      .then((_response) => {
        setAddedItems((previousItems) => previousItems.filter((item) => item.id !== removeItemId));
      })
      .catch((error) => console.log(error));
  };

  const handleUserCommentOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const editedItem = {
      ...itemBeingEdited!,
      userComment: e.target.value,
    };
    setItemBeingEdited(editedItem);
  };

  const handleSaveItemEditedOnClick = (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    updateItem(itemBeingEdited!)
      .then((response) => {
        const editedItem = listItemTypeFormatter(response.data);
        setAddedItems((previousItems) =>
          previousItems.map((item) =>
            item.externalApiIdentifier === itemBeingEdited?.externalApiIdentifier ? editedItem : item
          )
        );
        setItemBeingEdited(null);
      })
      .catch((error) => console.log(error));
  };

  const handlePublishListOnChange = (_e: SyntheticEvent<Element, Event>, checked: boolean) => {
    if (addedItems.length < 3 && checked) {
      setOpenWarningModal(true);
    } else if (checked) {
      updateList(list!.id, { draft: false })
        .then((_response) => {
          setList((previousList) => {
            return { ...previousList!, draft: true };
          });
          setPublishCheckBox(true);
        })
        .catch((error) => console.log(error));
    } else setPublishCheckBox(false);
  };

  const handleListTitleOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTitleBeingEdited(event.target.value);
  };

  const handleTitleOnBlur = (_e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
    updateList(list!.id, { title: titleBeingEdited });
  };

  if (list === null)
    return (
      <Box sx={{ display: "flex", flex: 10, bgcolor: theme.palette.primary.dark }}>
        <Container maxWidth="md">
          <CircularProgress />
        </Container>
      </Box>
    );
  else
    return (
      <>
        <Box sx={{ display: "flex", flex: 10, bgcolor: theme.palette.primary.dark }}>
          {/* <Container maxWidth="md">
          <Typography variant="h3" gutterBottom>
            Crie uma nova lista!
          </Typography>
        </Container> */}
          <Container maxWidth="md">
            <Box sx={{ display: "flex" }}>
              <Stack direction="column" display={"flex"} flex={8} minHeight={"100vh"}>
                <TextField
                  id="standard-basic"
                  label="Título"
                  required
                  value={titleBeingEdited}
                  sx={{ mt: 2, mb: 2 }}
                  variant="standard"
                  onBlur={handleTitleOnBlur}
                  onChange={handleListTitleOnChange}
                />

                {/* <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, mb: 2, mr: 1 }}>
                {list?.category.name}
              </Typography> */}

                <Card sx={{ minWidth: 275, mt: 3, bgcolor: "white" }}>
                  <Icons></Icons>

                  <CardContent>
                    {addedItems.map((item, index) => {
                      if (item.externalApiIdentifier === itemBeingEdited?.externalApiIdentifier)
                        return (
                          <Card sx={{ display: "flex", mb: 2 }} key={index}>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                flex: 5,
                              }}
                            >
                              <CardContent sx={{ flex: "1 0 auto" }}>
                                <Stack direction="row" spacing={2}>
                                  <Typography component="div" variant="h3">
                                    #{index + 1}
                                  </Typography>
                                  <Stack direction="column">
                                    <Typography component="div" variant="h5">
                                      {item.title}
                                    </Typography>
                                    <Typography variant="subtitle1" color="text.secondary" component="div">
                                      {item.details}
                                    </Typography>
                                  </Stack>
                                </Stack>
                                <Stack direction="column">
                                  <TextField
                                    id="outlined-multiline-static"
                                    multiline
                                    rows={4}
                                    value={itemBeingEdited!.userComment}
                                    onChange={handleUserCommentOnChange}
                                  />
                                  <Stack direction="row">
                                    <Button
                                      size="small"
                                      sx={{
                                        bgcolor: theme.palette.secondary.main,
                                        color: "white",
                                      }}
                                      onClick={handleSaveItemEditedOnClick}
                                    >
                                      Salvar
                                    </Button>
                                    <Button
                                      size="small"
                                      sx={{
                                        bgcolor: theme.palette.secondary.main,
                                        color: "white",
                                      }}
                                      onClick={() => setItemBeingEdited(null)}
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
                              alt="Poster do filme"
                              src={`${posterInitialUrl}${item.imageUrl}`}
                            />
                          </Card>
                        );
                      else
                        return (
                          <Card sx={{ display: "flex", mb: 2 }} key={index}>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                flex: 5,
                              }}
                            >
                              <CardContent sx={{ flex: "1 0 auto" }}>
                                <Stack direction="row" spacing={2}>
                                  <Typography component="div" variant="h3">
                                    #{index + 1}
                                  </Typography>
                                  <Stack direction="column">
                                    <Typography component="div" variant="h5">
                                      {item.title}
                                    </Typography>
                                    <Typography variant="subtitle1" color="text.secondary" component="div">
                                      {item.details}
                                    </Typography>
                                  </Stack>
                                </Stack>
                                <Typography component="div">{item.userComment}</Typography>
                                <Stack direction="row" spacing={1}>
                                  <Button
                                    size="small"
                                    sx={{
                                      bgcolor: theme.palette.secondary.main,
                                      color: "white",
                                    }}
                                    onClick={(_e) => setItemBeingEdited(item)}
                                  >
                                    Editar
                                  </Button>
                                  <Button
                                    size="small"
                                    sx={{
                                      bgcolor: theme.palette.secondary.main,
                                      color: "white",
                                    }}
                                    onClick={handleReplaceItemOnClick(item.id)}
                                  >
                                    Substituir
                                  </Button>
                                  <Button
                                    size="small"
                                    sx={{
                                      bgcolor: theme.palette.secondary.main,
                                      color: "white",
                                    }}
                                    onClick={handleRemoveItemOnClick(item.id)}
                                  >
                                    Remover
                                  </Button>
                                </Stack>
                              </CardContent>
                            </Box>
                            <CardMedia
                              component="img"
                              sx={{ width: 151, flex: 1 }}
                              alt="Poster do filme"
                              src={`${posterInitialUrl}${item.imageUrl}`}
                            />
                          </Card>
                        );
                    })}
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                      <IconButton aria-label="add" onClick={() => setOpenSearchItemModal(true)}>
                        <AddIcon fontSize="large" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Publicar"
                    onChange={handlePublishListOnChange}
                    checked={publishCheckBox}
                  />

                  <Button sx={buttonStyle} onClick={() => navigate("/manage-lists")}>
                    Sair
                  </Button>
                </Box>
              </Stack>
            </Box>
            <Modal
              open={openSearchItemModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={modalBoxStyle} component="form">
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
            <Modal open={openWarningModal} onClose={() => setOpenWarningModal(false)}>
              <Box sx={{ ...style, width: 200 }}>
                <h2 id="child-modal-title">Aviso</h2>
                <p id="child-modal-description">Uma lista com menos de 3 itens não pode ser publicada.</p>
                <Button onClick={() => setOpenWarningModal(false)}>Ok</Button>
              </Box>
            </Modal>
          </Container>
        </Box>
      </>
    );
};

export default CreateListArea;
