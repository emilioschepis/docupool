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
  const search = (router.query.q as string) ?? "";
  const [text, setText] = useState((router.query.q as string) ?? "");
  const { data } = useQuery(
    ["SEARCH", search],
    async () => {
      const { data, error } = await supabase
        .from<Document & { topic: Topic }>("documents")
        .select("*,topic:topics(*)")
        .neq("user_id", user!.id)
        .ilike("title", "%" + search + "%");

      if (error) {
        throw error;
      }

      return data;
    },
    { enabled: search.length >= 3 }
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
    { enabled: search.length >= 3 }
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (text !== router.query.q) {
        router.replace(`/app/search?q=${text}`, undefined, { shallow: true });
      }
    }, 200);

    return () => {
      clearTimeout(timeout);
    };
  }, [router, text]);

  return (
    <Box>
      <Input
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Search"
      />
      {search.length >= 3 ? (
        <>
          <DocumentsTable search={search} documents={data ?? []} />
          <TopicsTable search={search} topics={topicsData ?? []} />
        </>
      ) : null}
    </Box>
  );
};

export default SearchBox;
