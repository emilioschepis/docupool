import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Heading,
  Wrap,
  WrapItem,
  Link as ChakraLink,
  Flex,
  VStack,
  Text,
  Input,
  InputRightAddon,
  IconButton,
  InputGroup,
  useMediaQuery,
  HStack,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import Header from "../../components/Header";
import SearchBar from "../../components/home/SearchBar";
import supabase from "../../lib/supabase";
import { Document, Topic } from "../../lib/types/types";

const formatter = Intl.DateTimeFormat();

const Search: NextPage = () => {
  const router = useRouter();
  const [isDesktop] = useMediaQuery("(min-width: 768px)");
  const search = (router.query.q as string) ?? "";
  const [text, setText] = useState((router.query.q as string) ?? "");
  const { data, isLoading: isLoadingDocuments } = useQuery(
    ["SEARCH", search],
    async () => {
      const { data, error } = await supabase
        .from<Document & { topic: Topic }>("documents")
        .select("*,topic:topics(*)")
        .ilike("title", "%" + search + "%");

      if (error) {
        throw error;
      }

      return data;
    },
    { enabled: search.length >= 3 }
  );

  const { data: topicsData, isLoading: isLoadingTopics } = useQuery(
    ["SEARCH_TOPICS", search],
    async () => {
      const { data, error } = await supabase
        .from<Topic & { documents: Document[] }>("topics")
        .select("*,documents(id)")
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
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [router, text]);

  return (
    <Box>
      <Header />
      <Flex
        w="full"
        justifyContent="center"
        borderBottomWidth={8}
        borderBottomColor="#F5F6F7"
      >
        <Box
          w={isDesktop ? "66%" : "100%"}
          px={isDesktop ? 0 : 6}
          py={isDesktop ? 16 : 12}
        >
          <InputGroup height={16}>
            <Input
              id="search"
              aria-label="search"
              type="text"
              placeholder="Start searching for a document or topic..."
              variant="filled"
              height={16}
              bg="#EBEDEF"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <InputRightAddon
              border="none"
              bg="brand"
              color="white"
              h={16}
              w={20}
              justifyContent="center"
            >
              <SearchIcon w={5} h={5} />
            </InputRightAddon>
          </InputGroup>
        </Box>
      </Flex>
      <VStack p={isDesktop ? 10 : 6} spacing={10} alignItems="flex-start">
        {router.query.q &&
        router.query.q.length >= 3 &&
        !isLoadingTopics &&
        !isLoadingDocuments &&
        !data?.length &&
        !topicsData?.length ? (
          <Text alignSelf="center">
            No documents or topics found for &ldquo;<b>{router.query.q}</b>
            &rdquo;.
          </Text>
        ) : null}
        {topicsData?.length ? (
          <>
            <Box>
              <Heading
                as="h2"
                fontSize="2xl"
                fontWeight="normal"
                color="#2B3B38"
              >
                Topics with &ldquo;<b>{router.query.q}</b>&rdquo;
              </Heading>
              <Wrap spacing={3} mt={4}>
                {topicsData?.map((topic) => (
                  <WrapItem key={topic.id}>
                    <Link href={`/app/t/${topic.id}`} passHref>
                      <ChakraLink
                        p={4}
                        bg="#EBEDEF"
                        borderRadius="lg"
                        fontSize="md"
                        fontWeight="bold"
                        color="#2B3B38"
                      >
                        {topic.name}
                        <Text as="span" ml={8} fontSize="sm" color="#88918F">
                          {topic.documents.length}
                        </Text>
                      </ChakraLink>
                    </Link>
                  </WrapItem>
                ))}
              </Wrap>
            </Box>
          </>
        ) : null}
        {data?.length ? (
          <>
            <Box>
              <Heading
                as="h2"
                fontSize="2xl"
                fontWeight="normal"
                color="#2B3B38"
              >
                Documents with &ldquo;<b>{router.query.q}</b>&rdquo;
              </Heading>
              {isDesktop ? (
                <Wrap spacing={3} mt={4}>
                  {data?.map((document) => (
                    <WrapItem key={document.id}>
                      <Link href={`/app/d/${document.id}`} passHref>
                        <ChakraLink>
                          <VStack w="250px" alignItems="flex-start" spacing={2}>
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
                                {formatter.format(
                                  new Date(document.created_at)
                                )}
                              </Text>

                              <Text
                                fontSize="lg"
                                color="#2B3B38"
                                fontWeight="bold"
                              >
                                {document.title}
                              </Text>
                              <Text
                                fontSize="md"
                                color="#88918F"
                                fontWeight="bold"
                              >
                                {document.topic.name}
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
                  {data?.map((document) => (
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
                            {document.topic?.name ?? "-"}
                          </Text>
                        </ChakraLink>
                      </Link>
                    </Box>
                  ))}
                </VStack>
              )}
            </Box>
          </>
        ) : null}
      </VStack>
    </Box>
  );
};

export default Search;
