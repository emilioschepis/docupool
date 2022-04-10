import { Box, Heading, useMediaQuery } from "@chakra-ui/react";
import type { NextPage } from "next";
import Header from "../../components/Header";
import DocumentsTable from "../../components/uploads/DocumentsTable";

const Uploads: NextPage = () => {
  const [isDesktop] = useMediaQuery("min-width(768px)");

  return (
    <Box>
      <Header />
      <Heading
        as="h1"
        pt={isDesktop ? 12 : 4}
        px={isDesktop ? 10 : 6}
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
