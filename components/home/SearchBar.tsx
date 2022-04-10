import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

type Props = {};
type Fields = {
  search: string;
};

const SearchBar = ({}: Props) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Fields>();

  function performSearch(fields: Fields) {
    router.push("/app/search?q=" + encodeURIComponent(fields.search));
  }

  return (
    <Box as="form" onSubmit={handleSubmit(performSearch)}>
      <FormControl isInvalid={!!errors.search}>
        <InputGroup height={16}>
          <Input
            id="search"
            aria-label="search"
            type="text"
            placeholder="Start searching for a document or topic..."
            {...register("search")}
            variant="filled"
            height={16}
            bg="#EBEDEF"
          />
          <InputRightAddon
            border="none"
            bg="brand"
            color="white"
            h={16}
            w={20}
            justifyContent="center"
          >
            <IconButton
              aria-label="search"
              type="submit"
              variant="unstyled"
              icon={<SearchIcon w={5} h={5} />}
            />
          </InputRightAddon>
        </InputGroup>
      </FormControl>
    </Box>
  );
};

export default SearchBar;
