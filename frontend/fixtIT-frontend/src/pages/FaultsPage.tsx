import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getFaults from "../services/getFaults";
import { useLoggedUserState } from "../store/userStore";
import FaultCard from "../components/FaultCard";
import { Box, Typography } from "@mui/material";
import { api } from "../utils/api";
import { enqueueSnackbar } from "notistack";

export const FaultsPage = () => {
  const token = useLoggedUserState((state) => state.accessToken);

  const queryclient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryFn: getFaults,
    queryKey: ["faults"],
    enabled: !!token,
  });

  const deleteMutation = useMutation({
    mutationFn: async (faultID: string) => {
      await api.delete(`/api/user/${faultID}/delete`);
    },
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ["faults"] });
      enqueueSnackbar("Udalo sie usunac usterke", { variant: "success" });
    },
  });

  const handleDelete = (faultID: string) => {
    deleteMutation.mutate(faultID);
  };

  if (isLoading) return <div>Ładowanie...</div>;
  if (isError || !data) return <div>Błąd pobierania danych</div>;
  if (data.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: "center", mt: 4 }}>
        <Typography variant="h5" color="text.secondary">
          Brak zgłoszonych usterek.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Wygląda na to, że jeszcze nie zgłoszono żadnych usterek.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", p: 2 }}>
      {data.map((fault) => (
        <FaultCard
          key={fault._id}
          category={fault.category}
          description={fault.description}
          reportedAt={fault.reportedAt}
          state={fault.state}
          imageURL={fault.imageURL}
          onDelete={(id) => {
            handleDelete(id);
          }}
          id={fault._id}
        />
      ))}
      {deleteMutation.isPending && (
        <div style={{ position: "fixed", bottom: 20, right: 20 }}>
          Usuwanie...
        </div>
      )}
    </Box>
  );
};
