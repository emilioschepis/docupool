import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Text,
  useToast,
  VStack,
  Link as ChakraLink,
  Flex,
  useMediaQuery,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import supabase from "../lib/supabase";

type Fields = {
  email: string;
  password: string;
};

const Login: NextPage = () => {
  const [isDesktop] = useMediaQuery("(min-width: 768px)");
  const toast = useToast();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isValid, errors },
  } = useForm<Fields>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  async function login(fields: Fields) {
    const { error } = await supabase.auth.signIn({
      email: fields.email,
      password: fields.password,
    });

    if (error) {
      toast({
        title: "Could not login",
        description: "Please double check your credentials",
        status: "error",
        duration: 2000,
      });
    }
  }

  return (
    <Box as="form" onSubmit={handleSubmit(login)} p={6} h="100vh">
      <Flex w="full" h="full" alignItems="center">
        {isDesktop && (
          <Flex
            direction="column"
            flex={1}
            justifyContent="center"
            alignItems="center"
            bg="brand"
            h="full"
            borderRadius="xl"
            mr={8}
          >
            <Image width={200} height={200} src="/logo.png" alt="" />
            <Text
              mt={6}
              color="white"
              fontSize="4xl"
              lineHeight={7}
              fontWeight="bold"
            >
              DocuPool
            </Text>
          </Flex>
        )}
        <Box flex={2}>
          <Box maxW="512px" mx="auto">
            <Heading
              as="h1"
              textAlign="center"
              color="brand"
              fontWeight="normal"
            >
              Login
            </Heading>
            <VStack alignItems="stretch" pt={4} spacing={4}>
              <FormControl isInvalid={!!errors.email}>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  type="email"
                  variant="filled"
                  placeholder="you@example.com"
                  bg="#EBEDEF"
                  {...register("email", {
                    required: {
                      value: true,
                      message: "Insert your email",
                    },
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Insert a valid email",
                    },
                  })}
                />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.password}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input
                  id="password"
                  type="password"
                  variant="filled"
                  placeholder="your password"
                  bg="#EBEDEF"
                  {...register("password", {
                    required: {
                      value: true,
                      message: "Insert your password",
                    },
                    minLength: {
                      value: 6,
                      message: "Insert a strong password",
                    },
                  })}
                />
                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
              </FormControl>
              <Button
                bg="brand"
                w="full"
                type="submit"
                disabled={!isValid}
                isLoading={isSubmitting}
                _hover={{
                  bg: "brand",
                }}
                color="white"
              >
                Login
              </Button>
              <Text textAlign="center">
                Don&apos;t have an account yet?{" "}
                <Link passHref href="/register">
                  <ChakraLink
                    color="brand"
                    fontWeight="bold"
                    textDecoration="underline"
                  >
                    Register
                  </ChakraLink>
                </Link>
              </Text>
            </VStack>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default Login;
