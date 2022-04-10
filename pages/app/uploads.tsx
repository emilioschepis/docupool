import { Box, Heading } from "@chakra-ui/react";
import type { NextPage } from "next";
import Header from "../../components/Header";
import DocumentsTable from "../../components/uploads/DocumentsTable";

const Uploads: NextPage = () => {
  return (
    <Box>
      <Header />
      <Heading as="h1">Uploads</Heading>
      <DocumentsTable />
    </Box>
  );
};

export default Uploads;
