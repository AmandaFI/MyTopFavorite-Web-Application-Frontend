import * as React from "react";
import theme from "../theme";
import { useState } from "react";
import { authenticateUserType, userType, login } from "../services/api";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { ThemeProvider } from "@mui/material/styles";

type signInProps = {
  setLoggedUser: React.Dispatch<React.SetStateAction<userType | null>>;
  setSignUp: React.Dispatch<React.SetStateAction<boolean>>;
};

const Copyright = (props: any) => {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {"Copyright © "}
      MyTopFavorite {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

export default function SignIn(props: signInProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitButtonInactive, setSubmitButtonInactive] = useState(false);

  const authenticateUser = (credentials: authenticateUserType) => {
    login(credentials)
      .then((response) => {
        props.setLoggedUser(response.data);
      })
      .catch((error) => {
        if (error.response.status === 404) window.alert("E-mail ou senha incorretos.");
        else console.log(error);
        setSubmitButtonInactive(false);
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email.trim() !== "" && password.trim() !== "") {
      setSubmitButtonInactive(true);
      authenticateUser({ email, password });
    } else window.alert("Campos obrigatórios precisam ser preenchidos.");
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
            Entrar
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-mail"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: theme.palette.primary.main }}
              disabled={submitButtonInactive}
            >
              Entrar
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to="/signup" style={{ textDecoration: "none", color: theme.palette.primary.main }}>
                  Esqueci minha senha
                </Link>
              </Grid>
              <Grid
                item
                onClick={(_e) => {
                  props.setSignUp(true);
                }}
              >
                {"Não possui uma conta? Cadastrar"}
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
