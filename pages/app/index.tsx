import {
  Box,
  Heading,
  Wrap,
  WrapItem,
  Link as ChakraLink,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Link from "next/link";
import { useQuery } from "react-query";
import supabase from "../../lib/supabase";

const App: NextPage = () => {
  const { data: followedTopics } = useQuery(["FOLLOWING_TOPICS"], async () => {
    const { data, error } = await supabase
      .from("topic_followers")
      .select("topic:topics(*)")
      .eq("user_id", supabase.auth.user()?.id);

    if (error) {
      throw error;
    }

    return data;
  });

  const { data: recentDocuments } = useQuery(["RECENT_DOCUMENTS"], async () => {
    const { data, error } = await supabase
      .from("document_views")
      .select("created_at,document:documents(id, title)")
      .eq("user_id", supabase.auth.user()?.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      throw error;
    }

    return data;
  });

  return (
    <Box>
      <Heading as="h1">Docupool</Heading>
      <Heading as="h2">Followed topics</Heading>
      <Wrap>
        {followedTopics?.map((followed) => (
          <WrapItem key={followed.topic.id}>
            <Link href={`/app/t/${followed.topic.id}`} passHref>
              <ChakraLink>{followed.topic.name}</ChakraLink>
            </Link>
          </WrapItem>
        ))}
      </Wrap>
      <Heading as="h2">Recently viewed</Heading>
      <Wrap>
        {recentDocuments?.map((viewed) => (
          <WrapItem key={viewed.document.id}>
            <Link href={`/app/d/${viewed.document.id}`} passHref>
              <ChakraLink>{viewed.document.title}</ChakraLink>
            </Link>
          </WrapItem>
        ))}
      </Wrap>
    </Box>
  );
};

export default App;
