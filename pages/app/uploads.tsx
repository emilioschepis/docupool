import { Box } from "@chakra-ui/react";
import type { NextPage } from "next";
import PendingDocumentsTable from "../../components/uploads/PendingDocumentsTable";
import PublicDocumentsTable from "../../components/uploads/PublicDocumentsTable";

const Uploads: NextPage = () => {
  return (
    <Box>
      <PendingDocumentsTable />
      <PublicDocumentsTable />
    </Box>
  );
};

export default Uploads;
