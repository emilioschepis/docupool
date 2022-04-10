import { Box, Heading, useMediaQuery } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useQuery } from "react-query";
import UploadForm from "../../components/forms/UploadForm";
import Header from "../../components/Header";
import supabase from "../../lib/supabase";
import { Topic } from "../../lib/types/types";

const New: NextPage = () => {
  const [isDesktop] = useMediaQuery("min-width(768px)");
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
        pt={isDesktop ? 12 : 4}
        px={isDesktop ? 10 : 6}
        fontSize="2xl"
        fontWeight="normal"
        color="#2B3B38"
        mb={8}
      >
        Upload a document
      </Heading>
      <UploadForm topics={data ?? []} />
    </Box>
  );
};

export default New;
