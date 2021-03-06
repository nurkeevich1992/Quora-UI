import React, { useContext, useMemo } from "react";
import { AuthContext } from "../utils/Auth";
import { useMutation } from "@apollo/react-hooks";
import { CurrentUser } from "../constants/types";
import { logoutMutation, LogoutMutationResponse } from "../graphql/mutation";

const Profile = () => {
    const { currentUser, setCurrentUser } = useContext(AuthContext);
    const [logout, { client, loading, error, data }] = useMutation<{ logout: LogoutMutationResponse }>(logoutMutation);

    const handleLogout = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        setCurrentUser(undefined);
        logout()
            .then(response => {
                if (response.data) {
                    client?.clearStore();
                    alert("Successfully logout!");
                } else {
                    console.log(response);
                }
            })
            .catch(error => {
                console.log("error", error);
            });
    };

    if (loading) {
        return <p>Loading...</p>;
    }
    
    if (error) {
        return <p>Error in profile {error.message}</p>
    }

    return (
        <div>
            <h1>Profile</h1>
            {currentUser && <button onClick={handleLogout}>logout</button>}
        </div>
    );
};

export default Profile;
