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
} from "@chakra-ui/react";
import { Document } from "../../lib/types/types";

type Props = {
  search: string;
  documents: Document[];
};

const DocumentsTable = ({ search, documents }: Props) => {
  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th>title</Th>
            <Th>description</Th>
            <Th>status</Th>
            <Th>unlock</Th>
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
                  {document.title.substring(0, searchIndex)}
                  <b>
                    {document.title.substring(
                      searchIndex,
                      searchIndex + search.length
                    )}
                  </b>
                  {document.title.substring(searchIndex + search.length)}
                </Td>
                <Td>{document.description}</Td>
                <Td>{document.status}</Td>
                <Td>
                  <IconButton
                    aria-label="unlock"
                    icon={<ArrowForwardIcon />}
                    onClick={() => {}}
                  />
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
