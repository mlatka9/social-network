import { FormEvent, useState } from "react";
import { trpc } from "src/utils/trpc";
import Link from "next/link";

const UserSearch = () => {
  const [searchPhrase, setSearchPhrase] = useState("");
  const utils = trpc.useContext();

  const { data } = trpc.useQuery(["user.getBySearchPhrase", { searchPhrase }]);

  // console.log(data);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPhrase(e.target.value);
    if (e.target.value) {
      utils.invalidateQueries(["user.getBySearchPhrase", { searchPhrase }]);
    }
  };

  return (
    <div className="relative bg-white z-[200]">
      <input value={searchPhrase} onChange={handleOnChange} />
      <div className="absolute top-full bg-white p-1 w-full">
        {data?.map((user) => (
          <Link href={`/user/${user.id}`} key={user.id} passHref>
            <a>
              <div className="p-1 hover:bg-slate-100">{user.name}</div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UserSearch;
