import React, { useEffect, useState, useRef, SyntheticEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import theme from "../theme";
import { posterInitialUrl, tmdbMovieType, searchMovieByTitle } from "../services/tmdbApi";
import {
  completeListType,
  deleteItem,
  getSingleList,
  simplifiedListItemType,
  updateItem,
  updateList,
} from "../services/api";
import { Icons, buttonStyle, modalBoxStyle } from "../styleHelpers";
import { Box, Checkbox, FormControlLabel, Stack, TextField } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import Modal from "@mui/material/Modal";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import SearchIcon from "@mui/icons-material/Search";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const EditList = () => {
  const [listInEdit, setListInEdit] = useState<completeListType | null>(null);
  const [itemInEdit, setItemInEdit] = useState<simplifiedListItemType | null>(null);

  const [openSearchItemModal, setOpenSearchItemModal] = useState(false);
  const searchTitle = useRef<HTMLInputElement | null>(null);
  const [chosenItem, setChosenItem] = useState<tmdbMovieType | null>(null);
  const chosenItemUsertext = useRef<HTMLInputElement | null>(null);
  const [tmdbApiResults, setTmdbApiResults] = useState<tmdbMovieType[]>([]);
  const [publishCheckBox, setPublishCheckBox] = useState(false);
  const [titleBeingEdited, setTitleBeingEdited] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id === undefined) navigate("manage-lists");
    else {
      getSingleList(+id)
        .then((response) => {
          setListInEdit(response.data);
          setTitleBeingEdited(response.data.title);
          setPublishCheckBox(!response.data.draft);
        })
        .catch((error) => console.log(error));
    }
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

  const handleChoseItemOnClick = (item: tmdbMovieType) => (_e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
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
    if (listInEdit!.draft === false && listInEdit!.items.length < 4) {
      toast.error("Uma lista publicada não pode ter menos que 3 itens.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
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

  const handleListTitleOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTitleBeingEdited(event.target.value);
  };

  const handleTitleOnBlur = (_e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
    updateList(+id!, { title: titleBeingEdited })
      .then((_response) => {})
      .catch((error) => console.log(error));
  };

  const handlePublishListOnChange = (_e: SyntheticEvent<Element, Event>, checked: boolean) => {
    if (listInEdit!.items.length < 3 && checked) {
      toast.warn("Atenção! Uma lista com menos de 3 itens não pode ser publicada.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setPublishCheckBox(false);
    } else {
      updateList(+id!, { draft: !checked })
        .then((_response) => {
          setListInEdit((previousList) => {
            return { ...previousList!, draft: !checked };
          });
          setPublishCheckBox(checked);
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <>
      <ToastContainer />
      <Box sx={{ display: "flex", flex: 10, bgcolor: theme.palette.primary.dark }}>
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
              <Card sx={{ minWidth: 275, mt: 3, bgcolor: "white" }}>
                <Icons></Icons>
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
                                  <IconButton aria-label="save" onClick={handleSaveChangesOnClick}>
                                    <CheckIcon fontSize="medium" />
                                  </IconButton>
                                  <IconButton aria-label="search" onClick={() => setOpenSearchItemModal(true)}>
                                    <SearchIcon fontSize="medium" />
                                  </IconButton>
                                  <IconButton aria-label="cancel" onClick={() => setItemInEdit(null)}>
                                    <CloseIcon fontSize="medium" />
                                  </IconButton>
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
                              </Stack>
                            </CardContent>
                            <Stack direction="row" sx={{ display: "flex", justiyContent: "space-between" }}>
                              <IconButton aria-label="edit" onClick={() => setItemInEdit(item)}>
                                <EditIcon fontSize="medium" />
                              </IconButton>

                              <IconButton aria-label="delete" onClick={handleRemoveItemOnClick(item.id)}>
                                <DeleteIcon fontSize="medium" />
                              </IconButton>
                            </Stack>
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
                <CardActions></CardActions>
              </Card>

              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Publicar"
                  onChange={handlePublishListOnChange}
                  checked={publishCheckBox}
                />

                <Button size="small" sx={buttonStyle} onClick={(_e) => navigate("/manage-lists")}>
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
