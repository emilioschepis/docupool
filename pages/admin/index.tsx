import { DownloadIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  HStack,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { createClient } from "@supabase/supabase-js";
import type { GetServerSideProps, NextPage } from "next";

const formatter = Intl.DateTimeFormat();

const AdminPage: NextPage<{ documents: any[] }> = ({ documents }) => {
  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th>Title</Th>
            <Th>Author</Th>
            <Th>Created</Th>
            <Th>Status</Th>
            <Th>Download</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {documents.map((document) => (
            <Tr key={document.id}>
              <Td>{document.title}</Td>
              <Td>{document.profile.name}</Td>
              <Td>{formatter.format(new Date(document.created_at))}</Td>
              <Td>{document.status}</Td>
              <Td>
                <IconButton
                  aria-label="download"
                  icon={<DownloadIcon />}
                  onClick={() =>
                    window.open(
                      `/api/admin/download?id=${document.id}`,
                      "_blank"
                    )
                  }
                />
              </Td>
              <Td>
                {document.status === "pending" ? (
                  <HStack>
                    <Button size="sm" colorScheme="green">
                      Approve
                    </Button>
                    <Button size="sm" colorScheme="red">
                      Reject
                    </Button>
                  </HStack>
                ) : null}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY as string;

  const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const { data, error } = await adminClient
    .from("documents")
    .select("*, profile:profiles(*)")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return {
    props: {
      documents: data,
    },
  };
};

export default AdminPage;
