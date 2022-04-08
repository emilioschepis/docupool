import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import type { NextPage } from "next";
import { useQuery } from "react-query";
import PendingDocumentsTable from "../../components/uploads/PendingDocumentsTable";
import { PendingDocument } from "../../lib/types/types";

const Uploads: NextPage = () => {
  return (
    <Box>
      <PendingDocumentsTable />
    </Box>
  );
};

export default Uploads;
