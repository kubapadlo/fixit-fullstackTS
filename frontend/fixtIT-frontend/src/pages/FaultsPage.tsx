import { useQuery } from "@tanstack/react-query";
import getFaults from "../services/getFaults";
import { useLoggedUserState } from "../store/userStore";

export const FaultsPage = () => {
  const token = useLoggedUserState((state) => state.accessToken);

  const { data, isLoading, isError } = useQuery({
    queryFn: getFaults,
    queryKey: ["faults"],
    enabled: !!token,
  });

  if (isLoading) return <div>Ładowanie...</div>;
  if (isError || !data) return <div>Błąd pobierania danych</div>;

  return (
    <div>
      {data.map((fault) => (
        <div key={fault._id}>{fault.description}</div>
      ))}
    </div>
  );
};
