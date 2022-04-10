import {
  Box,
  Heading,
  Wrap,
  WrapItem,
  Link as ChakraLink,
  Flex,
  VStack,
  Text,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Link from "next/link";
import { useQuery } from "react-query";
import Header from "../../components/Header";
import SearchBar from "../../components/home/SearchBar";
import supabase from "../../lib/supabase";

const formatter = Intl.DateTimeFormat();

const App: NextPage = () => {
  const { data: followedTopics } = useQuery(["FOLLOWING_TOPICS"], async () => {
    const { data, error } = await supabase
      .from("topic_followers")
      .select("topic:topics(*, documents(id))")
      .eq("user_id", supabase.auth.user()?.id);

    if (error) {
      throw error;
    }

    return data;
  });

  const { data: recentDocuments } = useQuery(["RECENT_DOCUMENTS"], async () => {
    const { data, error } = await supabase
      .from("document_views")
      .select(
        "created_at,document:documents(id, title, created_at, topic:topics(name))"
      )
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
      <Header />
      <Flex
        w="full"
        justifyContent="center"
        borderBottomWidth={8}
        borderBottomColor="#F5F6F7"
      >
        <Box w="66%" py={16}>
          <SearchBar />
        </Box>
      </Flex>
      <VStack p={10} spacing={10} alignItems="flex-start">
        <Box>
          <Heading as="h2" fontSize="2xl" fontWeight="normal" color="#2B3B38">
            Followed topics
          </Heading>
          <Wrap spacing={3} mt={4}>
            {followedTopics?.map((followed) => (
              <WrapItem key={followed.topic.id}>
                <Link href={`/app/t/${followed.topic.id}`} passHref>
                  <ChakraLink
                    p={4}
                    bg="#EBEDEF"
                    borderRadius="lg"
                    fontSize="md"
                    fontWeight="bold"
                    color="#2B3B38"
                  >
                    {followed.topic.name}
                    <Text as="span" ml={8} fontSize="sm" color="#88918F">
                      {followed.topic.documents.length}
                    </Text>
                  </ChakraLink>
                </Link>
              </WrapItem>
            ))}
          </Wrap>
        </Box>
        <Box>
          <Heading as="h2" fontSize="2xl" fontWeight="normal" color="#2B3B38">
            Recently viewed
          </Heading>
          <Wrap spacing={3} mt={4}>
            {recentDocuments?.map((viewed) => (
              <WrapItem key={viewed.document.id}>
                <Link href={`/app/d/${viewed.document.id}`} passHref>
                  <ChakraLink>
                    <VStack w="250px" alignItems="flex-start" spacing={2}>
                      <Box
                        position="relative"
                        w="full"
                        h="180px"
                        bg="#EBEDEF"
                        borderRadius={4}
                      >
                        <Text
                          bg="brand"
                          color="white"
                          position="absolute"
                          top={0}
                          right={0}
                          py={1.5}
                          px={4}
                          fontWeight="bold"
                          fontSize="md"
                          borderRadius={4}
                        >
                          01
                        </Text>
                      </Box>
                      <VStack alignItems="flex-start" spacing={0}>
                        <Text fontSize="xs" color="#88918F">
                          {formatter.format(
                            new Date(viewed.document.created_at)
                          )}
                        </Text>

                        <Text fontSize="lg" color="#2B3B38" fontWeight="bold">
                          {viewed.document.title}
                        </Text>
                        <Text fontSize="md" color="#88918F" fontWeight="bold">
                          {viewed.document.topic.name}
                        </Text>
                      </VStack>
                    </VStack>
                  </ChakraLink>
                </Link>
              </WrapItem>
            ))}
          </Wrap>
        </Box>
      </VStack>
    </Box>
  );
};

export default App;
