import { ArrowForwardIcon } from "@chakra-ui/icons";
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
import { Document, Topic } from "../../lib/types/types";

type Props = {
  search: string;
  documents: (Document & { topic: Topic })[];
};

const DocumentsTable = ({ search, documents }: Props) => {
  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th>title</Th>
            <Th>description</Th>
            <Th>topic</Th>
          </Tr>
        </Thead>
        <Tbody>
          {documents.map((document) => {
            const searchIndex = document.title
              .toLowerCase()
              .indexOf(search.toLowerCase());

            return (
              <Tr key={document.id}>
                <Td>
                  <Link href={`/app/d/${document.id}`} passHref>
                    <ChakraLink>
                      {document.title.substring(0, searchIndex)}
                      <b>
                        {document.title.substring(
                          searchIndex,
                          searchIndex + search.length
                        )}
                      </b>
                      {document.title.substring(searchIndex + search.length)}
                    </ChakraLink>
                  </Link>
                </Td>
                <Td>{document.description}</Td>
                <Td>
                  <Link href={`/app/t/${document.topic.id}`} passHref>
                    <ChakraLink>{document.topic.name}</ChakraLink>
                  </Link>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default DocumentsTable;
