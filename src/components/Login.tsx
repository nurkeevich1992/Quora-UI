import React, { useState, useContext } from "react";
import { AuthContext } from "../utils/Auth";
import { RouteComponentProps } from "react-router-dom";
import { Routes } from "../constants/appConstants";
import { useMutation } from "@apollo/react-hooks";
import { loginMutation, LoginMutationResponse } from "../graphql/mutation";

interface LoginProps extends RouteComponentProps {
    // add own custom props
}

const Login: React.FC<LoginProps> = props => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setCurrentUser } = useContext(AuthContext);
    const [login, { client, loading, error, data }] = useMutation<{ login: LoginMutationResponse }>(loginMutation);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error in Login {error.message}</p>;
    }

    if (data) {
        console.log(data);
    }
    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const currentEmail = event.currentTarget.value;
        setEmail(currentEmail);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const currentPassword = event.currentTarget.value;
        setPassword(currentPassword);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const result = login({ variables: { email, password } });
        setPassword("");
        result
            .then(response => {
                if (response.data) {
                    client?.resetStore();
                    setCurrentUser(response.data.login);
                    props.history.push(Routes.DASHBOARD);
                } else {
                    setCurrentUser(undefined);
                }
            })
            .catch(error => {
                setCurrentUser(undefined);
            });
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Enter email" value={email} onChange={handleEmailChange}/>
                <input type="password" placeholder="Enter password" value={password} onChange={handlePasswordChange} />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
