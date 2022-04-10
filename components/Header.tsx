import {
  Box,
  Link as ChakraLink,
  Flex,
  Avatar,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { useQuery } from "react-query";
import supabase from "../lib/supabase";

type Props = {};

const HeaderUser = () => {
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
    <HStack alignItems="center">
      <Avatar name={profileData.name} />
      <VStack spacing={0} alignItems="flex-start">
        <Text>{profileData.name}</Text>
        <Text>{coinsData.coins} coins</Text>
      </VStack>
    </HStack>
  );
};

const Header = ({}: Props) => {
  return (
    <Flex h={12} dir="row">
      <Box as="nav">
        <Link href="/app" passHref>
          <ChakraLink>Home</ChakraLink>
        </Link>
        <Link href="/app/downloads" passHref>
          <ChakraLink>Downloads</ChakraLink>
        </Link>
        <Link href="/app/uploads" passHref>
          <ChakraLink>Uploads</ChakraLink>
        </Link>
      </Box>
      <Link href="/app/new" passHref>
        <ChakraLink>Upload a document</ChakraLink>
      </Link>
      <HeaderUser />
    </Flex>
  );
};

export default Header;
