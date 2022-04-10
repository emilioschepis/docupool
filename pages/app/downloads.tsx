import { Box, Heading, useMediaQuery } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import DocumentsTable from "../../components/downloads/DocumentsTable";
import Header from "../../components/Header";

const Downloads: NextPage = () => {
  const [isDesktop] = useMediaQuery("(min-width: 768px)");

  return (
    <Box>
      <Head>
        <title>Downloads | DocuPool</title>
      </Head>
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
        My downloads
      </Heading>
      <DocumentsTable />
    </Box>
  );
};

export default Downloads;
