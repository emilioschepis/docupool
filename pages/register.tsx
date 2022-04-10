import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import type { NextPage } from "next";
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
    <Box as="form" onSubmit={handleSubmit(register)}>
      <FormControl isInvalid={!!errors.name}>
        <FormLabel htmlFor="name">Name</FormLabel>
        <Input
          id="name"
          type="text"
          placeholder="John Doe"
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
          placeholder="you@example.com"
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
          placeholder="your password"
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
          placeholder="your password again"
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
        <FormErrorMessage>{errors.repeatPassword?.message}</FormErrorMessage>
      </FormControl>
      <Button type="submit" disabled={!isValid} isLoading={isSubmitting}>
        Register
      </Button>
    </Box>
  );
};

export default Register;
