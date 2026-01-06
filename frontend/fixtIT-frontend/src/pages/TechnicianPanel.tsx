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
import type { EditFormData } from "../components/dashboard/EditFaultDialog";
import EditFaultDialog from "../components/dashboard/EditFaultDialog";
import type { FaultWithUserObject } from "../types/fault.type";
import { enqueueSnackbar } from "notistack";

type SortOption = "date_desc" | "date_asc" | "category" | "location";

const TechnicianPanel = () => {
  const queryClient = useQueryClient();
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFault, setSelectedFault] =
    useState<FaultWithUserObject | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("date_desc");

  const {
    data: faults = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["faults"],
    queryFn: getAllFaults,
  });

  const updateMutation = useMutation({
    mutationFn: updateFaultStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faults"] });
      setOpenDialog(false);
      setSelectedFault(null);
    },
    onError: (err: Error) => {
      enqueueSnackbar(`Błąd aktualizacji: ${err.message}`, {
        variant: "error",
      });
    },
  });

  // Obsługa zmiany tabów
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Otwieranie dialogu
  const handleOpenManage = (fault: FaultWithUserObject) => {
    setSelectedFault(fault);
    setOpenDialog(true);
  };

  // Zapis zmian z formularza - LOGIKA API PRZYWRÓCONA
  const handleSaveDialog = (formData: EditFormData) => {
    if (selectedFault) {
      updateMutation.mutate({
        id: selectedFault._id,
        state: formData.state,
        review: formData.review,
      });
    }
  };

  const handleSortChange = (event: any) => {
    setSortBy(event.target.value as SortOption);
  };

  const processedFaults = useMemo(() => {
    const filtered = faults.filter((f) => {
      switch (tabValue) {
        case 0:
          return f.state === "reported";
        case 1:
          return f.state === "assigned";
        case 2:
          return f.state === "fixed";
        default:
          return false;
      }
    });

    // Krok 2: Sortowanie
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "date_desc":
          return (
            new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
          );
        case "date_asc":
          return (
            new Date(a.reportedAt).getTime() - new Date(b.reportedAt).getTime()
          );
        case "category":
          return a.category.localeCompare(b.category);
        case "location":
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
  }, [faults, tabValue, sortBy]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">
          Błąd podczas pobierania usterek:{" "}
          {error instanceof Error ? error.message : "Nieznany błąd"}
        </Alert>
      </Container>
    );
  }

  const reportedCount = faults.filter((f) => f.state === "reported").length;
  const assignedCount = faults.filter((f) => f.state === "assigned").length;

  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="xl">
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#1a237e" }}
        >
          Panel Technika
        </Typography>

        <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Grid>
            <Card>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab
                  icon={<ReportIcon />}
                  iconPosition="start"
                  label={`Wszystkie wolne (${reportedCount})`}
                />
                <Tab
                  icon={<ConstructionIcon />}
                  iconPosition="start"
                  label={`Moje usterki (${assignedCount})`}
                />
                <Tab
                  icon={<CheckCircleIcon />}
                  iconPosition="start"
                  label="Historia napraw"
                />
              </Tabs>
            </Card>
          </Grid>
          <Grid>
            <FormControl fullWidth variant="outlined" sx={{ bgcolor: "white" }}>
              <InputLabel id="sort-label">Sortuj według</InputLabel>
              <Select
                labelId="sort-label"
                value={sortBy}
                label="Sortuj według"
                onChange={handleSortChange}
                startAdornment={
                  <SortIcon sx={{ mr: 1, color: "action.active" }} />
                }
              >
                <MenuItem value="date_desc">Najnowsze zgłoszenia</MenuItem>
                <MenuItem value="date_asc">Najstarsze zgłoszenia</MenuItem>
                <MenuItem value="category">Kategoria (A-Z)</MenuItem>
                <MenuItem value="location">Lokalizacja (Akademik)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {processedFaults.length === 0 ? (
            <Grid>
              <Box textAlign="center" py={8} color="text.secondary">
                <Typography variant="h6">
                  Brak zgłoszeń w tej sekcji.
                </Typography>
              </Box>
            </Grid>
          ) : (
            processedFaults.map((fault) => (
              <Grid>
                <FaultCard
                  fault={fault}
                  onManage={() => handleOpenManage(fault)}
                />
              </Grid>
            ))
          )}
        </Grid>

        {/* Dialog edycji */}
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
