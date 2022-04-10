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
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import supabase from "../lib/supabase";

type Fields = {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
};

const Register: NextPage = () => {
  const [isDesktop] = useMediaQuery("(min-width: 768px)");
  const toast = useToast();
  const router = useRouter();
  const {
    register: _register,
    getValues,
    handleSubmit,
    formState: { isSubmitting, isValid, errors },
  } = useForm<Fields>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: { email: "", password: "", repeatPassword: "" },
  });

  async function register(fields: Fields) {
    const { error } = await supabase.auth.signUp(
      {
        email: fields.email,
        password: fields.password,
      },
      {
        data: {
          name: fields.name,
        },
      }
    );

    if (error) {
      toast({
        title: "Could not register",
        description: "Please try again later",
        status: "error",
        duration: 2000,
      });
    }
  }

  return (
    <Box as="form" onSubmit={handleSubmit(register)} p={6} h="100vh">
      <Flex w="full" h="full" alignItems="center">
        {isDesktop && (
          <Box flex={1} bg="brand" h="full" borderRadius="xl"></Box>
        )}
        <Box flex={2} ml={8}>
          <Box maxW="512px" mx="auto">
            <Heading
              as="h1"
              textAlign="center"
              color="brand"
              fontWeight="normal"
            >
              Register
            </Heading>
            <VStack alignItems="stretch" pt={4} spacing={4}>
              <FormControl isInvalid={!!errors.name}>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input
                  id="name"
                  type="text"
                  variant="filled"
                  placeholder="John Doe"
                  bg="#EBEDEF"
                  {..._register("name", {
                    required: {
                      value: true,
                      message: "Insert your name",
                    },
                  })}
                />
                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.email}>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  type="email"
                  variant="filled"
                  placeholder="you@example.com"
                  bg="#EBEDEF"
                  {..._register("email", {
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
                  {..._register("password", {
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
              <FormControl isInvalid={!!errors.repeatPassword}>
                <FormLabel htmlFor="repeatPassword">Repeat password</FormLabel>
                <Input
                  id="repeatPassword"
                  type="password"
                  variant="filled"
                  placeholder="your password again"
                  bg="#EBEDEF"
                  {..._register("repeatPassword", {
                    required: {
                      value: true,
                      message: "Insert your password",
                    },
                    validate: (value) =>
                      value !== getValues("password")
                        ? "Make sure the passwords match"
                        : true,
                  })}
                />
                <FormErrorMessage>
                  {errors.repeatPassword?.message}
                </FormErrorMessage>
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
                Register
              </Button>
              <Text textAlign="center">
                Already have an account?{" "}
                <Link passHref href="/login">
                  <ChakraLink
                    color="brand"
                    fontWeight="bold"
                    textDecoration="underline"
                  >
                    Login
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

export default Register;
