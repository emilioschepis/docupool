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
  HStack,
  Box,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import Link from "next/link";
import { useQuery } from "react-query";
import supabase from "../../lib/supabase";
import { Document } from "../../lib/types/types";

type Props = {};

const formatter = Intl.DateTimeFormat();

const DocumentsTable = ({}: Props) => {
  const [isDesktop] = useMediaQuery("(min-width: 768px)");
  const { data } = useQuery(["MY_DOCUMENTS"], async () => {
    const { data, error } = await supabase
      .from("documents")
      .select("*, topic:topics(*)")
      .eq("user_id", supabase.auth.user()!.id);

    if (error) {
      throw error;
    }

    return data;
  });

  return (
    <TableContainer px={isDesktop ? 10 : 6}>
      <Table>
        <Thead>
          <Tr borderBottomWidth={8} borderBottomColor="#F5F6F7">
            <Th paddingInline={0}>title</Th>
            <Th>topic</Th>
            <Th>created</Th>
            <Th>status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.map((document) => (
            <Tr key={document.id}>
              <Td
                paddingInline={0}
                fontSize="md"
                color="#2B3B38"
                textDecoration="underline"
              >
                <Link href={`/app/d/${document.id}`} passHref>
                  <ChakraLink>{document.title}</ChakraLink>
                </Link>
              </Td>
              <Td fontSize="md" color="#88918F">
                {document.topic ? (
                  <Link href={`/app/t/${document.topic.id}`} passHref>
                    <ChakraLink>{document.topic.name}</ChakraLink>
                  </Link>
                ) : (
                  "-"
                )}
              </Td>
              <Td fontSize="md" color="#88918F">
                {formatter.format(new Date(document.created_at))}
              </Td>
              <Td>
                <HStack w="full">
                  {document.status === "pending" ? (
                    <>
                      <Box w={4} h={4} bg="yellow.400" borderRadius="full" />
                      <Text fontSize="md" color="#88918F">
                        Pending
                      </Text>
                    </>
                  ) : document.status === "approved" ? (
                    <>
                      <Box w={4} h={4} bg="brand" borderRadius="full" />
                      <Text fontSize="md" color="#88918F">
                        Approved
                      </Text>
                    </>
                  ) : document.status === "rejected" ? (
                    <>
                      <Box w={4} h={4} bg="red" borderRadius="full" />
                      <Text fontSize="md" color="#88918F">
                        Rejected
                      </Text>
                    </>
                  ) : null}
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default DocumentsTable;
