import { Title, Loader } from "@mantine/core";

import SearchSymbols from "./SearchSymbols";

import { useAppSelector } from "../../store/hooks";
import { selectSecurity, selectStatus } from "./slice";

function SecurityBrowser() {
  const security = useAppSelector(selectSecurity);
  const status = useAppSelector(selectStatus);

  return (
    <div>
      <SearchSymbols />
      {status === "loading" && <Loader />}
      {status === "idle" && security && (
        <>
          <Title>{security.companyName}</Title>
          <Title order={3}>{security.companyDescription}</Title>
        </>
      )}
    </div>
  );
}

export default SecurityBrowser;
