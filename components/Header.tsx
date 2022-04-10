import {
  Box,
  Link as ChakraLink,
  Flex,
  Avatar,
  HStack,
  Text,
  VStack,
  Button,
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
import Image from "next/image";

type Props = {};

const HeaderUser = ({ avatarOnly = false }: { avatarOnly?: boolean }) => {
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

  async function logout() {
    await supabase.auth.signOut();
  }

  if (isLoadingCoins || isLoadingProfiles || !coinsData || !profileData) {
    return null;
  }

  return (
    <HStack alignItems="center" spacing={4}>
      <Avatar name={profileData.name} bg="#F4FBF9" textColor="brand" />
      {!avatarOnly ? (
        <VStack spacing={1} alignItems="flex-start">
          <HStack alignItems="center" spacing={1}>
            <Box w={4} h={4}>
              <Image
                width={48}
                height={48}
                layout="responsive"
                alt=""
                src="/coins-brand.png"
              />
            </Box>
            <Text fontSize="sm" lineHeight={4} fontWeight="bold" color="brand">
              {coinsData.coins}
            </Text>
          </HStack>
          <Text fontSize="md" lineHeight={5} fontWeight="bold">
            {profileData.name}
          </Text>
          <Button
            variant="unstyled"
            onClick={logout}
            h={6}
            style={{ marginTop: 0 }}
          >
            Logout
          </Button>
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
              <HStack alignItems="center" spacing={2}>
                <Image
                  width="48px"
                  height="48px"
                  alt=""
                  src="/logo-inverted.png"
                />
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
              </HStack>
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
              <HStack>
                <Box w={4} h={4}>
                  <Image
                    width={48}
                    height={48}
                    alt=""
                    src="/upload.png"
                    layout="responsive"
                  />
                </Box>
                <Text>Upload a document</Text>
              </HStack>
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
                justifyContent="space-between"
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
                <Image
                  width="48px"
                  height="48px"
                  alt=""
                  src="/logo-inverted.png"
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
                        <HStack>
                          <Box w={4} h={4}>
                            <Image
                              width={48}
                              height={48}
                              alt=""
                              src="/upload.png"
                              layout="responsive"
                            />
                          </Box>
                          <Text>Upload a document</Text>
                        </HStack>
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
