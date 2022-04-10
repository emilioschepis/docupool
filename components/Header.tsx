import {
  Box,
  Link as ChakraLink,
  Flex,
  Avatar,
  HStack,
  Text,
  VStack,
  Drawer,
  useDisclosure,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  useMediaQuery,
  IconButton,
} from "@chakra-ui/react";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import supabase from "../lib/supabase";

type Props = {};

const HeaderUser = () => {
  const [isDesktop] = useMediaQuery("(min-width: 768px)");
  const { data: coinsData, isLoading: isLoadingCoins } = useQuery(
    "MY_COINS",
    async () => {
      const { data, error } = await supabase
        .from("user_coins")
        .select("coins")
        .eq("user_id", supabase.auth.user()?.id)
        .single();

      if (error) {
        throw error;
      }

      return data;
    }
  );

  const { data: profileData, isLoading: isLoadingProfiles } = useQuery(
    "PROFILE",
    async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", supabase.auth.user()?.id)
        .single();

      if (error) {
        throw error;
      }

      return data;
    }
  );

  if (isLoadingCoins || isLoadingProfiles || !coinsData || !profileData) {
    return null;
  }

  return (
    <HStack alignItems="center" spacing={4}>
      <Avatar name={profileData.name} bg="#F4FBF9" textColor="brand" />
      {isDesktop ? (
        <VStack spacing={0} alignItems="flex-start">
          <Text fontSize="sm" lineHeight={4} fontWeight="bold" color="brand">
            {coinsData.coins} coins
          </Text>
          <Text fontSize="md" lineHeight={5} fontWeight="bold">
            {profileData.name}
          </Text>
        </VStack>
      ) : null}
    </HStack>
  );
};

const Header = ({}: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const pathname = useRouter().pathname;
  const [isDesktop] = useMediaQuery("(min-width: 768px)");

  return (
    <Flex
      h={20}
      dir="row"
      alignItems="center"
      borderBottomWidth={2}
      borderBottomColor="#F5F6F7"
      px={isDesktop ? 10 : 6}
    >
      {isDesktop ? (
        <>
          <Box as="nav" flex={1}>
            <HStack spacing={10} alignItems="center">
              <Link href="/app" passHref>
                <ChakraLink
                  color="brand"
                  fontSize="2xl"
                  lineHeight={7}
                  fontWeight="bold"
                >
                  DocuPool
                </ChakraLink>
              </Link>
              <Link href="/app" passHref>
                <ChakraLink
                  color={pathname === "/app" ? "brand" : "#81818D"}
                  fontSize="lg"
                  lineHeight={5}
                  letterSpacing={0.03}
                  py={1}
                  borderBottomWidth={2}
                  borderColor={pathname === "/app" ? "brand" : "transparent"}
                >
                  Home
                </ChakraLink>
              </Link>
              <Link href="/app/downloads" passHref>
                <ChakraLink
                  color={pathname === "/app/downloads" ? "brand" : "#81818D"}
                  fontSize="lg"
                  lineHeight={5}
                  letterSpacing={0.03}
                  py={1}
                  borderBottomWidth={2}
                  borderColor={
                    pathname === "/app/downloads" ? "brand" : "transparent"
                  }
                >
                  Downloads
                </ChakraLink>
              </Link>
              <Link href="/app/uploads" passHref>
                <ChakraLink
                  color={pathname === "/app/uploads" ? "brand" : "#81818D"}
                  fontSize="lg"
                  lineHeight={5}
                  letterSpacing={0.03}
                  py={1}
                  borderBottomWidth={2}
                  borderColor={
                    pathname === "/app/uploads" ? "brand" : "transparent"
                  }
                >
                  Uploads
                </ChakraLink>
              </Link>
            </HStack>
          </Box>
          <Link href="/app/new" passHref>
            <ChakraLink
              display="flex"
              alignItems="center"
              h={10}
              bg="brand"
              color="white"
              px={4}
              borderRadius="lg"
              fontSize="md"
              lineHeight={5}
              fontWeight="bold"
              mr={8}
            >
              Upload a document
            </ChakraLink>
          </Link>
          <HeaderUser />
        </>
      ) : (
        <>
          <Flex flex={1} alignItems="center" justifyContent="space-between">
            <IconButton
              aria-label="open menu"
              onClick={() => onOpen()}
              icon={<HamburgerIcon />}
            />
            <HeaderUser />
          </Flex>
          <Drawer isOpen={isOpen} placement="start" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
              <Flex
                h={20}
                dir="row"
                alignItems="center"
                borderBottomWidth={2}
                borderBottomColor="#F5F6F7"
                px={6}
              >
                <IconButton
                  aria-label="close menu"
                  onClick={() => onClose()}
                  icon={<CloseIcon />}
                />
              </Flex>
              <DrawerBody>
                <Box as="nav" flex={1}>
                  <VStack spacing={6} alignItems="flex-start">
                    <Link href="/app" passHref>
                      <ChakraLink
                        color={pathname === "/app" ? "brand" : "#81818D"}
                        fontSize="lg"
                        lineHeight={5}
                        letterSpacing={0.03}
                        py={1}
                        borderBottomWidth={2}
                        borderColor={
                          pathname === "/app" ? "brand" : "transparent"
                        }
                      >
                        Home
                      </ChakraLink>
                    </Link>
                    <Link href="/app/downloads" passHref>
                      <ChakraLink
                        color={
                          pathname === "/app/downloads" ? "brand" : "#81818D"
                        }
                        fontSize="lg"
                        lineHeight={5}
                        letterSpacing={0.03}
                        py={1}
                        borderBottomWidth={2}
                        borderColor={
                          pathname === "/app/downloads"
                            ? "brand"
                            : "transparent"
                        }
                      >
                        Downloads
                      </ChakraLink>
                    </Link>
                    <Link href="/app/uploads" passHref>
                      <ChakraLink
                        color={
                          pathname === "/app/uploads" ? "brand" : "#81818D"
                        }
                        fontSize="lg"
                        lineHeight={5}
                        letterSpacing={0.03}
                        py={1}
                        borderBottomWidth={2}
                        borderColor={
                          pathname === "/app/uploads" ? "brand" : "transparent"
                        }
                      >
                        Uploads
                      </ChakraLink>
                    </Link>
                    <Link href="/app/new" passHref>
                      <ChakraLink
                        w="full"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        h={10}
                        bg="brand"
                        color="white"
                        px={4}
                        borderRadius="lg"
                        fontSize="md"
                        lineHeight={5}
                        fontWeight="bold"
                        mr={8}
                      >
                        Upload a document
                      </ChakraLink>
                    </Link>
                  </VStack>
                </Box>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      )}
    </Flex>
  );
};

export default Header;
