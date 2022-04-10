import {
  Box,
  Button,
  Heading,
  Link as ChakraLink,
  Text,
} from "@chakra-ui/react";
import { createClient } from "@supabase/supabase-js";
import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Header from "../../../components/Header";
import supabase from "../../../lib/supabase";
import { Document, Topic } from "../../../lib/types/types";

type Props = {
  topic: Topic;
  documents: Document[];
};

const formatter = Intl.DateTimeFormat();

const TopicPage: NextPage<Props> = ({ topic, documents }) => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(
    ["FOLLOWING_TOPIC", topic.id],
    async () => {
      const { data, error } = await supabase
        .from("topic_followers")
        .select("*")
        .eq("topic_id", topic.id)
        .eq("user_id", supabase.auth.user()?.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data;
    }
  );

  const { mutateAsync: follow, isLoading: isLoadingFollow } = useMutation(
    async () => {
      const { error } = await supabase
        .from("topic_followers")
        .insert({ user_id: supabase.auth.user()?.id, topic_id: topic.id })
        .single();

      if (error) {
        throw error;
      }
    },
    {
      onSuccess: () =>
        queryClient.refetchQueries(["FOLLOWING_TOPIC", topic.id]),
    }
  );
  const { mutateAsync: unfollow, isLoading: isLoadingUnfollow } = useMutation(
    async () => {
      const { error } = await supabase
        .from("topic_followers")
        .delete()
        .match({ user_id: supabase.auth.user()?.id, topic_id: topic.id })
        .single();

      if (error) {
        throw error;
      }
    },
    {
      onSuccess: () =>
        queryClient.refetchQueries(["FOLLOWING_TOPIC", topic.id]),
    }
  );

  return (
    <Box>
      <Header />
      <Heading as="h1">{topic.name}</Heading>
      {isLoading ? (
        <></>
      ) : data ? (
        <Button isLoading={isLoadingUnfollow} onClick={() => unfollow()}>
          Unfollow
        </Button>
      ) : (
        <Button isLoading={isLoadingFollow} onClick={() => follow()}>
          Follow
        </Button>
      )}
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
