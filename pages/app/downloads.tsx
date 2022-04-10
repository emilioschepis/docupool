import { Box, Heading } from "@chakra-ui/react";
import type { NextPage } from "next";
import DocumentsTable from "../../components/downloads/DocumentsTable";
import Header from "../../components/Header";

const Downloads: NextPage = () => {
  return (
    <Box>
      <Header />
      <Heading as="h1">Downloads</Heading>
      <DocumentsTable />
    </Box>
  );
};

export default Downloads;
