import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { modalBoxStyle } from "../styleHelpers";
import theme from "../theme";
import { UserContext } from "../App";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import { Stack } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {
  categoryType,
  deleteList,
  simplifiedListType,
  userLists,
  allCategories,
  postListType,
  createList,
  userDrafLists,
  userPublishedLists,
} from "../services/api";

const ManageLists = () => {
  const navigate = useNavigate();
  const loggedUser = useContext(UserContext);

  const [loggedUserLists, setLoggedUserLists] = useState<Array<simplifiedListType>>([]);
  const [loggedUserDraftLists, setLoggedUserDrafLists] = useState<Array<simplifiedListType>>([]);
  const [loggedUserPublishedLists, setLoggedUserPublishedLists] = useState<Array<simplifiedListType>>([]);

  const [openNewListForm, setOpenNewListForm] = useState(false);
  const [categories, setCategories] = useState<Array<categoryType>>([]);
  const [listTitle, setListTitle] = useState("");
  const [listCategory, setListCategory] = useState<categoryType>({ id: -1, name: "" });

  type tabs = "published" | "draft";
  const [currentTab, setCurrentTab] = React.useState<tabs>("published");

  useEffect(() => {
    // userLists(loggedUser!.id)
    //   .then((response) => {
    //     setLoggedUserLists(response.data);
    //     console.log(response.data);
    //   })
    //   .catch((error) => console.log(error));

    userDrafLists(loggedUser!.id)
      .then((response) => {
        setLoggedUserDrafLists(response.data);
        console.log(response.data);
      })
      .catch((error) => console.log(error));

    userPublishedLists(loggedUser!.id)
      .then((response) => {
        setLoggedUserPublishedLists(response.data);
        console.log(response.data);
      })
      .catch((error) => console.log(error));

    allCategories()
      .then((response) => {
        setCategories(response.data);
        setListCategory({ id: response.data[0]?.id, name: response.data[0]?.name });
      })
      .catch((error) => console.log(error));
  }, []);

  const handleDeleteListOnClick = (listId: number) => (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    deleteList(listId)
      .then((_response) => {
        setLoggedUserLists((previousItems) => previousItems!.filter((item) => item!.id !== listId));
      })
      .catch((error) => console.log(error));
  };

  const handleEditListOnClick = (listId: number) => (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    navigate(`/edit-list/${listId}`);
  };

  let userListCards;
  if (loggedUserLists !== null && currentTab === "published") {
    userListCards = loggedUserPublishedLists.map((card) => (
      <Card
        sx={{
          minWidth: 275,
          maxWidth: 200,
          m: 1,
          minHeight: 250,
          maxHeight: "50%",
          display: "flex",
          flexDirection: "column",
        }}
        key={card.id}
      >
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {card.category.name}
          </Typography>
          <Typography variant="h5" component="div">
            {card.title}
          </Typography>
          <Typography sx={{ mb: 1 }} color="text.secondary">
            {card.createdAt.split(":")[0].split("T")[0]}
          </Typography>
          <Typography sx={{ mb: 1 }} color="text.secondary">
            {card.draft ? "Não publicada" : "Publicada"}
          </Typography>
        </CardContent>
        <CardActions disableSpacing sx={{ mt: "auto", display: "flex" }}>
          <Stack direction="row" display="flex" justifyContent="end">
            <Link to={`/edit-list/${card.id}`} style={{ textDecoration: "none", color: "white" }}>
              <Button size="small" onClick={handleEditListOnClick(card.id)}>
                Editar
              </Button>
            </Link>
            <Button size="small" onClick={handleDeleteListOnClick(card.id)}>
              Deletar
            </Button>
          </Stack>
        </CardActions>
      </Card>
    ));
  } else if (loggedUserLists !== null && currentTab === "draft") {
    userListCards = loggedUserDraftLists.map((card) => (
      <Card
        sx={{
          minWidth: 275,
          maxWidth: 200,
          m: 1,
          minHeight: 250,
          maxHeight: "50%",
          display: "flex",
          flexDirection: "column",
        }}
        key={card.id}
      >
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {card.category.name}
          </Typography>
          <Typography variant="h5" component="div">
            {card.title}
          </Typography>
          <Typography sx={{ mb: 1 }} color="text.secondary">
            {card.createdAt.split(":")[0].split("T")[0]}
          </Typography>
          <Typography sx={{ mb: 1 }} color="text.secondary">
            {card.draft ? "Não publicada" : "Publicada"}
          </Typography>
        </CardContent>
        <CardActions disableSpacing sx={{ mt: "auto", display: "flex" }}>
          <Stack direction="row" display="flex" justifyContent="end">
            <Link to={`/edit-list/${card.id}`} style={{ textDecoration: "none", color: "white" }}>
              <Button size="small" onClick={handleEditListOnClick(card.id)}>
                Editar
              </Button>
            </Link>
            <Button size="small" onClick={handleDeleteListOnClick(card.id)}>
              Deletar
            </Button>
          </Stack>
        </CardActions>
      </Card>
    ));
  } else {
    userListCards = <></>;
  }

  const handleListCategoryOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //fazer reduce para cirar listCAtegories como sendo um  has onde nome é chave e id é valor
    // const category2: oi[] = categories.reduce((acc, item, index) => [...acc, {item['name']: item.id}], [{}])
    const category = categories.filter((category) => category.name === e.target.value);
    setListCategory({ id: category[0].id, name: category[0].name });
  };

  const handleCreateListOnClick = (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    createList(listTitle, listCategory.id)
      .then((response) => {
        setOpenNewListForm(false);
        navigate(`/create-list/${response.data.id}`);
      })
      .catch((error) => console.log(error));
  };

  const handleTabOnChange = (_e: React.SyntheticEvent, newTab: tabs) => {
    setCurrentTab(newTab);
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
              Bem-vindo {loggedUser!.name}
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
            <Stack>
              <Tabs
                value={currentTab}
                onChange={handleTabOnChange}
                textColor="inherit"
                // indicatorColor="primary"
                aria-label="secondary tabs example"
                TabIndicatorProps={{
                  style: {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                  },
                }}
              >
                <Tab value="published" label="Piblicadas" />
                <Tab value="draft" label="Não Publicadas" />
              </Tabs>
              <Box
                sx={{
                  display: "flex",
                  flex: 8,
                  p: 1,
                  bgcolor: theme.palette.primary.dark,
                  flexWrap: "wrap",
                }}
              >
                <Card sx={{ minWidth: 275, m: 1, maxHeight: "50%", minHeight: 250 }}>
                  <CardContent sx={{ mb: 6 }}>
                    <IconButton size="large" onClick={(_e) => setOpenNewListForm(true)}>
                      <AddCircleOutlineIcon fontSize="large" sx={{ mr: 1 }} />
                      Nova Lista
                    </IconButton>
                  </CardContent>
                </Card>
                {userListCards}
              </Box>
            </Stack>

            <Modal
              open={openNewListForm}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={modalBoxStyle} component="form">
                <Stack direction="column" display={"flex"} spacing={2}>
                  <Typography variant="h5" component="div">
                    Crie uma nova lista!
                  </Typography>
                  <TextField
                    required
                    id="outlined-required"
                    label="Título"
                    value={listTitle}
                    onChange={(e) => setListTitle(e.target.value)}
                  />
                  <TextField
                    id="outlined-select-currency"
                    select
                    defaultValue={categories.length !== 0 ? categories[0].name : ""}
                    required
                    label="Categoria"
                    value={listCategory.name}
                    onChange={handleListCategoryOnChange}
                  >
                    {categories.map((category, index) => (
                      <MenuItem key={index} value={category.name}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <Button
                    sx={{
                      bgcolor: theme.palette.secondary.main,
                      color: "white",
                      display: "flex",
                    }}
                    disabled={listTitle === ""}
                    onClick={handleCreateListOnClick}
                    fullWidth={true}
                  >
                    Criar
                  </Button>

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
          </Box>
        </Stack>
      </Box>
    </>
  );
};

export default ManageLists;
