import { useLoggedUserState } from "../store/userStore";

const Homepage = () => {
  const user = useLoggedUserState((state) => state.user);
  const accessToken = useLoggedUserState((state) => state.accessToken);
  return (
    <div>
      <h1> test stanu globalnego </h1>
      <h3> Dane zalogowane uzytkownika dostepne w KAZDYM komponencie: </h3>
      token: {accessToken}
      <br />
      role: {user?.role}
      <br />
      username: {user?.username}
    </div>
  );
};

export default Homepage;
