import React, { useState, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  SelectChangeEvent,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  ErrorOutline as ReportIcon,
  Sort as SortIcon,
  Construction as ConstructionIcon,
} from "@mui/icons-material";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import getAllFaults from "../services/getAllFaults";
import { updateFaultStatus } from "../services/updateFaultStatus";
import FaultCard from "../components/dashboard/FaultCard";
import EditFaultDialog from "../components/dashboard/EditFaultDialog";
import { enqueueSnackbar } from "notistack";
import { useLoggedUserState } from "../store/userStore";
import type { AddReviewDTO, FaultWithUserObject, FaultWithUserID } from "@fixit/shared/src/types/fault"; // Upewnij się, że import jest poprawny

type SortOption = "date_desc" | "date_asc" | "category" | "location";

const TechnicianPanel = () => {
  const loggedUser = useLoggedUserState((state) => state.user);
  const queryClient = useQueryClient();
  
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFault, setSelectedFault] = useState<FaultWithUserObject | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("date_desc");

  // 1. Zmiana nazwy z data na faults dla czytelności w useMemo
  const {
    data: faults = [], // Domyślna pusta tablica zapobiega błędom przed załadowaniem
    isLoading,
    isError,
    error,
  } = useQuery<FaultWithUserObject[]>({
    queryKey: ["faults"],
    queryFn: getAllFaults,
  });

  // 2. Dostosowanie mutacji do serwisu, który przyjmuje (id, data)
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AddReviewDTO }) => 
      updateFaultStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faults"] });
      setOpenDialog(false);
      setSelectedFault(null);
      enqueueSnackbar("Zaktualizowano status usterki", { variant: "success" });
    },
    onError: (err: Error) => {
      enqueueSnackbar(`Błąd aktualizacji: ${err.message}`, {
        variant: "error",
      });
    },
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenManage = (fault: FaultWithUserObject) => {
    setSelectedFault(fault);
    setOpenDialog(true);
  };

  // 3. Poprawne przekazanie danych do mutacji
  const handleSaveDialog = (formData: AddReviewDTO) => {
    if (selectedFault) {
      updateMutation.mutate({
        id: selectedFault.id,
        data: formData, // Przekazujemy cały obiekt DTO
      });
    }
  };

  // 4. Typowanie eventu Select
  const handleSortChange = (event: SelectChangeEvent<SortOption>) => {
    setSortBy(event.target.value as SortOption);
  };

  const processedFaults = useMemo(() => {
    // Krok 1: Filtrowanie
    const filtered = faults.filter((f) => {
      switch (tabValue) {
        case 0:
          return f.state === "reported";
        case 1:
          return f.state === "assigned" && f.assignedTo === loggedUser?.id;
        case 2:
          return f.state === "fixed" && f.assignedTo === loggedUser?.id;
        default:
          return false;
      }
    });

    // Krok 2: Sortowanie
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "date_desc":
          return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
        case "date_asc":
          return new Date(a.reportedAt).getTime() - new Date(b.reportedAt).getTime();
        case "category":
          return a.category.localeCompare(b.category);
        case "location":
          // Używamy opcjonalnego łańcuchowania dla bezpieczeństwa typów
          const dormA = a.reportedBy?.location?.dorm || "";
          const dormB = b.reportedBy?.location?.dorm || "";
          if (dormA !== dormB) return dormA.localeCompare(dormB);

          const roomA = a.reportedBy?.location?.room || "";
          const roomB = b.reportedBy?.location?.room || "";
          return roomA.localeCompare(roomB);
        default:
          return 0;
      }
    });
  }, [faults, tabValue, sortBy, loggedUser?.id]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">
          Błąd: {error instanceof Error ? error.message : "Nie udało się pobrać danych"}
        </Alert>
      </Container>
    );
  }

  // Liczniki dla tabów
  const reportedCount = faults.filter((f) => f.state === "reported").length;
  const myAssignedCount = faults.filter(
    (f) => f.state === "assigned" && f.assignedTo === loggedUser?.id
  ).length;

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "primary.main", mb: 4 }}>
          Panel Technika
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid >
            <Card>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab icon={<ReportIcon />} iconPosition="start" label={`Wolne (${reportedCount})`} />
                <Tab icon={<ConstructionIcon />} iconPosition="start" label={`Moje (${myAssignedCount})`} />
                <Tab icon={<CheckCircleIcon />} iconPosition="start" label="Moja historia" />
              </Tabs>
            </Card>
          </Grid>
          <Grid>
            <FormControl fullWidth>
              <InputLabel>Sortuj według</InputLabel>
              <Select
                value={sortBy}
                label="Sortuj według"
                onChange={handleSortChange}
                startAdornment={<SortIcon sx={{ mr: 1 }} />}
              >
                <MenuItem value="date_desc">Najnowsze</MenuItem>
                <MenuItem value="date_asc">Najstarsze</MenuItem>
                <MenuItem value="category">Kategoria</MenuItem>
                <MenuItem value="location">Lokalizacja (Akademik)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {processedFaults.length === 0 ? (
            <Grid>
              <Box textAlign="center" py={10}>
                <Typography variant="h6" color="text.secondary">
                  Brak zgłoszeń w tej sekcji.
                </Typography>
              </Box>
            </Grid>
          ) : (
            processedFaults.map((fault) => (
              <Grid key={fault.id} >
                <FaultCard
                  fault={fault}
                  onManage={() => handleOpenManage(fault)}
                />
              </Grid>
            ))
          )}
        </Grid>

        <EditFaultDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onSave={handleSaveDialog}
          fault={selectedFault}
          isSaving={updateMutation.isPending}
        />
      </Container>
    </Box>
  );
};

export default TechnicianPanel;