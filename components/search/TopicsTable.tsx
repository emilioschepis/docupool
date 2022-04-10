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
import { Topic } from "../../lib/types/types";

type Props = {
  search: string;
  topics: Topic[];
};

const TopicsTable = ({ search, topics }: Props) => {
  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th>name</Th>
          </Tr>
        </Thead>
        <Tbody>
          {topics.map((topic) => {
            const searchIndex = topic.name
              .toLowerCase()
              .indexOf(search.toLowerCase());

            return (
              <Tr key={topic.id}>
                <Td>
                  <Link href={`/app/t/${topic.id}`} passHref>
                    <ChakraLink>
                      {topic.name.substring(0, searchIndex)}
                      <b>
                        {topic.name.substring(
                          searchIndex,
                          searchIndex + search.length
                        )}
                      </b>
                      {topic.name.substring(searchIndex + search.length)}
                    </ChakraLink>
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

export default TopicsTable;
