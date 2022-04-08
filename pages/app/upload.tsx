import { Box } from "@chakra-ui/react";
import type { NextPage } from "next";
import UploadForm from "../../components/forms/UploadForm";

const Upload: NextPage = () => {
  return (
    <Box>
      <UploadForm />
    </Box>
  );
};

export default Upload;
