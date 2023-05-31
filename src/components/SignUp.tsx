import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import theme from "../theme";
import { ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createUser, userType } from "../services/api";

const Copyright = (props: any) => {
	return (
		<Typography variant="body2" color="text.secondary" align="center" {...props}>
			{"Copyright © "}
			MyTopFavorite {new Date().getFullYear()}
			{"."}
		</Typography>
	);
};

export default function SignUp() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [submitButtonState, setSubmitButtonState] = useState(false);

	const navigate = useNavigate();

	const handleNameOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setName(event.target.value);
	};

	const handleEmailOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setEmail(event.target.value);
	};

	const handlePasswordOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setPassword(event.target.value);
	};

	const handleSignUpOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault(); // trocar get para post
		if (email.trim() !== "" && password.trim() !== "" && name !== "") {
			setSubmitButtonState(true);
			newUser({ email, encrypted_password: password, name });
		} else window.alert("Campos obrigatórios precisam ser preenchidos.");
	};

	const newUser = (user: userType) => {
		createUser(user)
			.then((_user) => navigate("/"))
			.catch((error) => {
				setSubmitButtonState(false);
			});
	};

	return (
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
									onChange={handleNameOnChange}
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
									onChange={handleEmailOnChange}
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
									onChange={handlePasswordOnChange}
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
							<Grid item>
								<Link to="/" style={{ textDecoration: "none", color: theme.palette.primary.main }}>
									{"Já é cadastrado ? Entrar"}
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
				<Copyright sx={{ mt: 5 }} />
			</Container>
		</ThemeProvider>
	);
}
