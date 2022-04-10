import { Box } from "@chakra-ui/react";
import type { NextPage } from "next";
import DocumentsTable from "../../components/downloads/DocumentsTable";

const Uploads: NextPage = () => {
  return (
    <Box>
      <DocumentsTable />
    </Box>
  );
};

export default Uploads;
