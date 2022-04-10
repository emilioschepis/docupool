import { Box, Input } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import supabase from "../../lib/supabase";
import { Document, Topic } from "../../lib/types/types";
import DocumentsTable from "./DocumentsTable";
import TopicsTable from "./TopicsTable";

type Props = {};

const SearchBox = ({}: Props) => {
  const router = useRouter();
  const user = supabase.auth.user();
  const [text, setText] = useState((router.query.q as string) ?? "");
  const [search, setSearch] = useState((router.query.q as string) ?? "");
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

  const { data: topicsData } = useQuery(
    ["SEARCH_TOPICS", search],
    async () => {
      const { data, error } = await supabase
        .from<Topic>("topics")
        .select("*")
        .ilike("name", "%" + search + "%");

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
      <TopicsTable search={search} topics={topicsData ?? []} />
    </Box>
  );
};

export default SearchBox;
