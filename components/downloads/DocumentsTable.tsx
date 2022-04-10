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
  useMediaQuery,
} from "@chakra-ui/react";
import Link from "next/link";
import { useQuery } from "react-query";
import supabase from "../../lib/supabase";
import { Document, Topic } from "../../lib/types/types";

type Props = {};

const formatter = Intl.DateTimeFormat();

const DocumentsTable = ({}: Props) => {
  const [isDesktop] = useMediaQuery("(min-width: 768px)");
  const { data } = useQuery(["UNLOCKED_DOCUMENTS"], async () => {
    const { data, error } = await supabase
      .from("documents")
      .select(
        "*,topic:topics(id, name),unlocks:document_unlocks!inner(user_id, created_at)"
      )
      .neq("user_id", supabase.auth.user()!.id)
      .eq("unlocks.user_id", supabase.auth.user()!.id);

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
            <Th>unlocked</Th>
            <Th isNumeric>download</Th>
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
                {formatter.format(new Date(document.unlocks[0].created_at))}
              </Td>
              <Td isNumeric>
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
