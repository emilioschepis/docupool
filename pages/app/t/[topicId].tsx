import {
  Box,
  Button,
  Heading,
  HStack,
  Link as ChakraLink,
  Text,
  useMediaQuery,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { createClient } from "@supabase/supabase-js";
import type { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Header from "../../../components/Header";
import supabase from "../../../lib/supabase";
import { Document, Topic } from "../../../lib/types/types";

type Props = {
  topic: Topic & { documents: Document[] };
};

const formatter = Intl.DateTimeFormat();

const TopicPage: NextPage<Props> = ({ topic }) => {
  const [isDesktop] = useMediaQuery("(min-width: 768px)");
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
      <VStack
        alignItems="stretch"
        pt={isDesktop ? 12 : 4}
        px={isDesktop ? 10 : 6}
        mb={8}
        spacing={0}
      >
        <Text fontSize="sm" color="#798683">
          <b>{topic.documents.length}</b> documents available
        </Text>
        <HStack
          justifyContent={isDesktop ? "flex-start" : "space-between"}
          alignItems="center"
        >
          <Heading as="h1" fontSize="2xl" fontWeight="normal" color="#2B3B38">
            {topic.name}
          </Heading>
          {data ? (
            <Button
              isLoading={isLoadingUnfollow}
              onClick={() => unfollow()}
              h={6}
            >
              Unfollow
            </Button>
          ) : (
            <Button isLoading={isLoadingFollow} onClick={() => follow()} h={6}>
              Follow
            </Button>
          )}
        </HStack>
      </VStack>
      {isDesktop ? (
        <Wrap spacing={3} mt={4} px={10}>
          {topic.documents?.map((document) => (
            <WrapItem key={document.id}>
              <Link href={`/app/d/${document.id}`} passHref>
                <ChakraLink>
                  <VStack
                    w={isDesktop ? "250px" : "full"}
                    alignItems="flex-start"
                    spacing={2}
                  >
                    <Box
                      position="relative"
                      w="full"
                      h="180px"
                      bg="#EBEDEF"
                      borderRadius={4}
                    >
                      <HStack
                        bg="brand"
                        color="white"
                        position="absolute"
                        top={0}
                        right={0}
                        py={1.5}
                        px={2}
                        borderRadius={4}
                      >
                        <Box w={4} h={4}>
                          <Image
                            width={48}
                            height={48}
                            layout="responsive"
                            alt=""
                            src="/coins-white.png"
                          />
                        </Box>
                        <Text fontWeight="bold" fontSize="md">
                          01
                        </Text>
                      </HStack>
                    </Box>
                    <VStack alignItems="flex-start" spacing={0}>
                      <Text fontSize="xs" color="#88918F">
                        {formatter.format(new Date(document.created_at))}
                      </Text>

                      <Text fontSize="lg" color="#2B3B38" fontWeight="bold">
                        {document.title}
                      </Text>
                    </VStack>
                  </VStack>
                </ChakraLink>
              </Link>
            </WrapItem>
          ))}
        </Wrap>
      ) : (
        <VStack alignItems="flex-start" mt={4} px={6}>
          {topic.documents?.map((document) => (
            <Box
              key={document.id}
              pb={2}
              borderBottomWidth={1}
              borderBottomColor="#F5F6F7"
            >
              <Link href={`/app/d/${document.id}`} passHref>
                <ChakraLink>
                  <Text
                    fontSize="md"
                    fontWeight="bold"
                    textDecoration="underline"
                  >
                    {document.title}
                  </Text>
                  <Text fontSize="sm" color="#88918F">
                    {formatter.format(new Date(document.created_at))}
                  </Text>
                </ChakraLink>
              </Link>
            </Box>
          ))}
        </VStack>
      )}
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
