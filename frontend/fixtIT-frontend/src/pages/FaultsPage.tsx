import { useQuery } from "@tanstack/react-query";
import getFaults from "../services/getFaults";
import { useLoggedUserState } from "../store/userStore";
import FaultCard from "../components/FaultCard";
import { Box } from "@mui/material";

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
    <Box sx={{ display: "flex", flexWrap: "wrap", p: 2 }}>
      {data.map((fault) => (
        <FaultCard
          key={fault._id} // Pamiętaj o unikalnym kluczu dla każdego elementu w map
          category={fault.category}
          description={fault.description}
          reportedAt={fault.reportedAt} // Przekazujemy stringa, formatowanie w FaultCard
          state={fault.state}
          imageURL={fault.imageURL}
          onDelete={() => {}}
          onEdit={() => {}}
          id={fault._id}
        />
      ))}
    </Box>
  );
};
