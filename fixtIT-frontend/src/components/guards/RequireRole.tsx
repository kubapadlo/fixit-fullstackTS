import { Navigate, Outlet } from "react-router-dom";
import { useLoggedUserState } from "../../store/userStore.ts";

type Props = {
  allowedRoles: string[];
};

const RequireRole = ({ allowedRoles }: Props) => {
  const user = useLoggedUserState((state) => state.user);
  console.log(user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="404" replace />;
  }

  return <Outlet />;
};

export default RequireRole;
