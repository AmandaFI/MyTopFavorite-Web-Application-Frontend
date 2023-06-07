import * as React from "react";
import { Box, Stack } from "@mui/material";
import { styled } from "@mui/system";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Avatar from "@mui/material/Avatar";
import theme from "../theme";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import { completeListType, likeList, initialLoadFeed, paginationLoadFeed } from "../services/api";
import { useEffect, useState } from "react";
import { posterInitialUrl } from "../services/tmdbApi";

export type ListMovieType = {
  id: number;
  rank: number;
  title: string;
  user_comment: string;
  extraInfo: string;
  posterUrl: string;
};

const Icons = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
}));

const SHOWN_ITEMS_PER_LIST: number = 3;

const Feed = () => {
  const [feedContent, setFeedContent] = useState<Array<completeListType>>([]);
  const [databasePage, setDatabasePage] = useState(1);

  const preProcessListsForFeed = (lists: Array<completeListType>) => {
    const processedLists: Array<completeListType> = lists.reduce(
      (acc: Array<completeListType>, item) => [...acc, { ...item, shownItems: SHOWN_ITEMS_PER_LIST }],
      []
    );
    // shuffle array
    return processedLists.sort((_a, _b) => 0.5 - Math.random());
  };

  useEffect(() => {
    initialLoadFeed()
      .then((response) => {
        setFeedContent(preProcessListsForFeed(response.data));
        setDatabasePage((previousValue) => previousValue + 1);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleShowMoreOnClick = (listIndex: number) => (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (feedContent[listIndex].shownItems! > SHOWN_ITEMS_PER_LIST) {
      setFeedContent((previousLists) => [
        ...previousLists.slice(0, listIndex),
        { ...previousLists[listIndex], shownItems: SHOWN_ITEMS_PER_LIST },
        ...previousLists.slice(listIndex + 1),
      ]);
    } else {
      setFeedContent((previousLists) => [
        ...previousLists.slice(0, listIndex),
        { ...previousLists[listIndex], shownItems: previousLists[listIndex].items.length },
        ...previousLists.slice(listIndex + 1),
      ]);
    }
  };

  const handleLoadMoreListsOnClick = (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    paginationLoadFeed(databasePage).then((response) => {
      setFeedContent((previousLists) => [...previousLists, ...preProcessListsForFeed(response.data)]);
      setDatabasePage((previousValue) => previousValue + 1);
    });
  };

  const handleLikeListOnClick = (id: number) => (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    likeList(id)
      .then((_response) => {})
      .catch((error) => console.log(error));
  };

  return (
    <Box flex={8} sx={{ bgcolor: theme.palette.primary.dark }} p={2}>
      {feedContent.map((list, listIndex) => (
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
            <Button size="small" sx={{ color: "black" }} onClick={handleLikeListOnClick(list.id)}>
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
      <Button size="small" sx={{ color: "black" }} onClick={handleLoadMoreListsOnClick}>
        Carregar mais
      </Button>
    </Box>
  );
};

export default Feed;
