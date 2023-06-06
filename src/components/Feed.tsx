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
import { completeListType, likeList, loadFeed } from "../services/api";
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

// type itemsPerListCountType = {
//   listId: number
// }

export const MOVIES: ListMovieType[] = [
  {
    id: 1,
    rank: 1,
    title: "Star Trek",
    user_comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ut nibh tellus. In hac habitasse platea dictumst. Praesent vel eleifend est. In tincidunt diam non tortor tempus dictum. Proin ac eleifend ligula. Praesent non consequat urna. Sed ut lacus a neque semper vehicula vel nec erat. Mauris non dui ac augue vestibulum lacinia. Donec ac dolor porta eros blandit tris Donec ac dolor",
    extraInfo: "2009",
    posterUrl: "src\\assets\\starTrek.jpg",
  },
  {
    id: 2,
    rank: 2,
    title: "Rocky",
    user_comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ut nibh tellus. In hac habitasse platea dictumst. Praesent vel eleifend est. In tincidunt diam non tortor tempus dictum. Proin ac eleifend ligula. Praesent non consequat urna. Sed ut lacus a neque semper vehicula vel nec erat. Mauris non dui ac augue vestibulum lacinia. Donec ac dolor porta eros blandit tris Donec ac dolor",
    extraInfo: "1976",
    posterUrl: "src\\assets\\rocky.jpg",
  },
  {
    id: 3,
    rank: 3,
    title: "Jurassic Park",
    user_comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ut nibh tellus. In hac habitasse platea dictumst. Praesent vel eleifend est. In tincidunt diam non tortor tempus dictum. Proin ac eleifend ligula. Praesent non consequat urna. Sed ut lacus a neque semper vehicula vel nec erat. Mauris non dui ac augue vestibulum lacinia. Donec ac dolor porta eros blandit tris Donec ac dolor",
    extraInfo: "1993",
    posterUrl: "src\\assets\\jurassicPark.jpg",
  },
  {
    id: 4,
    rank: 4,
    title: "Star Trek",
    user_comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ut nibh tellus. In hac habitasse platea dictumst. Praesent vel eleifend est. In tincidunt diam non tortor tempus dictum. Proin ac eleifend ligula. Praesent non consequat urna. Sed ut lacus a neque semper vehicula vel nec erat. Mauris non dui ac augue vestibulum lacinia. Donec ac dolor porta eros blandit tris Donec ac dolor",
    extraInfo: "2009",
    posterUrl: "src\\assets\\starTrek.jpg",
  },
  {
    id: 5,
    rank: 5,
    title: "Rocky",
    user_comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ut nibh tellus. In hac habitasse platea dictumst. Praesent vel eleifend est. In tincidunt diam non tortor tempus dictum. Proin ac eleifend ligula. Praesent non consequat urna. Sed ut lacus a neque semper vehicula vel nec erat. Mauris non dui ac augue vestibulum lacinia. Donec ac dolor porta eros blandit tris Donec ac dolor",
    extraInfo: "1976",
    posterUrl: "src\\assets\\rocky.jpg",
  },
];

const Icons = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
}));

const Feed = () => {
  const [feedContent, setFeedContent] = useState<Array<completeListType>>([]);
  // const [itemsPerListCount, setItemsPerLIstCount] =

  useEffect(() => {
    loadFeed()
      // shuffle array before setState
      .then((response) => setFeedContent(response.data.sort((a, b) => 0.5 - Math.random())))
      .catch((error) => console.log(error));
  }, []);

  const handleLikeListOnClick = (id: number) => (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    likeList(id)
      .then((_response) => {})
      .catch((error) => console.log(error));
  };

  return (
    <Box flex={8} sx={{ bgcolor: theme.palette.primary.dark }} p={2}>
      {feedContent.map((list) => (
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
            {list.items.map((item) => (
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
                {/* <CardMedia component="img" sx={{ width: 151, flex: 1 }} image={item.metadata.y} alt={item.title} />
                 */}
              </Card>
            ))}
          </CardContent>
          <CardActions>
            <Button size="small" sx={{ color: "black" }}>
              Ver Mais
            </Button>
            <Button size="small" sx={{ color: "black" }} onClick={handleLikeListOnClick(list.id)}>
              Like
            </Button>
          </CardActions>
        </Card>
      ))}
    </Box>
  );
};

export default Feed;
