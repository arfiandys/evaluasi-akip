import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { SearchInput } from "@/components/search-input";
import { getTeams } from "@/action/get-teams";
import { TeamsList } from "@/components/teams-list";

import { Categories } from "./_components/categories";
import { auth } from "@/auth";

interface SearchPageProps {
  searchParams: {
    name: string;
    categoryId: string;
  }
};

const TeamListPage = async ({
  searchParams
}: SearchPageProps) => {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return redirect("/");
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc"
    }
  });

  const teams = await getTeams({
    userId,
    ...searchParams,
  });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Categories
          items={categories}
        />
        <TeamsList items={teams} />
      </div>
    </>
   );
}
 
export default TeamListPage;