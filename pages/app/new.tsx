import { Box } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useQuery } from "react-query";
import UploadForm from "../../components/forms/UploadForm";
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
      <UploadForm topics={data ?? []} />
    </Box>
  );
};

export default New;
