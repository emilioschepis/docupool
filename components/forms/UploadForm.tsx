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
  useToast,
  Flex,
  VStack,
  HStack,
  IconButton,
  useMediaQuery,
} from "@chakra-ui/react";
import { ArrowRightIcon, CloseIcon, DeleteIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import supabase from "../../lib/supabase";
import { Topic } from "../../lib/types/types";
import Image from "next/image";

type Props = {
  topics: Topic[];
};
export type Fields = {
  title: string;
  description: string;
  file: FileList;
  topic: string;
};

const UploadForm = ({ topics }: Props) => {
  const toast = useToast();
  const router = useRouter();
  const {
    watch,
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isSubmitting, isSubmitSuccessful },
  } = useForm<Fields>({ mode: "onChange" });
  const [isDesktop] = useMediaQuery("(min-width: 768px)");
  const [isDragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLDivElement>(null);

  async function uploadDocument(fields: Fields) {
    const file = fields.file.item(0);
    if (!file) {
      return;
    }

    let topicId = topics.find(
      (topic) => topic.name.toLowerCase() === fields.topic.toLowerCase()
    )?.id;
    if (fields.topic.length > 0 && !topicId) {
      const { data } = await supabase
        .from("topics")
        .insert({ name: fields.topic.toLowerCase() })
        .single();
      topicId = data?.id;
    }

    const user = supabase.auth.user();
    const uuid = crypto.randomUUID();
    const segments = file.name.split(".");
    const extension = segments[segments.length - 1];
    const filename = `${uuid}.${extension}`;
    const { data, error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(`${user!.id}/${uuid}/${filename}`, file);

    if (uploadError || !data) {
      toast({
        title: "Could not upload your document",
        description: "Please try again later",
        status: "error",
        duration: 2000,
      });
      throw uploadError;
    }

    const { error: databaseError } = await supabase.from("documents").insert({
      id: uuid,
      user_id: user!.id,
      title: fields.title,
      description: fields.description,
      filename,
      status: "pending",
      topic_id: topicId,
    });

    if (databaseError) {
      toast({
        title: "Could not upload your document",
        description: "Please try again later",
        status: "error",
        duration: 2000,
      });
      throw databaseError;
    }
  }

  return (
    <>
      {isSubmitSuccessful ? (
        <VStack maxW="512px" mx="auto" px={6} spacing={4}>
          <Box pointerEvents="none" width={128} height={128}>
            <Image
              width={1564}
              height={1404}
              alt=""
              src="/upload-completed.png"
            />
          </Box>
          <Text fontSize="2rem" lineHeight={10} color="brand" fontWeight="bold">
            Thank you!
          </Text>
          <Text>The document has been sent to be reviewed</Text>
          <Button
            bg="brand"
            onClick={() => router.push("/app")}
            color="white"
            _hover={{ bg: "brand" }}
          >
            Home page
          </Button>
        </VStack>
      ) : (
        <Box
          as="form"
          onSubmit={handleSubmit(uploadDocument)}
          maxW="512px"
          mx="auto"
          px={6}
        >
          <VStack spacing={4} alignItems="flex-start">
            {isDesktop ? (
              <Flex
                w="full"
                borderRadius="lg"
                borderWidth={2}
                borderColor="brand"
                overflow="hidden"
                bg="brand"
              >
                <Box flex={1} bg="brand" color="white" py={2}>
                  <Text
                    w="full"
                    textAlign="center"
                    fontSize="lg"
                    fontWeight="bold"
                  >
                    Selection &amp; Details
                  </Text>
                </Box>
                <Box flex={1} color="brand" bg="white" py={2}>
                  <Text
                    w="full"
                    textAlign="center"
                    fontSize="lg"
                    fontWeight="bold"
                  >
                    In review
                  </Text>
                </Box>
              </Flex>
            ) : null}

            <FormControl
              ref={fileInputRef}
              isInvalid={!!errors.file}
              onDragEnter={() => setDragging(true)}
              onDragLeave={(event) => {
                console.log(
                  event.target,
                  fileInputRef.current?.firstChild,
                  event.target === fileInputRef.current?.firstChild
                );
                if (event.target === fileInputRef.current?.firstChild) {
                  setDragging(false);
                }
              }}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                event.stopPropagation();

                setDragging(false);

                const file = event.dataTransfer.files.item(0);
                if (!file) return;

                const extension = file.name.split(".").pop();
                const title = file.name.replace(`.${extension}`, "");

                setValue("file", event.dataTransfer.files);
                setValue("title", title, { shouldValidate: true });
              }}
            >
              <Controller
                name="file"
                control={control}
                rules={{
                  validate: (list) => {
                    if (!list.item(0)) return "Insert a file";

                    return list.item(0)!.size > 5242880
                      ? "Maximum upload size is 5MB"
                      : true;
                  },
                }}
                render={({}) => (
                  <VStack
                    justifyContent="center"
                    p={16}
                    bg="rgba(37, 167, 138, 0.15)"
                    borderWidth={2}
                    borderStyle="dashed"
                    borderColor="brand"
                    height="300px"
                  >
                    {watch("file")?.item(0)?.name ? (
                      <>
                        <Text fontSize="lg" fontWeight="bold" color="#318170">
                          {watch("file").item(0)!.name}
                        </Text>
                        <IconButton
                          bg="transparent"
                          aria-label="remove upload"
                          icon={<DeleteIcon />}
                          onClick={() => setValue("file", null!)}
                        />
                      </>
                    ) : isDragging ? (
                      <Text fontSize="lg" fontWeight="bold" color="#318170">
                        Drop your file here
                      </Text>
                    ) : (
                      <>
                        <Box pointerEvents="none" width={128} height={128}>
                          <Image
                            width={1564}
                            height={1404}
                            alt="Drag and drop"
                            src="/dd-illustration.png"
                          />
                        </Box>
                        <Text fontSize="lg" fontWeight="bold" color="#318170">
                          Drag and drop to upload
                        </Text>
                        <Text>or</Text>
                        <FormLabel
                          htmlFor="file"
                          py={2}
                          px={4}
                          borderWidth={1}
                          borderColor="#318170"
                          color="#318170"
                          borderRadius="lg"
                        >
                          Browse my documents
                        </FormLabel>
                        <Text fontSize="xs" color="#6F6F76">
                          Supported files: pdf, doc, docx
                        </Text>
                        <Input
                          display="none"
                          visibility="hidden"
                          id="file"
                          type="file"
                          accept=".doc,.docx,.pdf"
                          {...register("file", {})}
                          isDisabled={isSubmitting}
                        />
                      </>
                    )}
                  </VStack>
                )}
              />
              <FormErrorMessage>{errors.file?.message}</FormErrorMessage>
            </FormControl>
            <FormControl
              w="full"
              isInvalid={!!errors.title}
              style={{ marginTop: "48px" }}
            >
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
                bg="transparent"
                variant="unstyled"
                paddingBottom={1}
                borderRadius={0}
                borderBottomWidth={0.5}
                borderBottomColor="#2B3B38"
              />
              <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.topic}>
              <FormLabel htmlFor="topic">Topic</FormLabel>
              <Input
                id="topic"
                type="text"
                placeholder="Your document's topic"
                {...register("topic")}
                isDisabled={isSubmitting}
                bg="transparent"
                variant="unstyled"
                paddingBottom={1}
                borderRadius={0}
                borderBottomWidth={0.5}
                borderBottomColor="#2B3B38"
              />
              <FormErrorMessage>{errors.topic?.message}</FormErrorMessage>
            </FormControl>
            {topics.length > 0 && watch("topic")?.length > 0 ? (
              <Box>
                {topics
                  .filter((topic) =>
                    topic.name
                      .toLowerCase()
                      .includes(watch("topic").toLowerCase())
                  )
                  .map((topic) => (
                    <Button
                      key={topic.id}
                      onClick={() => setValue("topic", topic.name)}
                    >
                      {topic.name}
                    </Button>
                  ))}
              </Box>
            ) : null}
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
                bg="transparent"
                variant="unstyled"
                paddingBottom={1}
                borderRadius={0}
                borderBottomWidth={0.5}
                borderBottomColor="#2B3B38"
              />
              <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
            </FormControl>
          </VStack>
          <Button
            mt={8}
            w="full"
            variant="solid"
            type="submit"
            isDisabled={!isValid}
            isLoading={isSubmitting}
            h={10}
            bg="brand"
            color="white"
            px={4}
            borderRadius="lg"
            fontSize="md"
            lineHeight={5}
            fontWeight="bold"
            rightIcon={<ArrowRightIcon />}
            _hover={{
              bg: "brand",
            }}
            mb={10}
          >
            Send for review
          </Button>
        </Box>
      )}
    </>
  );
};

export default UploadForm;
