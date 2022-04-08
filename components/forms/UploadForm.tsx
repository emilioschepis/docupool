import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import { useUser } from "@supabase/supabase-auth-helpers/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

type Props = {};
export type Fields = {
  title: string;
  description: string;
  file: FileList;
};

const UploadForm = ({}: Props) => {
  const user = useUser();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, isSubmitSuccessful },
  } = useForm<Fields>({ mode: "onChange" });

  async function uploadDocument(fields: Fields) {
    const file = fields.file.item(0);
    if (!file) {
      return;
    }

    try {
      const uuid = crypto.randomUUID();
      const segments = file.name.split(".");
      const extension = segments[segments.length - 1];
      const fileName = `${uuid}.${extension}`;
      const { data, error } = await supabaseClient.storage
        .from("uploads")
        .upload(`${user.user!.id}/${fileName}`, file);

      if (error) {
        throw error;
      }

      await supabaseClient.from("pending_documents").insert({
        id: uuid,
        user_id: user.user!.id,
        title: fields.title,
        description: fields.description,
        file_key: data!.Key,
      });
    } catch (_e) {
      console.warn(_e);
    }
  }

  return (
    <>
      {isSubmitSuccessful ? (
        <Box>
          <Heading as="h1">Thank you!</Heading>
          <Text>
            We received your document and will be reviewing it shortly.
          </Text>
          <Button onClick={() => router.push("/app")}>Go back home</Button>
        </Box>
      ) : (
        <Box as="form" onSubmit={handleSubmit(uploadDocument)}>
          <p>{JSON.stringify(errors.file?.type)}</p>
          <FormControl isInvalid={!!errors.title}>
            <FormLabel htmlFor="title">Title</FormLabel>
            <Input
              id="title"
              type="text"
              placeholder="Your document's title"
              {...register("title", {
                required: {
                  value: true,
                  message: "Insert a title",
                },
              })}
              isDisabled={isSubmitting}
            />
            <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.description}>
            <FormLabel htmlFor="description">Description</FormLabel>
            <Textarea
              id="description"
              placeholder="Your document's description"
              {...register("description", {
                required: {
                  value: true,
                  message: "Insert a description",
                },
              })}
              isDisabled={isSubmitting}
            />
            <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.file}>
            <FormLabel htmlFor="file">File</FormLabel>
            <Input
              id="file"
              type="file"
              accept=".doc,.docx,.pdf"
              {...register("file", {
                required: {
                  value: true,
                  message: "Insert a file",
                },
                validate: (list) =>
                  list.item(0)!.size > 5242880
                    ? "Maximum upload size is 5MB"
                    : true,
              })}
              isDisabled={isSubmitting}
            />
            <FormErrorMessage>{errors.file?.message}</FormErrorMessage>
          </FormControl>
          <Button type="submit" isDisabled={!isValid} isLoading={isSubmitting}>
            Submit
          </Button>
        </Box>
      )}
    </>
  );
};

export default UploadForm;
