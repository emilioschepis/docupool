import { Box, Heading, Link as ChakraLink, Text } from "@chakra-ui/react";
import { createClient } from "@supabase/supabase-js";
import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { Document, Topic } from "../../../lib/types/types";

type Props = {
  topic: Topic;
  documents: Document[];
};

const formatter = Intl.DateTimeFormat();

const TopicPage: NextPage<Props> = ({ topic, documents }) => {
  return (
    <Box>
      <Heading as="h1">{topic.name}</Heading>
      {documents.map((document) => (
        <Box key={document.id}>
          <Heading as="h2">
            <Link href={`/app/d/${document.id}`} passHref>
              <ChakraLink>{document.title}</ChakraLink>
            </Link>
          </Heading>
          <Text>{document.description}</Text>
          <Text>{formatter.format(new Date(document.created_at))}</Text>
        </Box>
      ))}
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const topicId = context.params?.topicId as string;

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY as string;

  const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const { data, error } = await adminClient
    .from<Topic & { documents: Document[] }>("topics")
    .select("*,documents(*)")
    .eq("id", topicId)
    // @ts-expect-error
    .eq("documents.status", "approved")
    .maybeSingle();

  if (error || !data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      topic: data,
      documents: data.documents,
    },
  };
};

export default TopicPage;
