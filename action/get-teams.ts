import { Category, Team } from "@prisma/client";

import { getProgress } from "@/action/get-progress";
import { db } from "@/lib/db";

type TeamsWithProgressWithCategory = Team & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

type GetTeams = {
  userId: string;
  name?: string;
  categoryId?: string;
};

export const getTeams = async ({
  userId,
  name,
  categoryId
}: GetTeams): Promise<TeamsWithProgressWithCategory[]> => {
  try {
    const teams = await db.team.findMany({
      where: {
        isPublished: true,
        name: {
          contains: name,
        },
        categoryId,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          }
        },
        purchases: {
          where: {
            userId,
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      }
    });

    const teamsWithProgress: TeamsWithProgressWithCategory[] = await Promise.all(
      teams.map(async team => {
        if (team.purchases.length === 0) {
          return {
            ...team,
            progress: null,
          }
        }

        const progressPercentage = await getProgress(userId, team.id);

        return {
          ...team,
          progress: progressPercentage,
        };
      })
    );

    return teamsWithProgress;
  } catch (error) {
    console.log("[GET_TEAMS]", error);
    return [];
  }
}