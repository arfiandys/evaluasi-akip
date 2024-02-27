import { auth } from "@/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
// import { UploadThingError } from "uploadthing/server";
const f = createUploadthing();

const handleAuth = async () => {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) throw new Error("Unauthorized!");
    return { userId };
}; // auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    teamImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(() => handleAuth())
        .onUploadComplete(() => { }),
    teamAttachment: f(["text", "image", "video", "audio", "pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
    permindokDokumen: f(["pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
    chapterVideo: f({ video: { maxFileCount: 1, maxFileSize: "512GB"}})
    .middleware(() => handleAuth())
    .onUploadComplete(() => {})
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;