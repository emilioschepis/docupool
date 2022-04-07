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
};

const Login: NextPage = () => {
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
    try {
      const { error } = await supabaseClient.auth.signIn({
        email: fields.email,
        password: fields.password,
      });

      if (error) {
        throw error;
      }

      if (typeof router.query.redirectedFrom === "string") {
        router.replace(router.query.redirectedFrom);
      } else {
        router.replace("/app");
      }
    } catch (_e) {
      toast({
        title: "Could not login",
        description: "Please double check your credentials",
        status: "error",
        duration: 2000,
      });
    }
  }

  return (
    <Box as="form" onSubmit={handleSubmit(login)}>
      <FormControl isInvalid={!!errors.email}>
        <FormLabel htmlFor="email">Email</FormLabel>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
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
          placeholder="your password"
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
      <Button type="submit" disabled={!isValid} isLoading={isSubmitting}>
        Login
      </Button>
    </Box>
  );
};

export default Login;
