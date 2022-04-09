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
  Link as ChakraLink,
} from "@chakra-ui/react";
import Link from "next/link";
import { useQuery } from "react-query";
import supabase from "../../lib/supabase";
import { Document } from "../../lib/types/types";

type Props = {};

const DocumentsTable = ({}: Props) => {
  const { data } = useQuery(["MY_DOCUMENTS"], async () => {
    const { data, error } = await supabase
      .from<Document>("documents")
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
            <Th>title</Th>
            <Th>description</Th>
            <Th>status</Th>
            <Th>download</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.map((document) => (
            <Tr key={document.id}>
              <Td>
                <Link href={`/app/d/${document.id}`} passHref>
                  <ChakraLink>{document.title}</ChakraLink>
                </Link>
              </Td>
              <Td>{document.description}</Td>
              <Td>{document.status}</Td>
              <Td>
                <IconButton
                  aria-label="download"
                  icon={<DownloadIcon />}
                  onClick={() =>
                    window.open(`/api/download?id=${document.id}`, "_blank")
                  }
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default DocumentsTable;