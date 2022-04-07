import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

type Fields = {
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
    try {
      const { error } = await supabaseClient.auth.signUp({
        email: fields.email,
        password: fields.password,
      });

      if (error) {
        throw error;
      }

      router.replace("/app");
    } catch (_e) {
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
