import * as React from "react";
import { useContext, useState } from "react";
import theme from "../theme";
import { createUser, postUserType } from "../services/api";
import { ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseToast } from "../styleHelpers";
import { UserContext } from "../App";

const Copyright = (props: any) => {
	return (
		<Typography variant="body2" color="text.secondary" align="center" {...props}>
			{"Copyright © "}
			MyTopFavorite {new Date().getFullYear()}
			{"."}
		</Typography>
	);
};

export type signUpFormPropsType = {
	setSignUp: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SignUpForm = (props: signUpFormPropsType) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [submitButtonState, setSubmitButtonState] = useState(false);

	const { token } = useContext(UserContext);

	const handleSignUpOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault(); // trocar get para post
		if (email.trim() !== "" && password.trim() !== "" && name !== "") {
			setSubmitButtonState(true);
			newUser({ email, password, name });
		} else
			toast.warn("Campos obrigatórios precisam ser preenchidos.", {
				...baseToast,
			});
	};

	const newUser = (user: postUserType) => {
		createUser(user, token)
			.then((_user) => props.setSignUp(false))
			.catch((_error) => {
				toast.error("Erro ao criar usuário.", {
					...baseToast,
				});
				setSubmitButtonState(false);
			});
	};

	return (
		<>
			<ToastContainer />
			<ThemeProvider theme={theme}>
				<Container component="main" maxWidth="xs">
					<CssBaseline />
					<Box
						sx={{
							marginTop: 8,
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}
					>
						<Avatar sx={{ m: 1, bgcolor: theme.palette.secondary.main }}>
							<LockOutlinedIcon />
						</Avatar>
						<Typography component="h1" variant="h5">
							Criar Conta
						</Typography>
						<Box component="form" noValidate sx={{ mt: 3 }} onSubmit={handleSignUpOnSubmit}>
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<TextField
										required
										fullWidth
										id="name"
										label="Nome"
										name="name"
										autoComplete="family-name"
										value={name}
										onChange={(e) => setName(e.target.value)}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										required
										fullWidth
										id="email"
										label="E-mail"
										name="email"
										autoComplete="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										required
										fullWidth
										name="password"
										label="Senha"
										type="password"
										id="password"
										autoComplete="new-password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
									/>
								</Grid>
							</Grid>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								sx={{ mt: 3, mb: 2, bgcolor: theme.palette.primary.main }}
								disabled={submitButtonState}
							>
								Criar
							</Button>
							<Grid container justifyContent="flex-end">
								<Grid item onClick={(_e) => props.setSignUp(false)}>
									{"Já é cadastrado ? Entrar"}
								</Grid>
							</Grid>
						</Box>
					</Box>
					<Copyright sx={{ mt: 5 }} />
				</Container>
			</ThemeProvider>
		</>
	);
};
