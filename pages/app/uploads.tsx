import { Box } from "@chakra-ui/react";
import type { NextPage } from "next";
import DocumentsTable from "../../components/uploads/DocumentsTable";

const Uploads: NextPage = () => {
  return (
    <Box>
      <DocumentsTable />
    </Box>
  );
};

export default Uploads;
