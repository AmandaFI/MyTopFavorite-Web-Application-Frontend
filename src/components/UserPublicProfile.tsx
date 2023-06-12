import theme from "../theme";
import { Icons } from "../styleHelpers";
import { useEffect, useState } from "react";
import { Avatar, Box, Button, Card, CardActions, CardContent, CardMedia, Stack, Typography } from "@mui/material";
import { posterInitialUrl } from "../services/tmdbApi";
import { useParams } from "react-router-dom";
import {
  completeListType,
  searchUserById,
  userPublishedLists,
  postUserType,
  followUser,
  unfollowUser,
} from "../services/api";

export const UserPublicProfile = () => {
  const { id } = useParams();
  const [searchedUser, setSearchedUser] = useState<postUserType>();
  const [searchedUserLists, setSearchedUserLists] = useState<Array<completeListType>>([]);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    searchUserById(+id!)
      .then((response) => {
        console.log("carregando listas");
        setSearchedUser(response.data);
        userPublishedLists(+id!, true).then((response) => setSearchedUserLists(response.data as completeListType[]));
      })
      .catch((error) => console.log(error));
  }, [id]);

  const handleFollowUserOnCLick = () => {
    if (following) {
      unfollowUser(+id!)
        .then((_response) => setFollowing(false))
        .catch((error) => console.log(error));
    } else {
      followUser(+id!)
        .then((_response) => setFollowing(true))
        .catch((error) => console.log(error));
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", flex: 10 }}>
        <Stack direction="column" display={"flex"} flex={8} minHeight={"100vh"}>
          <Box flex={8} bgcolor={theme.palette.secondary.main} maxHeight={"15%"} minHeight={"8%"}>
            <Stack direction="row">
              <Button size="medium" sx={{ color: "black", backgroundColor: "white" }} onClick={handleFollowUserOnCLick}>
                {following ? "Deixar de seguir" : "Seguir"}
              </Button>
            </Stack>
          </Box>
          <Box flex={8} sx={{ bgcolor: theme.palette.primary.dark }} p={2}>
            {searchedUserLists.map((list) => (
              <Card sx={{ minWidth: 275, m: 3, bgcolor: "white" }} key={list.id}>
                <Icons>
                  <Box>
                    <Avatar sx={{ mt: 2, ml: 2 }}>{`${list.user.name[0]}${list.user.name[1]}`}</Avatar>
                    <Typography sx={{ ml: 2, mb: 2 }}>{list.user.name}</Typography>
                  </Box>
                  <Typography variant="h5" m={2}>
                    {list.title}
                  </Typography>
                  <Box sx={{ mt: 2, mr: 2 }} alignItems="center" justifyContent="center">
                    {list.category.name}
                  </Box>
                </Icons>

                <CardContent>
                  {list.items.slice(0, list.shownItems!).map((item) => (
                    <Card sx={{ display: "flex", mb: 2 }} key={item.id}>
                      <Box sx={{ display: "flex", flexDirection: "column", flex: 5 }}>
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
                      </Box>
                      <CardMedia
                        component="img"
                        sx={{ width: 151, flex: 1 }}
                        src={`${posterInitialUrl}${item.imageUrl}`}
                        alt={item.title}
                      />
                    </Card>
                  ))}
                </CardContent>
                <CardActions>
                  {/* <Button size="small" sx={{ color: "black" }} onClick={handleLikeListOnClick(list.id)}>
                    Like
                  </Button>
                  <Button size="small" sx={{ color: "black" }} onClick={handleShowMoreOnClick(listIndex)}>
                    {list.items.length - 1 > list.shownItems!
                      ? "Ver mais"
                      : list.items.length - 1 <= SHOWN_ITEMS_PER_LIST
                      ? ""
                      : "Ver menos"}
                  </Button>
                </CardActions>
              </Card>
            ))}
            <Button size="small" sx={{ color: "black" }} onClick={handleLoadMoreListsOnClick}> */}
                  <Button size="small" sx={{ color: "black" }}>
                    Like
                  </Button>
                  <Button size="small" sx={{ color: "black" }}>
                    Ver mais
                  </Button>
                </CardActions>
              </Card>
            ))}
            <Button size="small" sx={{ color: "black" }}>
              Carregar mais
            </Button>
          </Box>
        </Stack>
      </Box>
    </>
  );
};
