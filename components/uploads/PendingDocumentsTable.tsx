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
import { useQuery } from "react-query";
import { PendingDocument } from "../../lib/types/types";

type Props = {};

const PendingDocumentsTable = ({}: Props) => {
  const { data } = useQuery(["PENDING_DOCUMENTS"], async () => {
    const { data, error } = await supabaseClient
      .from<PendingDocument>("pending_documents")
      .select("*");

    if (error) {
      throw error;
    }

    return data;
  });

  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th>id</Th>
            <Th>title</Th>
            <Th>description</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.map((document) => (
            <Tr key={document.id}>
              <Td>{document.id}</Td>
              <Td>{document.title}</Td>
              <Td>{document.description}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default PendingDocumentsTable;
