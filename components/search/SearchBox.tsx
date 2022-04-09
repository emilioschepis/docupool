import { Box, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import supabase from "../../lib/supabase";
import { Document } from "../../lib/types/types";
import DocumentsTable from "./DocumentsTable";

type Props = {};

const SearchBox = ({}: Props) => {
  const user = supabase.auth.user();
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const { data } = useQuery(
    ["SEARCH", search],
    async () => {
      const { data, error } = await supabase
        .from<Document>("documents")
        .select("*")
        .neq("user_id", user!.id)
        .ilike("title", "%" + search + "%");

      if (error) {
        throw error;
      }

      return data;
    },
    { enabled: search.length > 3, keepPreviousData: true }
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(text);
    }, 200);

    return () => {
      clearTimeout(timeout);
    };
  }, [text]);

  return (
    <Box>
      <Input
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Search"
      />
      <DocumentsTable search={search} documents={data ?? []} />
    </Box>
  );
};

export default SearchBox;
