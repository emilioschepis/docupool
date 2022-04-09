import { DownloadIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { PendingDocument } from "../../lib/types/types";

type Props = {};

const PendingDocumentsTable = ({}: Props) => {
  const router = useRouter();
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
            <Th>download</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.map((document) => (
            <Tr key={document.id}>
              <Td>{document.id}</Td>
              <Td>{document.title}</Td>
              <Td>{document.description}</Td>
              <Td>
                <IconButton
                  aria-label="download"
                  icon={<DownloadIcon />}
                  onClick={() =>
                    window.open(
                      `/api/download?id=${document.id}&type=pending`,
                      "_blank"
                    )
                  }
                ></IconButton>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default PendingDocumentsTable;
