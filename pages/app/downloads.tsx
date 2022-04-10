import { Box, Heading } from "@chakra-ui/react";
import type { NextPage } from "next";
import DocumentsTable from "../../components/downloads/DocumentsTable";
import Header from "../../components/Header";

const Downloads: NextPage = () => {
  return (
    <Box>
      <Header />
      <Heading
        as="h1"
        pt={12}
        px={10}
        fontSize="2xl"
        fontWeight="normal"
        color="#2B3B38"
        mb={8}
      >
        My downloads
      </Heading>
      <DocumentsTable />
    </Box>
  );
};

export default Downloads;
