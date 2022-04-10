import {
  Box,
  Heading,
  Link as ChakraLink,
  Text,
  Button,
} from "@chakra-ui/react";
import { createClient } from "@supabase/supabase-js";
import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "react-query";
import supabase from "../../../lib/supabase";
import { Document, Topic, Unlock } from "../../../lib/types/types";

type Props = {
  document: Document & { topic: Topic } & { unlocks: Unlock[] };
};

const formatter = Intl.DateTimeFormat();

const DocumentPage: NextPage<Props> = ({ document: _document }) => {
  const queryClient = useQueryClient();
  const { data: document } = useQuery(
    ["DOCUMENT", _document.id],
    async () => {
      const { data, error } = await supabase
        .from<Document & { topic: Topic } & { unlocks: Unlock[] }>("documents")
        .select("*,topic:topics(*),unlocks:document_unlocks(user_id)")
        .eq("id", _document.id)
        .maybeSingle();

      if (error) {
        throw error;
      }
      return data;
    },
    {
      initialData: _document,
    }
  );

  const { data } = useQuery("MY_COINS", async () => {
    const { data, error } = await supabase
      .from("user_coins")
      .select("coins")
      .eq("user_id", supabase.auth.user()?.id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  });
  const { mutateAsync: unlock, isLoading } = useMutation(
    async () =>
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL}/unlock`, {
        method: "POST",
        body: JSON.stringify({ documentId: document?.id }),
        headers: {
          Authorization: `Bearer ${supabase.auth.session()?.access_token}`,
        },
      }),
    {
      onSuccess: () => {
        queryClient.refetchQueries("MY_COINS");
        queryClient.refetchQueries(["DOCUMENT", document?.id]);
      },
    }
  );

  if (!document) {
    return null;
  }

  const unlocked =
    document.user_id === supabase.auth.user()?.id ||
    !!document.unlocks.find((un) => un.user_id === supabase.auth.user()?.id);

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
      <Button
        onClick={() => unlock()}
        disabled={!data || data.coins < 1 || unlocked}
        isLoading={isLoading}
      >
        {unlocked ? "Unlocked" : `Unlock (${data?.coins})`}
      </Button>
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
    .select("*,topic:topics(*),unlocks:document_unlocks(user_id)")
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

  await adminClient
    .from("document_views")
    .upsert({ document_id: documentId, user_id: user?.id })
    .single();

  return {
    props: {
      document: data,
    },
  };
};

export default DocumentPage;
