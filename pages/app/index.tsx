import {
  Box,
  Heading,
  Wrap,
  WrapItem,
  Link as ChakraLink,
  Flex,
  VStack,
  Text,
  useMediaQuery,
  HStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "react-query";
import Header from "../../components/Header";
import SearchBar from "../../components/home/SearchBar";
import supabase from "../../lib/supabase";

const formatter = Intl.DateTimeFormat();

const App: NextPage = () => {
  const showPreviews = useBreakpointValue({ base: false, md: true }, "base");
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
      <Head>
        <title>DocuPool</title>
      </Head>
      <Header />
      <Flex
        w="full"
        justifyContent="center"
        borderBottomWidth={8}
        borderBottomColor="#F5F6F7"
      >
        <Box
          w={{ base: "100%", md: "66%" }}
          px={{ base: 6, md: 0 }}
          py={{ base: 12, md: 16 }}
        >
          <SearchBar />
        </Box>
      </Flex>
      <VStack p={{ base: 6, md: 10 }} spacing={10} alignItems="flex-start">
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
          {showPreviews ? (
            <Wrap spacing={3} mt={4}>
              {recentDocuments?.map((viewed) => (
                <WrapItem key={viewed.document.id}>
                  <Link href={`/app/d/${viewed.document.id}`} passHref>
                    <ChakraLink>
                      <VStack
                        w={{ base: "full", md: "250px" }}
                        alignItems="flex-start"
                        spacing={2}
                      >
                        <Flex
                          position="relative"
                          w="full"
                          h="180px"
                          bg="rgba(37, 167, 138, 0.15)"
                          borderRadius={4}
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Box w={12}>
                            <Image
                              width={200}
                              height={300}
                              alt=""
                              src="/document.png"
                            />
                          </Box>
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
                        </Flex>
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
                            {viewed.document.topic?.name ?? "-"}
                          </Text>
                        </VStack>
                      </VStack>
                    </ChakraLink>
                  </Link>
                </WrapItem>
              ))}
            </Wrap>
          ) : (
            <VStack alignItems="flex-start" mt={4}>
              {recentDocuments?.map((viewed) => (
                <Box
                  key={viewed.document.id}
                  pb={2}
                  borderBottomWidth={1}
                  borderBottomColor="#F5F6F7"
                >
                  <Link href={`/app/d/${viewed.document.id}`} passHref>
                    <ChakraLink>
                      <Text
                        fontSize="md"
                        fontWeight="bold"
                        textDecoration="underline"
                      >
                        {viewed.document.title}
                      </Text>
                      <Text fontSize="sm" color="#88918F">
                        {viewed.document.topic?.name ?? "-"}
                      </Text>
                    </ChakraLink>
                  </Link>
                </Box>
              ))}
            </VStack>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default App;
