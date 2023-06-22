import * as React from "react";
import theme from "../theme";
import { completeListType, likeList, initialLoadFeed, paginationLoadFeed, dislikeList } from "../services/api";
import { useEffect, useState } from "react";
import { posterInitialUrl } from "../services/tmdbApi";
import { Icons, baseToast, stringToColor } from "../styleHelpers";
import { Box, CircularProgress, Container, IconButton, Stack } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import CardMedia from "@mui/material/CardMedia";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SHOWN_ITEMS_PER_LIST: number = 3;

export const Feed = () => {
	const [feedContent, setFeedContent] = useState<Array<completeListType>>([]);
	const [databasePage, setDatabasePage] = useState(1);
	const [loading, setLoading] = useState(true);

	const shuffle = (array: Array<any>) => array.sort((_a, _b) => 0.5 - Math.random());

	const preProcessListsForFeed = (lists: Array<completeListType>) => {
		const processedLists: Array<completeListType> = lists.reduce(
			(acc: Array<completeListType>, item) => [...acc, { ...item, shownItems: SHOWN_ITEMS_PER_LIST }],
			[]
		);
		return shuffle(processedLists);
	};

	useEffect(() => {
		initialLoadFeed()
			.then((response) => {
				setFeedContent(preProcessListsForFeed(response.data));
				setDatabasePage((previousValue) => previousValue + 1);
				setLoading(false);
			})
			.catch((_error) =>
				toast.error("Erro ao carregar o feed.", {
					...baseToast,
				})
			);
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
		paginationLoadFeed(databasePage)
			.then((response) => {
				setFeedContent((previousLists) => [...previousLists, ...preProcessListsForFeed(response.data)]);
				setDatabasePage((previousValue) => previousValue + 1);
			})
			.catch((_error) =>
				toast.error("Erro ao carregar mais listas.", {
					...baseToast,
				})
			);
	};

	const handleLikeListOnClick =
		(currentList: completeListType) => (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
			if (currentList.likedByCurrentUser! === false) {
				likeList(currentList.id)
					.then((_response) => {
						setFeedContent((previousLists) =>
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
						setFeedContent((previousLists) =>
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

	if (loading)
		return (
			<Box sx={{ display: "flex", flex: 10, bgcolor: theme.palette.primary.dark }}>
				<ToastContainer />
				<Container maxWidth="md">
					<CircularProgress />
				</Container>
			</Box>
		);
	else
		return (
			<>
				<ToastContainer />
				<Box flex={10} sx={{ bgcolor: theme.palette.primary.dark }} p={2}>
					<Container maxWidth="lg">
						{feedContent.map((list, listIndex) => (
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
								{/* , border: "3px solid red" */}
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
									<IconButton size="small" sx={{ color: "black" }} onClick={handleLikeListOnClick(list)}>
										{list.likedByCurrentUser ? (
											<ThumbUpAltIcon fontSize="large" />
										) : (
											<ThumbUpOffAltIcon fontSize="large" />
										)}
									</IconButton>
									<IconButton
										aria-label="add"
										size="small"
										sx={{ color: "black" }}
										onClick={handleShowMoreOnClick(listIndex)}
									>
										{list.items.length - 1 > list.shownItems! ? (
											<KeyboardArrowDownIcon fontSize="medium" />
										) : list.items.length - 1 <= SHOWN_ITEMS_PER_LIST ? (
											""
										) : (
											<KeyboardArrowUpIcon fontSize="medium" />
										)}
									</IconButton>
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
			</>
		);
};
