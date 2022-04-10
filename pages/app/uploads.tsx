import { Box, Heading } from "@chakra-ui/react";
import type { NextPage } from "next";
import Header from "../../components/Header";
import DocumentsTable from "../../components/uploads/DocumentsTable";

const Uploads: NextPage = () => {
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
        My uploads
      </Heading>
      <DocumentsTable />
    </Box>
  );
};

export default Uploads;
