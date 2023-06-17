import React, { useEffect, useState, useRef, SyntheticEvent } from "react";
import { Box, Checkbox, CircularProgress, FormControlLabel, Stack } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  posterInitialUrl,
  tmdbMovieType,
  searchMovieByTitle,
  searchPersonByName,
  searchSeriesByTitle,
  tmdbSeriesType,
  tmdbPersonType,
} from "../services/tmdbApi";
import Container from "@mui/material/Container";
import theme from "../theme";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import AddIcon from "@mui/icons-material/Add";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

// https://github.com/hello-pangea/dnd/blob/main/docs/about/installation.md
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// https://fkhadra.github.io/react-toastify/introduction
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import { Icons, baseToast, buttonStyle, modalBoxStyle } from "../styleHelpers";

type genericTmdbResults = {
  externalApiIdentifier: string;
  title: string;
  imageUrl: string;
  details: string;
};

const ListEditingArea = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [list, setList] = useState<completeListType | null>(null);

  const [chosenItem, setChosenItem] = useState<genericTmdbResults | boolean>(false);
  const chosenItemUsertext = useRef<HTMLInputElement | null>(null);

  const searchTitle = useRef<HTMLInputElement | null>(null);
  const [tmdbApiResults, setTmdbApiResults] = useState<genericTmdbResults[]>([]);

  const [titleBeingEdited, setTitleBeingEdited] = useState("");
  const [itemBeingEdited, setItemBeingEdited] = useState<simplifiedListItemType | null>(null);
  const [publishCheckBox, setPublishCheckBox] = useState(false);
  const [rankCount, setRankCount] = useState(0);

  const [openSearchItemModal, setOpenSearchItemModal] = useState(false);

  useEffect(() => {
    if (id === undefined) navigate("/manage-lists");
    else {
      getSingleList(+id)
        .then((response) => {
          setList(response.data);
          setTitleBeingEdited(response.data.title);
          setPublishCheckBox(!response.data.draft);
          setRankCount(response.data.items.length);
        })
        .catch((error) => console.log(error));
    }
  }, []);

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

  const movieTypeToGenericType = (movies: Array<tmdbMovieType>) => {
    return movies.map((movie) => {
      return {
        externalApiIdentifier: String(movie.id),
        title: movie.original_title,
        imageUrl: movie.poster_path,
        details: movie.release_date,
      };
    });
  };

  const seriesTypeToGenericType = (series: Array<tmdbSeriesType>) => {
    return series.map((item) => {
      return {
        externalApiIdentifier: String(item.id),
        title: item.original_name,
        imageUrl: item.poster_path,
        details: item.first_air_date,
      };
    });
  };

  const personTypeToGenericType = (people: Array<tmdbPersonType>) => {
    return people.map((person) => {
      return {
        externalApiIdentifier: String(person.id),
        title: person.original_name,
        imageUrl: person.profile_path,
        details: "",
      };
    });
  };

  const handleSearchItemClick = (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const title = searchTitle!.current!.value.trim();
    if (title !== "") {
      const category = list ? list.category.name : "";
      if (category === "Filmes") searchMovie(title);
      else if (category === "Séries") searchSeries(title);
      else if (category === "Pessoas") searchPerson(title);
    }
  };

  const searchMovie = (title: string) => {
    searchMovieByTitle(title)
      .then((response) => {
        console.log(response.data);
        setTmdbApiResults(movieTypeToGenericType(response.data.results as Array<tmdbMovieType>));
      })
      .catch((error) => console.log(error));
  };

  const searchSeries = (title: string) => {
    searchSeriesByTitle(title)
      .then((response) => {
        console.log(response.data);
        setTmdbApiResults(seriesTypeToGenericType(response.data.results as Array<tmdbSeriesType>));
      })
      .catch((error) => console.log(error));
  };

  const searchPerson = (name: string) => {
    searchPersonByName(name)
      .then((response) => {
        console.log(response.data);
        setTmdbApiResults(personTypeToGenericType(response.data.results as Array<tmdbPersonType>));
      })
      .catch((error) => console.log(error));
  };

  const handleChoseItemOnClick = (item: genericTmdbResults) => (_e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    searchTitle!.current!.value = item.title;
    setChosenItem(item);
  };

  const apiInputListItemTypeFormatter = (item: genericTmdbResults, comment: string) => {
    if (itemBeingEdited === null) {
      setRankCount((previousValue) => previousValue + 1);
    }
    return {
      ...item,
      rank: itemBeingEdited === null ? rankCount + 1 : itemBeingEdited.rank,
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
      chosenItem as genericTmdbResults,
      chosenItemUsertext!.current!.value
    );
    if (itemBeingEdited === null) {
      insertItem(Number(list?.id), newItem)
        .then((response) => {
          const addedItem = listItemTypeFormatter(response.data);
          setList((previousList) => {
            return { ...previousList!, items: [...previousList!.items, addedItem] };
          });
          setOpenSearchItemModal(false);
        })
        .catch((error) => console.log(error));
    } else {
      updateItem(newItem, itemBeingEdited.id)
        .then((response) => {
          const replacedItem = listItemTypeFormatter(response.data);
          setList((previousList) => {
            return {
              ...previousList!,
              items: previousList!.items.map((item) => (item.id === replacedItem.id ? replacedItem : item)),
            };
          });
          setItemBeingEdited(null);
          setOpenSearchItemModal(false);
        })
        .catch((error) => console.log(error));
    }
  };

  const handleReplaceItemOnClick =
    (item: simplifiedListItemType) => (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setItemBeingEdited(item);
      setOpenSearchItemModal(true);
    };

  const handleRemoveItemOnClick =
    (removeItemId: number, removeItemIndex: number) => (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (list!.draft === false && list!.items.length < 4) {
        toast.warn("Uma lista publicada não pode ter menos que 3 itens. A lista será mantida privada.", {
          ...baseToast,
        });
        updateList(list!.id, { draft: true })
          .then(() => setPublishCheckBox(false))
          .catch((error) => console.log(error));
      }
      let success = true;
      deleteItem(removeItemId)
        .then((_response) => {
          setRankCount((previousCount) => previousCount - 1);
          list!.items.forEach((item, index) => {
            if (index > removeItemIndex - 1) {
              updateItem({ rank: item.rank - 1 }, item.id)
                .then(() => {})
                .catch(() => (success = false));
            }
          });
          if (success) {
            setList((previousList) => {
              return {
                ...previousList!,
                items: previousList!.items
                  .filter((item) => item.id !== removeItemId)
                  .map((item, index) => (index > removeItemIndex - 1 ? { ...item, rank: item.rank - 1 } : item)),
              };
            });
          }
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
    updateItem(itemBeingEdited!, itemBeingEdited!.id)
      .then((response) => {
        const editedItem = listItemTypeFormatter(response.data);
        setList((previousList) => {
          return {
            ...previousList!,
            items: previousList!.items.map((item) =>
              item.externalApiIdentifier === itemBeingEdited?.externalApiIdentifier ? editedItem : item
            ),
          };
        });
        setItemBeingEdited(null);
      })
      .catch((error) => console.log(error));
  };

  const handlePublishListOnChange = (_e: SyntheticEvent<Element, Event>, checked: boolean) => {
    if (list!.items.length < 3 && checked) {
      toast.warn("Atenção! Uma lista com menos de 3 itens não pode ser publicada.", {
        ...baseToast,
      });
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

  const handleTitleOnBlur = (_e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
    updateList(list!.id, { title: titleBeingEdited })
      .then(() => {})
      .catch((error) => console.log(error));
  };

  const handleOnDragEnd = (result: any) => {
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    updateItem({ rank: destinationIndex + 1 }, list!.items[sourceIndex].id)
      .then(() => {
        updateItem({ rank: sourceIndex + 1 }, list!.items[destinationIndex].id)
          .then(() => {
            console.log("updated");
            setList((previousList) => {
              return {
                ...previousList!,
                items: previousList!.items.map((item, index) => {
                  if (index === sourceIndex) {
                    return { ...previousList!.items[destinationIndex], rank: index + 1 };
                  } else if (index === destinationIndex)
                    return { ...previousList!.items[sourceIndex], rank: index + 1 };
                  else return item;
                }),
              };
            });
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
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
                  onChange={(e) => setTitleBeingEdited(e.target.value)}
                />
                <DragDropContext onDragEnd={handleOnDragEnd}>
                  <Droppable droppableId="characters">
                    {(provided) => (
                      <Card
                        sx={{ minWidth: 275, mt: 3, bgcolor: "white" }}
                        className="characters"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        <Icons></Icons>

                        <CardContent>
                          {list.items
                            .sort((a, b) => a.rank - b.rank)
                            .map((item, index) => {
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
                                            {item.rank}
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
                                            <IconButton aria-label="edit" onClick={handleSaveItemEditedOnClick}>
                                              <CheckIcon fontSize="medium" />
                                            </IconButton>

                                            <IconButton aria-label="edit" onClick={() => setItemBeingEdited(null)}>
                                              <CloseIcon fontSize="medium" />
                                            </IconButton>
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
                                  <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                                    {(provided) => (
                                      <Card
                                        sx={{ display: "flex", mb: 2 }}
                                        key={index}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
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
                                                {item.rank}
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
                                          </CardContent>
                                          <Stack direction="row" spacing={1}>
                                            <IconButton aria-label="edit" onClick={(_e) => setItemBeingEdited(item)}>
                                              <EditIcon fontSize="medium" />
                                            </IconButton>

                                            <IconButton aria-label="search" onClick={handleReplaceItemOnClick(item)}>
                                              <SearchIcon fontSize="medium" />
                                            </IconButton>

                                            <IconButton
                                              aria-label="delete"
                                              onClick={handleRemoveItemOnClick(item.id, index)}
                                            >
                                              <DeleteIcon fontSize="medium" />
                                            </IconButton>
                                          </Stack>
                                        </Box>
                                        <CardMedia
                                          component="img"
                                          sx={{ width: 151, flex: 1 }}
                                          alt="Poster do filme"
                                          src={`${posterInitialUrl}${item.imageUrl}`}
                                        />
                                      </Card>
                                    )}
                                  </Draggable>
                                );
                            })}
                          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                            <IconButton aria-label="add" onClick={() => setOpenSearchItemModal(true)}>
                              <AddIcon fontSize="large" />
                            </IconButton>
                          </Box>
                        </CardContent>
                        {provided.placeholder}
                      </Card>
                    )}
                  </Droppable>
                </DragDropContext>
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
                    {tmdbApiResults.map((item, index) => (
                      <ListItem disablePadding onClick={handleChoseItemOnClick(item)} key={index}>
                        <ListItemButton>
                          <ListItemText primary={item.title} />
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

export default ListEditingArea;
