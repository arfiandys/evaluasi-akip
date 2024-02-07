import { Category, Team } from "@prisma/client";

import { TeamCard } from "@/components/team-card";

type TeamWithProgressWithCategory = Team & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

interface TeamsListProps {
  items: TeamWithProgressWithCategory[];
}

export const TeamsList = ({
  items
}: TeamsListProps) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <TeamCard
            key={item.id}
            id={item.id}
            name={item.name}
            imageUrl={item.imageUrl!}
            chaptersLength={item.chapters.length}
            price={item.price!}
            progress={item.progress}
            category={item?.category?.name!}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No team found
        </div>
      )}
    </div>
  )
}