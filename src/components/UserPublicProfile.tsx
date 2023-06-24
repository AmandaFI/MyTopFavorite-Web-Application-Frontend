import theme from "../theme";
import { Icons, baseToast, stringToColor } from "../styleHelpers";
import { useEffect, useState } from "react";
import { posterInitialUrl } from "../services/tmdbApi";
import { useNavigate, useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
	Avatar,
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Container,
	IconButton,
	Stack,
	Typography,
} from "@mui/material";
import {
	completeListType,
	searchUserById,
	followUser,
	unfollowUser,
	userPublishedListsPaginated,
	checkFollowingUser,
	userType,
	likeList,
	dislikeList,
} from "../services/api";

export const UserPublicProfile = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [searchedUser, setSearchedUser] = useState<userType>();
	const [searchedUserLists, setSearchedUserLists] = useState<Array<completeListType>>([]);
	const [following, setFollowing] = useState(false);
	const [paginationPage, setPaginationPage] = useState(1);

	useEffect(() => {
		if (id === undefined) navigate("/feed");
		else {
			setPaginationPage(1);
			searchUserById(+id)
				.then((response) => {
					setSearchedUser(response.data);
					userPublishedListsPaginated(+id!, 1).then((response) => {
						setSearchedUserLists(response.data as completeListType[]);
						setPaginationPage((previousPage) => previousPage + 1);
					});
				})
				.catch((_error) =>
					toast.error("Usuário não encontrado.", {
						...baseToast,
					})
				);

			checkFollowingUser(+id)
				.then((_response) => {
					setFollowing(true);
				})
				.catch((error) => console.log(error));
		}
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

	const handleLoadMoreListsOnClick = () => {
		if (id === undefined) navigate("/feed");
		else {
			userPublishedListsPaginated(+id, paginationPage)
				.then((response) => {
					setSearchedUserLists((previousLists) => [...previousLists, ...(response.data as completeListType[])]);
					setPaginationPage((previousPage) => previousPage + 1);
				})
				.catch((_error) =>
					toast.error("Erro ao carregar mais listas.", {
						...baseToast,
					})
				);
		}
	};

	const handleLikeListOnClick =
		(currentList: completeListType) => (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
			if (currentList.likedByCurrentUser! === false) {
				likeList(currentList.id)
					.then((_response) => {
						setSearchedUserLists((previousLists) =>
							previousLists.map((list) =>
								list.id === currentList.id
									? { ...list, likersCount: list.likersCount + 1, likedByCurrentUser: true }
									: list
							)
						);
					})
					.catch((error) => console.log(error));
			} else {
				dislikeList(currentList.id)
					.then((_response) =>
						setSearchedUserLists((previousLists) =>
							previousLists.map((list) =>
								list.id === currentList.id
									? { ...list, likersCount: list.likersCount - 1, likedByCurrentUser: false }
									: list
							)
						)
					)
					.catch((error) => console.log(error));
			}
		};

	return (
		<>
			<ToastContainer />
			<Box sx={{ display: "flex", flex: 10 }}>
				<Stack direction="column" display={"flex"} flex={8} minHeight={"100vh"}>
					<Box flex={8} sx={{ bgcolor: theme.palette.primary.dark }}>
						<Container maxWidth="lg">
							<Stack direction="row" spacing={2} sx={{ bgcolor: "#1d232f", ml: 3, mr: 3 }}>
								<Avatar
									sx={{
										bgcolor: stringToColor(searchedUser ? searchedUser.name : ""),
										width: 120,
										height: 120,
										m: 5,
									}}
								></Avatar>
								<Stack direction="column" spacing={2}>
									<Typography component="div" variant="h5" sx={{ color: "white", mt: 5 }}>
										{searchedUser ? searchedUser.name : ""}
									</Typography>
									<Box sx={{ color: "white" }}>{searchedUser ? `${searchedUser.followersCount} Seguidores` : ""}</Box>
									<Button
										size="small"
										sx={{ color: "white", backgroundColor: theme.palette.primary.main, maxWidth: 150 }}
										onClick={handleFollowUserOnCLick}
									>
										{following ? "Deixar de seguir" : "Seguir"}
									</Button>
								</Stack>
							</Stack>
						</Container>
					</Box>
					<Box flex={8} sx={{ bgcolor: theme.palette.primary.dark }} p={2}>
						<Container maxWidth="lg">
							{searchedUserLists.map((list) => (
								<Card sx={{ minWidth: 275, m: 3, bgcolor: "white" }} key={list.id}>
									<Icons>
										<Box>
											<Avatar
												sx={{ mt: 2, ml: 2, bgcolor: stringToColor(list.user.name) }}
											>{`${list.user.name[0]}${list.user.name[1]}`}</Avatar>
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
										{list.items
											.sort((a, b) => a.rank - b.rank)
											.slice(0, list.shownItems!)
											.map((item) => (
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

										<IconButton size="small" sx={{ color: "black" }} onClick={handleLikeListOnClick(list)}>
											{list.likedByCurrentUser ? (
												<ThumbUpAltIcon fontSize="large" />
											) : (
												<ThumbUpOffAltIcon fontSize="large" />
											)}
										</IconButton>
										{/* <Button size="small" sx={{ color: "black" }}>
                      Ver mais
                    </Button> */}
										{/* <IconButton aria-label="add" size="small" sx={{ color: "black" }}>
                      {list.items.length - 1 > list.shownItems! ? (
                        <KeyboardArrowDownIcon fontSize="medium" />
                      ) : list.items.length - 1 <= SHOWN_ITEMS_PER_LIST ? (
                        ""
                      ) : (
                        <KeyboardArrowUpIcon fontSize="medium" />
                      )}
                    </IconButton> */}
									</CardActions>
								</Card>
							))}
							<Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
								<IconButton aria-label="add" onClick={handleLoadMoreListsOnClick}>
									<AddIcon fontSize="large" />
								</IconButton>
							</Box>
						</Container>
					</Box>
				</Stack>
			</Box>
		</>
	);
};
