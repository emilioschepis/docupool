import { Box, Heading, Text, Link as ChakraLink } from "@chakra-ui/react";
import { createClient } from "@supabase/supabase-js";
import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import supabase from "../../../lib/supabase";
import { Document, Topic } from "../../../lib/types/types";

type Props = {
  document: Document & { topic: Topic };
};

const formatter = Intl.DateTimeFormat();

const DocumentPage: NextPage<Props> = ({ document }) => {
  return (
    <Box>
      <Heading as="h1">{document.title}</Heading>
      <Text>{document.description}</Text>
      <Text>{formatter.format(new Date(document.created_at))}</Text>
      {document.topic ? (
        <Link href={`/app/t/${document.topic.id}`} passHref>
          <ChakraLink>{document.topic.name}</ChakraLink>
        </Link>
      ) : null}
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const documentId = context.params?.documentId as string;

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY as string;

  const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const { data, error } = await adminClient
    .from<Document & { topic: Topic }>("documents")
    .select("*,topic:topics(*)")
    .eq("id", documentId)
    .maybeSingle();

  if (error || !data) {
    return {
      notFound: true,
    };
  }

  const { user } = await supabase.auth.api.getUserByCookie(context.req);
  if (data.status === "pending" && data.user_id !== user?.id) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      document: data,
    },
  };
};

export default DocumentPage;
