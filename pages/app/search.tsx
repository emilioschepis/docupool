import { Box } from "@chakra-ui/react";
import { useUser } from "@supabase/supabase-auth-helpers/react";
import type { NextPage } from "next";
import SearchBox from "../../components/search/SearchBox";

const Search: NextPage = () => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <Box>
      <SearchBox />
    </Box>
  );
};

export default Search;
