import { Typography } from "@mui/material";

import { useLoggedUserState } from "../../store/userStore";

const Greeter = () => {
  const { isAuthenticated, user } = useLoggedUserState();
  return (
    <Typography alignSelf="center" textAlign="center" sx={{ lineHeight: 1.1 }}>
      {isAuthenticated && (
        <>
          Welcome
          <br />
          <strong>{user?.fullName}</strong>
        </>
      )}
    </Typography>
  );
};

export default Greeter;
