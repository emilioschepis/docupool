import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
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
        <FormLabel htmlFor="search">Search</FormLabel>
        <Input
          id="search"
          type="text"
          placeholder="Applied mathematics"
          {...register("search")}
        />
      </FormControl>
    </Box>
  );
};

export default SearchBar;
