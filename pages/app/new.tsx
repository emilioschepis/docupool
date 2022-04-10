import { Box, Heading } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useQuery } from "react-query";
import UploadForm from "../../components/forms/UploadForm";
import Header from "../../components/Header";
import supabase from "../../lib/supabase";
import { Topic } from "../../lib/types/types";

const New: NextPage = () => {
  const { data } = useQuery(["ALL_TOPICS"], async () => {
    const { data, error } = await supabase.from<Topic>("topics").select("*");

    if (error) {
      throw error;
    }

    return data;
  });

  return (
    <Box>
      <Header />
      <Heading
        as="h1"
        pt={12}
        px={10}
        fontSize="2xl"
        fontWeight="normal"
        color="#2B3B38"
      >
        Upload a document
      </Heading>
      <UploadForm topics={data ?? []} />
    </Box>
  );
};

export default New;
