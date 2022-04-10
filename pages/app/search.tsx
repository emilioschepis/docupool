import { Box, Heading } from "@chakra-ui/react";
import type { NextPage } from "next";
import Header from "../../components/Header";
import SearchBox from "../../components/search/SearchBox";

const Search: NextPage = () => {
  return (
    <Box>
      <Header />
      <Heading as="h1">Search</Heading>
      <SearchBox />
    </Box>
  );
};

export default Search;
